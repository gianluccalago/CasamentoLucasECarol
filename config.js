/* ==========================================================================
   CONFIG.JS — CENTRAL DE CONTEÚDO DO SITE
   ==========================================================================
   Este arquivo concentra TODOS os textos, nomes, datas, endereço, dados do
   PIX, lista de presentes e caminhos de fotos do site. Para alterar
   qualquer conteúdo, edite APENAS este arquivo — nada precisa ser mexido
   no HTML, no CSS ou no restante do JavaScript.

   DICAS PARA EDITAR SEM ERRO:
   - Mantenha os textos sempre entre aspas: "assim".
   - Não apague as vírgulas no fim das linhas.
   - Para pular linha dentro de um parágrafo, use \n (barra + n).
   - Se um campo opcional não for usado, deixe as aspas vazias: "".
   ========================================================================== */

const SITE = {

  /* ------------------------------------------------------------------
     SUPABASE (opcional) — presentes com PIX automático
     ------------------------------------------------------------------
     Preencha estes dois campos para ligar o site ao Supabase: a lista de
     presentes passa a vir do banco e o pagamento do PIX marca o item
     como conquistado sozinho, via Mercado Pago.

     O passo a passo completo está no arquivo SUPABASE.md.

     Enquanto estiverem vazios (""), o site funciona normalmente com a
     lista de presentes escrita mais abaixo, neste mesmo arquivo.

     A chave "anonKey" é pública por natureza e pode ficar aqui.
     NUNCA coloque aqui a chave "service_role".
     ------------------------------------------------------------------ */
  supabase: {
    url: "",
    anonKey: "",
  },

  /* ------------------------------------------------------------------
     OS NOIVOS E O EVENTO
     ------------------------------------------------------------------ */
  casal: {
    // Nome exibido no hero (topo) e no rodapé, em letra manuscrita.
    nomeCompleto: "Maria Carolina & Lucas",
    // Versão curta, usada em espaços menores.
    nomeCurto: "Carol & Lucas",
  },

  evento: {
    // Pequena frase acima do nome dos noivos no hero (em CAIXA ALTA).
    chamada: "Vamos nos casar",
    // Data como aparece no hero, logo abaixo do vídeo.
    dataCurta: "16 . 01 . 2027",
    // Data por extenso, usada na seção "O grande dia" e no rodapé.
    dataLonga: "16 de janeiro de 2027",
    // Horário da cerimônia.
    horario: "16 horas",
    // Complemento do horário exibido na seção "O grande dia".
    horarioNota: "Chegue com carinho e sem pressa — a cerimônia começa pontualmente.",
    // Nome do espaço.
    localNome: "Espaço Querência",
    // Endereço completo, como no convite.
    localEndereco: "R. Marina Coelho, 330 — Borda do Campo\nSão José dos Pinhais - PR, 83075-295",
    // Link do botão "VER NO MAPA".
    localMapaUrl: "https://www.google.com/maps/search/?api=1&query=R.+Marina+Coelho%2C+330+-+Borda+do+Campo%2C+S%C3%A3o+Jos%C3%A9+dos+Pinhais+-+PR%2C+83075-295",
    // Versículo do convite (deixe "" para ocultar do rodapé).
    versiculo: "“Nós amamos porque Ele nos amou primeiro”",
    versiculoRef: "1 João 4:19",
  },

  /* ------------------------------------------------------------------
     NAVEGAÇÃO (rótulos do menu, em CAIXA ALTA automática)
     ------------------------------------------------------------------ */
  navegacao: [
    { rotulo: "Bem-vindos",   secao: "bem-vindos" },
    { rotulo: "O grande dia", secao: "o-dia" },
    { rotulo: "Presentes",    secao: "presentes" },
    { rotulo: "Confirmar",    secao: "rsvp" },
  ],

  /* ------------------------------------------------------------------
     VÍDEO DO HERO (a aquarela da laranjeira sendo pintada)
     O desabrochar avança conforme a rolagem da página.
     ------------------------------------------------------------------ */
  heroVideo: {
    // MP4 é a fonte principal; o WebM atende navegadores sem H.264.
    desktopMp4:  "assets/video/hero-flor-final.mp4",
    desktopWebm: "assets/video/hero-flor-final.webm",
    mobileMp4:   "assets/video/hero-flor-mobile.mp4",
    mobileWebm:  "assets/video/hero-flor-mobile.webm",
    // Primeiro quadro (papel em branco): capa antes do vídeo carregar.
    posterInicioDesktop: "assets/img/hero-poster-inicio.jpg",
    posterInicioMobile:  "assets/img/hero-poster-inicio-mobile.jpg",
    // Último quadro (ilustração completa): usado com "movimento reduzido".
    posterDesktop: "assets/img/hero-poster.jpg",
    posterMobile:  "assets/img/hero-poster-mobile.jpg",
    descricao: "Ilustração em aquarela de um ramo de laranjeira com flores e frutos sendo pintado.",
  },

  /* ------------------------------------------------------------------
     SEÇÃO 1: NOSSO GRANDE DIA (boas-vindas)
     ------------------------------------------------------------------ */
  boasVindas: {
    titulo: "Nosso grande dia",
    subtitulo: "bem-vindos",
    paragrafos: [
      "Estamos muito felizes em compartilhar este momento tão especial com vocês. A presença de cada pessoa que faz parte da nossa história torna este dia ainda mais significativo.",
      "Criamos este espaço para reunir todas as informações sobre o casamento e facilitar a organização para nossos convidados. Esperamos que este seja um dia repleto de alegria, amor e boas lembranças.",
      "Mal podemos esperar para celebrar com vocês!",
    ],
    /* FOTO DO PRÉ-WEDDING desta seção.
       Para trocar, coloque o arquivo em assets/img/fotos/ e escreva o
       caminho aqui (proporção vertical 4:5 fica ideal). */
    foto: "assets/img/fotos/casal-flores.jpg",
    fotoAlt: "Maria Carolina e Lucas se olhando entre galhos floridos",
  },

  /* ------------------------------------------------------------------
     SEÇÃO 2: O GRANDE DIA (informações)
     ------------------------------------------------------------------ */
  oDia: {
    titulo: "O grande dia",
    subtitulo: "informações",
    introducao: "O essencial para viver esse dia com a gente.",
    rotuloData: "Data",
    rotuloHorario: "Horário",
    rotuloLocal: "Espaço",
    botaoMapa: "Ver no mapa",
    /* FOTOS DO PRÉ-WEDDING desta seção (duas, lado a lado).
       Proporção vertical 4:5 fica ideal. */
    fotos: [
      { arquivo: "assets/img/fotos/casal-caminho.jpg", alt: "Maria Carolina e Lucas caminhando juntos pelo campo" },
      { arquivo: "assets/img/fotos/casal-por-do-sol.jpg", alt: "Maria Carolina e Lucas ao pôr do sol, entre flores" },
    ],
  },

  /* ------------------------------------------------------------------
     SEÇÃO 3: PRESENTES
     ------------------------------------------------------------------
     COMO FUNCIONA: cada presente tem um valor e pode ter mais de uma
     unidade. O convidado escolhe contribuir com o valor todo ou só uma
     parte, e o site mostra a chave PIX para ele pagar.

     COMO MARCAR UM PRESENTE COMO CONQUISTADO:
     Quando alguém pagar, atualize o campo "recebido" do item com o total
     JÁ RECEBIDO em reais. O selo "CONQUISTADO!" aparece sozinho quando
     "recebido" alcança valor × unidades.
     Exemplo: item de R$ 300 com 2 unidades (total R$ 600).
     Se receber R$ 300, escreva: recebido: 300  → mostra "1 de 2 conquistadas".
     Se receber os R$ 600, escreva: recebido: 600 → mostra "CONQUISTADO!".

     Para trocar a foto de um item, coloque o arquivo em assets/img/ e
     escreva o caminho no campo "foto".
     ------------------------------------------------------------------ */
  presentes: {
    titulo: "Presentes",
    subtitulo: "",
    texto: "Preparamos esta lista de presentes para quem desejar nos presentear de forma prática e especial. Cada item representa um gesto de carinho que fará parte do início da nossa vida juntos. Agradecemos imensamente por todo o apoio e por celebrarem este momento ao nosso lado.",

    // Dados do PIX (usados por todos os presentes).
    banco: "Nome do banco (edite aqui)",
    titular: "Nome do titular (edite aqui)",
    chavePix: "chave-pix@exemplo.com",

    // A LISTA. Copie um bloco inteiro para criar um novo presente.
    itens: [
      { nome: "Jogo de panelas",        valor: 890,  unidades: 1, recebido: 0, foto: "assets/img/placeholders/presente-01.svg" },
      { nome: "Jogo de taças",          valor: 240,  unidades: 2, recebido: 0, foto: "assets/img/placeholders/presente-02.svg" },
      { nome: "Roupa de cama",          valor: 520,  unidades: 1, recebido: 0, foto: "assets/img/placeholders/presente-03.svg" },
      { nome: "Cafeteira",              valor: 680,  unidades: 1, recebido: 0, foto: "assets/img/placeholders/presente-04.svg" },
      { nome: "Jogo de toalhas",        valor: 320,  unidades: 2, recebido: 0, foto: "assets/img/placeholders/presente-05.svg" },
      { nome: "Air fryer",              valor: 750,  unidades: 1, recebido: 0, foto: "assets/img/placeholders/presente-06.svg" },
      { nome: "Aparelho de jantar",     valor: 980,  unidades: 1, recebido: 0, foto: "assets/img/placeholders/presente-07.svg" },
      { nome: "Nossa lua de mel",       valor: 500,  unidades: 8, recebido: 0, foto: "assets/img/placeholders/presente-08.svg" },
    ],

    // Textos da seção (editáveis).
    rotuloConquistado: "Conquistado!",
    rotuloUnidades: "de",            // ex.: "1 de 2 conquistadas"
    rotuloUnidadesFim: "conquistadas",
    rotuloDisponiveis: "unidades",   // ex.: "2 unidades" (nada recebido ainda)
    rotuloContribuir: "Presentear",
    rotuloValorTotal: "Valor total",
    rotuloEscolhaValor: "Quanto você quer contribuir?",
    rotuloValorLivre: "Outro valor",
    rotuloCopiarPix: "Copiar chave PIX",
    feedbackCopiado: "Chave copiada!",
    rotuloComoPagar: "Copie a chave abaixo, faça o PIX no seu banco e pronto — o carinho já está a caminho.",
    rotuloAvisar: "Avisar que presenteei",
    rotuloAvisarEnviado: "Obrigado! Anotamos com carinho.",
    // OPCIONAL: imagem do QR Code do PIX ("" para não exibir).
    qrCodeImagem: "",
  },

  /* ------------------------------------------------------------------
     SEÇÃO 4: CONFIRMAÇÃO DE PRESENÇA
     ------------------------------------------------------------------ */
  rsvp: {
    titulo: "Confirme sua presença",
    subtitulo: "venha celebrar!",
    introducao: "Sua presença é o que faz a festa.",
    rotuloNome: "Nome completo",
    placeholderNome: "Como no convite",
    rotuloObservacoes: "Alguma observação?",
    placeholderObservacoes: "Restrições alimentares, recado, o que quiser nos contar…",
    botaoEnviar: "Confirmar presença",
    botaoEnviando: "Enviando…",
    sucessoTitulo: "Presença confirmada!",
    sucessoTexto: "Que alegria! Guardamos seu lugar. Até 16 de janeiro de 2027.",

    /* --------------------------------------------------------------
       ONDE AS RESPOSTAS CAEM — Google Sheets
       --------------------------------------------------------------
       Cole abaixo, entre as aspas, a URL do seu Apps Script implantado
       (termina em /exec). O passo a passo completo está no arquivo
       rsvp-apps-script.gs, na raiz do projeto (leva ~5 minutos).
       A MESMA URL registra as confirmações de presença E os avisos de
       presentes. Enquanto estiver vazia (""), o formulário apenas
       simula o envio e NADA é gravado.
       -------------------------------------------------------------- */
    googleSheetsUrl: "",
  },

  /* ------------------------------------------------------------------
     RODAPÉ
     ------------------------------------------------------------------ */
  rodape: {
    agradecimento: "Obrigado por fazer parte da nossa história.",
    credito: "Com a bênção de seus pais",
  },

  /* ------------------------------------------------------------------
     SEO / COMPARTILHAMENTO
     ------------------------------------------------------------------ */
  seo: {
    titulo: "Maria Carolina & Lucas — 16 . 01 . 2027",
    descricao: "Vamos nos casar! 16 de janeiro de 2027, às 16 horas, no Espaço Querência, São José dos Pinhais — PR. Confirme sua presença.",
  },
};

/* Não altere a linha abaixo — ela entrega o conteúdo para o site. */
window.SITE = SITE;
