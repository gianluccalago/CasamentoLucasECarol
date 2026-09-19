-- ==========================================================================
-- ESQUEMA DO BANCO — Casamento Maria Carolina & Lucas
-- ==========================================================================
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em RUN.
--
-- Para que serve:
--   1. guardar a lista oficial de 92 presentes;
--   2. registrar quem presenteou cada item — é isso que faz um presente
--      aparecer como CONQUISTADO para TODOS os convidados, evitando que
--      duas pessoas comprem a mesma coisa;
--   3. guardar as confirmações de presença;
--   4. abrir o PAINEL PRIVADO do casal (painel.html), onde vocês veem
--      o que foi presenteado, por quem e quando.
--
-- Não há pagamento aqui: o PIX é feito direto do banco do convidado para
-- a conta de vocês. O site só anota quem avisou que presenteou.
--
-- Rodar de novo é seguro: tudo usa "if not exists" / "or replace".
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. PRESENTES — o catálogo. O site LÊ esta tabela.
-- --------------------------------------------------------------------------
create table if not exists public.presentes (
  id         text primary key,                          -- ex.: "06-liquidificador"
  nome       text not null,
  valor      numeric(10,2) not null check (valor > 0),  -- valor de UMA unidade
  unidades   int  not null default 1 check (unidades > 0),
  foto       text,
  ordem      int  not null default 0,
  ativo      boolean not null default true,
  -- Somado automaticamente a partir das marcações (não edite na mão).
  recebido   numeric(10,2) not null default 0
);

-- Colunas acrescentadas junto com a lista oficial (para bancos já criados).
alter table public.presentes add column if not exists modelo    text;
alter table public.presentes add column if not exists categoria text;

-- --------------------------------------------------------------------------
-- 2. MARCAÇÕES — cada convidado que avisou "já fiz o PIX deste presente".
--    O convidado só consegue INSERIR aqui. Não consegue ler a lista de
--    quem presenteou, nem apagar nada. Quem lê é o painel do casal.
-- --------------------------------------------------------------------------
create table if not exists public.marcacoes (
  id           uuid primary key default gen_random_uuid(),
  -- Fica vazio quando é uma contribuição de valor livre, que não
  -- reserva nenhum item da lista.
  presente_id  text references public.presentes(id) on delete cascade,
  nome         text not null,
  valor        numeric(10,2) not null check (valor > 0),
  mensagem     text,
  criado_em    timestamptz not null default now()
);

create index if not exists idx_marcacoes_presente on public.marcacoes(presente_id);

-- Se a tabela já existia com presente_id obrigatório, libera o campo.
alter table public.marcacoes alter column presente_id drop not null;

-- --------------------------------------------------------------------------
-- 3. RSVPS — confirmações de presença.
-- --------------------------------------------------------------------------
create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  observacoes text,
  criado_em   timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 4. GATILHO: soma as marcações no total recebido de cada presente.
--    É esse total que faz o selo CONQUISTADO aparecer.
-- --------------------------------------------------------------------------
create or replace function public.atualizar_recebido()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  alvo text := coalesce(new.presente_id, old.presente_id);
begin
  -- Contribuição livre não pertence a nenhum presente: nada a recalcular.
  if alvo is null then
    return null;
  end if;

  update public.presentes p
     set recebido = coalesce((
           select sum(m.valor) from public.marcacoes m where m.presente_id = alvo
         ), 0)
   where p.id = alvo;
  return null;
end;
$$;

drop trigger if exists trg_atualizar_recebido on public.marcacoes;
create trigger trg_atualizar_recebido
after insert or update or delete on public.marcacoes
for each row execute function public.atualizar_recebido();

-- --------------------------------------------------------------------------
-- 5. SEGURANÇA (RLS) — o que o navegador do convidado pode fazer
-- --------------------------------------------------------------------------
alter table public.presentes enable row level security;
alter table public.marcacoes enable row level security;
alter table public.rsvps     enable row level security;

-- Presentes: qualquer visitante LÊ (para montar a lista). Ninguém escreve.
drop policy if exists "presentes: leitura publica" on public.presentes;
create policy "presentes: leitura publica"
  on public.presentes for select
  to anon, authenticated
  using (ativo);

-- Marcações: o convidado só INSERE a própria (com nome e valor válidos).
-- Não pode ler nem apagar as dos outros.
drop policy if exists "marcacoes: qualquer um avisa" on public.marcacoes;
create policy "marcacoes: qualquer um avisa"
  on public.marcacoes for insert
  to anon, authenticated
  with check (
    length(trim(nome)) between 2 and 120
    and valor > 0 and valor <= 100000
    and length(coalesce(mensagem, '')) <= 500
  );
-- Obs.: presente_id vazio é permitido de propósito — é assim que fica
-- registrada a contribuição de valor livre.

-- RSVP: o convidado insere a própria confirmação, sem ler a lista.
drop policy if exists "rsvp: qualquer um confirma" on public.rsvps;
create policy "rsvp: qualquer um confirma"
  on public.rsvps for insert
  to anon, authenticated
  with check (
    length(coalesce(nome, '')) between 2 and 120
    and length(coalesce(observacoes, '')) <= 1000
  );

-- ==========================================================================
-- 6. PAINEL PRIVADO DO CASAL
-- ==========================================================================
-- Os convidados NÃO podem ver quem presenteou o quê (não há policy de
-- leitura em "marcacoes" nem em "rsvps"). Quem enxerga isso é a função
-- abaixo, e só quando recebe a senha certa.
--
--  >>> TROQUE A SENHA NA LINHA INDICADA ANTES DE RODAR ESTE ARQUIVO. <<<
--
-- Depois é só abrir  https://SEU-SITE/painel.html  e digitar a senha.
-- --------------------------------------------------------------------------
create table if not exists public.painel_acesso (
  id    int primary key default 1 check (id = 1),
  senha text not null check (length(senha) >= 8)
);

alter table public.painel_acesso enable row level security;
-- Sem nenhuma policy: ninguém lê esta tabela pelo navegador, nem com a
-- chave anon. Só a função abaixo (security definer) enxerga a senha.
-- O revoke é um segundo cadeado, caso a RLS seja desligada sem querer.
revoke all on public.painel_acesso from anon, authenticated;

insert into public.painel_acesso (id, senha)
values (1, 'braialol')      -- <<<<<< TROQUE AQUI (mínimo 8 letras)
on conflict (id) do nothing;

-- Para mudar a senha depois:
--   update public.painel_acesso set senha = 'a-nova-senha' where id = 1;

create or replace function public.painel(p_senha text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  resposta jsonb;
begin
  if p_senha is null
     or not exists (select 1 from public.painel_acesso a where a.senha = p_senha) then
    -- Atraso proposital: desestimula tentativa de adivinhar a senha.
    perform pg_sleep(0.7);
    raise exception 'senha-incorreta' using errcode = '28P01';
  end if;

  select jsonb_build_object(
    'gerado_em', now(),

    -- Todo o catálogo, com o quanto já entrou em cada item.
    'presentes', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.ordem)
        from (
          select p.id, p.nome, p.modelo, p.categoria, p.valor, p.unidades,
                 p.recebido, p.ordem,
                 (p.recebido >= p.valor * p.unidades) as conquistado
            from public.presentes p
           where p.ativo
        ) t
    ), '[]'::jsonb),

    -- Quem presenteou o quê e quando (presente vazio = contribuição livre).
    'marcacoes', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.criado_em desc)
        from (
          select m.id, m.nome, m.valor, m.mensagem, m.criado_em,
                 m.presente_id, p.nome as presente, p.categoria
            from public.marcacoes m
            left join public.presentes p on p.id = m.presente_id
        ) t
    ), '[]'::jsonb),

    -- Quem confirmou presença.
    'rsvps', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.criado_em desc)
        from (
          select r.id, r.nome, r.observacoes, r.criado_em
            from public.rsvps r
        ) t
    ), '[]'::jsonb)
  ) into resposta;

  return resposta;
end;
$$;

revoke all on function public.painel(text) from public;
grant execute on function public.painel(text) to anon, authenticated;

-- --------------------------------------------------------------------------
-- 7. CATÁLOGO OFICIAL — 92 presentes em 5 categorias
-- --------------------------------------------------------------------------
-- Tira da frente os 8 itens de exemplo da primeira versão, se existirem.
delete from public.presentes
 where id in ('jogo-de-panelas', 'jogo-de-tacas', 'roupa-de-cama', 'cafeteira',
              'jogo-de-toalhas', 'air-fryer', 'aparelho-de-jantar', 'lua-de-mel');

-- A foto de cada item vem da pasta assets/img/presentes/ pelo próprio id
-- (ex.: "06-liquidificador" → assets/img/presentes/06-liquidificador.jpg).
-- Só preencha a coluna "foto" se quiser usar outra imagem.
--
-- "do nothing" preserva as edições que vocês fizerem no Table Editor. Para
-- forçar a volta desta lista original, apague os itens antes de rodar:
--   delete from public.presentes;
insert into public.presentes (id, nome, modelo, categoria, valor, unidades, ordem) values
  -- Cozinha
  ('01-geladeira-frost-free-inverse', 'Geladeira Frost Free Inverse', 'Consul CRE44AK, 397 L (Evox)', 'Cozinha', 4700, 1, 1),
  ('02-fogao-5-bocas-completo', 'Fogão 5 bocas completo', 'Consul CFS5VAR, mesa de vidro', 'Cozinha', 2150, 1, 2),
  ('03-micro-ondas-30l', 'Micro-ondas 30 L', 'Electrolux MI41T, 31 L', 'Cozinha', 850, 1, 3),
  ('04-air-fryer-formato-oven', 'Air fryer (formato forno)', 'Philips Walita Airfryer Forno Série 5000, 12 L', 'Cozinha', 850, 1, 4),
  ('05-panela-eletrica-multifuncional', 'Panela elétrica multifuncional', 'Philips Walita Viva Collection RI3136', 'Cozinha', 550, 1, 5),
  ('06-liquidificador', 'Liquidificador', 'Oster 1100 Full, 3,2 L', 'Cozinha', 320, 1, 6),
  ('07-mixer', 'Mixer', 'Philips Walita Pro Mix RI2622, 400 W', 'Cozinha', 280, 1, 7),
  ('08-multiprocessador-de-alimentos', 'Multiprocessador de alimentos', 'Philips Walita PowerChop RI7303, 1000 W', 'Cozinha', 460, 1, 8),
  ('09-batedeira-planetaria', 'Batedeira planetária', 'KitchenAid Artisan KEA33CV, 4,8 L', 'Cozinha', 1200, 1, 9),
  ('10-cafeteira-eletrica', 'Cafeteira elétrica', 'Mondial Dolce Arome C-32, 32 xícaras', 'Cozinha', 280, 1, 10),
  ('11-cafeteira-nespresso', 'Cafeteira Nespresso', 'Nespresso Vertuo Next', 'Cozinha', 750, 1, 11),
  ('12-chaleira-eletrica', 'Chaleira elétrica', 'Mondial Pratic CE-06, inox, 2 L', 'Cozinha', 200, 1, 12),
  ('13-torradeira', 'Torradeira', 'Philips Walita Viva Collection RI2630, inox', 'Cozinha', 250, 1, 13),
  ('14-grill-eletrico-multifuncional', 'Grill elétrico multifuncional', 'George Foreman Compacto, 1200 W', 'Cozinha', 300, 1, 14),
  ('15-espremedor-de-frutas', 'Espremedor de frutas', 'Philips Walita RI2746', 'Cozinha', 200, 1, 15),
  ('16-conjunto-de-panelas-inox', 'Conjunto de panelas inox', 'Tramontina Solar, fundo triplo, 6 peças', 'Cozinha', 650, 1, 16),
  ('17-conjunto-de-panelas-antiaderentes', 'Conjunto de panelas antiaderentes', 'Tramontina Paris, 7 peças', 'Cozinha', 550, 1, 17),
  ('18-frigideira-grande', 'Frigideira grande', 'Tramontina Mônaco, antiaderente, 28 cm', 'Cozinha', 250, 1, 18),
  ('19-panela-wok', 'Panela wok', 'Tramontina Mônaco, antiaderente, 32 cm', 'Cozinha', 200, 1, 19),
  ('20-cacarola-de-ferro-fundido', 'Caçarola de ferro fundido', 'Le Creuset Signature redonda, 24 cm', 'Cozinha', 820, 1, 20),
  ('21-assadeira-de-vidro', 'Assadeira de vidro', 'Marinex, retangular, 36 cm', 'Cozinha', 140, 1, 21),
  ('22-jogo-de-travessas', 'Jogo de travessas', 'Oxford Bake, refratária, 3 peças', 'Cozinha', 220, 1, 22),
  ('23-forma-para-bolo', 'Forma para bolo', 'Tramontina, alumínio antiaderente, retangular', 'Cozinha', 90, 1, 23),
  ('24-forma-para-pizza', 'Forma para pizza', 'Tramontina, alumínio, 35 cm', 'Cozinha', 80, 1, 24),
  ('25-kit-de-potes-hermeticos', 'Kit de potes herméticos', 'Tupperware Basic Line', 'Cozinha', 220, 1, 25),
  ('26-jogo-de-utensilios-de-silicone', 'Jogo de utensílios de silicone', 'Tramontina Softta, 5 peças', 'Cozinha', 150, 1, 26),
  -- Mesa posta
  ('27-jogo-de-jantar-30-pecas', 'Jogo de jantar (30 peças)', 'Oxford Coup Serene', 'Mesa posta', 580, 1, 27),
  ('28-faqueiro-inox-48-pecas', 'Faqueiro inox (48 peças)', 'Tramontina Malibu', 'Mesa posta', 360, 1, 28),
  ('29-jogo-de-tacas-de-vinho', 'Jogo de taças de vinho', 'Bohemia Gastro, cristal, 6 peças', 'Mesa posta', 220, 1, 29),
  ('30-jogo-de-tacas-de-espumante', 'Jogo de taças de espumante', 'Bohemia, cristal, 6 peças', 'Mesa posta', 220, 1, 30),
  ('31-jogo-de-copos', 'Jogo de copos', 'Nadir Figueiredo Oca, 6 peças, 300 ml', 'Mesa posta', 120, 1, 31),
  ('32-jarra-de-vidro', 'Jarra de vidro', 'Nadir Figueiredo Tango, 1,5 L', 'Mesa posta', 80, 1, 32),
  ('33-bowl-de-porcelana', 'Bowl de porcelana', 'Oxford Ryo, 500 ml', 'Mesa posta', 150, 1, 33),
  ('34-petisqueira-de-madeira', 'Petisqueira de madeira', 'Tramontina Teca, 3 nichos', 'Mesa posta', 140, 1, 34),
  ('35-tabua-de-frios', 'Tábua de frios', 'Tramontina Provence, madeira teca', 'Mesa posta', 150, 1, 35),
  ('36-conjunto-de-pratos-para-sobremesa', 'Conjunto de pratos de sobremesa', 'Oxford Soleil White, 6 peças', 'Mesa posta', 200, 1, 36),
  ('37-xicaras-de-cafe', 'Xícaras de café', 'Oxford Soleil White, 6 peças', 'Mesa posta', 120, 1, 37),
  ('38-xicaras-de-cha', 'Xícaras de chá', 'Oxford Soleil White, 12 peças', 'Mesa posta', 140, 1, 38),
  ('39-bandeja-de-cafe-da-manha', 'Bandeja de café da manhã', 'Tramontina, madeira, mesinha dobrável', 'Mesa posta', 150, 1, 39),
  ('40-galheteiro', 'Galheteiro', 'Lyor Vegas, vidro com suporte de metal', 'Mesa posta', 90, 1, 40),
  ('41-saleiro-e-pimenteiro', 'Saleiro e pimenteiro', 'Lyor, vidro com suporte de metal', 'Mesa posta', 90, 1, 41),
  ('42-centro-de-mesa', 'Centro de mesa', 'Lyor Deli Diamond, cristal', 'Mesa posta', 180, 1, 42),
  -- Quarto e banho
  ('43-jogo-de-cama-casal', 'Jogo de cama casal', 'Buddemeyer Intense Gran Percal, 250 fios', 'Quarto e banho', 410, 1, 43),
  ('44-jogo-de-lencol-extra-reserva', 'Jogo de lençol extra (reserva)', 'Buddemeyer Percalle, liso', 'Quarto e banho', 200, 1, 44),
  ('45-edredom-casal', 'Edredom casal', 'Karsten Verbena, algodão percal', 'Quarto e banho', 480, 1, 45),
  ('46-cobre-leito-casal', 'Cobre-leito casal', 'Karsten Cali, cetim, 3 peças', 'Quarto e banho', 400, 1, 46),
  ('47-kit-de-travesseiros-casal-2-unid', 'Kit de travesseiros casal (2 un.)', 'Duoflex Nasa Cervical', 'Quarto e banho', 260, 1, 47),
  ('48-protetor-de-colchao', 'Protetor de colchão', 'Duoflex, impermeável, casal', 'Quarto e banho', 140, 1, 48),
  ('49-manta-para-cama', 'Manta para cama', 'Buddemeyer Nina, tricô', 'Quarto e banho', 200, 1, 49),
  ('50-almofadas-decorativas-kit', 'Almofadas decorativas (kit)', 'Kit com 2 almofadas de veludo Mistero', 'Quarto e banho', 200, 1, 50),
  ('51-jogo-de-toalhas-de-banho', 'Jogo de toalhas de banho', 'Buddemeyer Luxo Fio Penteado, 6 peças', 'Quarto e banho', 360, 1, 51),
  ('52-toalhas-de-rosto-kit', 'Toalhas de rosto (kit)', 'Karsten', 'Quarto e banho', 120, 1, 52),
  ('53-toalhas-de-piso-kit', 'Toalhas de piso (kit)', 'Karsten Juliet, 2 peças', 'Quarto e banho', 120, 1, 53),
  ('54-roupao-feminino', 'Roupão feminino', 'Buddemeyer Laise, atoalhado com capuz', 'Quarto e banho', 200, 1, 54),
  ('55-roupao-masculino', 'Roupão masculino', 'Buddemeyer Stripes, atoalhado', 'Quarto e banho', 200, 1, 55),
  ('56-kit-organizador-de-guarda-roupa', 'Kit organizador de guarda-roupa', 'Organizador empilhável multiuso', 'Quarto e banho', 220, 1, 56),
  ('57-cesto-de-roupas', 'Cesto de roupas', 'Coza Puffer, 49 L, com tampa', 'Quarto e banho', 140, 1, 57),
  ('58-cabides-de-veludo-kit-50-un', 'Cabides de veludo (kit 50 un.)', 'Kit com 50 cabides antideslizantes', 'Quarto e banho', 120, 1, 58),
  ('59-espelho-de-corpo-inteiro', 'Espelho de corpo inteiro', 'Retangular, moldura preta, 170 × 70 cm', 'Quarto e banho', 350, 1, 59),
  ('60-cortina-blackout-casal', 'Cortina blackout casal', 'Bella Janela, tecido blackout', 'Quarto e banho', 280, 1, 60),
  ('61-tapete-para-quarto', 'Tapete para quarto', 'Tapetes São Carlos Adana', 'Quarto e banho', 300, 1, 61),
  ('62-difusor-de-aromas', 'Difusor de aromas', 'Via Aroma, varetas, 200–250 ml', 'Quarto e banho', 150, 1, 62),
  ('63-saia-para-cama-box', 'Saia para cama box', 'Buddemeyer Bud Vision New Colors', 'Quarto e banho', 200, 1, 63),
  -- Limpeza e lavanderia
  ('64-maquina-de-lavar-roupas', 'Máquina de lavar roupas', 'Brastemp BWK12AB, 12 kg', 'Limpeza e lavanderia', 2200, 1, 64),
  ('65-secadora-de-roupas', 'Secadora de roupas', 'Brastemp BSR10BB, de piso, 10 kg', 'Limpeza e lavanderia', 3000, 1, 65),
  ('66-aspirador-de-po-vertical', 'Aspirador de pó vertical', 'Electrolux Ergorapido 2 em 1', 'Limpeza e lavanderia', 550, 1, 66),
  ('67-aspirador-robo', 'Aspirador robô', 'Positivo Smart Robô Aspirador Wi-Fi PRA100', 'Limpeza e lavanderia', 1250, 1, 67),
  ('68-ferro-de-passar-a-vapor', 'Ferro de passar a vapor', 'Philips Walita, base antiaderente', 'Limpeza e lavanderia', 200, 1, 68),
  ('69-passadeira-a-vapor', 'Passadeira a vapor', 'Philips Walita Série 3000, vertical', 'Limpeza e lavanderia', 400, 1, 69),
  ('70-tabua-de-passar-roupa', 'Tábua de passar roupa', 'Arthi, estrutura reforçada', 'Limpeza e lavanderia', 140, 1, 70),
  ('71-varal-de-chao', 'Varal de chão', 'Arthi, retrátil com rodinhas', 'Limpeza e lavanderia', 140, 1, 71),
  ('72-lixeira-inox-para-cozinha', 'Lixeira inox para cozinha', 'Tramontina, com pedal, 12 L', 'Limpeza e lavanderia', 200, 1, 72),
  ('73-lixeira-para-banheiro', 'Lixeira para banheiro', 'Coza Serene, 5 L, com tampa', 'Limpeza e lavanderia', 60, 1, 73),
  ('74-kit-balde-mop', 'Kit balde + mop', 'Flash Limp, mop giratório 360°', 'Limpeza e lavanderia', 140, 1, 74),
  ('75-escorredor-de-louca-inox', 'Escorredor de louça inox', 'Tramontina Plurale', 'Limpeza e lavanderia', 140, 1, 75),
  ('76-organizadores-de-geladeira-kit', 'Organizadores de geladeira (kit)', 'Kit de potes empilháveis', 'Limpeza e lavanderia', 120, 1, 76),
  ('77-organizadores-de-armario-kit', 'Organizadores de armário (kit)', 'Organizador plástico empilhável multiuso', 'Limpeza e lavanderia', 120, 1, 77),
  ('78-cestos-organizadores-kit', 'Cestos organizadores (kit)', 'Coza, kit com 3 a 4 peças multiuso', 'Limpeza e lavanderia', 120, 1, 78),
  -- Sala, decoração e tecnologia
  ('79-smart-tv', 'Smart TV', 'Samsung Crystal UHD 4K 50” U8000H', 'Sala, decoração e tecnologia', 2850, 1, 79),
  ('80-soundbar', 'Soundbar', 'JBL Cinema SB580, 3.1 canais', 'Sala, decoração e tecnologia', 1150, 1, 80),
  ('81-ventilador-de-coluna', 'Ventilador de coluna', 'Mondial VTX-40C, com controle remoto', 'Sala, decoração e tecnologia', 280, 1, 81),
  ('82-purificador-de-agua', 'Purificador de água', 'Electrolux PE11B', 'Sala, decoração e tecnologia', 700, 1, 82),
  ('83-umidificador-de-ar', 'Umidificador de ar', 'Multilaser Easy Air HC290, 1,8 L', 'Sala, decoração e tecnologia', 200, 1, 83),
  ('84-caixa-de-som-bluetooth', 'Caixa de som Bluetooth', 'JBL Charge 5', 'Sala, decoração e tecnologia', 700, 1, 84),
  ('85-luminaria-de-mesa', 'Luminária de mesa', 'Taschibra TLM-03', 'Sala, decoração e tecnologia', 150, 1, 85),
  ('86-abajur', 'Abajur', 'Mart Collection, cúpula de linho', 'Sala, decoração e tecnologia', 220, 1, 86),
  ('87-vaso-decorativo', 'Vaso decorativo', 'Mart Collection, cerâmica texturizada', 'Sala, decoração e tecnologia', 180, 1, 87),
  ('88-planta-em-vaso-grande', 'Planta em vaso grande', 'Planta artificial premium com vaso decorativo', 'Sala, decoração e tecnologia', 220, 1, 88),
  ('89-quadro-decorativo', 'Quadro decorativo', 'Oppen House, abstrato com moldura', 'Sala, decoração e tecnologia', 220, 1, 89),
  ('90-tapete-para-sala', 'Tapete para sala', 'Tapetes São Carlos Adana Onda', 'Sala, decoração e tecnologia', 450, 1, 90),
  ('91-cortina-para-sala', 'Cortina para sala', 'Bella Janela Duplex Voil', 'Sala, decoração e tecnologia', 350, 1, 91),
  ('92-kit-de-velas-e-aromatizadores', 'Kit de velas e aromatizadores', 'Kit vela aromática + difusor de varetas', 'Sala, decoração e tecnologia', 200, 1, 92)on conflict (id) do nothing;

-- ==========================================================================
-- COMO VOCÊS ACOMPANHAM
-- --------------------------------------------------------------------------
-- O jeito fácil: abra  https://SEU-SITE/painel.html  e digite a senha da
-- Parte 6. Lá aparece o que foi presenteado, por quem e quando, quanto já
-- entrou, o que ainda falta e quem confirmou presença — com botão para
-- baixar tudo em planilha.
--
-- Pelo painel do Supabase (Table Editor), se preferirem:
-- · marcacoes  → quem avisou que presenteou, com valor e data
--                (linhas sem presente são contribuições de valor livre)
-- · presentes  → coluna "recebido" mostra o total de cada item
-- · rsvps      → quem confirmou presença
--
-- Se alguém marcar por engano, apague a linha em "marcacoes": o total do
-- presente se corrige sozinho e o item volta a ficar disponível.
-- ==========================================================================
