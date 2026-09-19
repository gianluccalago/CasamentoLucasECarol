/* ==========================================================================
   PAINEL.JS — a página privada do casal (painel.html)
   --------------------------------------------------------------------------
   Mostra o que foi presenteado, por quem e quando; o que ainda falta; e
   quem confirmou presença.

   COMO A SENHA É CONFERIDA: não é aqui. O navegador manda a senha para a
   função "painel" do banco (Supabase), que compara com a senha guardada
   numa tabela que ninguém consegue ler de fora. Se a senha não bater, o
   banco simplesmente não devolve nada. Por isso não adianta "burlar" esta
   página: os dados nunca chegam a sair do servidor sem a senha certa.
   ========================================================================== */

(function () {
  "use strict";

  var SITE = window.SITE || {};
  var $ = function (id) { return document.getElementById(id); };

  var SB = (SITE.supabase && SITE.supabase.url && SITE.supabase.anonKey)
    ? { url: SITE.supabase.url.replace(/\/+$/, ""), chave: SITE.supabase.anonKey }
    : null;

  var CHAVE_LEMBRAR = "painel-senha";
  var dados = null;
  var senhaAtual = "";
  var situacaoLista = "todos";

  /* ------------------------------------------------------------------
     FORMATOS
     ------------------------------------------------------------------ */
  function moeda(v) {
    return "R$ " + Number(v || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    });
  }

  function moedaCurta(v) {
    return "R$ " + Number(v || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    });
  }

  /* Data e hora sempre no fuso do Brasil, mesmo que o celular esteja
     configurado em outro país. */
  function quando(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d)) return String(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  }

  function texto(el, valor) { el.textContent = valor == null ? "" : String(valor); }

  /* ------------------------------------------------------------------
     CONVERSA COM O BANCO
     ------------------------------------------------------------------ */
  function buscarPainel(senha) {
    return fetch(SB.url + "/rest/v1/rpc/painel", {
      method: "POST",
      headers: {
        "apikey": SB.chave,
        "Authorization": "Bearer " + SB.chave,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_senha: senha }),
    }).then(function (r) {
      return r.text().then(function (corpo) {
        if (r.ok) return JSON.parse(corpo);
        var erro = new Error(corpo || ("HTTP " + r.status));
        // 403/401 e a mensagem da função significam a mesma coisa: senha errada.
        erro.senhaErrada = r.status === 403 || r.status === 401 ||
          corpo.indexOf("senha-incorreta") !== -1;
        // A função ainda não existe no banco (esqueceram de rodar o SQL).
        erro.semFuncao = r.status === 404 ||
          corpo.indexOf("Could not find the function") !== -1 ||
          corpo.indexOf("PGRST202") !== -1;
        throw erro;
      });
    });
  }

  /* ------------------------------------------------------------------
     RESUMO (os quadradinhos do topo)
     ------------------------------------------------------------------ */
  function montarResumo() {
    var presentes = dados.presentes || [];
    var marcacoes = dados.marcacoes || [];
    var rsvps = dados.rsvps || [];

    var arrecadado = marcacoes.reduce(function (s, m) { return s + Number(m.valor || 0); }, 0);
    var conquistados = presentes.filter(function (p) { return p.conquistado; }).length;
    var livres = marcacoes.filter(function (m) { return !m.presente_id; }).length;

    var blocos = [
      { rotulo: "Já recebido", valor: moedaCurta(arrecadado),
        nota: marcacoes.length + (marcacoes.length === 1 ? " aviso registrado" : " avisos registrados") },
      { rotulo: "Presentes conquistados", valor: conquistados + " de " + presentes.length,
        nota: (presentes.length - conquistados) + " ainda disponíveis" },
      { rotulo: "Contribuições livres", valor: String(livres),
        nota: "sem item da lista" },
      { rotulo: "Confirmaram presença", valor: String(rsvps.length),
        nota: rsvps.length === 1 ? "convidado" : "convidados" },
    ];

    var alvo = $("painel-resumo");
    alvo.textContent = "";
    blocos.forEach(function (b) {
      var card = document.createElement("div");
      card.className = "resumo__bloco";
      var r = document.createElement("p"); r.className = "resumo__rotulo"; r.textContent = b.rotulo;
      var v = document.createElement("p"); v.className = "resumo__valor";  v.textContent = b.valor;
      var n = document.createElement("p"); n.className = "resumo__nota";   n.textContent = b.nota;
      card.appendChild(r); card.appendChild(v); card.appendChild(n);
      alvo.appendChild(card);
    });
  }

  /* Célula com rótulo embutido — é o que vira "cartão" no celular. */
  function celula(linha, conteudo, rotulo, classe) {
    var td = document.createElement("td");
    if (rotulo) td.dataset.rotulo = rotulo;
    if (classe) td.className = classe;
    if (conteudo instanceof Node) td.appendChild(conteudo);
    else td.textContent = conteudo == null ? "" : String(conteudo);
    linha.appendChild(td);
    return td;
  }

  /* ------------------------------------------------------------------
     QUEM PRESENTEOU O QUÊ E QUANDO
     ------------------------------------------------------------------ */
  function marcacoesFiltradas() {
    var busca = ($("painel-busca").value || "").trim().toLowerCase();
    var lista = (dados.marcacoes || []);
    if (!busca) return lista;
    return lista.filter(function (m) {
      return ((m.nome || "") + " " + (m.presente || "") + " " + (m.categoria || ""))
        .toLowerCase().indexOf(busca) !== -1;
    });
  }

  function montarMarcacoes() {
    var corpo = $("tabela-marcacoes").querySelector("tbody");
    var lista = marcacoesFiltradas();
    corpo.textContent = "";

    lista.forEach(function (m) {
      var tr = document.createElement("tr");
      celula(tr, quando(m.criado_em), "Quando", "discreto");
      celula(tr, m.nome, "Quem presenteou", "destaque");

      var presente = document.createElement("span");
      if (m.presente_id) {
        presente.textContent = m.presente || m.presente_id;
        if (m.categoria) {
          var cat = document.createElement("span");
          cat.className = "etiqueta";
          cat.textContent = m.categoria;
          presente.appendChild(document.createTextNode(" "));
          presente.appendChild(cat);
        }
      } else {
        presente.className = "livre-marca";
        presente.textContent = "Contribuição livre";
      }
      celula(tr, presente, "Presente");
      celula(tr, moeda(m.valor), "Valor", "num");

      if (m.mensagem) {
        var extra = document.createElement("tr");
        extra.className = "linha-recado";
        var td = document.createElement("td");
        td.colSpan = 4;
        td.textContent = "“" + m.mensagem + "”";
        extra.appendChild(td);
        corpo.appendChild(tr);
        corpo.appendChild(extra);
        return;
      }
      corpo.appendChild(tr);
    });

    var vazio = lista.length === 0;
    $("vazio-marcacoes").hidden = !vazio;
    $("vazio-marcacoes").textContent = (dados.marcacoes || []).length === 0
      ? "Nenhum presente registrado até agora."
      : "Nada encontrado com esse termo.";
    $("tabela-marcacoes").hidden = vazio;
  }

  /* ------------------------------------------------------------------
     A LISTA INTEIRA (o que falta)
     ------------------------------------------------------------------ */
  function montarLista() {
    var corpo = $("tabela-lista").querySelector("tbody");
    corpo.textContent = "";

    (dados.presentes || []).filter(function (p) {
      if (situacaoLista === "disponiveis") return !p.conquistado;
      if (situacaoLista === "conquistados") return p.conquistado;
      return true;
    }).forEach(function (p) {
      var alvo = Number(p.valor) * Number(p.unidades || 1);
      var recebido = Number(p.recebido || 0);

      var tr = document.createElement("tr");
      if (p.conquistado) tr.className = "is-conquistado";

      var nome = document.createElement("span");
      nome.textContent = p.nome;
      if (p.modelo) {
        var m = document.createElement("small");
        m.textContent = p.modelo;
        nome.appendChild(m);
      }
      celula(tr, nome, "Presente", "destaque");
      celula(tr, p.categoria || "", "Categoria", "discreto");
      celula(tr, moedaCurta(alvo) + ((p.unidades || 1) > 1 ? " (" + p.unidades + " un.)" : ""), "Valor", "num");
      celula(tr, recebido > 0 ? moeda(recebido) : "—", "Recebido", "num");

      var situacao = document.createElement("span");
      if (p.conquistado) {
        situacao.className = "selo selo--ok";
        situacao.textContent = "Conquistado";
      } else if (recebido > 0) {
        situacao.className = "selo selo--parcial";
        situacao.textContent = "Falta " + moedaCurta(alvo - recebido);
      } else {
        situacao.className = "selo selo--livre";
        situacao.textContent = "Disponível";
      }
      celula(tr, situacao, "Situação");

      corpo.appendChild(tr);
    });
  }

  /* ------------------------------------------------------------------
     CONFIRMAÇÕES DE PRESENÇA
     ------------------------------------------------------------------ */
  function montarRsvps() {
    var lista = dados.rsvps || [];
    var corpo = $("tabela-rsvps").querySelector("tbody");
    corpo.textContent = "";

    lista.forEach(function (r) {
      var tr = document.createElement("tr");
      celula(tr, quando(r.criado_em), "Quando", "discreto");
      celula(tr, r.nome, "Nome", "destaque");
      celula(tr, r.observacoes || "—", "Observações");
      corpo.appendChild(tr);
    });

    texto($("conta-rsvps"), lista.length
      ? lista.length + (lista.length === 1 ? " confirmação" : " confirmações")
      : "");
    $("vazio-rsvps").hidden = lista.length > 0;
    $("tabela-rsvps").hidden = lista.length === 0;
  }

  /* ------------------------------------------------------------------
     PLANILHAS (.csv que o Excel e o Google Planilhas abrem direto)
     ------------------------------------------------------------------ */
  function baixarCsv(nomeArquivo, cabecalho, linhas) {
    function campo(v) {
      var t = v == null ? "" : String(v);
      return /[";\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
    }
    var csv = [cabecalho].concat(linhas)
      .map(function (l) { return l.map(campo).join(";"); })
      .join("\r\n");
    // O ﻿ faz o Excel entender os acentos.
    var blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }

  // Número com vírgula decimal, como o Excel brasileiro espera.
  function numeroBr(v) { return Number(v || 0).toFixed(2).replace(".", ","); }

  function hoje() { return new Date().toISOString().slice(0, 10); }

  /* ------------------------------------------------------------------
     DESENHA TUDO
     ------------------------------------------------------------------ */
  function desenhar() {
    montarResumo();
    montarMarcacoes();
    montarLista();
    montarRsvps();
    texto($("painel-atualizado"), "Atualizado em " + quando(dados.gerado_em || new Date().toISOString()));
  }

  function entrar(senha, lembrar) {
    var botao = $("painel-entrar");
    botao.disabled = true;
    botao.textContent = "Entrando…";
    $("painel-erro").hidden = true;

    return buscarPainel(senha)
      .then(function (resposta) {
        dados = resposta;
        senhaAtual = senha;
        if (lembrar) {
          try { localStorage.setItem(CHAVE_LEMBRAR, senha); } catch (e) { /* sem armazenamento */ }
        }
        $("painel-entrada").hidden = true;
        $("painel-conteudo").hidden = false;
        desenhar();
      })
      .catch(function (erro) {
        try { localStorage.removeItem(CHAVE_LEMBRAR); } catch (e) { /* tudo bem */ }
        var el = $("painel-erro");
        if (erro.senhaErrada) el.textContent = "Senha incorreta. Tente de novo.";
        else if (erro.semFuncao) el.textContent = "O banco ainda não tem o painel. Rode o arquivo supabase/migrations/0001_esquema.sql no SQL Editor do Supabase.";
        else el.textContent = "Não consegui falar com o banco agora. Verifique a internet e tente de novo.";
        el.hidden = false;
        $("painel-senha").focus();
        $("painel-senha").select();
      })
      .then(function () {
        botao.disabled = false;
        botao.textContent = "Entrar";
      });
  }

  function atualizar() {
    var botao = $("painel-atualizar");
    var rotulo = botao.textContent;
    botao.disabled = true;
    botao.textContent = "Atualizando…";
    buscarPainel(senhaAtual)
      .then(function (resposta) { dados = resposta; desenhar(); })
      .catch(function () { texto($("painel-atualizado"), "Não consegui atualizar agora."); })
      .then(function () { botao.disabled = false; botao.textContent = rotulo; });
  }

  function sair() {
    try { localStorage.removeItem(CHAVE_LEMBRAR); } catch (e) { /* tudo bem */ }
    senhaAtual = "";
    dados = null;
    $("painel-conteudo").hidden = true;
    $("painel-entrada").hidden = false;
    $("painel-senha").value = "";
    $("painel-senha").focus();
  }

  /* ------------------------------------------------------------------
     LIGAÇÕES DA PÁGINA
     ------------------------------------------------------------------ */
  function ligar() {
    var evento = SITE.evento || {};
    var casal = SITE.casal || {};
    texto($("painel-sub"), [casal.nomeCompleto, evento.dataLonga].filter(Boolean).join(" · "));

    // Sem Supabase configurado não há o que consultar.
    if (!SB) {
      $("painel-form").hidden = true;
      var ajuda = $("painel-ajuda");
      ajuda.hidden = false;
      ajuda.textContent = "O painel ainda não está ligado ao banco de dados. " +
        "Preencha os campos \"url\" e \"anonKey\" em supabase, no arquivo config.js, " +
        "e rode o supabase/migrations/0001_esquema.sql no SQL Editor. " +
        "O passo a passo está em SUPABASE.md.";
      return;
    }

    $("painel-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var senha = $("painel-senha").value;
      if (!senha) { $("painel-senha").focus(); return; }
      entrar(senha, true);
    });

    $("painel-atualizar").addEventListener("click", atualizar);
    $("painel-sair").addEventListener("click", sair);
    $("painel-busca").addEventListener("input", montarMarcacoes);

    // Abas
    var abas = $("painel-abas").querySelectorAll(".aba");
    Array.prototype.forEach.call(abas, function (aba) {
      aba.addEventListener("click", function () {
        Array.prototype.forEach.call(abas, function (outra) {
          var ativa = outra === aba;
          outra.classList.toggle("is-ativa", ativa);
          outra.setAttribute("aria-selected", String(ativa));
          $(outra.dataset.alvo).hidden = !ativa;
        });
      });
    });

    // Filtro de situação na aba "A lista"
    var filtros = $("filtro-situacao").querySelectorAll(".filtro");
    Array.prototype.forEach.call(filtros, function (f) {
      f.addEventListener("click", function () {
        situacaoLista = f.dataset.situacao;
        Array.prototype.forEach.call(filtros, function (outro) {
          var ativo = outro === f;
          outro.classList.toggle("is-ativo", ativo);
          outro.setAttribute("aria-pressed", String(ativo));
        });
        montarLista();
      });
    });

    // Planilhas
    $("baixar-presentes").addEventListener("click", function () {
      baixarCsv("presentes-recebidos-" + hoje() + ".csv",
        ["Quando", "Quem presenteou", "Presente", "Categoria", "Valor (R$)", "Recado"],
        (dados.marcacoes || []).map(function (m) {
          return [quando(m.criado_em), m.nome,
                  m.presente_id ? (m.presente || m.presente_id) : "Contribuição livre",
                  m.categoria || "", numeroBr(m.valor), m.mensagem || ""];
        }));
    });

    $("baixar-lista").addEventListener("click", function () {
      baixarCsv("lista-de-presentes-" + hoje() + ".csv",
        ["Presente", "Modelo", "Categoria", "Valor (R$)", "Unidades", "Recebido (R$)", "Situação"],
        (dados.presentes || []).map(function (p) {
          return [p.nome, p.modelo || "", p.categoria || "", numeroBr(p.valor),
                  p.unidades || 1, numeroBr(p.recebido),
                  p.conquistado ? "Conquistado" : (Number(p.recebido) > 0 ? "Parcial" : "Disponível")];
        }));
    });

    $("baixar-rsvps").addEventListener("click", function () {
      baixarCsv("confirmacoes-de-presenca-" + hoje() + ".csv",
        ["Quando", "Nome", "Observações"],
        (dados.rsvps || []).map(function (r) {
          return [quando(r.criado_em), r.nome, r.observacoes || ""];
        }));
    });

    // Se a senha já foi guardada neste aparelho, entra direto.
    var guardada = "";
    try { guardada = localStorage.getItem(CHAVE_LEMBRAR) || ""; } catch (e) { /* sem armazenamento */ }
    if (guardada) {
      $("painel-senha").value = guardada;
      entrar(guardada, false);
    } else {
      $("painel-senha").focus();
    }
  }

  ligar();
})();
