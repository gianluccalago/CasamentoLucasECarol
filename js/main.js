/* ==========================================================================
   MAIN.JS — comportamento do site
   --------------------------------------------------------------------------
   Nenhum texto de conteúdo vive aqui: tudo vem do objeto SITE (config.js).
   ========================================================================== */

(function () {
  "use strict";

  var SITE = window.SITE;
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ehMobile = window.matchMedia("(max-width: 767px)").matches;

  var $ = function (id) { return document.getElementById(id); };

  function moeda(v) {
    return "R$ " + Number(v).toLocaleString("pt-BR", {
      minimumFractionDigits: Number.isInteger(Number(v)) ? 0 : 2,
      maximumFractionDigits: 2,
    });
  }

  /* ------------------------------------------------------------------
     SUPABASE (opcional)
     ------------------------------------------------------------------
     O PIX funciona sempre, sem servidor nenhum. O Supabase é opcional e
     serve para um objetivo só: fazer o presente já escolhido sumir da
     lista para TODOS os convidados, evitando presentes repetidos. Sem
     ele, o site usa a lista do config.js e a marcação vale apenas no
     navegador de quem clicou. Passo a passo: SUPABASE.md
     ------------------------------------------------------------------ */
  var SB = (SITE.supabase && SITE.supabase.url && SITE.supabase.anonKey)
    ? { url: SITE.supabase.url.replace(/\/+$/, ""), chave: SITE.supabase.anonKey }
    : null;

  function sbFetch(caminho, opcoes) {
    opcoes = opcoes || {};
    return fetch(SB.url + caminho, {
      method: opcoes.metodo || "GET",
      headers: {
        "apikey": SB.chave,
        "Authorization": "Bearer " + SB.chave,
        "Content-Type": "application/json",
        "Prefer": opcoes.prefer || "",
      },
      body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
    });
  }

  /* Traz os presentes do banco para dentro de SITE.presentes.itens, no
     mesmo formato que o resto do site já usa. */
  function carregarPresentesDoBanco() {
    if (!SB) return Promise.resolve(false);
    return sbFetch("/rest/v1/presentes?select=id,nome,valor,unidades,foto,recebido&ativo=eq.true&order=ordem")
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)); })
      .then(function (linhas) {
        if (!Array.isArray(linhas) || !linhas.length) return false;
        SITE.presentes.itens = linhas.map(function (l) {
          return {
            id: l.id,
            nome: l.nome,
            valor: Number(l.valor),
            unidades: Number(l.unidades) || 1,
            recebido: Number(l.recebido) || 0,
            foto: l.foto || "assets/img/placeholders/presente-01.svg",
          };
        });
        return true;
      })
      .catch(function (erro) {
        console.warn("Não consegui ler os presentes do Supabase; usando a lista do config.js.", erro);
        return false;
      });
  }

  /* ------------------------------------------------------------------
     HIDRATAÇÃO: despeja o conteúdo do config.js no HTML
     ------------------------------------------------------------------ */
  function hidratar() {
    document.title = SITE.seo.titulo;

    // Navegação (desktop + menu mobile)
    ["nav-links", "menu-links"].forEach(function (idContainer) {
      var cont = $(idContainer);
      SITE.navegacao.forEach(function (item) {
        var a = document.createElement("a");
        a.href = "#" + item.secao;
        a.textContent = item.rotulo;
        a.dataset.secao = item.secao;
        cont.appendChild(a);
      });
    });

    // Hero — o nome quebra em três linhas (nome & nome), como no convite
    $("hero-eyebrow").textContent = SITE.evento.chamada;
    var wm = $("hero-wordmark");
    var partes = SITE.casal.nomeCompleto.split("&");
    if (partes.length === 2) {
      wm.textContent = "";
      [partes[0].trim(), "&", partes[1].trim()].forEach(function (txt, i) {
        var s = document.createElement("span");
        s.className = i === 1 ? "e-comercial" : "";
        s.textContent = txt;
        wm.appendChild(s);
      });
    } else {
      wm.textContent = SITE.casal.nomeCompleto;
    }
    $("hero-date").textContent = SITE.evento.dataCurta;

    // 1 · Nosso grande dia
    $("bv-titulo").textContent = SITE.boasVindas.titulo;
    $("bv-subtitulo").textContent = SITE.boasVindas.subtitulo;
    $("bv-foto").src = SITE.boasVindas.foto;
    $("bv-foto").alt = SITE.boasVindas.fotoAlt;
    SITE.boasVindas.paragrafos.forEach(function (texto) {
      var p = document.createElement("p");
      p.textContent = texto;
      $("bv-paragrafos").appendChild(p);
    });

    // 2 · O grande dia
    $("odia-titulo").textContent = SITE.oDia.titulo;
    $("odia-subtitulo").textContent = SITE.oDia.subtitulo;
    $("odia-intro").textContent = SITE.oDia.introducao;
    $("odia-rotulo-data").textContent = SITE.oDia.rotuloData;
    $("odia-data").textContent = SITE.evento.dataLonga;
    $("odia-rotulo-horario").textContent = SITE.oDia.rotuloHorario;
    $("odia-horario").textContent = SITE.evento.horario;
    $("odia-horario-nota").textContent = SITE.evento.horarioNota;
    $("odia-rotulo-local").textContent = SITE.oDia.rotuloLocal;
    $("odia-local-nome").textContent = SITE.evento.localNome;
    $("odia-local-endereco").textContent = SITE.evento.localEndereco;
    $("odia-mapa").textContent = SITE.oDia.botaoMapa;
    $("odia-mapa").href = SITE.evento.localMapaUrl;

    (SITE.oDia.fotos || []).forEach(function (foto) {
      var fig = document.createElement("figure");
      fig.className = "reveal";
      var img = document.createElement("img");
      img.src = foto.arquivo;
      img.alt = foto.alt;
      img.loading = "lazy";
      fig.appendChild(img);
      $("odia-fotos").appendChild(fig);
    });

    // 3 · Presentes
    $("presentes-titulo").textContent = SITE.presentes.titulo;
    var sub = $("presentes-subtitulo");
    if (SITE.presentes.subtitulo) { sub.textContent = SITE.presentes.subtitulo; } else { sub.hidden = true; }
    $("presentes-texto").textContent = SITE.presentes.texto;

    // 4 · RSVP
    $("rsvp-titulo").textContent = SITE.rsvp.titulo;
    $("rsvp-subtitulo").textContent = SITE.rsvp.subtitulo;
    $("rsvp-intro").textContent = SITE.rsvp.introducao;
    $("rsvp-rotulo-nome").textContent = SITE.rsvp.rotuloNome;
    $("rsvp-nome").placeholder = SITE.rsvp.placeholderNome;
    $("rsvp-rotulo-obs").textContent = SITE.rsvp.rotuloObservacoes;
    $("rsvp-obs").placeholder = SITE.rsvp.placeholderObservacoes;
    $("rsvp-enviar").textContent = SITE.rsvp.botaoEnviar;
    $("rsvp-sucesso-titulo").textContent = SITE.rsvp.sucessoTitulo;
    $("rsvp-sucesso-texto").textContent = SITE.rsvp.sucessoTexto;

    // Rodapé
    $("rodape-nomes").textContent = SITE.casal.nomeCompleto;
    if (SITE.evento.versiculo) {
      $("rodape-versiculo").textContent = SITE.evento.versiculo;
      $("rodape-versiculo-ref").textContent = SITE.evento.versiculoRef;
    } else {
      $("rodape-versiculo").hidden = true;
      $("rodape-versiculo-ref").hidden = true;
    }
    $("rodape-agradecimento").textContent = SITE.rodape.agradecimento;
    $("rodape-data").textContent = SITE.evento.dataLonga;
    $("rodape-credito").textContent = SITE.rodape.credito;
  }

  /* ------------------------------------------------------------------
     HERO: o vídeo toca UMA vez, sozinho, e congela na ilustração
     completa. Nunca entra em laço nem reinicia.

     Para o iPhone nunca exibir o botão de play nativo (o que acontece
     quando o autoplay é barrado, por exemplo no modo de economia de
     energia), o vídeo fica invisível até começar de fato a tocar: por
     baixo dele há sempre uma imagem. Se o autoplay for barrado, tentamos
     de novo no primeiro toque e, persistindo, mostramos a ilustração
     pronta — o convidado nunca vê um controle solto na tela.
     ------------------------------------------------------------------ */
  function montarHero() {
    var stage = $("hero-stage");
    var wrap = $("hero-video-wrap");
    var cfg = SITE.heroVideo;
    var posterInicio = ehMobile ? cfg.posterInicioMobile : cfg.posterInicioDesktop;
    var posterFinal = ehMobile ? cfg.posterMobile : cfg.posterDesktop;

    // Camada de imagem, sempre presente por baixo do vídeo.
    var capa = document.createElement("img");
    capa.className = "hero__capa";
    capa.src = reduzMovimento ? posterFinal : posterInicio;
    capa.alt = cfg.descricao;
    wrap.appendChild(capa);
    stage.classList.add("is-ready");

    // Movimento reduzido: só a ilustração pronta, sem vídeo.
    if (reduzMovimento) return;

    // Pré-carrega o quadro final para a troca no fim ser instantânea.
    var fim = new Image();
    fim.src = posterFinal;

    var video = document.createElement("video");
    video.muted = true;
    video.setAttribute("muted", "");
    video.defaultMuted = true;
    video.autoplay = true;
    video.setAttribute("autoplay", "");
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.preload = "auto";
    video.disablePictureInPicture = true;
    video.setAttribute("aria-hidden", "true");
    video.width = ehMobile ? 864 : 1920;
    video.height = 1080;
    // SEM loop: o desabrochar acontece uma única vez.

    var srcMp4 = document.createElement("source");
    srcMp4.src = ehMobile ? cfg.mobileMp4 : cfg.desktopMp4;
    srcMp4.type = "video/mp4";
    video.appendChild(srcMp4);
    if (cfg.desktopWebm && cfg.mobileWebm) {
      var srcWebm = document.createElement("source");
      srcWebm.src = ehMobile ? cfg.mobileWebm : cfg.desktopWebm;
      srcWebm.type = "video/webm";
      video.appendChild(srcWebm);
    }
    wrap.appendChild(video);

    // Só revela o vídeo quando ele realmente começa a rodar.
    video.addEventListener("playing", function () {
      stage.classList.add("is-tocando");
    }, { once: true });

    // No fim, congela: a ilustração completa assume e o vídeo se recolhe.
    video.addEventListener("ended", function () {
      capa.src = posterFinal;
      stage.classList.add("is-final");
      setTimeout(function () {
        if (video.parentNode) video.parentNode.removeChild(video);
      }, 900);
    }, { once: true });

    var desistiu = false;
    function mostrarPronta() {
      if (desistiu) return;
      desistiu = true;
      capa.src = posterFinal;
      stage.classList.add("is-final");
      ouvirGestos(false);
      // Deixa o vídeo sumir junto com a transição antes de removê-lo.
      try { video.pause(); } catch (e) { /* indiferente */ }
      setTimeout(function () {
        if (video.parentNode) video.parentNode.removeChild(video);
      }, 600);
    }

    var comecou = false;
    var GESTOS = ["touchstart", "pointerdown", "scroll", "keydown", "click"];
    var ouvindoGestos = false;

    function ouvirGestos(ligar) {
      if (ligar === ouvindoGestos) return;
      ouvindoGestos = ligar;
      GESTOS.forEach(function (ev) {
        if (ligar) window.addEventListener(ev, tentarTocar, { passive: true });
        else window.removeEventListener(ev, tentarTocar);
      });
    }

    function tentarTocar() {
      if (desistiu || comecou || !video.parentNode) return;
      var p = video.play();
      if (p && p.catch) {
        p.catch(function () {
          // Autoplay barrado (economia de energia, economia de dados):
          // fica de prontidão para tocar ao primeiro toque na tela.
          ouvirGestos(true);
        });
      }
    }

    /* Começa o quanto antes: quem abre a página precisa ver a flor
       desabrochando, não uma imagem parada. Pedimos o play já na criação
       do elemento e repetimos ao primeiro sinal de dados — o navegador
       enfileira o pedido e começa assim que puder.
       (A proteção contra engasgo continua abaixo, no evento "waiting".) */
    tentarTocar();
    ["loadedmetadata", "loadeddata", "canplay", "canplaythrough"].forEach(function (ev) {
      video.addEventListener(ev, tentarTocar);
    });
    // Rede muito lenta: insiste por alguns segundos antes de desistir.
    var insistir = setInterval(function () {
      if (desistiu || comecou) { clearInterval(insistir); return; }
      tentarTocar();
    }, 400);
    setTimeout(function () { clearInterval(insistir); }, 9000);

    video.addEventListener("playing", function () {
      comecou = true;
      clearInterval(insistir);
      ouvirGestos(false);
    });

    /* Rede insuficiente no meio da reprodução: em vez de deixar o vídeo
       engasgando (e, no iPhone, voltando ao início), assumimos a
       ilustração pronta com uma transição suave. */
    var travadoDesde = 0;
    var ultimoTempo = 0;
    video.addEventListener("waiting", function () {
      travadoDesde = travadoDesde || Date.now();
      setTimeout(function () {
        if (!desistiu && travadoDesde && Date.now() - travadoDesde >= 2500 &&
            !stage.classList.contains("is-final")) {
          mostrarPronta();
        }
      }, 2600);
    });
    video.addEventListener("timeupdate", function () {
      travadoDesde = 0;
      // Se o vídeo regredir sozinho (sintoma de reinício por falta de
      // buffer), encerramos na ilustração pronta em vez de recomeçar.
      if (video.currentTime + 0.4 < ultimoTempo) mostrarPronta();
      ultimoTempo = video.currentTime;
    });

    video.addEventListener("error", function () {
      // Abortos transitórios acontecem com arquivos grandes; só desiste
      // quando o elemento reporta erro real de mídia.
      if (!video.error) return;
      mostrarPronta();
    });

    // Se em 10s o vídeo não tiver começado, mostra a ilustração pronta.
    setTimeout(function () {
      if (!stage.classList.contains("is-tocando")) mostrarPronta();
    }, 10000);
  }

  /* ------------------------------------------------------------------
     NAVEGAÇÃO
     ------------------------------------------------------------------ */
  function montarNavegacao() {
    var nav = $("nav");
    var burger = $("nav-burger");
    var menu = $("menu-mobile");
    function aoRolar() {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();

    var ancoras = document.querySelectorAll(".nav__links a, .menu__links a");
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        ancoras.forEach(function (a) {
          a.classList.toggle("is-active", a.dataset.secao === e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { io.observe(s); });

    var aberto = false;
    function alternarMenu(forcar) {
      aberto = typeof forcar === "boolean" ? forcar : !aberto;
      menu.hidden = !aberto;
      burger.setAttribute("aria-expanded", String(aberto));
      burger.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("travado", aberto);
      if (aberto) menu.querySelector("a").focus();
    }
    burger.addEventListener("click", function () { alternarMenu(); });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") alternarMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (!aberto) return;
      if (e.key === "Escape") { alternarMenu(false); burger.focus(); }
      if (e.key === "Tab") {
        var itens = [burger].concat(Array.prototype.slice.call(menu.querySelectorAll("a")));
        var i = itens.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); itens[itens.length - 1].focus(); }
        else if (!e.shiftKey && i === itens.length - 1) { e.preventDefault(); itens[0].focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------
     ENTRADAS E PARALLAX
     ------------------------------------------------------------------ */
  function montarEntradas() {
    var alvos = document.querySelectorAll(".reveal");
    if (reduzMovimento || !("IntersectionObserver" in window)) {
      alvos.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    alvos.forEach(function (el) { io.observe(el); });
  }

  function montarParallax() {
    if (reduzMovimento) return;
    var img = $("bv-foto"), quadro_ = $("bv-media"), agendado = false;
    function atualizar() {
      agendado = false;
      var r = quadro_.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var p = (r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2 + r.height / 2);
      img.style.transform = "translate3d(0," + (Math.max(-1, Math.min(1, p)) * -8).toFixed(2) + "%,0)";
    }
    window.addEventListener("scroll", function () {
      if (!agendado) { agendado = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    atualizar();
  }

  /* ------------------------------------------------------------------
     PRESENTES
     ------------------------------------------------------------------
     Cada item tem valor, unidades e o total já recebido (config.js).
     O selo "CONQUISTADO!" só aparece quando TODAS as unidades foram
     integralmente pagas (recebido >= valor × unidades).
     ------------------------------------------------------------------ */
  var itemAtual = null;
  var valorEscolhido = 0;

  function estadoItem(item) {
    var alvo = item.valor * (item.unidades || 1);
    var recebido = Math.max(0, Number(item.recebido) || 0);
    // Sem banco compartilhado, a marcação vale só neste navegador — pelo
    // menos quem presenteou não vê o próprio presente disponível de novo.
    if (!SB) {
      recebido += Number(marcadosLocalmente()[chaveDoItem(item)] || 0);
    }
    return {
      alvo: alvo,
      recebido: Math.min(recebido, alvo),
      conquistado: recebido >= alvo,
      unidadesFeitas: Math.floor(recebido / item.valor),
      progresso: alvo ? Math.min(1, recebido / alvo) : 0,
    };
  }

  function montarPresentes() {
    var grid = $("presentes-grid");
    grid.textContent = "";

    SITE.presentes.itens.forEach(function (item, i) {
      var e = estadoItem(item);
      var card = document.createElement("article");
      card.className = "presente reveal" + (e.conquistado ? " is-conquistado" : "");

      var img = document.createElement("img");
      img.className = "presente__foto";
      img.src = item.foto;
      img.alt = item.nome;
      img.loading = "lazy";
      card.appendChild(img);

      if (e.conquistado) {
        var selo = document.createElement("div");
        selo.className = "presente__selo";
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("href", "#svg-flor");
        svg.appendChild(use);
        selo.appendChild(svg);
        selo.appendChild(document.createTextNode(SITE.presentes.rotuloConquistado));
        card.appendChild(selo);
      }

      var corpo = document.createElement("div");
      corpo.className = "presente__corpo";

      var nome = document.createElement("h3");
      nome.className = "presente__nome";
      nome.textContent = item.nome;
      corpo.appendChild(nome);

      var valor = document.createElement("p");
      valor.className = "presente__valor";
      valor.textContent = moeda(item.valor);
      corpo.appendChild(valor);

      // Contagem de unidades (só quando há mais de uma)
      if ((item.unidades || 1) > 1) {
        var un = document.createElement("p");
        un.className = "presente__unidades";
        un.textContent = e.unidadesFeitas > 0
          ? e.unidadesFeitas + " " + SITE.presentes.rotuloUnidades + " " +
            item.unidades + " " + SITE.presentes.rotuloUnidadesFim
          : item.unidades + " " + SITE.presentes.rotuloDisponiveis;
        corpo.appendChild(un);
      }

      if (e.recebido > 0 && !e.conquistado) {
        var barra = document.createElement("div");
        barra.className = "presente__barra";
        var span = document.createElement("span");
        span.style.width = (e.progresso * 100).toFixed(1) + "%";
        barra.appendChild(span);
        corpo.appendChild(barra);
      }

      var acao = document.createElement("div");
      acao.className = "presente__acao";
      if (!e.conquistado) {
        var botao = document.createElement("button");
        botao.type = "button";
        botao.className = "botao botao--outline";
        botao.textContent = SITE.presentes.rotuloContribuir;
        botao.addEventListener("click", function () { abrirModal(i); });
        acao.appendChild(botao);
      }
      corpo.appendChild(acao);

      card.appendChild(corpo);
      grid.appendChild(card);
    });

    montarEntradas();
  }

  function abrirModal(indice) {
    var item = SITE.presentes.itens[indice];
    var e = estadoItem(item);
    itemAtual = item;

    $("modal-foto").src = item.foto;
    $("modal-foto").alt = item.nome;
    $("modal-nome").textContent = item.nome;
    $("modal-valor").textContent = SITE.presentes.rotuloValorTotal + ": " + moeda(item.valor) +
      ((item.unidades || 1) > 1 ? " · " + item.unidades + " un." : "");
    $("modal-rotulo-escolha").textContent = SITE.presentes.rotuloEscolhaValor;
    $("modal-rotulo-livre").textContent = SITE.presentes.rotuloValorLivre;

    // --- PIX (forma principal, sem taxa)
    var p = SITE.presentes;
    $("pix-titulo").textContent = p.pixTitulo;
    $("pix-nota").textContent = p.pixNota;
    $("pix-rotulo-codigo").textContent = p.pixRotuloCodigo;
    $("pix-copiar").textContent = p.pixBotaoCopiar;
    $("pix-copiar").classList.remove("is-copied");
    $("pix-rot-titular").textContent = p.pixRotuloTitular;
    $("pix-titular").textContent = p.titular;
    $("pix-rot-chave").textContent = p.pixRotuloChave;
    $("pix-chave").textContent = p.chavePix;
    $("pix-parcelar").textContent = p.pixParcelar;

    // --- Confirmação: é o que reserva o presente para os demais
    $("confirmar-ou").textContent = p.confirmarOu;
    $("confirmar-titulo").textContent = p.confirmarTitulo;
    $("confirmar-nota").textContent = p.confirmarNota;
    $("confirmar-rot-nome").textContent = p.confirmarRotuloNome;
    $("confirmar-enviar").textContent = p.confirmarBotao;
    $("confirmar-enviar").disabled = false;
    $("confirmar-erro").hidden = true;
    $("confirmar-formulario").hidden = false;
    $("confirmar-obrigado").hidden = true;
    $("confirmar-obrigado-texto").textContent = p.confirmarObrigado;

    // Sugestões: metade, o que falta e o valor cheio de uma unidade
    var falta = Math.max(0, e.alvo - e.recebido);
    var opcoes = [
      { rotulo: moeda(Math.round(item.valor / 2)), valor: Math.round(item.valor / 2) },
      { rotulo: moeda(item.valor), valor: item.valor },
    ];
    if (falta > 0 && falta !== item.valor && falta !== Math.round(item.valor / 2)) {
      opcoes.push({ rotulo: moeda(falta), valor: falta });
    }
    var cont = $("modal-opcoes");
    cont.textContent = "";
    opcoes.forEach(function (op) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "modal__opcao";
      b.textContent = op.rotulo;
      b.addEventListener("click", function () {
        cont.querySelectorAll(".modal__opcao").forEach(function (x) { x.classList.remove("is-ativa"); });
        b.classList.add("is-ativa");
        valorEscolhido = op.valor;
        $("modal-livre").value = "";
        atualizarPix();
      });
      cont.appendChild(b);
    });
    valorEscolhido = item.valor;
    cont.querySelectorAll(".modal__opcao")[1].classList.add("is-ativa");
    $("modal-livre").value = "";
    atualizarPix();

    $("modal-presente").hidden = false;
    document.body.classList.add("travado");
    $("modal-fechar").focus();
  }

  /* Refaz o código PIX e o QR sempre que o valor escolhido muda. */
  function atualizarPix() {
    if (!itemAtual) return;
    var p = SITE.presentes;
    var codigo = window.PIX.montar({
      chave: p.chavePix,
      nome: p.titular,
      cidade: p.cidade,
      valor: valorEscolhido,
      // Identificador curto para o casal reconhecer no extrato.
      txid: (itemAtual.id || itemAtual.nome || "presente").replace(/[^A-Za-z0-9]/g, "").slice(0, 25),
    });
    $("pix-codigo").textContent = codigo;
    $("pix-copiar").dataset.codigo = codigo;
    var desenhou = window.PIX.desenharQr($("pix-qr"), codigo);
    $("pix-qr").hidden = !desenhou;
  }

  function fecharModal() {
    $("modal-presente").hidden = true;
    document.body.classList.remove("travado");
    itemAtual = null;
  }

  /* ------------------------------------------------------------------
     RESERVA DO PRESENTE
     ------------------------------------------------------------------
     Depois de fazer o PIX, o convidado escreve o nome e confirma. A
     marcação é somada ao presente e, quando o total é alcançado, o item
     aparece como conquistado para todos os convidados — que é o que
     evita duas pessoas darem o mesmo presente.

     Isso só vale para todo mundo se o Supabase estiver configurado
     (é ele que guarda o dado compartilhado). Sem ele, a marcação fica
     apenas no navegador de quem clicou, e o casal recebe o aviso pela
     planilha do Google, se estiver configurada.
     ------------------------------------------------------------------ */

  var CHAVE_LOCAL = "presentes-marcados";

  function marcadosLocalmente() {
    try { return JSON.parse(localStorage.getItem(CHAVE_LOCAL) || "{}"); }
    catch (e) { return {}; }
  }

  function marcarLocalmente(chave, valor) {
    try {
      var atual = marcadosLocalmente();
      atual[chave] = (Number(atual[chave]) || 0) + Number(valor);
      localStorage.setItem(CHAVE_LOCAL, JSON.stringify(atual));
    } catch (e) { /* navegador sem armazenamento: segue sem lembrar */ }
  }

  /* Chave do item: usa o id do banco quando existe; senão, o nome. */
  function chaveDoItem(item) {
    return item.id || item.nome;
  }

  function montarConfirmacao() {
    var botao = $("confirmar-enviar");

    function erro(msg) {
      var el = $("confirmar-erro");
      el.textContent = msg;
      el.hidden = false;
    }

    botao.addEventListener("click", function () {
      if (!itemAtual) return;
      var p = SITE.presentes;
      var nome = $("confirmar-nome").value.trim();
      $("confirmar-erro").hidden = true;

      if (nome.length < 2) {
        $("confirmar-nome").focus();
        return erro(p.confirmarErroNome);
      }

      botao.disabled = true;
      botao.textContent = p.confirmarBotaoEnviando;

      var item = itemAtual;
      var valor = valorEscolhido;

      registrarMarcacao(item, valor, nome)
        .then(function () {
          marcarLocalmente(chaveDoItem(item), valor);
          $("confirmar-formulario").hidden = true;
          $("confirmar-obrigado").hidden = false;
          // Atualiza a lista para o item já aparecer reservado.
          return atualizarListaDePresentes(item, valor);
        })
        .catch(function () {
          botao.disabled = false;
          botao.textContent = p.confirmarBotao;
          erro(p.confirmarErroEnvio);
        });
    });
  }

  /* Grava a marcação onde for possível: no banco (visível para todos) e,
     se houver planilha configurada, também como aviso para o casal. */
  function registrarMarcacao(item, valor, nome) {
    if (SB) {
      return sbFetch("/rest/v1/marcacoes", {
        metodo: "POST",
        prefer: "return=minimal",
        corpo: { presente_id: item.id, nome: nome, valor: valor },
      }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
      });
    }
    // Sem banco: avisa o casal pela planilha, se estiver configurada.
    return enviarParaPlanilha({
      tipo: "presente",
      presente: item.nome,
      valor: valor,
      nome: nome,
    });
  }

  /* Relê os presentes do banco; sem banco, soma na lista em memória. */
  function atualizarListaDePresentes(item, valor) {
    if (SB) {
      return carregarPresentesDoBanco().then(function () { montarPresentes(); });
    }
    item.recebido = (Number(item.recebido) || 0) + Number(valor);
    montarPresentes();
    return Promise.resolve();
  }

  function montarModal() {
    $("modal-fechar").addEventListener("click", fecharModal);
    $("modal-presente").addEventListener("click", function (ev) {
      if (ev.target === ev.currentTarget) fecharModal();
    });
    document.addEventListener("keydown", function (ev) {
      if (!$("modal-presente").hidden && ev.key === "Escape") fecharModal();
    });

    $("modal-livre").addEventListener("input", function () {
      var v = parseFloat(this.value.replace(/\./g, "").replace(",", "."));
      if (!isNaN(v) && v > 0) {
        valorEscolhido = v;
        $("modal-opcoes").querySelectorAll(".modal__opcao").forEach(function (x) {
          x.classList.remove("is-ativa");
        });
        atualizarPix();
      }
    });

    var tempo = null;
    $("pix-copiar").addEventListener("click", function () {
      var botao = this;
      var codigo = botao.dataset.codigo || "";
      if (!codigo) return;
      function feito() {
        botao.classList.add("is-copied");
        botao.textContent = SITE.presentes.pixCopiado;
        clearTimeout(tempo);
        tempo = setTimeout(function () {
          botao.classList.remove("is-copied");
          botao.textContent = SITE.presentes.pixBotaoCopiar;
        }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codigo).then(feito, function () { copiaManual(codigo, feito); });
      } else {
        copiaManual(codigo, feito);
      }
    });

  }

  function copiaManual(texto, aoTerminar) {
    var area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); aoTerminar(); } catch (e) { /* silencioso */ }
    document.body.removeChild(area);
  }

  /* ------------------------------------------------------------------
     ENVIO PARA A PLANILHA (RSVP e avisos de presente)
     ------------------------------------------------------------------
     Configure a URL do Apps Script em rsvp.googleSheetsUrl (config.js).
     Passo a passo completo: rsvp-apps-script.gs.
     Sem URL, o envio é apenas simulado e nada é gravado.
     ------------------------------------------------------------------ */
  function enviarParaPlanilha(dados) {
    // Com o Supabase ligado, a confirmação de presença vai para o banco.
    if (SB && dados.tipo === "rsvp") {
      return sbFetch("/rest/v1/rsvps", {
        metodo: "POST",
        prefer: "return=minimal",
        corpo: { nome: dados.nome, observacoes: dados.observacoes || null },
      }).then(function (r) {
        if (!r.ok) console.warn("Não consegui gravar o RSVP no Supabase:", r.status);
      }).catch(function (e) {
        console.warn("Falha de rede ao gravar o RSVP:", e);
      });
    }

    var url = SITE.rsvp.googleSheetsUrl;
    if (!url) {
      return new Promise(function (ok) { setTimeout(ok, 900); });
    }
    return fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(dados),
    }).catch(function (erro) {
      console.warn("Não foi possível registrar na planilha:", erro);
    });
  }

  /* Busca o estado atualizado dos presentes na planilha (opcional).
     Se o Apps Script responder, os valores recebidos sobrescrevem os do
     config.js — assim o casal marca o pagamento na planilha e o site se
     atualiza sozinho. Falhas são ignoradas em silêncio. */
  function sincronizarPresentes() {
    var url = SITE.rsvp.googleSheetsUrl;
    if (!url) return;
    fetch(url + "?acao=presentes")
      .then(function (r) { return r.json(); })
      .then(function (dados) {
        if (!dados || !dados.presentes) return;
        var mudou = false;
        SITE.presentes.itens.forEach(function (item) {
          var v = dados.presentes[item.nome];
          if (typeof v === "number" && v !== item.recebido) { item.recebido = v; mudou = true; }
        });
        if (mudou) montarPresentes();
      })
      .catch(function () { /* offline ou sem doGet: mantém o config.js */ });
  }

  /* ------------------------------------------------------------------
     RSVP
     ------------------------------------------------------------------ */
  function montarRsvp() {
    var form = $("rsvp-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = $("rsvp-nome").value.trim();
      if (!nome) { $("rsvp-nome").focus(); return; }
      var botao = $("rsvp-enviar");
      botao.disabled = true;
      botao.textContent = SITE.rsvp.botaoEnviando;

      enviarParaPlanilha({
        tipo: "rsvp",
        nome: nome,
        observacoes: $("rsvp-obs").value.trim(),
      }).then(function () {
        form.hidden = true;
        var ok = $("rsvp-sucesso");
        ok.hidden = false;
        ok.focus();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  hidratar();
  montarHero();
  montarNavegacao();
  montarPresentes();
  montarModal();
  montarConfirmacao();
  montarEntradas();
  montarParallax();
  montarRsvp();

  if (SB) {
    // Lista de presentes vinda do banco (com o total já recebido de cada um).
    carregarPresentesDoBanco().then(function (deuCerto) {
      if (deuCerto) montarPresentes();
    });
  } else {
    // Sem Supabase: mantém a sincronia opcional pela planilha do Google.
    sincronizarPresentes();
  }
})();
