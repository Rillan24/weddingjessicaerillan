import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Rsvp() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [attending, setAttending] = useState("sim");
  const [guests, setGuests] = useState("0");
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const submit = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("rsvps").insert({
        name: name.trim(),
        contact: contact.trim() || null,
        attending: attending === "sim",
        guests: Number(guests) || 0,
        dietary: dietary.trim() || null,
        message: message.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setDone(true);
      toast.success("Confirmação enviada. Obrigado!");
    },
    onError: () => toast.error("Não conseguimos enviar sua confirmação. Tente novamente."),
  });

  return (
    <section id="confirmar" className="bg-sage/40 py-24">
      <div className="mx-auto max-w-2xl px-5">
        <div className="text-center">
          <p className="eyebrow">Confirmação de presença</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Você vem celebrar com a gente?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            Sua confirmação antecipada nos ajuda a cuidar de cada detalhe.
          </p>
        </div>

        {done ? (
          <div className="mt-12 bg-background p-10 text-center">
            <p className="font-serif text-2xl text-sage-deep">Recebemos sua resposta!</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Obrigado, {name.split(" ")[0]}. Qualquer mudança, é só nos avisar.
            </p>
          </div>
        ) : (
          <form
            className="mt-12 space-y-6 bg-background p-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) {
                toast.error("Informe seu nome");
                return;
              }
              submit.mutate();
            }}

          >
            <div className="space-y-2">
              <Label htmlFor="rsvp-name">Nome completo</Label>
              <Input id="rsvp-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rsvp-contact">E-mail ou telefone</Label>
              <Input
                id="rsvp-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Para avisarmos de qualquer novidade"
              />
            </div>

            <div className="space-y-3">
              <Label>Você vai comparecer?</Label>
              <RadioGroup value={attending} onValueChange={setAttending} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="sim" id="rsvp-sim" />
                  <Label htmlFor="rsvp-sim" className="font-normal">
                    Sim, com alegria
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="nao" id="rsvp-nao" />
                  <Label htmlFor="rsvp-nao" className="font-normal">
                    Infelizmente não
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {attending === "sim" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rsvp-guests">Acompanhantes (além de você)</Label>
                  <Input
                    id="rsvp-guests"
                    type="number"
                    min={0}
                    max={1}
                    value={guests}
                    onChange={(e) => {
                      const value = e.target.value;
                      setGuests(
                        value === ""
                          ? ""
                          : String(Math.min(1, Math.max(0, Number(value) || 0))),
                      );
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rsvp-diet">Restrição alimentar</Label>
                  <Input
                    id="rsvp-diet"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="Vegetariano, sem glúten, alergias…"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="rsvp-message">Recado para os noivos</Label>
              <Textarea
                id="rsvp-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submit.isPending}>
              {submit.isPending ? "Enviando…" : "Enviar confirmação"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
