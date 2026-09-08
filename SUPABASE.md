# Presentes com PIX automático — Supabase + Mercado Pago

Este guia liga o site ao seu projeto Supabase e ao Mercado Pago para que,
**quando alguém pagar o PIX de um presente, o site marque sozinho o item
como CONQUISTADO** — sem vocês precisarem conferir o banco e atualizar nada.

Leva cerca de 40 minutos na primeira vez. Vá com calma: cada passo tem o
que clicar e o que colar.

---

## Antes de começar: vale a pena?

| | PIX direto (como está hoje) | Mercado Pago (este guia) |
|---|---|---|
| Taxa | **Nenhuma** — vocês recebem 100% | O Mercado Pago cobra uma taxa por PIX recebido (confira a atual em *Custos* no painel dele) |
| Confirmação | Manual: vocês veem o extrato e atualizam | **Automática**: cai o PIX, o site atualiza |
| Dinheiro | Direto na conta de vocês | Fica na conta Mercado Pago; vocês transferem depois |
| Trabalho de configuração | Nenhum | Este guia |

Se a lista tiver poucos itens, o PIX direto resolve bem. Se forem muitos
convidados e vocês não quiserem ficar conferindo extrato, o automático
compensa. Dá para voltar atrás a qualquer momento: é só apagar a URL do
Supabase no `config.js`.

---

## Parte 1 — Criar as tabelas (5 min)

1. Abra o painel do Supabase e entre no seu projeto.
2. No menu da esquerda, clique em **SQL Editor** e depois em **New query**.
3. Abra o arquivo [`supabase/migrations/0001_esquema.sql`](supabase/migrations/0001_esquema.sql)
   deste repositório, copie **todo** o conteúdo e cole na janela.
4. Clique em **Run**. Deve aparecer *Success*.

Isso cria três tabelas — `presentes`, `contribuicoes` e `rsvps` — já com as
regras de segurança e a lista de presentes inicial.

> **O que essa segurança faz:** o navegador do convidado só consegue **ler**
> a lista de presentes e **inserir** a própria confirmação de presença. Ele
> não consegue escrever na tabela de contribuições. É isso que impede
> alguém de marcar um presente como pago sem ter pagado.

5. Para conferir, vá em **Table Editor** → `presentes`. Você deve ver os 8
   itens. Pode editar nomes, valores e unidades ali mesmo, quando quiser.

---

## Parte 2 — Preparar o Mercado Pago (10 min)

1. Entre em **mercadopago.com.br/developers** com a conta que vai **receber
   o dinheiro** (pode ser pessoa física).
2. Vá em **Suas integrações** → **Criar aplicação**.
   - Nome: `Site do casamento`
   - Produto: **Checkout API** (o que permite gerar PIX pelo servidor)
3. Aberta a aplicação, vá em **Credenciais de produção** e copie o
   **Access Token**. Ele começa com `APP_USR-`.

   > Esse token é a chave do cofre: quem tem ele movimenta a conta.
   > Ele vai **só** para os segredos do Supabase, nunca para o site.
   > Se vazar, volte aqui e clique em *Renovar*.

4. Ainda na aplicação, vá em **Webhooks** (ou *Notificações*):
   - **URL de produção:** `https://SEU-PROJETO.supabase.co/functions/v1/mp-webhook`
     (troque `SEU-PROJETO` — está no endereço do seu projeto Supabase)
   - **Evento:** marque **Pagamentos** (`payment`)
   - Salve e depois clique em **gerar chave secreta**. Copie essa chave.

5. Confirme que o **PIX está habilitado** na conta (o painel avisa se
   faltar cadastrar chave PIX ou completar dados).

---

## Parte 3 — Guardar os segredos no Supabase (3 min)

No painel do Supabase: **Project Settings** → **Edge Functions** → **Secrets**
(em alguns painéis: *Edge Functions* → aba *Secrets*). Adicione:

| Nome | Valor |
|---|---|
| `MP_ACCESS_TOKEN` | o Access Token de produção (`APP_USR-...`) |
| `MP_WEBHOOK_SECRET` | a chave secreta do webhook, do passo 2.4 |

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já existem sozinhos — não mexa.

---

## Parte 4 — Publicar as duas funções (10 min)

As funções são o "servidor" que fala com o Mercado Pago. Há dois caminhos.

### Caminho A — pelo computador (recomendado)

No terminal, dentro da pasta do projeto:

```bash
# 1. instalar a ferramenta do Supabase (uma vez só)
npm install -g supabase

# 2. entrar na sua conta (abre o navegador)
supabase login

# 3. conectar esta pasta ao seu projeto
#    (o ID do projeto está em Project Settings → General)
supabase link --project-ref SEU_PROJECT_ID

# 4. publicar as funções
supabase functions deploy criar-pix
supabase functions deploy mp-webhook --no-verify-jwt
```

> O `--no-verify-jwt` da segunda é **essencial**: quem chama essa função é
> o Mercado Pago, que não tem login no seu projeto. A segurança dela vem da
> assinatura secreta, que a função confere a cada chamada.

### Caminho B — pelo painel, sem instalar nada

No Supabase: **Edge Functions** → **Deploy a new function** → *Via Editor*.
Crie uma função chamada `criar-pix` e cole o conteúdo de
`supabase/functions/criar-pix/index.ts`. Repita para `mp-webhook`, colando
`supabase/functions/mp-webhook/index.ts` — e, nas configurações dessa
segunda, **desmarque a verificação de JWT**.

---

## Parte 5 — Ligar o site (2 min)

1. No Supabase: **Project Settings** → **API**. Copie:
   - **Project URL** (ex.: `https://nifrqzfpzeeafzdsnmkk.supabase.co`)
   - **anon public** key (a chave longa `eyJ...`)

   > A chave `anon` pode ficar no site sem problema: ela é pública por
   > natureza e só consegue fazer o que as regras da Parte 1 permitem.
   > **Nunca** use aqui a `service_role`.

2. Abra o `config.js` e preencha:

```js
supabase: {
  url: "https://SEU-PROJETO.supabase.co",
  anonKey: "eyJ...",
},
```

3. Publique o site (commit + push; o Render atualiza sozinho).

Pronto: a lista de presentes passa a vir do Supabase, o botão gera um PIX
de verdade e o pagamento confirmado marca o item como conquistado.

**Enquanto esses campos estiverem vazios, nada muda** — o site continua
funcionando como hoje, com a lista do `config.js`.

---

## Parte 6 — Testar (10 min)

Faça um teste de verdade, com valor pequeno:

1. Abra o site, escolha um presente e clique em **Presentear**.
2. Escolha "Outro valor" e digite **5,00**.
3. Preencha nome e e-mail e gere o PIX.
4. Pague com o app do seu banco (o dinheiro cai na sua conta Mercado Pago).
5. Em até um minuto, recarregue o site: o valor recebido deve ter subido.
   No Supabase, **Table Editor** → `contribuicoes` mostra a linha com
   status `aprovado`.

Se não atualizar, veja **Edge Functions** → `mp-webhook` → **Logs**. As
mensagens de erro estão em português e dizem o que houve.

Para zerar depois do teste: em `contribuicoes`, apague a linha do teste —
o total do presente se ajusta sozinho.

---

## Perguntas comuns

**Preciso mexer no código para trocar preços ou presentes?**
Não. Use o **Table Editor** → `presentes`. Para acrescentar um item, clique
em *Insert row*: preencha `id` (sem espaços nem acentos, ex.: `liquidificador`),
`nome`, `valor`, `unidades`, `foto` e `ordem`.

**Como vejo quem confirmou presença?**
**Table Editor** → `rsvps`. Dá para exportar em CSV pelo próprio painel.

**Alguém pode fraudar e marcar um presente como pago?**
Não. O navegador não tem permissão de escrever em `contribuicoes`, e o
site só considera aprovado o que o Mercado Pago confirma — a função ainda
confere se o valor pago bate com o combinado.

**E se um convidado gerar o PIX e não pagar?**
A contribuição fica `pendente` e não conta no total. O PIX expira em 30
minutos.

**Onde fica o dinheiro?**
Na conta Mercado Pago. Transfiram para a conta bancária quando quiserem.

---

## Um aviso honesto

Escrevi esta integração seguindo a API do Mercado Pago (endpoint
`POST /v1/payments` com `payment_method_id: "pix"`, e validação do webhook
por `x-signature`). **Não consegui acessar a documentação oficial durante o
desenvolvimento** — o domínio do Mercado Pago está bloqueado no ambiente
onde trabalho. A estrutura é a padrão e estável há anos, mas antes de
divulgar o site aos convidados, faça o teste da Parte 6 com R$ 5,00. É o
que confirma que está tudo certo de ponta a ponta.

Se algum campo tiver mudado, o log da função (**Edge Functions** →
`criar-pix` → **Logs**) mostra a resposta exata do Mercado Pago, e o ajuste
é rápido.
