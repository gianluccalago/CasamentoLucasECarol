# Evitar presentes repetidos — Supabase em 10 minutos

Este guia é **opcional**, mas resolve um problema real: sem ele, duas
pessoas podem dar o mesmo presente sem saber.

## O problema

O PIX do site já funciona sozinho, sem servidor nenhum: o convidado escaneia
o QR com o valor preenchido e o dinheiro cai direto na conta de vocês, sem
taxa e sem intermediário.

O que um site estático **não** consegue fazer sozinho é lembrar de algo para
todos os visitantes. Quando alguém avisa "já comprei o jogo de panelas",
essa informação precisa ficar guardada em algum lugar que os **outros
convidados** também enxerguem. É só para isso que serve o Supabase aqui: um
caderninho compartilhado.

Sem ele, o site ainda marca o presente — mas só no navegador de quem clicou.
Quem presenteou não vê o item de novo; os outros convidados, sim.

| | Sem Supabase | Com Supabase |
|---|---|---|
| PIX com QR e valor | Funciona | Funciona |
| Presente some da lista para quem comprou | Sim | Sim |
| **Presente some para os outros convidados** | **Não** | **Sim** |
| Vocês veem quem presenteou o quê | Só pela planilha do Google | Sim, no painel |

Não há pagamento envolvido em nada disto — nenhum token, nenhuma conta de
gateway, nenhuma taxa. Só uma lista compartilhada.

---

## Parte 1 — Criar as tabelas (5 min)

1. Abra o painel do Supabase e entre no seu projeto.
2. No menu da esquerda, clique em **SQL Editor** → **New query**.
3. Abra o arquivo [`supabase/migrations/0001_esquema.sql`](supabase/migrations/0001_esquema.sql)
   deste repositório, copie **todo** o conteúdo e cole na janela.
4. Clique em **Run**. Deve aparecer *Success*.

Isso cria três tabelas — `presentes`, `marcacoes` e `rsvps` — já com a lista
de presentes inicial e as regras de segurança.

> **O que a segurança faz:** pelo navegador, o convidado só consegue **ler**
> a lista de presentes e **acrescentar** a própria marcação e o próprio
> RSVP. Ele não consegue apagar nada nem ver os dados dos outros.

5. Confira em **Table Editor** → `presentes`: devem estar lá os 8 itens.
   Pode editar nomes, valores, unidades e fotos ali mesmo, quando quiser.

---

## Parte 2 — Ligar o site (3 min)

1. No Supabase: **Project Settings** → **API**. Copie:
   - **Project URL** (ex.: `https://nifrqzfpzeeafzdsnmkk.supabase.co`)
   - a chave **anon public** (a longa, que começa com `eyJ...`)

   > A chave `anon` pode ficar no site sem problema: ela é pública por
   > natureza e só faz o que as regras da Parte 1 permitem.
   > **Nunca** use aqui a chave `service_role`.

2. No `config.js`, preencha:

```js
supabase: {
  url: "https://SEU-PROJETO.supabase.co",
  anonKey: "eyJ...",
},
```

3. Publique (commit + push; o Render atualiza sozinho).

Pronto. A lista de presentes passa a vir do banco e, quando alguém confirma
que presenteou, o item aparece como **CONQUISTADO** para todos.

---

## Parte 3 — Testar (2 min)

1. Abra o site, escolha um presente e clique em **Presentear**.
2. Role até "Avise que este presente é seu", escreva um nome e confirme.
3. O item deve aparecer como conquistado.
4. Abra o site em **outro celular** (ou numa aba anônima): o item deve
   aparecer conquistado lá também. É esse o ponto do guia.
5. Para desfazer o teste: **Table Editor** → `marcacoes` → apague a linha.
   O presente volta a ficar disponível sozinho.

---

## No dia a dia

**Ver quem presenteou o quê:** Table Editor → `marcacoes` (nome, presente,
valor e data). Dá para exportar em CSV pelo painel.

**Ver quem confirmou presença:** Table Editor → `rsvps`.

**Alguém marcou por engano:** apague a linha em `marcacoes`. O total do
presente se corrige sozinho.

**Trocar preços ou acrescentar presentes:** Table Editor → `presentes` →
*Insert row*. O `id` não pode ter espaços nem acentos (ex.: `liquidificador`).

**E se alguém marcar sem ter pago?** É possível, tecnicamente — o site
confia no aviso do convidado, como acontece em qualquer lista de presentes.
Na prática o link é privado, entre convidados. Se acontecer, é só apagar a
linha em `marcacoes`. Vale conferir a lista contra o extrato de vez em
quando.
