import { supabase } from "@/integrations/supabase/client";

type CheckoutInput = { giftId: string; name: string; phone: string; origin?: string };

async function invoke(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("mercadopago", { body });
  if (error) throw new Error("Não foi possível conectar ao pagamento agora.");
  return data;
}

export async function createGiftCheckout({ data }: { data: CheckoutInput }) {
  return invoke({ action: "checkout", giftId: data.giftId, name: data.name, phone: data.phone, origin: data.origin });
}

export async function getGiftPaymentStatus({ data }: { data: { reference: string } }) {
  return invoke({ action: "status", reference: data.reference });
}
