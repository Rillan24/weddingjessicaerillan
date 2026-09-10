import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { getGiftPaymentStatus } from "@/lib/mercadopago.functions";

export const Route = createFileRoute("/presente/retorno")({
  component: PaymentReturn,
});

type ViewState = "loading" | "approved" | "pending" | "failed" | "unknown";

function PaymentReturn() {
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [giftTitle, setGiftTitle] = useState<string | null>(null);

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("ref");
    if (!reference) {
      setViewState("unknown");
      return;
    }

    getGiftPaymentStatus({ data: { reference } })
      .then((result) => {
        setGiftTitle(result.giftTitle);
        if (result.status === "approved") setViewState("approved");
        else if (result.status === "pending") setViewState("pending");
        else if (result.status === "unknown") setViewState("unknown");
        else setViewState("failed");
      })
      .catch(() => setViewState("unknown"));
  }, []);

  const title =
    viewState === "approved"
      ? "Obrigado por esse carinho!"
      : viewState === "pending"
        ? "Pagamento em análise"
        : viewState === "loading"
          ? "Confirmando seu presente…"
          : "Vamos conferir seu pagamento";

  const message =
    viewState === "approved"
      ? (giftTitle ? "Seu presente — " + giftTitle + " — " : "Seu presente ") + "foi aceito com muito carinho. Vocês já fazem parte da nossa história! 😍🥰"
      : viewState === "pending"
        ? "O Mercado Pago ainda está processando o pagamento. Assim que ele for aprovado, o presente será confirmado automaticamente."
        : viewState === "loading"
          ? "Só um instante: estamos verificando a confirmação com segurança."
          : "Não conseguimos confirmar este pagamento agora. Se o valor já foi debitado, guarde o comprovante e fale conosco.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <section className="w-full max-w-lg rounded-[2rem] border border-border/70 bg-card p-8 text-center shadow-[0_25px_80px_-40px_rgba(30,47,38,0.65)] sm:p-12">
        {viewState === "approved" ? (
          <Heart className="mx-auto size-14 fill-current text-sage-deep" />
        ) : (
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage/15 text-2xl">♡</div>
        )}
        <h1 className="mt-6 font-serif text-4xl text-foreground">{title}</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">{message}</p>
        {viewState !== "loading" && (
          <a href="/" className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-sage-deep px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90">Voltar ao convite</a>
        )}
      </section>
    </main>
  );
}
