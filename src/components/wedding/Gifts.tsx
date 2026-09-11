import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createGiftCheckout } from "@/lib/mercadopago.functions";
import { pixDetails } from "@/lib/wedding-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PixQr } from "./PixQr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Gift = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  claimed_at: string | null;
};

type GiftCopy = {
  order: number;
  badge?: string;
  title: string;
  price: number;
};

const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const giftCopy: GiftCopy[] = [
  { order: 1, badge: "⭐", title: "✈️ Uma experiência para a nossa Lua de Mel", price: 500 },
  { order: 2, title: "🍟 Air Fryer para nossa casa", price: 320 },
  { order: 3, badge: "💝", title: "🛋️ Um detalhe especial para o nosso sofá", price: 450 },
  { order: 4, title: "🍳 Jogo de panelas premium", price: 370 },
  { order: 5, title: "🏨 Uma diária especial na Lua de Mel", price: 500 },
  { order: 6, title: "🛏️ Edredom + enxoval do casal", price: 380 },
  { order: 7, badge: "⭐", title: "🍽️ Aparelho de jantar completo", price: 420 },
  { order: 8, title: "☕ Cafeteira para nossos cafés juntos", price: 250 },
  { order: 9, title: "🧺 Nossa máquina de lavar", price: 430 },
  { order: 10, title: "🍷 Jantar romântico dos recém-casados", price: 350 },
  { order: 11, title: "📺 Um novo capítulo para a nossa sala", price: 480 },
  { order: 12, title: "🍲 Panela de pressão elétrica", price: 350 },
  { order: 13, badge: "💝", title: "🏠 Um toque especial para o nosso lar", price: 400 },
  { order: 14, title: "🍽️ Jogo de jantar para nossa casa", price: 230 },
  { order: 15, title: "🍖 Churrasqueira para nossa casa", price: 390 },
  { order: 16, title: "🧹 Aspirador de pó", price: 330 },
  { order: 17, badge: "⭐", title: "❤️ Presente especial para os noivos", price: 500 },
  { order: 18, title: "🛏️ Jogo de cama premium", price: 280 },
  { order: 19, title: "🪑 Mesa de jantar para a nossa casa", price: 400 },
  { order: 20, title: "🥂 Kit de taças para momentos especiais", price: 200 },
  { order: 21, title: "❄️ Um novo conforto para a nossa cozinha", price: 450 },
  { order: 22, title: "🥤 Liquidificador para nossa cozinha", price: 300 }, { order: 23, title: "🧪 Experiência de teste", price: 1 },
];

export function Gifts() {
  const [selected, setSelected] = useState<Gift | null>(null);
  const [name, setName] = useState("");
  const [giverPhone, setGiverPhone] = useState("");
  const [step, setStep] = useState<"details" | "pix">("details");
  const [pixFallback, setPixFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: gifts = [], isLoading } = useQuery({
    queryKey: ["gifts"],
    refetchInterval: 15000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gifts")
        .select("id, title, description, price, claimed_at")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Gift[];
    },
  });

  const storedGifts = Array.isArray(gifts) ? gifts : [];
  const visibleGifts: Gift[] = giftCopy.map((copy, index) => ({
    id: storedGifts[index]?.id ?? "display-" + copy.price + "-" + index,
    title: copy.title,
    description: null,
    price: copy.price,
    claimed_at: storedGifts[index]?.claimed_at ?? null,
  }));

  const checkout = useMutation({
    mutationFn: async ({ giftId, buyerName, phone }: { giftId: string; buyerName: string; phone: string }) => {
      const result = await createGiftCheckout({
        data: {
          giftId,
          name: buyerName.trim(),
          phone: phone.trim(),
          origin: window.location.origin,
        },
      });
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      window.location.assign(result.checkoutUrl);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Não foi possível abrir o pagamento.";
      if (message === "PAGAMENTO_INDISPONIVEL") {
        setPixFallback(true);
        setStep("pix");
        toast.error("O checkout online está temporariamente indisponível. Você pode usar o PIX direto abaixo.");
      } else {
        toast.error(message);
      }
    },
  });

  const resetDialog = () => {
    setSelected(null);
    setName("");
    setGiverPhone("");
    setStep("details");
    setPixFallback(false);
    setCopied(false);
  };

  const openGift = (gift: Gift) => {
    setSelected(gift);
    setName("");
    setGiverPhone("");
    setStep("details");
    setPixFallback(false);
    setCopied(false);
  };

  const continueToPayment = () => {
    if (!selected) return;
    if (!name.trim() || !giverPhone.trim()) {
      toast.error("Informe seu nome e telefone para continuar.");
      return;
    }
    if (selected.id.startsWith("display-")) {
      toast.error("Este presente ainda não está disponível para checkout.");
      return;
    }
    checkout.mutate({ giftId: selected.id, buyerName: name, phone: giverPhone });
  };

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixDetails.key);
      setCopied(true);
      toast.success("Chave PIX copiada");
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Copie a chave PIX exibida na tela.");
    }
  };

  return (
    <section id="presentes" className="bg-blush/50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="eyebrow">Lista de presentes</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Presentear é opcional, sua presença é o essencial
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-foreground/80 md:text-lg">
            Se quiser celebrar conosco de uma forma especial, escolha uma das experiências abaixo. Você pode presentear via PIX ou cartão de crédito em até 4x, conforme as opções exibidas no checkout.
          </p>
        </div>

        {isLoading ? (
          <p className="mt-14 text-center text-sm text-muted-foreground">Carregando presentes…</p>
        ) : (
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGifts.map((gift, index) => {
              const copy = giftCopy[index];
              if (!copy) return null;
              return (
                <li key={gift.id} className="press flex flex-col rounded-[1.5rem] border border-border/70 bg-background p-7 shadow-[0_20px_55px_-38px_rgba(30,47,38,0.7)]">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>{String(copy.order).padStart(2, "0")}</span>
                    {copy.badge && <span className="text-base tracking-normal">{copy.badge}</span>}
                  </div>
                  <h3 className="mt-5 font-serif text-2xl leading-tight text-foreground">{copy.title}</h3>
                  <p className="mt-4 font-serif text-xl text-sage-deep">{brl(copy.price)}</p>
                  <div className="mt-6">
                    {gift.claimed_at ? (
                      <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">Já presenteado</p>
                    ) : (
                      <button type="button" onClick={() => openGift({ ...gift, title: copy.title, price: copy.price })} className="press min-h-11 rounded-full border border-sage-deep px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] text-sage-deep hover:bg-sage-deep hover:text-primary-foreground">
                        Escolher esta opção
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && resetDialog()}>
        <DialogContent className="max-w-lg">
          {step === "details" && selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Um presente com carinho</DialogTitle>
                <DialogDescription>
                  Informe seu nome e telefone para abrir o pagamento seguro. Você pode escolher PIX ou cartão de crédito, com parcelamento em até 4x.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" aria-label="Seu nome" autoFocus required />
                <Input value={giverPhone} onChange={(event) => setGiverPhone(event.target.value)} placeholder="Seu telefone" aria-label="Seu telefone" type="tel" required />
              </div>
              <DialogFooter>
                <Button disabled={!name.trim() || !giverPhone.trim() || checkout.isPending} onClick={continueToPayment}>
                  {checkout.isPending ? "Abrindo Mercado Pago…" : "Pagar com Mercado Pago"}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "pix" && selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">PIX direto</DialogTitle>
                <DialogDescription>
                  {pixFallback ? "O checkout online está indisponível neste momento. Se preferir, use os dados abaixo para realizar o PIX." : "Você pode realizar o PIX diretamente pelos dados abaixo."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 rounded-2xl border border-sage/60 bg-sage/10 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
                <PixQr amount={Number(selected.price)} />
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div><p className="text-xs uppercase tracking-[0.18em] text-sage-deep">Chave PIX</p><p className="mt-1 break-all font-medium text-foreground">{pixDetails.key}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.18em] text-sage-deep">Recebedor</p><p className="mt-1 font-medium text-foreground">{pixDetails.recipient}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.18em] text-sage-deep">Banco</p><p className="mt-1 font-medium text-foreground">{pixDetails.bank}</p></div>
                  <Button type="button" variant="outline" onClick={copyPix}>
                    {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
                    Copiar chave PIX
                  </Button>
                </div>
              </div>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">A confirmação automática do presente ocorre quando o pagamento é feito pelo checkout do Mercado Pago. No PIX direto, guarde o comprovante.</p>
              <DialogFooter><Button variant="outline" onClick={resetDialog}>Fechar</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
