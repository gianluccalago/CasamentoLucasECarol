/* ==========================================================================
   RSVP → GOOGLE SHEETS — script para colar no Google Apps Script
   ==========================================================================
   Com isto, cada "Confirmar presença" do site vira uma linha na sua
   planilha do Google, com data/hora, nome, acompanhantes e observações.

   PASSO A PASSO (~5 minutos, só precisa fazer uma vez):

   1. Acesse sheets.google.com e crie uma planilha nova.
      Dê um nome (ex.: "RSVP Casamento") e escreva na primeira linha os
      títulos das colunas: A1 = Data/Hora · B1 = Nome ·
      C1 = Acompanhantes · D1 = Observações

   2. Na planilha, abra o menu  Extensões → Apps Script.
      Apague qualquer código que aparecer e cole TODO o conteúdo deste
      arquivo (só a função doPost lá do fim já basta, mas colar tudo
      não atrapalha — comentários são ignorados).

   3. Clique em  Implantar → Nova implantação.
      - No ícone de engrenagem, escolha o tipo "App da Web".
      - Em "Executar como", deixe VOCÊ (sua conta).
      - Em "Quem pode acessar", escolha "Qualquer pessoa".  ← importante!
      - Clique em Implantar e autorize com sua conta Google
        (o aviso de "app não verificado" é normal: é o SEU script;
        clique em Avançado → Acessar projeto).

   4. Copie a "URL do app da Web" (termina em /exec).

   5. Abra o config.js do site e cole essa URL no campo:
        rsvp: { ... googleSheetsUrl: "COLE_AQUI", ... }
      Salve, faça commit/deploy — pronto.

   6. TESTE: envie um RSVP pelo site e confira se a linha apareceu na
      planilha. (O site sempre mostra "Presença confirmada!" ao
      convidado; a prova real de que gravou é a linha na planilha.)

   Se um dia editar este script, é preciso implantar de novo
   (Implantar → Gerenciar implantações → editar → Nova versão).
   ========================================================================== */

function doPost(e) {
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dados = JSON.parse(e.postData.contents);
  planilha.appendRow([
    new Date(),
    dados.nome || "",
    dados.acompanhantes || 0,
    dados.observacoes || "",
  ]);
  return ContentService.createTextOutput("ok");
}
