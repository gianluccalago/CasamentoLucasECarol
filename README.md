# Site de casamento — Maria Carolina & Lucas

Site one-page, estático (HTML + CSS + JavaScript puro), em português do Brasil.
**16 de janeiro de 2027 · 16 horas · Espaço Querência, São José dos Pinhais — PR.**

Identidade visual derivada do convite oficial: papel claro, laranja da
aquarela, dourado dos textos e verde-folha. Tipografia **EB Garamond**
(no espírito do Bell MT do convite), **Pinyon Script** (caligrafia dos
nomes) e **Jost** (rótulos pequenos) — todas self-hosted em `assets/fonts/`.
O monograma exibido no site é o oficial, extraído do PDF em vetor.

## O que ainda falta preencher

Três coisas, todas no [`config.js`](config.js) (e nenhuma exige instalar nada):

| O quê | Onde | Sem isso… |
|---|---|---|
| **Chave PIX, titular e cidade** | `presentes.chavePix` / `titular` / `cidade` | o QR Code aponta para uma conta de exemplo |
| **Supabase** (`url` e `anonKey`) | `supabase` — passo a passo em [SUPABASE.md](SUPABASE.md) | o presente só some para quem deu, e o painel de vocês não abre |
| **Planilha do RSVP** (opcional) | `rsvp.googleSheetsUrl` | com o Supabase ligado, não precisa: as confirmações caem no painel |

Depois de preencher a chave PIX, **façam um teste de R$ 1,00** antes de
divulgar o site.

## Como editar o conteúdo

Todo o conteúdo (textos, datas, endereço, PIX, lista de presentes e caminhos
de fotos) vive em **um único arquivo**: [`config.js`](config.js). Cada campo
tem um comentário explicando o que faz. Nada precisa ser mexido no HTML, CSS
ou `main.js`.

### As fotos do pré-wedding

As três fotos do ensaio já estão no site, em `assets/img/fotos/`:

| Onde aparece | Arquivo | Campo no `config.js` |
|---|---|---|
| "Nosso grande dia" | `casal-flores.jpg` | `boasVindas.foto` |
| "O grande dia" (esquerda) | `casal-caminho.jpg` | `oDia.fotos[0]` |
| "O grande dia" (direita) | `casal-por-do-sol.jpg` | `oDia.fotos[1]` |

Todas em recorte vertical 4:5, exportadas sem redução de resolução
(1066×1332, JPEG qualidade 95 sem subamostragem de cor). Para trocar
qualquer uma, coloque o arquivo em `assets/img/fotos/` e escreva o caminho
no campo correspondente.

### Lista de presentes: como funciona

São **92 presentes**, a lista oficial, divididos em cinco categorias —
Cozinha, Mesa posta, Quarto e banho, Limpeza e lavanderia, e Sala,
decoração e tecnologia. Os botões acima da lista filtram por categoria e
mostram quantos itens ainda estão livres em cada uma.

Cada item tem `nome`, `modelo` (a sugestão de marca), `valor`, `unidades` e
`recebido` (quanto já entrou, em reais). A **foto vem sozinha** de
`assets/img/presentes/` pelo `id` do item — `06-liquidificador` puxa
`06-liquidificador.jpg`. Para usar outra imagem, acrescente `foto: "…"` no
item.

O convidado escolhe pagar o valor cheio ou metade e paga por **PIX**: o
site monta na hora um QR Code com o valor já preenchido, e o dinheiro cai
direto na conta de vocês — sem taxa e sem intermediário. Quem preferir
dividir em vezes pode parcelar o PIX no próprio aplicativo do banco, o que
a maioria dos bancos já permite (o site menciona isso).

> Os campos `chavePix`, `titular` e `cidade` no `config.js` são o que vai
> dentro do QR Code. **Confira com cuidado** — um erro ali manda o dinheiro
> para a conta errada. Faça um teste de R$ 1,00 antes de divulgar o site.

**Para não darem o mesmo presente duas vezes:** depois de pagar, o convidado
escreve o nome e clica no botão de confirmação, que mostra o valor escolhido
(ex.: "Já fiz o PIX de R$ 120"). O item passa a aparecer como **CONQUISTADO**
e desce para o fim da lista, sem botão. Contribuições parciais são somadas:
quem deu metade fica registrado com a sua parte, o cartão mostra o progresso
e outra pessoa pode completar depois. Itens com mais de uma unidade só
bloqueiam quando o total for alcançado.

O site foi tipografado com corpo maior que o usual (21–22 px, rótulos a
partir de 13 px) porque parte dos convidados é idosa.

Para esse bloqueio valer para **todos os convidados**, é preciso configurar
o Supabase (10 minutos, sem pagamento nem token envolvido) — veja
**[SUPABASE.md](SUPABASE.md)**. Sem ele, a marcação vale só no navegador de
quem clicou: quem presenteou não vê o item de novo, mas os outros sim.

No fim da lista há um bloco **"Quero contribuir com outro valor"**, para
quem prefere dar uma quantia à escolha sem pegar um item específico. Essa
contribuição gera o PIX normalmente e fica registrada, mas não reserva
nenhum presente — aparece no painel como "Contribuição livre".

Vocês também podem ajustar o campo `recebido` de qualquer item à mão, no
`config.js` ou no painel do Supabase.

### A página de acompanhamento do casal

`painel.html`, no mesmo endereço do site (`https://SEU-SITE/painel.html`),
é a página privada de vocês. Pede uma senha e mostra:

- **quem presenteou o quê e quando** — nome, presente, valor e data/hora,
  com busca;
- **a lista inteira**, com quanto já entrou em cada item e o que falta;
- **quem confirmou presença**, com as observações;
- botão para **baixar planilha** (.csv) de qualquer das três.

A senha não é conferida no navegador: ela vai para o banco, que só devolve
os dados se bater. Os convidados nunca conseguem ler essas informações — o
site só tem permissão para *acrescentar* marcações e confirmações, nunca
para lê-las. A página não tem link nenhum no site e pede para não ser
indexada por buscadores.

Ela depende do Supabase configurado. O passo a passo, incluindo onde
escolher a senha, está em **[SUPABASE.md](SUPABASE.md)**.

### As fotos dos presentes

As 92 fotos estão em `assets/img/presentes/`, todas quadradas (1:1) e
uniformizadas a partir das imagens originais: as de fundo branco tiveram a
sobra recortada e ganharam uma margem igual, para todos os produtos
aparecerem no mesmo tamanho; as fotos de ambiente foram cortadas no centro.
Saída em JPEG progressivo, até 720 px, ~39 KB por foto (3,8 MB no total),
carregadas sob demanda conforme a rolagem.

### Confirmações de presença (RSVP)

**Com o Supabase ligado** (o caminho recomendado), caem no banco e aparecem
na aba *Presenças* do `painel.html`, com botão para baixar planilha. Não
precisa de mais nada.

**Sem o Supabase**, o site pode mandar para uma **planilha do Google**, uma
linha por convidado (data/hora, nome, observações). O passo a passo (~5 min)
está em [`rsvp-apps-script.gs`](rsvp-apps-script.gs): criar a planilha, colar
o script, implantar como App da Web e colar a URL em `rsvp.googleSheetsUrl`
no `config.js`.

**Importante:** sem nenhum dos dois configurados, o formulário apenas simula
o envio e nada é gravado.

## O vídeo do hero

A ilustração em aquarela **toca sozinha uma única vez** ao abrir a página e
**congela na ilustração completa** — nunca reinicia nem entra em laço. O
clipe dura ~8,4 s (foi acelerado 20%) e começa em menos de 1,5 s nas redes
comuns, para que ninguém role a página antes de ver a flor desabrochar.

Para o iPhone jamais exibir o botão de play nativo (que aparece quando o
autoplay é barrado, por exemplo no modo de economia de energia), o vídeo fica
invisível até começar de fato a tocar: por baixo dele há sempre uma imagem.
Se o autoplay for barrado, o site tenta de novo no primeiro toque e,
persistindo, mostra a ilustração pronta.

Os arquivos em `assets/video/` foram gerados a partir do vídeo original com:

1. Remoção da marca d'água por **inpainting** (OpenCV, máscara fixa sobre a
   estrela em x 1136–1183, y 576–623) — preserva a composição inteira, sem
   corte e sem borrão;
2. Desktop 1920×1080 e mobile 864×1080 (recorte 4:5 com a flor e uma
   laranja), upscale `lanczos` + `unsharp`;
3. H.264 CRF 18 (qualidade alta), perfil high, `+faststart`, e WebM VP9 como
   alternativa para navegadores sem H.264;
4. Pôsteres do primeiro quadro (capa) e do último (exibido no congelamento,
   com "movimento reduzido" e como reserva).

No desktop a ilustração é exibida em recorte panorâmico (2:1), ocupando
~83% da largura da página; no celular, ~94%.

## Publicação

O site é 100% estático: basta hospedar a pasta inteira (Render, GitHub Pages,
Netlify, Vercel…). No Render, use **Publish Directory** `.` e deixe o Build
Command vazio. Após publicar, atualize a tag `og:image` no `index.html` com a
URL absoluta do domínio.

### Para alterar algo, você não precisa instalar nada

Não é necessário ter git, editor ou qualquer programa no computador. Há dois
caminhos:

- **Peça aqui no chat** — as alterações são feitas, versionadas e publicadas
  para você.
- **Edite pelo navegador** — abra o arquivo (normalmente o `config.js`) no
  site do GitHub, clique no ícone de lápis, altere e confirme em
  *Commit changes*. O Render republica sozinho em cerca de um minuto.
