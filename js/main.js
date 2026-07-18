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

  /* ------------------------------------------------------------------
     HIDRATAÇÃO: despeja o conteúdo do config.js no HTML
     ------------------------------------------------------------------ */
  function hidratar() {
    document.title = SITE.seo.titulo;

    $("nav-brand").textContent = SITE.casal.monograma;

    // Links de navegação (desktop + menu mobile)
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

    // Hero
    $("hero-eyebrow").textContent = SITE.evento.chamada;
    $("hero-wordmark").textContent = SITE.casal.nomeCompleto;
    $("hero-date").textContent = SITE.evento.dataCurta;

    // Nossa história
    $("historia-titulo").textContent = SITE.historia.titulo;
    $("historia-assinatura").textContent = SITE.historia.assinatura;
    $("historia-img").src = SITE.historia.imagem;
    $("historia-img").alt = SITE.historia.imagemAlt;
    SITE.historia.paragrafos.forEach(function (texto) {
      var p = document.createElement("p");
      p.textContent = texto;
      $("historia-paragrafos").appendChild(p);
    });

    // Galeria
    $("galeria-titulo").textContent = SITE.galeria.titulo;
    SITE.galeria.fotos.forEach(function (foto, i) {
      var botao = document.createElement("button");
      botao.type = "button";
      botao.className = "galeria__item reveal";
      botao.setAttribute("aria-label", foto.alt);
      if (!reduzMovimento) botao.style.transitionDelay = (i % 4) * 80 + "ms";

      var img = document.createElement("img");
      img.src = foto.arquivo;
      img.alt = foto.alt;
      img.loading = "lazy";
      botao.appendChild(img);

      // Flor discreta no canto do primeiro cartão (peça única)
      if (i === 0) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "galeria__flor");
        svg.setAttribute("aria-hidden", "true");
        var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("href", "#svg-flor");
        svg.appendChild(use);
        botao.appendChild(svg);
      }

      botao.addEventListener("click", function () { abrirLightbox(i); });
      $("galeria-grid").appendChild(botao);
    });

    // O dia
    $("odia-titulo").textContent = SITE.oDia.titulo;
    $("odia-intro").textContent = SITE.oDia.introducao;
    $("odia-rotulo-data").textContent = SITE.oDia.rotuloData;
    $("odia-data").textContent = SITE.evento.dataLonga;
    $("odia-rotulo-horario").textContent = SITE.oDia.rotuloHorario;
    $("odia-horario").textContent = SITE.evento.horario;
    $("odia-horario-nota").textContent = SITE.evento.horarioNota;
    $("odia-rotulo-local").textContent = SITE.oDia.rotuloLocal;
    $("odia-local-nome").textContent = SITE.evento.localNome + " · " + SITE.evento.localCidade;
    $("odia-local-endereco").textContent = SITE.evento.localEndereco;
    $("odia-mapa").textContent = SITE.oDia.botaoMapa;
    $("odia-mapa").href = SITE.evento.localMapaUrl;

    // Presentes / PIX
    $("presentes-titulo").textContent = SITE.presentes.titulo;
    $("presentes-texto").textContent = SITE.presentes.texto;
    $("pix-rotulo-banco").textContent = SITE.presentes.rotuloBanco;
    $("pix-banco").textContent = SITE.presentes.banco;
    $("pix-rotulo-titular").textContent = SITE.presentes.rotuloTitular;
    $("pix-titular").textContent = SITE.presentes.titular;
    $("pix-rotulo-chave").textContent = SITE.presentes.rotuloChave;
    $("pix-chave").textContent = SITE.presentes.chavePix;
    $("pix-copiar").textContent = SITE.presentes.botaoCopiar;
    if (SITE.presentes.qrCodeImagem) {
      $("pix-qr-img").src = SITE.presentes.qrCodeImagem;
      $("pix-qr-img").alt = SITE.presentes.qrCodeAlt;
      $("pix-qr").hidden = false;
    }

    // RSVP
    $("rsvp-titulo").textContent = SITE.rsvp.titulo;
    $("rsvp-intro").textContent = SITE.rsvp.introducao;
    $("rsvp-rotulo-nome").textContent = SITE.rsvp.rotuloNome;
    $("rsvp-nome").placeholder = SITE.rsvp.placeholderNome;
    $("rsvp-rotulo-acomp").textContent = SITE.rsvp.rotuloAcompanhantes;
    $("rsvp-nota-acomp").textContent = SITE.rsvp.notaAcompanhantes;
    $("rsvp-rotulo-obs").textContent = SITE.rsvp.rotuloObservacoes;
    $("rsvp-obs").placeholder = SITE.rsvp.placeholderObservacoes;
    $("rsvp-enviar").textContent = SITE.rsvp.botaoEnviar;
    $("rsvp-sucesso-titulo").textContent = SITE.rsvp.sucessoTitulo;
    $("rsvp-sucesso-texto").textContent = SITE.rsvp.sucessoTexto;

    // Rodapé
    $("rodape-nomes").textContent = SITE.casal.nomeCompleto;
    $("rodape-agradecimento").textContent = SITE.rodape.agradecimento;
    $("rodape-data").textContent = SITE.evento.dataLonga;
    $("rodape-credito").textContent = SITE.rodape.credito;
  }

  /* ------------------------------------------------------------------
     HERO: vídeo que toca uma vez e congela; recorte da flor entra por
     cima do nome no estado final (profundidade pétalas > letras).
     ------------------------------------------------------------------ */
  function montarHero() {
    var stage = $("hero-stage");
    var wrap = $("hero-video-wrap");
    var cfg = SITE.heroVideo;
    var poster = ehMobile ? cfg.posterMobile : cfg.posterDesktop;
    var cutoutSrc = ehMobile ? "assets/img/hero-flor-cutout-mobile.webp"
                             : "assets/img/hero-flor-cutout.webp";

    // Camada de profundidade: frame final recortado, acima do nome.
    var cutout = document.createElement("img");
    cutout.className = "hero__cutout";
    cutout.src = cutoutSrc;
    cutout.alt = "";
    cutout.setAttribute("aria-hidden", "true");
    stage.appendChild(cutout);

    function congelar() {
      stage.classList.add("is-frozen");
    }

    // Com movimento reduzido: apenas o pôster estático, já com profundidade.
    if (reduzMovimento) {
      var img = document.createElement("img");
      img.src = poster;
      img.alt = cfg.descricao;
      wrap.appendChild(img);
      stage.classList.add("is-ready");
      congelar();
      return;
    }

    var video = document.createElement("video");
    video.muted = true;
    video.setAttribute("muted", "");
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.preload = "metadata";
    video.disablePictureInPicture = true;
    video.setAttribute("aria-label", cfg.descricao);
    // SEM loop: o desabrochar é um evento único. O vídeo termina e congela
    // sozinho no último quadro; nunca reinicia nem reverte.

    var srcWebm = document.createElement("source");
    srcWebm.src = ehMobile ? cfg.mobileWebm : cfg.desktopWebm;
    srcWebm.type = "video/webm";
    var srcMp4 = document.createElement("source");
    srcMp4.src = ehMobile ? cfg.mobileMp4 : cfg.desktopMp4;
    srcMp4.type = "video/mp4";
    video.appendChild(srcWebm);
    video.appendChild(srcMp4);

    video.addEventListener("playing", function () {
      stage.classList.add("is-playing");
    }, { once: true });

    video.addEventListener("ended", function () {
      video.pause();
      congelar();
    }, { once: true });

    wrap.appendChild(video);

    var tocar = video.play();
    if (tocar && tocar.catch) {
      tocar.catch(function () {
        // Autoplay bloqueado: mostra o pôster (flor aberta) já congelado.
        video.poster = poster;
        stage.classList.add("is-ready");
        congelar();
      });
    }
  }

  /* ------------------------------------------------------------------
     NAVEGAÇÃO: fundo ao rolar, item ativo, menu mobile
     ------------------------------------------------------------------ */
  function montarNavegacao() {
    var nav = $("nav");
    var burger = $("nav-burger");
    var menu = $("menu-mobile");
    var linksMenu = menu.querySelectorAll("a");

    function aoRolar() {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();

    // Item ativo conforme a seção visível
    var todasAncoras = document.querySelectorAll(".nav__links a, .menu__links a");
    var observadorSecoes = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        todasAncoras.forEach(function (a) {
          a.classList.toggle("is-active", a.dataset.secao === e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) {
      observadorSecoes.observe(s);
    });

    // Menu mobile de tela cheia
    var aberto = false;
    function alternarMenu(forcar) {
      aberto = typeof forcar === "boolean" ? forcar : !aberto;
      menu.hidden = !aberto;
      burger.setAttribute("aria-expanded", String(aberto));
      burger.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("menu-aberto", aberto);
      if (aberto) menu.querySelector("a").focus();
    }

    burger.addEventListener("click", function () { alternarMenu(); });

    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") alternarMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (!aberto) return;
      if (e.key === "Escape") {
        alternarMenu(false);
        burger.focus();
      }
      // Foco circular dentro do menu
      if (e.key === "Tab") {
        var focaveis = [burger].concat(Array.prototype.slice.call(linksMenu.length ? linksMenu : menu.querySelectorAll("a")));
        var itens = Array.prototype.slice.call(menu.querySelectorAll("a"));
        itens.unshift(burger);
        var i = itens.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          itens[itens.length - 1].focus();
        } else if (!e.shiftKey && i === itens.length - 1) {
          e.preventDefault();
          itens[0].focus();
        }
      }
    });
  }

  /* ------------------------------------------------------------------
     ENTRADAS (fade/slide) via IntersectionObserver
     ------------------------------------------------------------------ */
  function montarEntradas() {
    var alvos = document.querySelectorAll(".reveal");
    if (reduzMovimento || !("IntersectionObserver" in window)) {
      alvos.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    alvos.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     PARALLAX leve (~8%) na imagem de "Nossa história" — rAF + translate3d
     ------------------------------------------------------------------ */
  function montarParallax() {
    if (reduzMovimento) return;
    var img = $("historia-img");
    var quadro = $("historia-media");
    var agendado = false;

    function atualizar() {
      agendado = false;
      var r = quadro.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var progresso = (r.top + r.height / 2 - window.innerHeight / 2) /
                      (window.innerHeight / 2 + r.height / 2);
      var deslocamento = Math.max(-1, Math.min(1, progresso)) * -8;
      img.style.transform = "translate3d(0," + deslocamento.toFixed(2) + "%,0)";
    }

    window.addEventListener("scroll", function () {
      if (!agendado) {
        agendado = true;
        requestAnimationFrame(atualizar);
      }
    }, { passive: true });
    atualizar();
  }

  /* ------------------------------------------------------------------
     LIGHTBOX da galeria (teclado: Esc, ← e →)
     ------------------------------------------------------------------ */
  var lightboxIndice = 0;
  var lightboxOrigem = null;

  function mostrarFoto(i) {
    var fotos = SITE.galeria.fotos;
    lightboxIndice = (i + fotos.length) % fotos.length;
    $("lightbox-img").src = fotos[lightboxIndice].arquivo;
    $("lightbox-img").alt = fotos[lightboxIndice].alt;
  }

  function abrirLightbox(i) {
    lightboxOrigem = document.activeElement;
    mostrarFoto(i);
    $("lightbox").hidden = false;
    document.body.classList.add("menu-aberto");
    $("lightbox-fechar").focus();
  }

  function fecharLightbox() {
    $("lightbox").hidden = true;
    document.body.classList.remove("menu-aberto");
    if (lightboxOrigem) lightboxOrigem.focus();
  }

  function montarLightbox() {
    $("lightbox-fechar").addEventListener("click", fecharLightbox);
    $("lightbox-ant").addEventListener("click", function () { mostrarFoto(lightboxIndice - 1); });
    $("lightbox-prox").addEventListener("click", function () { mostrarFoto(lightboxIndice + 1); });
    $("lightbox").addEventListener("click", function (e) {
      if (e.target === e.currentTarget) fecharLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if ($("lightbox").hidden) return;
      if (e.key === "Escape") fecharLightbox();
      if (e.key === "ArrowLeft") mostrarFoto(lightboxIndice - 1);
      if (e.key === "ArrowRight") mostrarFoto(lightboxIndice + 1);
      if (e.key === "Tab") {
        // Foco circular entre os três botões do lightbox
        var itens = [$("lightbox-fechar"), $("lightbox-ant"), $("lightbox-prox")];
        var i = itens.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); itens[itens.length - 1].focus(); }
        else if (!e.shiftKey && (i === -1 || i === itens.length - 1)) { e.preventDefault(); itens[0].focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------
     PIX: copiar chave com feedback de 2s
     ------------------------------------------------------------------ */
  function montarPix() {
    var botao = $("pix-copiar");
    var temporizador = null;

    function feedback() {
      botao.classList.add("is-copied");
      botao.textContent = SITE.presentes.feedbackCopiado;
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        botao.classList.remove("is-copied");
        botao.textContent = SITE.presentes.botaoCopiar;
      }, 2000);
    }

    botao.addEventListener("click", function () {
      var chave = SITE.presentes.chavePix;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(chave).then(feedback, function () { copiaManual(chave); });
      } else {
        copiaManual(chave);
      }
    });

    function copiaManual(texto) {
      var area = document.createElement("textarea");
      area.value = texto;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try { document.execCommand("copy"); feedback(); } catch (e) { /* silencioso */ }
      document.body.removeChild(area);
    }
  }

  /* ------------------------------------------------------------------
     RSVP
     ------------------------------------------------------------------
     PONTO ÚNICO DE INTEGRAÇÃO COM UM SERVIÇO REAL DE FORMULÁRIO:
     A função submitRSVP(dados) abaixo hoje apenas simula o envio (1s).
     Para conectar a um serviço, troque o corpo dela. Exemplos:

     — Formspree (crie um form em formspree.io e use o endpoint):
       function submitRSVP(dados) {
         return fetch("https://formspree.io/f/SEU_CODIGO", {
           method: "POST",
           headers: { "Content-Type": "application/json", Accept: "application/json" },
           body: JSON.stringify(dados),
         });
       }

     — Google Forms: monte a URL de resposta pré-preenchida do seu
       formulário (formResponse) e envie via fetch com mode: "no-cors".
     ------------------------------------------------------------------ */
  function submitRSVP(dados) {
    void dados; // dados = { nome, acompanhantes, observacoes }
    return new Promise(function (resolver) { setTimeout(resolver, 1000); });
  }

  function montarRsvp() {
    var form = $("rsvp-form");
    var campoAcomp = $("rsvp-acomp");

    function ajustar(delta) {
      var atual = parseInt(campoAcomp.value, 10) || 0;
      campoAcomp.value = Math.max(0, Math.min(12, atual + delta));
    }
    $("rsvp-menos").addEventListener("click", function () { ajustar(-1); });
    $("rsvp-mais").addEventListener("click", function () { ajustar(1); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = $("rsvp-nome").value.trim();
      if (!nome) {
        $("rsvp-nome").focus();
        return;
      }
      var botao = $("rsvp-enviar");
      botao.disabled = true;
      botao.textContent = SITE.rsvp.botaoEnviando;

      submitRSVP({
        nome: nome,
        acompanhantes: parseInt(campoAcomp.value, 10) || 0,
        observacoes: $("rsvp-obs").value.trim(),
      }).then(function () {
        form.hidden = true;
        var sucesso = $("rsvp-sucesso");
        sucesso.hidden = false;
        sucesso.focus();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  hidratar();
  montarHero();
  montarNavegacao();
  montarEntradas();
  montarParallax();
  montarLightbox();
  montarPix();
  montarRsvp();
})();
