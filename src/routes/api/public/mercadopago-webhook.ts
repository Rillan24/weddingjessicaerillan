import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

function verifySignature(request: Request, dataId: string): boolean {
  const secret = process.env["MP_WEBHOOK_SECRET"];
  if (!secret) return true; // sem secret configurado, seguimos apenas com a consulta na API

  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id") ?? "";
  if (!signature) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, ...value] = part.split("=");
      return [(key ?? "").trim(), value.join("=").trim()];
    }),
  ) as Record<string, string>;

  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/mercadopago-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const accessToken = process.env["MP_ACCESS_TOKEN"];
        if (!accessToken) return new Response("ok", { status: 200 });

        let payload: {
          type?: string;
          topic?: string;
          action?: string;
          data?: { id?: string | number };
        };
        try {
          payload = (await request.json()) as typeof payload;
        } catch {
          return new Response("ok", { status: 200 });
        }

        const kind = payload.type ?? payload.topic ?? "";
        const paymentId = payload.data?.id ? String(payload.data.id) : "";
        if (kind !== "payment" || !paymentId) return new Response("ok", { status: 200 });

        if (!verifySignature(request, paymentId)) {
          return new Response("invalid signature", { status: 401 });
        }

        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { authorization: `Bearer ${accessToken}` },
        });
        if (!mpResponse.ok) {
          console.error("Mercado Pago payment lookup failed", mpResponse.status);
          return new Response("retry", { status: 500 });
        }

        const payment = (await mpResponse.json()) as {
          status?: string;
          external_reference?: string;
          transaction_amount?: number;
        };

        const reference = payment.external_reference ?? "";
        if (!reference) return new Response("ok", { status: 200 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: record } = await supabaseAdmin
          .from("gift_payments")
          .select("id, gift_id, giver_name, giver_phone, status")
          .eq("id", reference)
          .maybeSingle();

        if (!record) return new Response("ok", { status: 200 });

        const status = payment.status ?? "pending";

        if (record.status === "approved") {
          return new Response("ok", { status: 200 }); // idempotente
        }

        await supabaseAdmin
          .from("gift_payments")
          .update({
            status,
            payment_id: paymentId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", record.id);

        if (status === "approved") {
          await supabaseAdmin
            .from("gifts")
            .update({
              claimed_by: `${record.giver_name} · ${record.giver_phone}`,
              claimed_at: new Date().toISOString(),
            })
            .eq("id", record.gift_id)
            .is("claimed_at", null);
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
