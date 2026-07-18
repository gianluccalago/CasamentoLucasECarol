# Site de casamento — Lucas & Carol

Site one-page, estático (HTML + CSS + JavaScript puro), em português do Brasil.
**16 de janeiro de 2027 · 16h · Espaço Querência, São José dos Pinhais — PR.**

Tipografia: **Playfair Display** (títulos), **Great Vibes** (manuscrita) e
**Jost** (corpo), todas self-hosted em `assets/fonts/`.

## Como editar o conteúdo

Todo o conteúdo do site (textos, nomes, datas, endereço, dados do PIX e
caminhos de imagens) vive em **um único arquivo**: [`config.js`](config.js).
Abra-o em qualquer editor de texto — cada campo tem um comentário explicando
o que ele faz. Nada precisa ser alterado no HTML, no CSS ou no `main.js`.

### Trocar as fotos

1. Coloque suas fotos em `assets/img/` (ex.: `assets/img/fotos/foto-01.jpg`).
2. No `config.js`, troque os caminhos dos placeholders pelos das fotos reais
   (campos `historia.imagem` e `galeria.fotos`), incluindo um `alt` descritivo.

### Trocar a paleta de cores

Todos os tokens de cor estão no bloco `:root` no topo de
[`css/styles.css`](css/styles.css). Trocar a paleta inteira exige editar só
esse bloco.

### Onde caem as respostas do RSVP (Google Sheets)

As confirmações de presença são gravadas numa **planilha do Google** — uma
linha por convidado (data/hora, nome, acompanhantes, observações). A
configuração leva ~5 minutos e o passo a passo completo está no arquivo
[`rsvp-apps-script.gs`](rsvp-apps-script.gs): você cria a planilha, cola o
script no Apps Script dela, implanta como App da Web e cola a URL gerada no
campo `rsvp.googleSheetsUrl` do `config.js`.

**Importante:** enquanto essa URL estiver vazia, o formulário apenas simula
o envio e nenhuma resposta é gravada.

## O vídeo do hero

O desabrochar é **conduzido pela rolagem da página**: o miolo do hero fica
fixo (sticky) enquanto o scroll percorre a linha do tempo do vídeo. Nunca
chamamos `play()` — por isso não existe botão de play nem bloqueio de
autoplay (inclusive no modo de economia de energia do iPhone). O nome
"Lucas & Carol" fica sempre por cima, nunca é coberto.

Os arquivos em `assets/video/` foram gerados a partir do vídeo original com:

1. Crop `1120×630` (remove a marca d'água do canto inferior direito, medida
   em x≈1136–1185, y≈575–625, mantendo 16:9 exato);
2. Upscale para 1920×1080 com `lanczos` + `unsharp=5:5:0.4` (por isso o
   vídeo nunca é renderizado acima de 1200px de largura no desktop);
3. Export H.264 `+faststart` com **keyframe em todo frame** (`-g 1`) —
   obrigatório para o scrub por scroll ser instantâneo;
4. Versão mobile 720×1080 (recorte vertical central) + pôsteres do primeiro
   quadro (`hero-poster-inicio*.jpg`, capa) e do último (`hero-poster*.jpg`,
   usado com "movimento reduzido" e como reserva).

## Publicação

O site é 100% estático: basta hospedar a pasta inteira (GitHub Pages,
Netlify, Vercel…). Após publicar, atualize a tag `og:image` no `index.html`
com a URL absoluta do seu domínio.
