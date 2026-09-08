// ==========================================================================
// FUNÇÃO: criar-checkout
// --------------------------------------------------------------------------
// Só é usada por quem escolhe PAGAR PARCELADO NO CARTÃO. Quem paga por PIX
// não passa por aqui: o QR Code é gerado no próprio navegador e o dinheiro
// vai direto para a conta do casal, sem taxa e sem intermediário.
//
// Aqui criamos uma "preferência de pagamento" no Mercado Pago e devolvemos
// o endereço do checkout dele, onde o convidado escolhe o cartão e o número
// de parcelas.
//
// O token do Mercado Pago vive SÓ aqui, no servidor. Nunca chega ao
// navegador do convidado.
//
// Segredos necessários (Supabase → Edge Functions → Secrets):
//   MP_ACCESS_TOKEN   — token de produção do Mercado Pago
//   SITE_URL          — endereço do site (ex.: https://casamento.onrender.com)
// (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já existem por padrão.)
// ==========================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function responder(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return responder({ erro: "Método não permitido" }, 405);

  try {
    const { presenteId, valor, nome, email, mensagem } = await req.json();

    if (!presenteId || typeof valor !== "number" || !(valor > 0)) {
      return responder({ erro: "Presente ou valor inválido." }, 400);
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return responder({ erro: "Informe um e-mail válido para o comprovante." }, 400);
    }

    // Cliente com a chave secreta: enxerga e escreve nas tabelas protegidas.
    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // O valor NUNCA é aceito às cegas: conferimos contra o preço real do
    // presente e contra o quanto ainda falta para ele ser conquistado.
    const { data: presente, error: erroPresente } = await db
      .from("presentes")
      .select("id, nome, valor, unidades, recebido, ativo")
      .eq("id", presenteId)
      .single();

    if (erroPresente || !presente || !presente.ativo) {
      return responder({ erro: "Presente não encontrado." }, 404);
    }

    const alvo = Number(presente.valor) * Number(presente.unidades);
    const falta = Math.max(0, alvo - Number(presente.recebido));
    if (falta <= 0) {
      return responder({ erro: "Este presente já foi conquistado. Obrigado!" }, 409);
    }

    const centavos = Math.round(valor * 100);
    if (centavos < 500) {
      return responder({ erro: "O valor mínimo é R$ 5,00." }, 400);
    }
    if (centavos > Math.round(falta * 100)) {
      return responder(
        { erro: `Falta apenas R$ ${falta.toFixed(2)} para este presente.`, falta },
        400,
      );
    }
    const valorFinal = centavos / 100;

    // Registra a intenção como PENDENTE. Só o webhook a torna aprovada.
    const { data: contribuicao, error: erroContrib } = await db
      .from("contribuicoes")
      .insert({
        presente_id: presente.id,
        valor: valorFinal,
        nome: (nome || "").slice(0, 120) || null,
        email: email.slice(0, 160),
        mensagem: (mensagem || "").slice(0, 1000) || null,
        forma: "cartao",
        status: "pendente",
      })
      .select("id")
      .single();

    if (erroContrib || !contribuicao) {
      console.error("Falha ao registrar contribuição:", erroContrib);
      return responder({ erro: "Não foi possível iniciar o pagamento." }, 500);
    }

    const site = (Deno.env.get("SITE_URL") || "").replace(/\/+$/, "");

    // Preferência de pagamento: é o "carrinho" que o Mercado Pago abre.
    const resposta = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}`,
        "Content-Type": "application/json",
        // Evita cobrança duplicada se a chamada for repetida.
        "X-Idempotency-Key": contribuicao.id,
      },
      body: JSON.stringify({
        items: [{
          id: presente.id,
          title: `Presente de casamento — ${presente.nome}`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: valorFinal,
        }],
        payer: { name: (nome || "Convidado").slice(0, 60), email },
        external_reference: contribuicao.id,
        notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mp-webhook`,
        statement_descriptor: "CASAMENTO",
        // Esta rota é a do cartão parcelado; quem quer PIX usa o QR Code
        // do site, sem taxa. Por isso excluímos o PIX daqui.
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }, { id: "bank_transfer" }],
          installments: 12,
        },
        back_urls: site
          ? { success: `${site}/#presentes`, pending: `${site}/#presentes`, failure: `${site}/#presentes` }
          : undefined,
        auto_return: site ? "approved" : undefined,
      }),
    });

    const preferencia = await resposta.json();

    if (!resposta.ok || !preferencia.init_point) {
      console.error("Mercado Pago recusou a preferência:", preferencia);
      await db.from("contribuicoes").update({ status: "recusado" }).eq("id", contribuicao.id);
      return responder({ erro: "O Mercado Pago não conseguiu abrir o pagamento agora." }, 502);
    }

    await db
      .from("contribuicoes")
      .update({ mp_preference_id: String(preferencia.id) })
      .eq("id", contribuicao.id);

    return responder({
      contribuicaoId: contribuicao.id,
      valor: valorFinal,
      urlPagamento: preferencia.init_point,
    });
  } catch (erro) {
    console.error("Erro inesperado em criar-checkout:", erro);
    return responder({ erro: "Erro inesperado ao abrir o pagamento." }, 500);
  }
});
