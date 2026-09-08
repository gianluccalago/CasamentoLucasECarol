-- ==========================================================================
-- ESQUEMA DO BANCO — Casamento Maria Carolina & Lucas
-- ==========================================================================
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em RUN.
-- Ele cria as três tabelas, a segurança de acesso e o gatilho que soma
-- automaticamente quanto já foi recebido de cada presente.
--
-- Rodar de novo é seguro: tudo usa "if not exists" / "or replace".
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. PRESENTES — o catálogo. É a fonte da verdade dos valores.
--    O site LÊ esta tabela; ninguém consegue escrever nela pelo navegador.
-- --------------------------------------------------------------------------
create table if not exists public.presentes (
  id         text primary key,                    -- ex.: "jogo-de-panelas"
  nome       text not null,
  valor      numeric(10,2) not null check (valor > 0),   -- valor de UMA unidade
  unidades   int  not null default 1 check (unidades > 0),
  foto       text,
  ordem      int  not null default 0,
  ativo      boolean not null default true,
  -- Somado automaticamente pelo gatilho, a partir dos pagamentos aprovados.
  recebido   numeric(10,2) not null default 0
);

-- --------------------------------------------------------------------------
-- 2. CONTRIBUIÇÕES — cada tentativa de presente e seu pagamento.
--    Tabela privada: o navegador não lê nem escreve aqui. Só as funções
--    do servidor (que usam a chave secreta) mexem nela.
-- --------------------------------------------------------------------------
create table if not exists public.contribuicoes (
  id             uuid primary key default gen_random_uuid(),
  presente_id    text not null references public.presentes(id) on delete cascade,
  valor          numeric(10,2) not null check (valor > 0),
  nome           text,
  email          text,
  mensagem       text,
  mp_payment_id  text unique,                     -- id do pagamento no Mercado Pago
  status         text not null default 'pendente'
                 check (status in ('pendente','aprovado','recusado','expirado')),
  criado_em      timestamptz not null default now(),
  pago_em        timestamptz
);

create index if not exists idx_contribuicoes_presente on public.contribuicoes(presente_id);
create index if not exists idx_contribuicoes_status   on public.contribuicoes(status);

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
-- 4. GATILHO: mantém presentes.recebido sempre igual à soma dos
--    pagamentos APROVADOS daquele presente.
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
           select sum(c.valor) from public.contribuicoes c
            where c.presente_id = alvo and c.status = 'aprovado'
         ), 0)
   where p.id = alvo;
  return null;
end;
$$;

drop trigger if exists trg_atualizar_recebido on public.contribuicoes;
create trigger trg_atualizar_recebido
after insert or update or delete on public.contribuicoes
for each row execute function public.atualizar_recebido();

-- --------------------------------------------------------------------------
-- 5. SEGURANÇA (RLS) — quem pode fazer o quê pelo navegador
-- --------------------------------------------------------------------------
alter table public.presentes     enable row level security;
alter table public.contribuicoes enable row level security;
alter table public.rsvps         enable row level security;

-- Presentes: qualquer visitante LÊ (para montar a lista). Ninguém escreve.
drop policy if exists "presentes: leitura publica" on public.presentes;
create policy "presentes: leitura publica"
  on public.presentes for select
  to anon, authenticated
  using (ativo);

-- Contribuições: NENHUMA política para o navegador.
-- Sem política, o RLS bloqueia tudo — só as funções do servidor acessam.
-- É isso que impede alguém de marcar um presente como pago sem pagar.

-- RSVP: o visitante pode INSERIR a própria confirmação, mas não pode
-- ler a lista de convidados.
drop policy if exists "rsvp: qualquer um confirma" on public.rsvps;
create policy "rsvp: qualquer um confirma"
  on public.rsvps for insert
  to anon, authenticated
  with check (
    length(coalesce(nome, '')) between 2 and 120
    and length(coalesce(observacoes, '')) <= 1000
  );

-- --------------------------------------------------------------------------
-- 6. CATÁLOGO INICIAL — edite valores, nomes e unidades à vontade.
--    Para alterar depois, use o Table Editor do Supabase.
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
