-- ==========================================================================
-- ESQUEMA DO BANCO — Casamento Maria Carolina & Lucas
-- ==========================================================================
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em RUN.
--
-- Para que serve: guardar a lista de presentes e registrar quem já
-- presenteou cada item. É isso que faz um presente aparecer como
-- CONQUISTADO para TODOS os convidados — evitando que duas pessoas
-- comprem a mesma coisa.
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
  id         text primary key,                          -- ex.: "jogo-de-panelas"
  nome       text not null,
  valor      numeric(10,2) not null check (valor > 0),  -- valor de UMA unidade
  unidades   int  not null default 1 check (unidades > 0),
  foto       text,
  ordem      int  not null default 0,
  ativo      boolean not null default true,
  -- Somado automaticamente a partir das marcações (não edite na mão).
  recebido   numeric(10,2) not null default 0
);

-- --------------------------------------------------------------------------
-- 2. MARCAÇÕES — cada convidado que avisou "já fiz o PIX deste presente".
--    O convidado só consegue INSERIR aqui. Não consegue ler a lista de
--    quem presenteou, nem apagar nada.
-- --------------------------------------------------------------------------
create table if not exists public.marcacoes (
  id           uuid primary key default gen_random_uuid(),
  presente_id  text not null references public.presentes(id) on delete cascade,
  nome         text not null,
  valor        numeric(10,2) not null check (valor > 0),
  mensagem     text,
  criado_em    timestamptz not null default now()
);

create index if not exists idx_marcacoes_presente on public.marcacoes(presente_id);

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

-- RSVP: o convidado insere a própria confirmação, sem ler a lista.
drop policy if exists "rsvp: qualquer um confirma" on public.rsvps;
create policy "rsvp: qualquer um confirma"
  on public.rsvps for insert
  to anon, authenticated
  with check (
    length(coalesce(nome, '')) between 2 and 120
    and length(coalesce(observacoes, '')) <= 1000
  );

-- --------------------------------------------------------------------------
-- 6. CATÁLOGO INICIAL — edite valores, nomes e unidades à vontade,
--    aqui ou depois pelo Table Editor.
-- --------------------------------------------------------------------------
insert into public.presentes (id, nome, valor, unidades, foto, ordem) values
  ('jogo-de-panelas',    'Jogo de panelas',    890, 1, 'assets/img/placeholders/presente-01.svg', 1),
  ('jogo-de-tacas',      'Jogo de taças',      240, 2, 'assets/img/placeholders/presente-02.svg', 2),
  ('roupa-de-cama',      'Roupa de cama',      520, 1, 'assets/img/placeholders/presente-03.svg', 3),
  ('cafeteira',          'Cafeteira',          680, 1, 'assets/img/placeholders/presente-04.svg', 4),
  ('jogo-de-toalhas',    'Jogo de toalhas',    320, 2, 'assets/img/placeholders/presente-05.svg', 5),
  ('air-fryer',          'Air fryer',          750, 1, 'assets/img/placeholders/presente-06.svg', 6),
  ('aparelho-de-jantar', 'Aparelho de jantar', 980, 1, 'assets/img/placeholders/presente-07.svg', 7),
  ('lua-de-mel',         'Nossa lua de mel',   500, 8, 'assets/img/placeholders/presente-08.svg', 8)
on conflict (id) do nothing;

-- ==========================================================================
-- COMO VOCÊS ACOMPANHAM (no Table Editor do Supabase)
-- --------------------------------------------------------------------------
-- · marcacoes  → quem avisou que presenteou, com valor e data
-- · presentes  → coluna "recebido" mostra o total de cada item
-- · rsvps      → quem confirmou presença
--
-- Se alguém marcar por engano, apague a linha em "marcacoes": o total do
-- presente se corrige sozinho e o item volta a ficar disponível.
-- ==========================================================================
