// ==========================================================================
// FUNÇÃO: mp-webhook
// --------------------------------------------------------------------------
// O Mercado Pago chama esta função sempre que um pagamento muda de estado.
// Aqui a gente confere se o PIX caiu de verdade e, se caiu, marca a
// contribuição como aprovada — o que faz o presente aparecer como
// CONQUISTADO no site, sozinho.
//
// IMPORTANTE: nunca confiamos no que a notificação diz. Ela só avisa "o
// pagamento X mudou"; nós consultamos o Mercado Pago para saber o estado
// real, usando nosso token.
//
// Segredos necessários:
//   MP_ACCESS_TOKEN     — token de produção do Mercado Pago
//   MP_WEBHOOK_SECRET   — "chave secreta" gerada no painel do Mercado Pago
//
// ATENÇÃO ao publicar esta função: ela precisa ser pública (sem exigir
// login), porque quem chama é o Mercado Pago. Use --no-verify-jwt.
// ==========================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

/* Confere a assinatura que o Mercado Pago envia no cabeçalho x-signature.
   O manifesto assinado tem o formato:
     id:<data.id>;request-id:<x-request-id>;ts:<ts>;
   e é assinado com HMAC-SHA256 usando a chave secreta da sua aplicação. */
async function assinaturaConfere(req: Request, dataId: string): Promise<boolean> {
  const segredo = Deno.env.get("MP_WEBHOOK_SECRET");
  if (!segredo) return false;

  const assinatura = req.headers.get("x-signature") ?? "";
  const requestId = req.headers.get("x-request-id") ?? "";

  const partes: Record<string, string> = {};
  for (const pedaco of assinatura.split(",")) {
    const [chave, valor] = pedaco.split("=", 2);
    if (chave && valor) partes[chave.trim()] = valor.trim();
  }
  const ts = partes["ts"];
  const v1 = partes["v1"];
  if (!ts || !v1) return false;

  const manifesto = `id:${dataId};request-id:${requestId};ts:${ts};`;

  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(segredo),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const assinado = await crypto.subtle.sign("HMAC", chave, new TextEncoder().encode(manifesto));
  const esperado = Array.from(new Uint8Array(assinado))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Comparação de tempo constante, para não vazar pistas sobre a chave.
  if (esperado.length !== v1.length) return false;
  let diferenca = 0;
  for (let i = 0; i < esperado.length; i++) diferenca |= esperado.charCodeAt(i) ^ v1.charCodeAt(i);
  return diferenca === 0;
}

Deno.serve(async (req) => {
  // Respondemos 200 mesmo em erro nosso: o Mercado Pago reenvia a
  // notificação quando recebe erro, e não queremos filas de reenvio por
  // causa de um problema que não é dele.
  const ok = () => new Response("ok", { status: 200 });

  try {
    if (req.method !== "POST") return ok();

    const corpo = await req.json().catch(() => ({}));
    const url = new URL(req.url);

    // O id do pagamento chega no corpo ou na query, dependendo do formato.
    const dataId = String(
      corpo?.data?.id ?? corpo?.resource?.split?.("/")?.pop?.() ?? url.searchParams.get("data.id") ??
        url.searchParams.get("id") ?? "",
    );
    const tipo = String(corpo?.type ?? url.searchParams.get("topic") ?? "");

    if (!dataId) return ok();
    if (tipo && tipo !== "payment") return ok(); // só nos interessam pagamentos

    if (!(await assinaturaConfere(req, dataId))) {
      console.warn("Assinatura inválida — notificação ignorada.", { dataId });
      return new Response("assinatura invalida", { status: 401 });
    }

    // Estado real do pagamento, direto na fonte.
    const consulta = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      headers: { "Authorization": `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}` },
    });
    if (!consulta.ok) {
      console.error("Não consegui consultar o pagamento:", dataId, await consulta.text());
      return ok();
    }
    const pagamento = await consulta.json();

    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const contribuicaoId = pagamento.external_reference;
    if (!contribuicaoId) return ok();

    const situacao = String(pagamento.status);
    const novoStatus = situacao === "approved"
      ? "aprovado"
      : ["rejected", "cancelled", "refunded", "charged_back"].includes(situacao)
      ? "recusado"
      : situacao === "expired"
      ? "expirado"
      : "pendente";

    // Confere se o valor pago bate com o combinado (protege contra
    // adulteração do valor no caminho).
    const { data: registro } = await db
      .from("contribuicoes")
      .select("id, valor, status")
      .eq("id", contribuicaoId)
      .single();

    if (!registro) return ok();
    if (registro.status === "aprovado") return ok(); // já contabilizado

    if (novoStatus === "aprovado") {
      const pago = Number(pagamento.transaction_amount);
      if (Math.round(pago * 100) !== Math.round(Number(registro.valor) * 100)) {
        console.warn("Valor pago diferente do registrado — não aprovado.", {
          contribuicaoId,
          pago,
          esperado: registro.valor,
        });
        return ok();
      }
    }

    await db
      .from("contribuicoes")
      .update({
        status: novoStatus,
        mp_payment_id: String(pagamento.id),
        pago_em: novoStatus === "aprovado" ? new Date().toISOString() : null,
      })
      .eq("id", contribuicaoId);

    // O gatilho do banco atualiza sozinho o total recebido do presente.
    return ok();
  } catch (erro) {
    console.error("Erro inesperado no webhook:", erro);
    return ok();
  }
});
