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
    url: "https://nifrqzfpzeeafzdsnmkk.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pZnJxemZwemVlYWZ6ZHNubWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MzA4NDUsImV4cCI6MjEwNDQwNjg0NX0.eVU3SF7XdR0iHWgxYBBbK1tYzcKO0t7VpSoQL7ly-tY",
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
     COMO FUNCIONA: o convidado escolhe um item, faz o PIX (o site monta
     o QR Code com o valor já preenchido) e avisa que o presente é dele.
     A partir daí o item aparece como CONQUISTADO para todos — é o que
     impede duas pessoas de darem a mesma coisa. Quem quiser pode
     contribuir com metade do valor; outra pessoa completa depois.

     PARA ISSO VALER PARA TODOS OS CONVIDADOS é preciso ligar o Supabase
     (10 minutos, sem custo) — veja SUPABASE.md. É também por lá que
     vocês consultam quem presenteou o quê e quando, no painel privado
     em /painel.html.
     ------------------------------------------------------------------ */
  presentes: {
    titulo: "Presentes",
    subtitulo: "",
    texto: "Preparamos esta lista de presentes para quem desejar nos presentear de forma prática e especial. Cada item representa um gesto de carinho que fará parte do início da nossa vida juntos. Agradecemos imensamente por todo o apoio e por celebrarem este momento ao nosso lado.",
    // Explicação curta do funcionamento, logo acima da lista.
    instrucao: "Escolha um presente, faça o PIX pelo QR Code e avise que ele é seu — assim o item sai da lista e ninguém repete o mesmo presente. Se preferir, você pode contribuir com metade do valor.",

    /* ----------------------------------------------------------------
       DADOS DO PIX — usados para gerar o QR Code de cada presente
       ----------------------------------------------------------------
       O site monta sozinho um QR Code com o valor já preenchido. O
       dinheiro cai direto na conta de vocês, sem taxa e sem
       intermediário.

       ATENÇÃO: confira estes três campos com muito cuidado. Um erro na
       chave faz o dinheiro ir para a conta errada.
       - chavePix: CPF (só números), celular (+5541999999999), e-mail
         ou chave aleatória.
       - titular: nome de quem recebe. Sem acentos, até 25 letras.
       - cidade: cidade da conta. Sem acentos, até 15 letras.
       ---------------------------------------------------------------- */
    chavePix: "chave-pix@exemplo.com",
    titular: "MARIA CAROLINA",
    cidade: "SAO JOSE DOS P",
    banco: "Nome do banco (edite aqui)",

    /* ----------------------------------------------------------------
       A LISTA OFICIAL — 92 presentes em 5 categorias
       ----------------------------------------------------------------
       Cada linha é um presente. O que dá para mudar à vontade:
       - nome    → como aparece no cartão
       - modelo  → a sugestão de marca/modelo, em letra menor
       - valor   → o preço, em reais (só números, sem "R$")
       - unidades→ quantas vezes o item pode ser presenteado
       - recebido→ quanto já entrou (o site soma sozinho; só mexa para
                   registrar um presente recebido por fora)

       A FOTO vem sozinha de assets/img/presentes/, pelo "id"
       (ex.: id "06-liquidificador" → assets/img/presentes/06-liquidificador.jpg).
       Para usar outra imagem, acrescente no item:  foto: "caminho/da/foto.jpg"

       O "id" identifica o presente no banco de dados. Se for criar um
       item novo, use um id sem espaços e sem acentos, que não se repita.
       As categorias abaixo precisam bater com a lista "categorias".
       ---------------------------------------------------------------- */
    pastaFotos: "assets/img/presentes/",

    // Os botões de filtro, na ordem em que aparecem.
    rotuloTodos: "Todos",
    categorias: [
      "Cozinha",
      "Mesa posta",
      "Quarto e banho",
      "Limpeza e lavanderia",
      "Sala, decoração e tecnologia",
    ],

    itens: [

      /* COZINHA */
      { id: "01-geladeira-frost-free-inverse",      nome: "Geladeira Frost Free Inverse",      modelo: "Consul CRE44AK, 397 L (Evox)",                   categoria: "Cozinha",                      valor: 4700,  unidades: 1, recebido: 0 },
      { id: "02-fogao-5-bocas-completo",            nome: "Fogão 5 bocas completo",            modelo: "Consul CFS5VAR, mesa de vidro",                  categoria: "Cozinha",                      valor: 2150,  unidades: 1, recebido: 0 },
      { id: "03-micro-ondas-30l",                   nome: "Micro-ondas 30 L",                  modelo: "Electrolux MI41T, 31 L",                         categoria: "Cozinha",                      valor: 850,   unidades: 1, recebido: 0 },
      { id: "04-air-fryer-formato-oven",            nome: "Air fryer (formato forno)",         modelo: "Philips Walita Airfryer Forno Série 5000, 12 L", categoria: "Cozinha",                      valor: 850,   unidades: 1, recebido: 0 },
      { id: "05-panela-eletrica-multifuncional",    nome: "Panela elétrica multifuncional",    modelo: "Philips Walita Viva Collection RI3136",          categoria: "Cozinha",                      valor: 550,   unidades: 1, recebido: 0 },
      { id: "06-liquidificador",                    nome: "Liquidificador",                    modelo: "Oster 1100 Full, 3,2 L",                         categoria: "Cozinha",                      valor: 320,   unidades: 1, recebido: 0 },
      { id: "07-mixer",                             nome: "Mixer",                             modelo: "Philips Walita Pro Mix RI2622, 400 W",           categoria: "Cozinha",                      valor: 280,   unidades: 1, recebido: 0 },
      { id: "08-multiprocessador-de-alimentos",     nome: "Multiprocessador de alimentos",     modelo: "Philips Walita PowerChop RI7303, 1000 W",        categoria: "Cozinha",                      valor: 460,   unidades: 1, recebido: 0 },
      { id: "09-batedeira-planetaria",              nome: "Batedeira planetária",              modelo: "KitchenAid Artisan KEA33CV, 4,8 L",              categoria: "Cozinha",                      valor: 1200,  unidades: 1, recebido: 0 },
      { id: "10-cafeteira-eletrica",                nome: "Cafeteira elétrica",                modelo: "Mondial Dolce Arome C-32, 32 xícaras",           categoria: "Cozinha",                      valor: 280,   unidades: 1, recebido: 0 },
      { id: "11-cafeteira-nespresso",               nome: "Cafeteira Nespresso",               modelo: "Nespresso Vertuo Next",                          categoria: "Cozinha",                      valor: 750,   unidades: 1, recebido: 0 },
      { id: "12-chaleira-eletrica",                 nome: "Chaleira elétrica",                 modelo: "Mondial Pratic CE-06, inox, 2 L",                categoria: "Cozinha",                      valor: 200,   unidades: 1, recebido: 0 },
      { id: "13-torradeira",                        nome: "Torradeira",                        modelo: "Philips Walita Viva Collection RI2630, inox",    categoria: "Cozinha",                      valor: 250,   unidades: 1, recebido: 0 },
      { id: "14-grill-eletrico-multifuncional",     nome: "Grill elétrico multifuncional",     modelo: "George Foreman Compacto, 1200 W",                categoria: "Cozinha",                      valor: 300,   unidades: 1, recebido: 0 },
      { id: "15-espremedor-de-frutas",              nome: "Espremedor de frutas",              modelo: "Philips Walita RI2746",                          categoria: "Cozinha",                      valor: 200,   unidades: 1, recebido: 0 },
      { id: "16-conjunto-de-panelas-inox",          nome: "Conjunto de panelas inox",          modelo: "Tramontina Solar, fundo triplo, 6 peças",        categoria: "Cozinha",                      valor: 650,   unidades: 1, recebido: 0 },
      { id: "17-conjunto-de-panelas-antiaderentes", nome: "Conjunto de panelas antiaderentes", modelo: "Tramontina Paris, 7 peças",                      categoria: "Cozinha",                      valor: 550,   unidades: 1, recebido: 0 },
      { id: "18-frigideira-grande",                 nome: "Frigideira grande",                 modelo: "Tramontina Mônaco, antiaderente, 28 cm",         categoria: "Cozinha",                      valor: 250,   unidades: 1, recebido: 0 },
      { id: "19-panela-wok",                        nome: "Panela wok",                        modelo: "Tramontina Mônaco, antiaderente, 32 cm",         categoria: "Cozinha",                      valor: 200,   unidades: 1, recebido: 0 },
      { id: "20-cacarola-de-ferro-fundido",         nome: "Caçarola de ferro fundido",         modelo: "Le Creuset Signature redonda, 24 cm",            categoria: "Cozinha",                      valor: 820,   unidades: 1, recebido: 0 },
      { id: "21-assadeira-de-vidro",                nome: "Assadeira de vidro",                modelo: "Marinex, retangular, 36 cm",                     categoria: "Cozinha",                      valor: 140,   unidades: 1, recebido: 0 },
      { id: "22-jogo-de-travessas",                 nome: "Jogo de travessas",                 modelo: "Oxford Bake, refratária, 3 peças",               categoria: "Cozinha",                      valor: 220,   unidades: 1, recebido: 0 },
      { id: "23-forma-para-bolo",                   nome: "Forma para bolo",                   modelo: "Tramontina, alumínio antiaderente, retangular",  categoria: "Cozinha",                      valor: 90,    unidades: 1, recebido: 0 },
      { id: "24-forma-para-pizza",                  nome: "Forma para pizza",                  modelo: "Tramontina, alumínio, 35 cm",                    categoria: "Cozinha",                      valor: 80,    unidades: 1, recebido: 0 },
      { id: "25-kit-de-potes-hermeticos",           nome: "Kit de potes herméticos",           modelo: "Tupperware Basic Line",                          categoria: "Cozinha",                      valor: 220,   unidades: 1, recebido: 0 },
      { id: "26-jogo-de-utensilios-de-silicone",    nome: "Jogo de utensílios de silicone",    modelo: "Tramontina Softta, 5 peças",                     categoria: "Cozinha",                      valor: 150,   unidades: 1, recebido: 0 },

      /* MESA POSTA */
      { id: "27-jogo-de-jantar-30-pecas",           nome: "Jogo de jantar (30 peças)",         modelo: "Oxford Coup Serene",                             categoria: "Mesa posta",                   valor: 580,   unidades: 1, recebido: 0 },
      { id: "28-faqueiro-inox-48-pecas",            nome: "Faqueiro inox (48 peças)",          modelo: "Tramontina Malibu",                              categoria: "Mesa posta",                   valor: 360,   unidades: 1, recebido: 0 },
      { id: "29-jogo-de-tacas-de-vinho",            nome: "Jogo de taças de vinho",            modelo: "Bohemia Gastro, cristal, 6 peças",               categoria: "Mesa posta",                   valor: 220,   unidades: 1, recebido: 0 },
      { id: "30-jogo-de-tacas-de-espumante",        nome: "Jogo de taças de espumante",        modelo: "Bohemia, cristal, 6 peças",                      categoria: "Mesa posta",                   valor: 220,   unidades: 1, recebido: 0 },
      { id: "31-jogo-de-copos",                     nome: "Jogo de copos",                     modelo: "Nadir Figueiredo Oca, 6 peças, 300 ml",          categoria: "Mesa posta",                   valor: 120,   unidades: 1, recebido: 0 },
      { id: "32-jarra-de-vidro",                    nome: "Jarra de vidro",                    modelo: "Nadir Figueiredo Tango, 1,5 L",                  categoria: "Mesa posta",                   valor: 80,    unidades: 1, recebido: 0 },
      { id: "33-bowl-de-porcelana",                 nome: "Bowl de porcelana",                 modelo: "Oxford Ryo, 500 ml",                             categoria: "Mesa posta",                   valor: 150,   unidades: 1, recebido: 0 },
      { id: "34-petisqueira-de-madeira",            nome: "Petisqueira de madeira",            modelo: "Tramontina Teca, 3 nichos",                      categoria: "Mesa posta",                   valor: 140,   unidades: 1, recebido: 0 },
      { id: "35-tabua-de-frios",                    nome: "Tábua de frios",                    modelo: "Tramontina Provence, madeira teca",              categoria: "Mesa posta",                   valor: 150,   unidades: 1, recebido: 0 },
      { id: "36-conjunto-de-pratos-para-sobremesa", nome: "Conjunto de pratos de sobremesa",   modelo: "Oxford Soleil White, 6 peças",                   categoria: "Mesa posta",                   valor: 200,   unidades: 1, recebido: 0 },
      { id: "37-xicaras-de-cafe",                   nome: "Xícaras de café",                   modelo: "Oxford Soleil White, 6 peças",                   categoria: "Mesa posta",                   valor: 120,   unidades: 1, recebido: 0 },
      { id: "38-xicaras-de-cha",                    nome: "Xícaras de chá",                    modelo: "Oxford Soleil White, 12 peças",                  categoria: "Mesa posta",                   valor: 140,   unidades: 1, recebido: 0 },
      { id: "39-bandeja-de-cafe-da-manha",          nome: "Bandeja de café da manhã",          modelo: "Tramontina, madeira, mesinha dobrável",          categoria: "Mesa posta",                   valor: 150,   unidades: 1, recebido: 0 },
      { id: "40-galheteiro",                        nome: "Galheteiro",                        modelo: "Lyor Vegas, vidro com suporte de metal",         categoria: "Mesa posta",                   valor: 90,    unidades: 1, recebido: 0 },
      { id: "41-saleiro-e-pimenteiro",              nome: "Saleiro e pimenteiro",              modelo: "Lyor, vidro com suporte de metal",               categoria: "Mesa posta",                   valor: 90,    unidades: 1, recebido: 0 },
      { id: "42-centro-de-mesa",                    nome: "Centro de mesa",                    modelo: "Lyor Deli Diamond, cristal",                     categoria: "Mesa posta",                   valor: 180,   unidades: 1, recebido: 0 },

      /* QUARTO E BANHO */
      { id: "43-jogo-de-cama-casal",                nome: "Jogo de cama casal",                modelo: "Buddemeyer Intense Gran Percal, 250 fios",       categoria: "Quarto e banho",               valor: 410,   unidades: 1, recebido: 0 },
      { id: "44-jogo-de-lencol-extra-reserva",      nome: "Jogo de lençol extra (reserva)",    modelo: "Buddemeyer Percalle, liso",                      categoria: "Quarto e banho",               valor: 200,   unidades: 1, recebido: 0 },
      { id: "45-edredom-casal",                     nome: "Edredom casal",                     modelo: "Karsten Verbena, algodão percal",                categoria: "Quarto e banho",               valor: 480,   unidades: 1, recebido: 0 },
      { id: "46-cobre-leito-casal",                 nome: "Cobre-leito casal",                 modelo: "Karsten Cali, cetim, 3 peças",                   categoria: "Quarto e banho",               valor: 400,   unidades: 1, recebido: 0 },
      { id: "47-kit-de-travesseiros-casal-2-unid",  nome: "Kit de travesseiros casal (2 un.)", modelo: "Duoflex Nasa Cervical",                          categoria: "Quarto e banho",               valor: 260,   unidades: 1, recebido: 0 },
      { id: "48-protetor-de-colchao",               nome: "Protetor de colchão",               modelo: "Duoflex, impermeável, casal",                    categoria: "Quarto e banho",               valor: 140,   unidades: 1, recebido: 0 },
      { id: "49-manta-para-cama",                   nome: "Manta para cama",                   modelo: "Buddemeyer Nina, tricô",                         categoria: "Quarto e banho",               valor: 200,   unidades: 1, recebido: 0 },
      { id: "50-almofadas-decorativas-kit",         nome: "Almofadas decorativas (kit)",       modelo: "Kit com 2 almofadas de veludo Mistero",          categoria: "Quarto e banho",               valor: 200,   unidades: 1, recebido: 0 },
      { id: "51-jogo-de-toalhas-de-banho",          nome: "Jogo de toalhas de banho",          modelo: "Buddemeyer Luxo Fio Penteado, 6 peças",          categoria: "Quarto e banho",               valor: 360,   unidades: 1, recebido: 0 },
      { id: "52-toalhas-de-rosto-kit",              nome: "Toalhas de rosto (kit)",            modelo: "Karsten",                                        categoria: "Quarto e banho",               valor: 120,   unidades: 1, recebido: 0 },
      { id: "53-toalhas-de-piso-kit",               nome: "Toalhas de piso (kit)",             modelo: "Karsten Juliet, 2 peças",                        categoria: "Quarto e banho",               valor: 120,   unidades: 1, recebido: 0 },
      { id: "54-roupao-feminino",                   nome: "Roupão feminino",                   modelo: "Buddemeyer Laise, atoalhado com capuz",          categoria: "Quarto e banho",               valor: 200,   unidades: 1, recebido: 0 },
      { id: "55-roupao-masculino",                  nome: "Roupão masculino",                  modelo: "Buddemeyer Stripes, atoalhado",                  categoria: "Quarto e banho",               valor: 200,   unidades: 1, recebido: 0 },
      { id: "56-kit-organizador-de-guarda-roupa",   nome: "Kit organizador de guarda-roupa",   modelo: "Organizador empilhável multiuso",                categoria: "Quarto e banho",               valor: 220,   unidades: 1, recebido: 0 },
      { id: "57-cesto-de-roupas",                   nome: "Cesto de roupas",                   modelo: "Coza Puffer, 49 L, com tampa",                   categoria: "Quarto e banho",               valor: 140,   unidades: 1, recebido: 0 },
      { id: "58-cabides-de-veludo-kit-50-un",       nome: "Cabides de veludo (kit 50 un.)",    modelo: "Kit com 50 cabides antideslizantes",             categoria: "Quarto e banho",               valor: 120,   unidades: 1, recebido: 0 },
      { id: "59-espelho-de-corpo-inteiro",          nome: "Espelho de corpo inteiro",          modelo: "Retangular, moldura preta, 170 × 70 cm",         categoria: "Quarto e banho",               valor: 350,   unidades: 1, recebido: 0 },
      { id: "60-cortina-blackout-casal",            nome: "Cortina blackout casal",            modelo: "Bella Janela, tecido blackout",                  categoria: "Quarto e banho",               valor: 280,   unidades: 1, recebido: 0 },
      { id: "61-tapete-para-quarto",                nome: "Tapete para quarto",                modelo: "Tapetes São Carlos Adana",                       categoria: "Quarto e banho",               valor: 300,   unidades: 1, recebido: 0 },
      { id: "62-difusor-de-aromas",                 nome: "Difusor de aromas",                 modelo: "Via Aroma, varetas, 200–250 ml",                 categoria: "Quarto e banho",               valor: 150,   unidades: 1, recebido: 0 },
      { id: "63-saia-para-cama-box",                nome: "Saia para cama box",                modelo: "Buddemeyer Bud Vision New Colors",               categoria: "Quarto e banho",               valor: 200,   unidades: 1, recebido: 0 },

      /* LIMPEZA E LAVANDERIA */
      { id: "64-maquina-de-lavar-roupas",           nome: "Máquina de lavar roupas",           modelo: "Brastemp BWK12AB, 12 kg",                        categoria: "Limpeza e lavanderia",         valor: 2200,  unidades: 1, recebido: 0 },
      { id: "65-secadora-de-roupas",                nome: "Secadora de roupas",                modelo: "Brastemp BSR10BB, de piso, 10 kg",               categoria: "Limpeza e lavanderia",         valor: 3000,  unidades: 1, recebido: 0 },
      { id: "66-aspirador-de-po-vertical",          nome: "Aspirador de pó vertical",          modelo: "Electrolux Ergorapido 2 em 1",                   categoria: "Limpeza e lavanderia",         valor: 550,   unidades: 1, recebido: 0 },
      { id: "67-aspirador-robo",                    nome: "Aspirador robô",                    modelo: "Positivo Smart Robô Aspirador Wi-Fi PRA100",     categoria: "Limpeza e lavanderia",         valor: 1250,  unidades: 1, recebido: 0 },
      { id: "68-ferro-de-passar-a-vapor",           nome: "Ferro de passar a vapor",           modelo: "Philips Walita, base antiaderente",              categoria: "Limpeza e lavanderia",         valor: 200,   unidades: 1, recebido: 0 },
      { id: "69-passadeira-a-vapor",                nome: "Passadeira a vapor",                modelo: "Philips Walita Série 3000, vertical",            categoria: "Limpeza e lavanderia",         valor: 400,   unidades: 1, recebido: 0 },
      { id: "70-tabua-de-passar-roupa",             nome: "Tábua de passar roupa",             modelo: "Arthi, estrutura reforçada",                     categoria: "Limpeza e lavanderia",         valor: 140,   unidades: 1, recebido: 0 },
      { id: "71-varal-de-chao",                     nome: "Varal de chão",                     modelo: "Arthi, retrátil com rodinhas",                   categoria: "Limpeza e lavanderia",         valor: 140,   unidades: 1, recebido: 0 },
      { id: "72-lixeira-inox-para-cozinha",         nome: "Lixeira inox para cozinha",         modelo: "Tramontina, com pedal, 12 L",                    categoria: "Limpeza e lavanderia",         valor: 200,   unidades: 1, recebido: 0 },
      { id: "73-lixeira-para-banheiro",             nome: "Lixeira para banheiro",             modelo: "Coza Serene, 5 L, com tampa",                    categoria: "Limpeza e lavanderia",         valor: 60,    unidades: 1, recebido: 0 },
      { id: "74-kit-balde-mop",                     nome: "Kit balde + mop",                   modelo: "Flash Limp, mop giratório 360°",                 categoria: "Limpeza e lavanderia",         valor: 140,   unidades: 1, recebido: 0 },
      { id: "75-escorredor-de-louca-inox",          nome: "Escorredor de louça inox",          modelo: "Tramontina Plurale",                             categoria: "Limpeza e lavanderia",         valor: 140,   unidades: 1, recebido: 0 },
      { id: "76-organizadores-de-geladeira-kit",    nome: "Organizadores de geladeira (kit)",  modelo: "Kit de potes empilháveis",                       categoria: "Limpeza e lavanderia",         valor: 120,   unidades: 1, recebido: 0 },
      { id: "77-organizadores-de-armario-kit",      nome: "Organizadores de armário (kit)",    modelo: "Organizador plástico empilhável multiuso",       categoria: "Limpeza e lavanderia",         valor: 120,   unidades: 1, recebido: 0 },
      { id: "78-cestos-organizadores-kit",          nome: "Cestos organizadores (kit)",        modelo: "Coza, kit com 3 a 4 peças multiuso",             categoria: "Limpeza e lavanderia",         valor: 120,   unidades: 1, recebido: 0 },

      /* SALA, DECORAÇÃO E TECNOLOGIA */
      { id: "79-smart-tv",                          nome: "Smart TV",                          modelo: "Samsung Crystal UHD 4K 50” U8000H",              categoria: "Sala, decoração e tecnologia", valor: 2850,  unidades: 1, recebido: 0 },
      { id: "80-soundbar",                          nome: "Soundbar",                          modelo: "JBL Cinema SB580, 3.1 canais",                   categoria: "Sala, decoração e tecnologia", valor: 1150,  unidades: 1, recebido: 0 },
      { id: "81-ventilador-de-coluna",              nome: "Ventilador de coluna",              modelo: "Mondial VTX-40C, com controle remoto",           categoria: "Sala, decoração e tecnologia", valor: 280,   unidades: 1, recebido: 0 },
      { id: "82-purificador-de-agua",               nome: "Purificador de água",               modelo: "Electrolux PE11B",                               categoria: "Sala, decoração e tecnologia", valor: 700,   unidades: 1, recebido: 0 },
      { id: "83-umidificador-de-ar",                nome: "Umidificador de ar",                modelo: "Multilaser Easy Air HC290, 1,8 L",               categoria: "Sala, decoração e tecnologia", valor: 200,   unidades: 1, recebido: 0 },
      { id: "84-caixa-de-som-bluetooth",            nome: "Caixa de som Bluetooth",            modelo: "JBL Charge 5",                                   categoria: "Sala, decoração e tecnologia", valor: 700,   unidades: 1, recebido: 0 },
      { id: "85-luminaria-de-mesa",                 nome: "Luminária de mesa",                 modelo: "Taschibra TLM-03",                               categoria: "Sala, decoração e tecnologia", valor: 150,   unidades: 1, recebido: 0 },
      { id: "86-abajur",                            nome: "Abajur",                            modelo: "Mart Collection, cúpula de linho",               categoria: "Sala, decoração e tecnologia", valor: 220,   unidades: 1, recebido: 0 },
      { id: "87-vaso-decorativo",                   nome: "Vaso decorativo",                   modelo: "Mart Collection, cerâmica texturizada",          categoria: "Sala, decoração e tecnologia", valor: 180,   unidades: 1, recebido: 0 },
      { id: "88-planta-em-vaso-grande",             nome: "Planta em vaso grande",             modelo: "Planta artificial premium com vaso decorativo",  categoria: "Sala, decoração e tecnologia", valor: 220,   unidades: 1, recebido: 0 },
      { id: "89-quadro-decorativo",                 nome: "Quadro decorativo",                 modelo: "Oppen House, abstrato com moldura",              categoria: "Sala, decoração e tecnologia", valor: 220,   unidades: 1, recebido: 0 },
      { id: "90-tapete-para-sala",                  nome: "Tapete para sala",                  modelo: "Tapetes São Carlos Adana Onda",                  categoria: "Sala, decoração e tecnologia", valor: 450,   unidades: 1, recebido: 0 },
      { id: "91-cortina-para-sala",                 nome: "Cortina para sala",                 modelo: "Bella Janela Duplex Voil",                       categoria: "Sala, decoração e tecnologia", valor: 350,   unidades: 1, recebido: 0 },
      { id: "92-kit-de-velas-e-aromatizadores",     nome: "Kit de velas e aromatizadores",     modelo: "Kit vela aromática + difusor de varetas",        categoria: "Sala, decoração e tecnologia", valor: 200,   unidades: 1, recebido: 0 },
    ],

    // Textos da seção (editáveis).
    rotuloConquistado: "Conquistado!",
    rotuloUnidades: "de",            // ex.: "1 de 2 conquistadas"
    rotuloUnidadesFim: "conquistadas",
    rotuloDisponiveis: "unidades",   // ex.: "2 unidades" (nada recebido ainda)
    rotuloContribuir: "Presentear",
    rotuloValorTotal: "Valor total",
    rotuloEscolhaValor: "Quanto você quer contribuir?",
    // Contador acima da lista. {n} vira o número de presentes à mostra.
    resumoDisponiveis: "{n} presentes disponíveis",
    resumoUm: "1 presente disponível",
    resumoNenhum: "Todos os presentes desta categoria já foram conquistados.",
    resumoConquistados: "{n} já conquistados",

    /* --- Bloco no fim da lista: contribuição com valor à escolha ----- */
    livreTitulo: "Quero contribuir com outro valor",
    livreNota: "Se preferir, contribua com a quantia que fizer sentido para você — sem escolher um item da lista.",
    livreBotao: "Escolher o valor",
    livreNomeNoModal: "Contribuição livre",
    rotuloValorLivre: "Quanto você quer contribuir?",
    livreErroValor: "Digite um valor a partir de R$ 5,00.",

    /* --- Textos do PIX ---------------------------------------------- */
    pixTitulo: "Pagar com PIX",
    pixNota: "Abra o app do seu banco, escaneie o código e pronto. O valor já vai preenchido.",
    pixRotuloCodigo: "Ou copie o código PIX:",
    pixBotaoCopiar: "Copiar código PIX",
    pixCopiado: "Código copiado!",
    pixRotuloTitular: "Recebedor",
    pixRotuloChave: "Chave PIX",
    // Lembrete de que dá para parcelar sem sair do banco.
    pixParcelar: "Quer dividir em vezes? A maioria dos bancos permite parcelar o PIX no próprio aplicativo, na hora do pagamento.",

    /* --- Confirmação: é o que reserva o presente --------------------
       Depois de pagar, o convidado escreve o nome e confirma. Aí o item
       passa a aparecer como conquistado para TODO MUNDO, evitando que
       duas pessoas deem o mesmo presente.
       (Isso exige o Supabase configurado — veja SUPABASE.md. Sem ele, a
       marcação vale só no navegador de quem clicou.)
       ---------------------------------------------------------------- */
    confirmarOu: "depois de pagar",
    // Usados quando a contribuição é de valor livre (sem item da lista).
    confirmarTituloLivre: "Avise que você contribuiu",
    confirmarNotaLivre: "Assim sabemos de quem veio esse carinho e podemos agradecer.",
    confirmarTitulo: "Avise que este presente é seu",
    confirmarNota: "Assim ele sai da lista e ninguém repete o mesmo presente. Se você contribuiu com parte do valor, registramos a sua parte — outra pessoa pode completar depois.",
    confirmarRotuloNome: "Seu nome",
    // O valor escolhido é acrescentado ao final do botão automaticamente.
    // Ex.: "Já fiz o PIX de R$ 120"
    confirmarBotao: "Já fiz o PIX",
    confirmarBotaoEnviando: "Registrando…",
    confirmarObrigado: "Presente reservado. Obrigado de coração!",
    confirmarErroNome: "Escreva seu nome para registrarmos o presente.",
    confirmarErroEnvio: "Não consegui registrar agora. Tente de novo em instantes.",
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
