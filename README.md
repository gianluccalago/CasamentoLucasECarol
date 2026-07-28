# Site de casamento — Maria Carolina & Lucas

Site one-page, estático (HTML + CSS + JavaScript puro), em português do Brasil.
**16 de janeiro de 2027 · 16 horas · Espaço Querência, São José dos Pinhais — PR.**

Identidade visual derivada do convite oficial: papel claro, laranja da
aquarela, dourado dos textos e verde-folha. Tipografia **EB Garamond**
(no espírito do Bell MT do convite), **Pinyon Script** (caligrafia dos
nomes) e **Jost** (rótulos pequenos) — todas self-hosted em `assets/fonts/`.
O monograma exibido no site é o oficial, extraído do PDF em vetor.

## Como editar o conteúdo

Todo o conteúdo (textos, datas, endereço, PIX, lista de presentes e caminhos
de fotos) vive em **um único arquivo**: [`config.js`](config.js). Cada campo
tem um comentário explicando o que faz. Nada precisa ser mexido no HTML, CSS
ou `main.js`.

### Colocar as fotos do pré-wedding

Os espaços já estão prontos, com imagens de exemplo. Coloque as fotos em
`assets/img/` e troque os caminhos no `config.js`:

| Onde aparece | Campo no `config.js` | Proporção ideal |
|---|---|---|
| Seção "Nosso grande dia" | `boasVindas.foto` | vertical 4:5 |
| Seção "O grande dia" (duas fotos) | `oDia.fotos` | horizontal 3:2 |
| Cada presente | `presentes.itens[].foto` | quadrada 1:1 |

### Lista de presentes e o selo "Conquistado!"

Cada item tem `valor`, `unidades` e `recebido` (quanto já entrou, em reais).
O convidado escolhe pagar o valor cheio ou uma parte, e o site mostra a chave
PIX. O selo **CONQUISTADO!** aparece sozinho quando `recebido` alcança
`valor × unidades` — ou seja, só depois que **todas** as unidades foram
integralmente pagas. Antes disso, o cartão mostra o progresso.

Há duas formas de marcar o que já foi recebido:

1. **Direto no `config.js`** — edite o campo `recebido` do item e publique.
2. **Pela planilha do Google** (mais prático) — o casal atualiza os valores
   na planilha e o site se atualiza sozinho. Veja
   [`rsvp-apps-script.gs`](rsvp-apps-script.gs).

> O PIX não avisa o site automaticamente quando alguém paga — nenhum site
> estático consegue isso sem um gateway de pagamento. Por isso a confirmação
> é sempre de vocês, depois de conferir a entrada no banco. O convidado pode
> clicar em "Avisar que presenteei", o que registra o aviso na planilha para
> facilitar a conferência.

### Confirmações de presença (RSVP)

Caem numa **planilha do Google**, uma linha por convidado (data/hora, nome,
observações). O passo a passo (~5 min) está em
[`rsvp-apps-script.gs`](rsvp-apps-script.gs): criar a planilha, colar o
script, implantar como App da Web e colar a URL em `rsvp.googleSheetsUrl`
no `config.js`.

**Importante:** enquanto essa URL estiver vazia, o formulário apenas simula o
envio e nada é gravado.

## O vídeo do hero

A ilustração em aquarela é **pintada conforme a rolagem da página**: o miolo
do hero fica fixo (sticky) enquanto o scroll percorre a linha do tempo do
vídeo. Nunca chamamos `play()` — por isso não existe botão de play nem
bloqueio de autoplay (inclusive no modo de economia de energia do iPhone).

Os arquivos em `assets/video/` foram gerados a partir do vídeo original com:

1. Remoção da marca d'água por **inpainting** (OpenCV, máscara fixa sobre a
   estrela em x 1136–1183, y 576–623) — preserva a composição inteira, sem
   corte e sem borrão;
2. Desktop 1600×900 (composição completa) e mobile 720×900 (recorte 4:5 com
   a flor e uma laranja);
3. H.264 `+faststart` com **keyframe em todo frame** (`-g 1`), obrigatório
   para o scrub por scroll ser instantâneo;
4. Pôsteres do primeiro quadro (capa) e do último (usado com "movimento
   reduzido" e como reserva).

## Publicação

O site é 100% estático: basta hospedar a pasta inteira (Render, GitHub Pages,
Netlify, Vercel…). No Render, use **Publish Directory** `.` e deixe o Build
Command vazio. Após publicar, atualize a tag `og:image` no `index.html` com a
URL absoluta do domínio.
