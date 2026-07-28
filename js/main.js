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
     HERO: a aquarela é pintada conforme a ROLAGEM da página.
     Nunca chamamos play() — por isso não existe botão de play nem
     bloqueio de autoplay (inclusive no modo de economia do iPhone).
     ------------------------------------------------------------------ */
  function montarHero() {
    var hero = $("inicio");
    var stage = $("hero-stage");
    var wrap = $("hero-video-wrap");
    var cfg = SITE.heroVideo;
    var posterInicio = ehMobile ? cfg.posterInicioMobile : cfg.posterInicioDesktop;
    var posterFinal = ehMobile ? cfg.posterMobile : cfg.posterDesktop;

    function somenteImagem(src) {
      wrap.textContent = "";
      var img = document.createElement("img");
      img.src = src;
      img.alt = cfg.descricao;
      wrap.appendChild(img);
      stage.classList.add("is-ready");
    }

    if (reduzMovimento) {
      somenteImagem(posterFinal);
      return;
    }

    hero.classList.add("hero--scrub");

    var video = document.createElement("video");
    video.muted = true;
    video.setAttribute("muted", "");
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.preload = "auto";
    video.poster = posterInicio;
    video.disablePictureInPicture = true;
    video.setAttribute("aria-label", cfg.descricao);
    video.width = ehMobile ? 720 : 1600;
    video.height = 900;

    // MP4 primeiro (universal em Safari, Chrome, Edge e Firefox); o WebM
    // atende navegadores sem suporte a H.264.
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
    try { video.load(); } catch (e) { /* indiferente */ }

    // A visibilidade NUNCA depende do carregamento do vídeo.
    requestAnimationFrame(function () { stage.classList.add("is-ready"); });

    // Um "erro" no vídeo nem sempre é fatal: navegadores abortam e refazem
    // o download de arquivos grandes. Só desistimos quando o elemento
    // reporta um erro de mídia real — e ainda assim tentamos de novo antes.
    var tentativas = 0;
    video.addEventListener("error", function () {
      if (!video.error && tentativas < 2) {
        tentativas++;
        try { video.load(); } catch (e) { /* indiferente */ }
        return;
      }
      hero.classList.remove("hero--scrub");
      somenteImagem(posterFinal);
    });

    function destravar() {
      if (video.readyState === 0) { try { video.load(); } catch (e) { /* indiferente */ } }
    }
    window.addEventListener("touchstart", destravar, { once: true, passive: true });
    window.addEventListener("pointerdown", destravar, { once: true, passive: true });

    // Vigia: sem nenhum dado após 8s, mostra a ilustração pronta.
    setTimeout(function () {
      if (video.readyState === 0 && document.body.contains(video)) {
        hero.classList.remove("hero--scrub");
        somenteImagem(posterFinal);
      }
    }, 8000);

    var duracao = 0, atual = null, agendado = false;

    function progresso() {
      var total = hero.offsetHeight - window.innerHeight;
      if (total <= 0) return 1;
      return Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / total));
    }

    function quadro() {
      agendado = false;
      if (!duracao) return;
      var alvo = progresso() * (duracao - 0.06);
      if (atual === null) atual = video.currentTime || 0;
      var delta = alvo - atual;
      if (Math.abs(delta) >= 0.004) {
        atual = Math.abs(delta) < 0.03 ? alvo : atual + delta * 0.22;
      }
      var exibido = video.currentTime || 0;
      if (Math.abs(exibido - atual) > 0.02) {
        try { video.currentTime = Math.max(0, atual); } catch (e) { /* carregando */ }
      }
      if (Math.abs(alvo - atual) >= 0.004 || Math.abs(exibido - atual) > 0.08) agendar();
    }

    function agendar() {
      if (!agendado) { agendado = true; requestAnimationFrame(quadro); }
    }

    video.addEventListener("loadedmetadata", function () {
      duracao = video.duration;
      agendar();
    });
    video.addEventListener("progress", agendar);
    video.addEventListener("canplay", agendar);
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar, { passive: true });
  }

  /* ------------------------------------------------------------------
     NAVEGAÇÃO
     ------------------------------------------------------------------ */
  function montarNavegacao() {
    var nav = $("nav");
    var burger = $("nav-burger");
    var menu = $("menu-mobile");
    var hero = $("inicio");

    function aoRolar() {
      var limite = Math.max(24, hero.offsetHeight - window.innerHeight - 40);
      nav.classList.toggle("is-scrolled", window.scrollY > limite);
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
    $("modal-como").textContent = SITE.presentes.rotuloComoPagar;
    $("modal-banco").textContent = SITE.presentes.banco;
    $("modal-titular").textContent = SITE.presentes.titular;
    $("modal-chave").textContent = SITE.presentes.chavePix;
    $("modal-copiar").textContent = SITE.presentes.rotuloCopiarPix;
    $("modal-copiar").classList.remove("is-copied");
    $("modal-avisar").textContent = SITE.presentes.rotuloAvisar;
    $("modal-avisar").disabled = false;

    if (SITE.presentes.qrCodeImagem) {
      $("modal-qr-img").src = SITE.presentes.qrCodeImagem;
      $("modal-qr").hidden = false;
    } else {
      $("modal-qr").hidden = true;
    }

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
      });
      cont.appendChild(b);
    });
    valorEscolhido = item.valor;
    cont.querySelectorAll(".modal__opcao")[1].classList.add("is-ativa");
    $("modal-livre").value = "";

    $("modal-presente").hidden = false;
    document.body.classList.add("travado");
    $("modal-fechar").focus();
  }

  function fecharModal() {
    $("modal-presente").hidden = true;
    document.body.classList.remove("travado");
    itemAtual = null;
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
      }
    });

    var tempo = null;
    $("modal-copiar").addEventListener("click", function () {
      var botao = this;
      function feito() {
        botao.classList.add("is-copied");
        botao.textContent = SITE.presentes.feedbackCopiado;
        clearTimeout(tempo);
        tempo = setTimeout(function () {
          botao.classList.remove("is-copied");
          botao.textContent = SITE.presentes.rotuloCopiarPix;
        }, 2200);
      }
      var chave = SITE.presentes.chavePix;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(chave).then(feito, function () { copiaManual(chave, feito); });
      } else {
        copiaManual(chave, feito);
      }
    });

    // Avisa o casal (registra na planilha) que o presente foi pago
    $("modal-avisar").addEventListener("click", function () {
      var botao = this;
      if (!itemAtual) return;
      botao.disabled = true;
      enviarParaPlanilha({
        tipo: "presente",
        presente: itemAtual.nome,
        valor: valorEscolhido,
      }).then(function () {
        botao.textContent = SITE.presentes.rotuloAvisarEnviado;
      });
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
  montarEntradas();
  montarParallax();
  montarRsvp();
  sincronizarPresentes();
})();
