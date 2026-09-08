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

As **fotos dos presentes** (`presentes.itens[].foto`) ainda usam ilustrações
de exemplo — troque por fotos quadradas (1:1) dos itens.

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

A ilustração em aquarela **toca sozinha uma única vez** ao abrir a página e
**congela na ilustração completa** — nunca reinicia nem entra em laço.

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
