import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { wedding } from "@/lib/wedding-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const giftCopy = [
  { title: "🍷 Jantar romântico dos recém-casados", price: 200 },
  { title: "🥂 Experiência especial da lua de mel", price: 250 },
  { title: "🏨 Ajude com nossa hospedagem", price: 300 },
  { title: "🏖️ Passeio especial do casal", price: 350 },
  { title: "✈️ Ajude nas passagens", price: 400 },
  { title: "❤️ Uma diária especial da nossa lua de mel", price: 500 },
];

export function Gifts() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Gift | null>(null);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: gifts = [], isLoading } = useQuery({
    queryKey: ["gifts"],
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
  const usingDisplayFallback = storedGifts.length < giftCopy.length;

  const claim = useMutation({
    mutationFn: async ({ id, giver }: { id: string; giver: string }) => {
      const { data, error } = await supabase
        .from("gifts")
        .update({ claimed_by: giver.trim(), claimed_at: new Date().toISOString() })
        .eq("id", id)
        .is("claimed_at", null)
        .select("id");
      if (error) throw error;
      if (!data?.length) throw new Error("Presente indisponível");
    },

    onSuccess: () => {
      toast.success("Obrigado! Presente reservado com carinho.");
      setSelected(null);
      setName("");
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
    },
    onError: () => toast.error("Não foi possível reservar. Talvez alguém tenha escolhido antes."),
  });

  const copyPix = async () => {
    await navigator.clipboard.writeText(wedding.pixKey);
    setCopied(true);
    toast.success("Chave PIX copiada");
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="presentes" className="bg-blush/50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="eyebrow">Lista de presentes</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Presentear é opcional, sua presença é o essencial
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Se quiser nos presentear, escolha uma das cotas abaixo. O pagamento é feito via PIX
            direto para nós.
          </p>

          <button
            type="button"
            onClick={copyPix}
            className="mx-auto mt-6 flex items-center gap-2 border border-sage-deep px-6 py-3 text-[0.7rem] uppercase tracking-[0.2em] text-sage-deep transition-colors hover:bg-sage-deep hover:text-primary-foreground"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            Copiar chave PIX
          </button>
        </div>

        {isLoading ? (
          <p className="mt-14 text-center text-sm text-muted-foreground">Carregando presentes…</p>
        ) : (
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGifts.map((gift, index) => {
              const copy = giftCopy[index];
              const present = copy ? { ...gift, ...copy, description: null } : gift;

              return (
                <li key={gift.id} className="flex flex-col bg-background p-7">
                  <h3 className="font-serif text-2xl text-foreground">{present.title}</h3>
                  {present.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {present.description}
                    </p>
                  )}
                  <p className="mt-4 font-serif text-xl text-sage-deep">
                    {present.price ? brl(Number(present.price)) : "Valor livre"}
                  </p>
                  <div className="mt-6">
                    {usingDisplayFallback ? (
                      <button
                        type="button"
                        onClick={copyPix}
                        className="border border-sage-deep px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] text-sage-deep transition-colors hover:bg-sage-deep hover:text-primary-foreground"
                      >
                        Copiar chave PIX
                      </button>
                    ) : present.claimed_at ? (
                      <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                        Já presenteado
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelected(present)}
                        className="border border-sage-deep px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] text-sage-deep transition-colors hover:bg-sage-deep hover:text-primary-foreground"
                      >
                        Quero presentear
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{selected?.title}</DialogTitle>
            <DialogDescription>
              Escreva seu nome para reservarmos essa cota. Depois é só enviar o PIX para{" "}
              <strong>{wedding.pixKey}</strong>.
            </DialogDescription>
          </DialogHeader>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            aria-label="Seu nome"
          />

          <DialogFooter>
            <Button
              disabled={!name.trim() || claim.isPending}
              onClick={() => selected && claim.mutate({ id: selected.id, giver: name })}
            >
              {claim.isPending ? "Reservando…" : "Confirmar presente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
