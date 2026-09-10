import { createServerFn } from "@tanstack/react-start";

const STABLE_ORIGIN = "https://project--6629ddaf-e037-42d4-acfc-47b671d3cccd.lovable.app";
const ORIGIN_PATTERN = /^https?:\/\/(localhost:\d+|127\.0\.0\.1:\d+|[a-z0-9-]+\.lovable\.app|[a-z0-9-]+\.lovableproject\.com)$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const sanitize = (value: string) => value.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 120);

type CheckoutInput = {
  giftId: string;
  name: string;
  phone: string;
  origin?: string;
};

function validateCheckoutInput(input: CheckoutInput): CheckoutInput {
  const giftId = String(input?.giftId ?? "");
  const name = sanitize(String(input?.name ?? ""));
  const phone = sanitize(String(input?.phone ?? ""));
  const origin = typeof input?.origin === "string" ? input.origin : "";

  if (!UUID_PATTERN.test(giftId)) throw new Error("Presente inválido.");
  if (name.length < 3 || name.split(/\s+/).length < 2) {
    throw new Error("Informe seu nome completo.");
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) {
    throw new Error("Informe um telefone válido com DDD.");
  }

  return { giftId, name, phone, origin };
}

export const createGiftCheckout = createServerFn({ method: "POST" })
  .inputValidator(validateCheckoutInput)
  .handler(async ({ data }) => {
    const accessToken = process.env["MP_ACCESS_TOKEN"];
    if (!accessToken) {
      return { ok: false as const, error: "PAGAMENTO_INDISPONIVEL" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: gift, error: giftError } = await supabaseAdmin
      .from("gifts")
      .select("id, title, price, claimed_at")
      .eq("id", data.giftId)
      .maybeSingle();

    if (giftError || !gift) throw new Error("Presente não encontrado.");
    if (gift.claimed_at) throw new Error("Este presente já foi presenteado.");

    const amount = Number(gift.price ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Este presente não possui valor definido.");
    }

    // Limite simples de abuso: no máximo 5 tentativas por telefone a cada 10 minutos.
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("gift_payments")
      .select("id", { count: "exact", head: true })
      .eq("giver_phone", data.phone)
      .gte("created_at", since);

    if ((count ?? 0) >= 5) {
      throw new Error("Muitas tentativas seguidas. Tente novamente em alguns minutos.");
    }

    const { data: record, error: recordError } = await supabaseAdmin
      .from("gift_payments")
      .insert({
        gift_id: gift.id,
        giver_name: data.name,
        giver_phone: data.phone,
        amount,
        status: "pending",
      })
      .select("id")
      .single();

    if (recordError || !record) throw new Error("Não foi possível iniciar o pagamento.");

    const origin =
      data.origin && ORIGIN_PATTERN.test(data.origin) ? data.origin : STABLE_ORIGIN;
    const backUrl = `${origin}/presente/retorno?ref=${record.id}`;

    const phoneDigits = data.phone.replace(/\D/g, "");
    const [firstName, ...rest] = data.name.split(/\s+/);

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": record.id,
      },
      body: JSON.stringify({
        items: [
          {
            id: gift.id,
            title: gift.title,
            description: "Presente de casamento — Jessica & Rillan",
            quantity: 1,
            currency_id: "BRL",
            unit_price: amount,
          },
        ],
        payer: {
          name: firstName,
          surname: rest.join(" ") || firstName,
          phone: {
            area_code: phoneDigits.slice(-11, -9) || phoneDigits.slice(0, 2),
            number: phoneDigits.slice(-9),
          },
        },
        payment_methods: {
          installments: 12,
          excluded_payment_types: [{ id: "ticket" }],
        },
        back_urls: {
          success: `${backUrl}&status=success`,
          pending: `${backUrl}&status=pending`,
          failure: `${backUrl}&status=failure`,
        },
        auto_return: "approved",
        external_reference: record.id,
        notification_url: `${STABLE_ORIGIN}/api/public/mercadopago-webhook`,
        statement_descriptor: "CASAMENTOJR",
      }),
    });

    if (!response.ok) {
      console.error("Mercado Pago preference failed", response.status);
      await supabaseAdmin
        .from("gift_payments")
        .update({ status: "error", updated_at: new Date().toISOString() })
        .eq("id", record.id);
      throw new Error("Não foi possível abrir o pagamento agora. Tente novamente.");
    }

    const preference = (await response.json()) as {
      id?: string;
      init_point?: string;
      sandbox_init_point?: string;
    };

    await supabaseAdmin
      .from("gift_payments")
      .update({ preference_id: preference.id ?? null, updated_at: new Date().toISOString() })
      .eq("id", record.id);

    const checkoutUrl = preference.init_point ?? preference.sandbox_init_point;
    if (!checkoutUrl) throw new Error("Não foi possível abrir o pagamento agora.");

    return { ok: true as const, checkoutUrl, reference: record.id };
  });

export const getGiftPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { reference: string }) => {
    const reference = String(input?.reference ?? "");
    if (!UUID_PATTERN.test(reference)) throw new Error("Referência inválida.");
    return { reference };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: record } = await supabaseAdmin
      .from("gift_payments")
      .select("status, amount, gift_id, gifts(title)")
      .eq("id", data.reference)
      .maybeSingle();

    if (!record) return { status: "unknown" as const, giftTitle: null, amount: null };

    const gift = record.gifts as unknown as { title: string } | null;
    return {
      status: record.status,
      giftTitle: gift?.title ?? null,
      amount: Number(record.amount ?? 0),
    };
  });
