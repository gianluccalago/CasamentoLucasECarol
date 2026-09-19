# Ligar o banco — Supabase em 10 minutos

Este passo a passo resolve duas coisas de uma vez:

1. **Ninguém dá o mesmo presente duas vezes.** Quando um convidado avisa
   que presenteou, o item passa a aparecer como **CONQUISTADO** para
   todos os outros.
2. **Vocês acompanham tudo.** Numa página só de vocês, protegida por
   senha, aparece **o que foi presenteado, por quem e quando** — além do
   que ainda falta e de quem confirmou presença.

## Por que isso não funciona sozinho

O PIX do site já funciona sem servidor nenhum: o convidado escaneia o QR
com o valor preenchido e o dinheiro cai direto na conta de vocês, sem taxa
e sem intermediário.

O que um site estático **não** consegue fazer sozinho é lembrar de algo
para todos os visitantes. Quando alguém avisa "já dei o liquidificador",
essa informação precisa ficar guardada em algum lugar que os **outros
convidados** também enxerguem. É só para isso que serve o Supabase aqui:
um caderninho compartilhado.

| | Sem Supabase | Com Supabase |
|---|---|---|
| PIX com QR e valor | Funciona | Funciona |
| Presente some da lista para quem deu | Sim | Sim |
| **Presente some para os outros convidados** | **Não** | **Sim** |
| **Página com quem presenteou o quê e quando** | **Não** | **Sim** |

Não há pagamento envolvido em nada disto — nenhum token, nenhuma conta de
gateway, nenhuma taxa. Só uma lista compartilhada.

---

## Parte 1 — Criar as tabelas (5 min)

1. Abra o painel do Supabase e entre no seu projeto.
2. No menu da esquerda, clique em **SQL Editor** → **New query**.
3. Abra o arquivo [`supabase/migrations/0001_esquema.sql`](supabase/migrations/0001_esquema.sql)
   deste repositório e copie **todo** o conteúdo.
4. **Antes de rodar**, ache a linha marcada com `<<<<<< TROQUE AQUI` e
   escreva ali a senha que vocês vão usar na página de acompanhamento
   (mínimo 8 letras). Exemplo:

   ```sql
   values (1, 'laranjeira-16-01-2027')
   ```

5. Cole tudo na janela e clique em **Run**. Deve aparecer *Success*.

Isso cria as tabelas `presentes` (já com os 92 itens da lista oficial),
`marcacoes`, `rsvps` e o acesso do painel, junto com as regras de
segurança.

> **O que a segurança faz:** pelo navegador, o convidado só consegue **ler**
> a lista de presentes e **acrescentar** a própria marcação e o próprio
> RSVP. Ele não consegue apagar nada, nem ver quem presenteou o quê, nem
> ler a senha do painel.

6. Confira em **Table Editor** → `presentes`: devem estar lá os 92 itens.
   Pode editar nomes, modelos, valores e unidades ali mesmo, quando quiser.

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

3. Publique. Você **não precisa de git nem de nada instalado** para isso —
   basta pedir a alteração aqui no chat, ou editar o `config.js` direto no
   site do GitHub (abra o arquivo → ícone de lápis → *Commit changes*). O
   Render publica sozinho em cerca de um minuto.

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

## Parte 4 — A página de vocês

Abra, no navegador:

```
https://SEU-SITE/painel.html
```

(é o endereço do site com `/painel.html` no fim). Digite a senha que vocês
escolheram na Parte 1. Lá dentro:

- **Quem presenteou** — cada aviso, com **nome, presente, valor e
  data/hora**, do mais recente para o mais antigo. Tem campo de busca.
- **A lista** — os 92 itens, quanto já entrou em cada um e o que falta.
- **Presenças** — quem confirmou e as observações que deixou.
- **Baixar planilha** — em qualquer das três, gera um arquivo que abre
  direto no Excel ou no Google Planilhas.

O aparelho lembra a senha, então no celular de vocês é só abrir. O botão
**Sair** esquece a senha naquele aparelho.

> **Essa página não tem link nenhum no site** e pede para não ser
> indexada por buscadores. E, mesmo que alguém descubra o endereço, não
> vê nada sem a senha: a conferência é feita dentro do banco, não no
> navegador. Guardem o endereço nos favoritos.

**Trocar a senha depois:** SQL Editor → New query → Run:

```sql
update public.painel_acesso set senha = 'a-nova-senha' where id = 1;
```

---

## No dia a dia

**Alguém marcou por engano:** Table Editor → `marcacoes` → apague a linha.
O total do presente se corrige sozinho e o item volta para a lista.

**Trocar preços ou acrescentar presentes:** Table Editor → `presentes` →
*Insert row*. O `id` não pode ter espaços nem acentos (ex.:
`93-churrasqueira`). Se puser uma foto em `assets/img/presentes/` com o
mesmo nome do `id` (`93-churrasqueira.jpg`), ela aparece sozinha.

**Tirar um item da lista sem apagar:** desmarque a coluna `ativo`.

**E se alguém marcar sem ter pago?** É possível, tecnicamente — o site
confia no aviso do convidado, como acontece em qualquer lista de presentes.
Na prática o link é privado, entre convidados. Se acontecer, é só apagar a
linha em `marcacoes`. Vale conferir o painel contra o extrato de vez em
quando.
