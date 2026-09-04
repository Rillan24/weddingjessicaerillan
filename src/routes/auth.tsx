import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { wedding } from "@/lib/wedding-data";

const title = "Área dos noivos — Jessica & Rillan";
const description = "Acesso restrito para acompanhar as confirmações de presença do casamento.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode entrar.");
        setMode("login");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { lovable } = await import("@/integrations/lovable/index");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não foi possível entrar com o Google");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-blush/50 px-5 py-16">
      <div className="w-full max-w-md bg-background p-10">
        <Link to="/" className="font-serif text-lg tracking-[0.3em] text-sage-deep">
          {wedding.monogram}
        </Link>
        <h1 className="mt-6 font-serif text-3xl text-foreground">Área dos noivos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Entre para ver a lista de confirmações."
            : "Crie sua conta de acesso."}
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <Button variant="outline" className="mt-3 w-full" onClick={signInWithGoogle}>
          Entrar com Google
        </Button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-sage-deep"
        >
          {mode === "login" ? "Criar uma conta" : "Já tenho conta"}
        </button>
      </div>
    </main>
  );
}
