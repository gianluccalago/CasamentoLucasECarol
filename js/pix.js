/* ==========================================================================
   PIX.JS — monta o código PIX "copia e cola" com o valor já preenchido
   --------------------------------------------------------------------------
   Gera o BR Code (padrão do Banco Central) direto no navegador, sem
   servidor e sem intermediário. O dinheiro cai na conta do casal sem
   nenhuma taxa.

   O código gerado segue o padrão EMV®: uma sequência de blocos
   "id + tamanho + conteúdo", terminada por um dígito verificador (CRC16).
   ========================================================================== */

window.PIX = (function () {
  "use strict";

  /* Cada bloco do código PIX tem: identificador (2 dígitos), tamanho do
     conteúdo (2 dígitos) e o conteúdo em si. */
  function bloco(id, valor) {
    var texto = String(valor);
    return id + String(texto.length).padStart(2, "0") + texto;
  }

  /* Dígito verificador do padrão (CRC-16/CCITT-FALSE). */
  function crc16(texto) {
    var crc = 0xFFFF;
    for (var i = 0; i < texto.length; i++) {
      crc ^= texto.charCodeAt(i) << 8;
      for (var j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  /* O padrão aceita apenas caracteres simples no nome e na cidade:
     tiramos acentos e símbolos, e respeitamos os limites de tamanho. */
  function limpar(texto, limite) {
    return String(texto || "")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")  // remove acentos
      .replace(/[^A-Za-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase()
      .slice(0, limite);
  }

  /* Identificador da transação: só letras e números, até 25 caracteres.
     Serve para o casal reconhecer o presente no extrato. */
  function limparTxid(texto) {
    var t = String(texto || "")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, 25);
    return t || "***";
  }

  /* Monta o código completo.
     dados = { chave, nome, cidade, valor, txid } */
  function montar(dados) {
    if (!dados || !dados.chave) return "";

    var chave = String(dados.chave).trim();
    var nome = limpar(dados.nome, 25) || "RECEBEDOR";
    var cidade = limpar(dados.cidade, 15) || "BRASIL";

    // Conta do recebedor: domínio fixo do PIX + a chave.
    var conta = bloco("00", "BR.GOV.BCB.PIX") + bloco("01", chave);

    var payload =
      bloco("00", "01") +                       // versão do padrão
      bloco("26", conta) +                      // dados do recebedor
      bloco("52", "0000") +                     // categoria (não se aplica)
      bloco("53", "986") +                      // moeda: real
      (dados.valor > 0 ? bloco("54", Number(dados.valor).toFixed(2)) : "") +
      bloco("58", "BR") +                       // país
      bloco("59", nome) +                       // nome do recebedor
      bloco("60", cidade) +                     // cidade do recebedor
      bloco("62", bloco("05", limparTxid(dados.txid)));  // identificador

    // O CRC é calculado sobre tudo, já incluindo "6304".
    var comCampoCrc = payload + "6304";
    return comCampoCrc + crc16(comCampoCrc);
  }

  /* Desenha o QR Code do código, como SVG, dentro do elemento indicado. */
  function desenharQr(elemento, codigo) {
    if (!elemento) return false;
    elemento.textContent = "";
    if (!codigo || typeof window.qrcode !== "function") return false;
    try {
      // 0 = escolhe sozinho o tamanho necessário; "M" = correção média,
      // recomendada para PIX.
      var qr = window.qrcode(0, "M");
      qr.addData(codigo);
      qr.make();
      elemento.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 8, scalable: true });
      var svg = elemento.querySelector("svg");
      if (svg) {
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "QR Code do PIX");
      }
      return true;
    } catch (e) {
      console.warn("Não consegui desenhar o QR Code:", e);
      return false;
    }
  }

  return { montar: montar, desenharQr: desenharQr, crc16: crc16 };
})();
