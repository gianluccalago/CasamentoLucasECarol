/* ==========================================================================
   CONFIG.JS — CENTRAL DE CONTEÚDO DO SITE
   ==========================================================================
   Este arquivo concentra TODOS os textos, nomes, datas, endereços, dados
   do PIX e caminhos de imagens/vídeos do site. Para alterar qualquer
   conteúdo, edite APENAS este arquivo — nada precisa ser mexido no HTML,
   no CSS ou no restante do JavaScript.

   DICAS PARA EDITAR SEM ERRO:
   - Mantenha os textos sempre entre aspas: "assim".
   - Não apague as vírgulas no fim das linhas.
   - Para pular linha dentro de um parágrafo, use \n (barra + n).
   - Se um campo opcional não for usado, deixe as aspas vazias: "".
   ========================================================================== */

const SITE = {

  /* ------------------------------------------------------------------
     OS NOIVOS E A DATA
     ------------------------------------------------------------------ */
  casal: {
    // Nome exibido no hero (topo) e no rodapé, em fonte manuscrita.
    nomeCompleto: "Lucas & Carol",
    // Iniciais exibidas na navegação (canto superior esquerdo).
    monograma: "L & C",
  },

  evento: {
    // Pequena frase acima do nome dos noivos no hero (em CAIXA ALTA).
    chamada: "Vamos nos casar",
    // Data como aparece no hero, logo abaixo do vídeo.
    dataCurta: "16 . 01 . 2027",
    // Data por extenso, usada na seção "O dia" e no rodapé.
    dataLonga: "16 de janeiro de 2027",
    // Horário da cerimônia.
    horario: "16h",
    // Complemento do horário exibido na seção "O dia".
    horarioNota: "Chegue com carinho e sem pressa — a cerimônia começa pontualmente.",
    // Nome do espaço e cidade.
    localNome: "Espaço Querência",
    localCidade: "São José dos Pinhais — PR",
    // Endereço completo (editável). Aparece na seção "O dia".
    localEndereco: "Espaço Querência, São José dos Pinhais, Paraná",
    // Link do botão "VER NO MAPA". Cole aqui o link do Google Maps do local.
    localMapaUrl: "https://www.google.com/maps/search/?api=1&query=Espa%C3%A7o+Quer%C3%AAncia+S%C3%A3o+Jos%C3%A9+dos+Pinhais+PR",
  },

  /* ------------------------------------------------------------------
     NAVEGAÇÃO (rótulos do menu, em CAIXA ALTA automática)
     ------------------------------------------------------------------ */
  navegacao: [
    { rotulo: "Nossa história", secao: "historia" },
    { rotulo: "Galeria",        secao: "galeria" },
    { rotulo: "O dia",          secao: "o-dia" },
    { rotulo: "Presentes",      secao: "presentes" },
    { rotulo: "RSVP",           secao: "rsvp" },
  ],

  /* ------------------------------------------------------------------
     VÍDEO DO HERO (a flor de laranjeira desabrochando)
     Os arquivos já estão prontos na pasta assets/video.
     Só altere estes caminhos se trocar os arquivos de lugar.
     ------------------------------------------------------------------ */
  heroVideo: {
    desktopMp4:  "assets/video/hero-flor-final.mp4",
    desktopWebm: "assets/video/hero-flor-final.webm",
    mobileMp4:   "assets/video/hero-flor-mobile.mp4",
    mobileWebm:  "assets/video/hero-flor-mobile.webm",
    // Imagem do último quadro (flor aberta): usada como capa/fallback.
    posterDesktop: "assets/img/hero-poster.jpg",
    posterMobile:  "assets/img/hero-poster-mobile.jpg",
    // Descrição do vídeo para leitores de tela.
    descricao: "Um galho de laranjeira cresce e sua flor branca desabrocha lentamente.",
  },

  /* ------------------------------------------------------------------
     SEÇÃO: NOSSA HISTÓRIA
     ------------------------------------------------------------------ */
  historia: {
    titulo: "Nossa história",
    // Palavra-âncora manuscrita que acompanha o título.
    assinatura: "para sempre",
    // Parágrafos do texto (cada item entre aspas é um parágrafo).
    paragrafos: [
      "Tudo começou de um jeito simples, como as melhores coisas costumam começar: uma conversa que não queria terminar, um riso que ficou ecoando e a sensação boa de ter encontrado um lugar para chamar de casa.",
      "No quintal da família da Carol existe uma laranjeira que floresce todo ano. Foi debaixo dela que entendemos o que estávamos plantando juntos — e é por isso que a flor de laranjeira abre este site e abrirá o nosso dia.",
    ],
    // Imagem da seção (troque pelo caminho da foto do casal).
    // Ex.: "assets/img/nossa-historia.jpg" — proporção vertical 4:5 fica ideal.
    imagem: "assets/img/placeholders/historia.svg",
    imagemAlt: "Foto do casal Lucas e Carol",
  },

  /* ------------------------------------------------------------------
     SEÇÃO: GALERIA
     Substitua cada "arquivo" pelo caminho da foto real, mantendo a ordem.
     Ex.: { arquivo: "assets/img/fotos/foto-01.jpg", alt: "descrição da foto" }
     As proporções podem variar — a galeria se ajusta sozinha.
     ------------------------------------------------------------------ */
  galeria: {
    titulo: "Galeria",
    // Palavra manuscrita decorativa abaixo do título (deixe "" para ocultar).
    assinatura: "momentos nossos",
    fotos: [
      { arquivo: "assets/img/placeholders/galeria-01.svg", alt: "Lucas e Carol — em breve, uma foto nossa aqui" },
      { arquivo: "assets/img/placeholders/galeria-02.svg", alt: "Lucas e Carol — em breve, uma foto nossa aqui" },
      { arquivo: "assets/img/placeholders/galeria-03.svg", alt: "Lucas e Carol — em breve, uma foto nossa aqui" },
      { arquivo: "assets/img/placeholders/galeria-04.svg", alt: "Lucas e Carol — em breve, uma foto nossa aqui" },
      { arquivo: "assets/img/placeholders/galeria-05.svg", alt: "Lucas e Carol — em breve, uma foto nossa aqui" },
      { arquivo: "assets/img/placeholders/galeria-06.svg", alt: "Lucas e Carol — em breve, uma foto nossa aqui" },
      { arquivo: "assets/img/placeholders/galeria-07.svg", alt: "Lucas e Carol — em breve, uma foto nossa aqui" },
      { arquivo: "assets/img/placeholders/galeria-08.svg", alt: "Lucas e Carol — em breve, uma foto nossa aqui" },
    ],
  },

  /* ------------------------------------------------------------------
     SEÇÃO: O DIA (detalhes do evento)
     ------------------------------------------------------------------ */
  oDia: {
    titulo: "O dia",
    // Palavra manuscrita decorativa abaixo do título (deixe "" para ocultar).
    assinatura: "o grande dia",
    introducao: "O essencial para viver esse dia com a gente.",
    rotuloData: "Data",
    rotuloHorario: "Horário",
    rotuloLocal: "Local",
    botaoMapa: "Ver no mapa",
  },

  /* ------------------------------------------------------------------
     SEÇÃO: LISTA DE PRESENTES / PIX
     ------------------------------------------------------------------ */
  presentes: {
    titulo: "Presentes",
    // Palavra manuscrita decorativa abaixo do título (deixe "" para ocultar).
    assinatura: "com carinho",
    // Texto afetuoso antes do cartão do PIX.
    texto: "O presente maior é ter você com a gente no dia 16 de janeiro. Mas, se quiser nos ajudar a regar essa vida nova, ficaremos muito felizes com qualquer carinho enviado pela chave abaixo.",
    // Dados bancários exibidos no cartão.
    banco: "Nome do banco (edite aqui)",
    titular: "Nome do titular (edite aqui)",
    chavePix: "chave-pix@exemplo.com",
    rotuloBanco: "Banco",
    rotuloTitular: "Titular",
    rotuloChave: "Chave PIX",
    botaoCopiar: "Copiar chave PIX",
    // Mensagem exibida por 2 segundos após copiar.
    feedbackCopiado: "Chave copiada",
    // OPCIONAL: caminho da imagem do QR Code do PIX.
    // Deixe "" (vazio) para não exibir. Ex.: "assets/img/qr-pix.png"
    qrCodeImagem: "",
    qrCodeAlt: "QR Code da chave PIX",
  },

  /* ------------------------------------------------------------------
     SEÇÃO: RSVP (confirmação de presença)
     ------------------------------------------------------------------ */
  rsvp: {
    titulo: "Confirme sua presença",
    // Palavra manuscrita decorativa abaixo do título (deixe "" para ocultar).
    assinatura: "venha celebrar",
    introducao: "Sua presença é o que faz a festa. Conta pra gente que você vem?",
    /* --------------------------------------------------------------
       ONDE AS RESPOSTAS CAEM — Google Sheets
       --------------------------------------------------------------
       Cole abaixo, entre as aspas, a URL do seu Apps Script implantado
       (termina em /exec). O passo a passo completo está no arquivo
       rsvp-apps-script.gs, na raiz do projeto (leva ~5 minutos).
       Enquanto este campo estiver vazio (""), o formulário apenas
       simula o envio e NENHUMA resposta é gravada.
       -------------------------------------------------------------- */
    googleSheetsUrl: "",
    rotuloNome: "Nome completo",
    placeholderNome: "Como no convite",
    rotuloAcompanhantes: "Acompanhantes",
    notaAcompanhantes: "Sem contar você",
    rotuloObservacoes: "Alguma observação?",
    placeholderObservacoes: "Restrições alimentares, recado, o que quiser nos contar…",
    botaoEnviar: "Confirmar presença",
    botaoEnviando: "Enviando…",
    // Mensagem exibida após o envio (título + texto).
    sucessoTitulo: "Presença confirmada!",
    sucessoTexto: "Que alegria! Guardamos seu lugar debaixo da laranjeira. Até o dia 16 de janeiro de 2027.",
  },

  /* ------------------------------------------------------------------
     RODAPÉ
     ------------------------------------------------------------------ */
  rodape: {
    agradecimento: "Obrigado por fazer parte da nossa história.",
    // Micro-crédito no pé da página (bem pequeno, em CAIXA ALTA).
    credito: "Feito com amor — 2027",
  },

  /* ------------------------------------------------------------------
     SEO / COMPARTILHAMENTO
     Obs.: o título e a descrição também existem no <head> do index.html
     (necessário para buscadores e pré-visualização de links). Se alterar
     aqui, vale atualizar lá também.
     ------------------------------------------------------------------ */
  seo: {
    titulo: "Lucas & Carol — 16 . 01 . 2027",
    descricao: "Vamos nos casar! 16 de janeiro de 2027, às 16h, no Espaço Querência, São José dos Pinhais — PR. Confirme sua presença.",
  },
};

/* Não altere a linha abaixo — ela entrega o conteúdo para o site. */
window.SITE = SITE;
