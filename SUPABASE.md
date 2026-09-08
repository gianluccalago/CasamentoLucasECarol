# Cartão parcelado — Supabase + Mercado Pago

**Este guia é opcional.** O site já recebe presentes por **PIX sem taxa
nenhuma**, com QR Code gerado na hora e o valor do presente já preenchido —
isso funciona sozinho, sem servidor, sem cadastro e sem intermediário. O
dinheiro cai direto na conta de vocês.

Este guia serve para **acrescentar uma segunda forma de pagamento**: cartão
de crédito parcelado, para quem preferir dividir o valor. Nesse caso o
pagamento passa pelo Mercado Pago, que cobra taxa.

---

## As duas formas, lado a lado

| | PIX (já está funcionando) | Cartão parcelado (este guia) |
|---|---|---|
| Taxa | **Nenhuma** — vocês recebem 100% | O Mercado Pago desconta taxa; confira a sua em *Custos*, no painel dele |
| Parcelamento | Não | Sim, até 12x |
| Dinheiro | Direto na conta de vocês | Fica na conta Mercado Pago; vocês transferem depois |
| Quem confirma | Vocês, olhando o extrato | **Automático**: o site marca o presente sozinho |
| Configuração | Só preencher a chave no `config.js` | Este guia (~40 min) |

Vale a pena? Se a maioria dos convidados vai pagar à vista, o PIX resolve e
você não precisa de nada disto. O cartão ajuda em presentes mais caros, em
que alguém só consegue participar parcelando.

> **Antes de tudo, confira a chave PIX.** No `config.js`, os campos
> `chavePix`, `titular` e `cidade` são o que vai dentro do QR Code. Um erro
> ali manda o dinheiro para a conta errada. Faça um teste de R$ 1,00 com o
> seu próprio celular antes de divulgar o site.

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
   - Produto: **Checkout Pro** (o que permite cartão parcelado)
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

5. Confirme que a conta está habilitada a receber cartão (o painel avisa
   se faltar completar algum dado cadastral).

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
supabase functions deploy criar-checkout
supabase functions deploy mp-webhook --no-verify-jwt
```

> O `--no-verify-jwt` da segunda é **essencial**: quem chama essa função é
> o Mercado Pago, que não tem login no seu projeto. A segurança dela vem da
> assinatura secreta, que a função confere a cada chamada.

### Caminho B — pelo painel, sem instalar nada

No Supabase: **Edge Functions** → **Deploy a new function** → *Via Editor*.
Crie uma função chamada `criar-checkout` e cole o conteúdo de
`supabase/functions/criar-checkout/index.ts`. Repita para `mp-webhook`, colando
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

Pronto: a lista de presentes passa a vir do Supabase e aparece, abaixo do
PIX, a opção de parcelar no cartão. Pagamentos por cartão marcam o presente
como conquistado sozinhos.

**Enquanto esses campos estiverem vazios, nada muda** — o site continua com
o PIX (que não depende disto) e a lista do `config.js`.

---

## Parte 6 — Testar (10 min)

Teste as duas formas, de verdade, com valores pequenos:

**PIX** (não depende deste guia):
1. Abra o site, escolha um presente e clique em **Presentear**.
2. Em "Outro valor", digite **1,00**.
3. Escaneie o QR com o app do seu banco. Confira se aparece **o seu nome**
   como recebedor e **R$ 1,00** como valor. Pague.
4. O dinheiro cai direto na conta — sem taxa e sem passar por ninguém.

**Cartão parcelado:**
1. No mesmo modal, role até "Prefere parcelar no cartão?".
2. Preencha nome e e-mail e clique em **Ir para o pagamento**.
3. Você vai para o Mercado Pago. Pague **R$ 5,00** no cartão.
4. Em até um minuto, recarregue o site: o valor recebido deve ter subido.
   No Supabase, **Table Editor** → `contribuicoes` mostra a linha com
   status `aprovado`.

Se o cartão não atualizar, veja **Edge Functions** → `mp-webhook` →
**Logs**. As mensagens estão em português e dizem o que houve.

Para zerar depois: em `contribuicoes`, apague as linhas de teste — o total
do presente se ajusta sozinho.

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

**E se um convidado começar o pagamento no cartão e desistir?**
A contribuição fica `pendente` e não conta no total.

**Os presentes pagos por PIX aparecem como conquistados sozinhos?**
Não — o PIX cai direto na conta de vocês, sem passar pelo Mercado Pago, e
por isso o site não fica sabendo. Ao ver o dinheiro no extrato, atualize a
coluna `recebido` do presente no **Table Editor** (ou o campo `recebido` no
`config.js`, se não estiver usando o Supabase). O identificador que aparece
no seu extrato é o nome do presente, o que ajuda a reconhecer.

**Onde fica o dinheiro?**
Na conta Mercado Pago. Transfiram para a conta bancária quando quiserem.

---

## Um aviso honesto

Escrevi esta integração seguindo a API do Mercado Pago (endpoint
`POST /checkout/preferences` para o checkout parcelado, e validação do
webhook por `x-signature`). **Não consegui acessar a documentação oficial durante o
desenvolvimento** — o domínio do Mercado Pago está bloqueado no ambiente
onde trabalho. A estrutura é a padrão e estável há anos, mas antes de
divulgar o site aos convidados, faça o teste da Parte 6 com R$ 5,00. É o
que confirma que está tudo certo de ponta a ponta.

Se algum campo tiver mudado, o log da função (**Edge Functions** →
`criar-checkout` → **Logs**) mostra a resposta exata do Mercado Pago, e o ajuste
é rápido.
