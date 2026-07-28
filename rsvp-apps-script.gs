/* ==========================================================================
   PLANILHA DO CASAMENTO — script para colar no Google Apps Script
   ==========================================================================
   Com isto, a planilha do Google recebe:
   · cada confirmação de presença (aba "RSVP");
   · cada aviso de presente pago (aba "Presentes").
   E, se você quiser, o site LÊ a planilha para marcar sozinho os presentes
   já conquistados.

   PASSO A PASSO (~5 minutos, só precisa fazer uma vez):

   1. Acesse sheets.google.com e crie uma planilha nova
      (ex.: "Casamento Carol e Lucas").

   2. Crie DUAS abas, com estes nomes exatos, nas guias lá embaixo:
      - "RSVP"
      - "Presentes"
      (Renomeie a aba "Página1" para RSVP e adicione a outra com o +.)

   3. Menu  Extensões → Apps Script. Apague o que estiver lá e cole TODO
      o conteúdo deste arquivo.

   4. Clique em  Implantar → Nova implantação.
      - No ícone de engrenagem, escolha "App da Web".
      - Em "Executar como": VOCÊ (sua conta).
      - Em "Quem pode acessar": "Qualquer pessoa".  ← importante!
      - Implantar e autorizar (o aviso de "app não verificado" é normal:
        o script é seu; clique em Avançado → Acessar projeto).

   5. Copie a "URL do app da Web" (termina em /exec) e cole no config.js,
      no campo:  rsvp: { ... googleSheetsUrl: "COLE_AQUI" ... }

   6. TESTE: envie uma confirmação pelo site e veja se a linha apareceu.

   --------------------------------------------------------------------------
   MARCANDO PRESENTES COMO CONQUISTADOS (opcional, mas prático)
   --------------------------------------------------------------------------
   Na aba "Presentes", o site grava cada aviso de pagamento. Mas quem manda
   de verdade é a coluna de CONFIRMAÇÃO — assim ninguém marca um presente
   como pago sem você conferir a entrada no banco:

   Na aba "Presentes", monte estas colunas a partir da coluna F:
      F1: NOME DO PRESENTE   G1: RECEBIDO (R$)
      F2: Jogo de panelas    G2: 890
      F3: Jogo de taças      G3: 240
      ... (um por linha, com o nome EXATAMENTE igual ao do config.js)

   Sempre que confirmar um PIX no seu banco, atualize o valor na coluna G.
   O site lê essa tabela sozinho e mostra "CONQUISTADO!" quando o valor
   alcança o total do item (valor × unidades).

   Se preferir não usar isso, basta editar o campo "recebido" de cada item
   no config.js — funciona igual.

   Se um dia editar este script, implante de novo:
   Implantar → Gerenciar implantações → editar (lápis) → Nova versão.
   ========================================================================== */

/* Recebe os envios do site (confirmações e avisos de presente). */
function doPost(e) {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var dados = JSON.parse(e.postData.contents);

  if (dados.tipo === "presente") {
    var abaP = planilha.getSheetByName("Presentes") || planilha.insertSheet("Presentes");
    abaP.appendRow([new Date(), dados.presente || "", dados.valor || 0]);
  } else {
    var abaR = planilha.getSheetByName("RSVP") || planilha.insertSheet("RSVP");
    abaR.appendRow([new Date(), dados.nome || "", dados.observacoes || ""]);
  }
  return ContentService.createTextOutput("ok");
}

/* Entrega ao site quanto já foi recebido de cada presente
   (lê as colunas F e G da aba "Presentes"). */
function doGet(e) {
  var resposta = { presentes: {} };
  try {
    var aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Presentes");
    if (aba) {
      var linhas = aba.getRange(2, 6, Math.max(1, aba.getLastRow() - 1), 2).getValues();
      linhas.forEach(function (linha) {
        var nome = String(linha[0] || "").trim();
        if (nome) resposta.presentes[nome] = Number(linha[1]) || 0;
      });
    }
  } catch (erro) {
    resposta.erro = String(erro);
  }
  return ContentService
    .createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON);
}
