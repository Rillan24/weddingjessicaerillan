import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const title = "Confirmações — Jessica & Rillan";
const description = "Painel dos noivos com a lista de confirmações de presença do casamento.";

export const Route = createFileRoute("/admin")({
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
  component: AdminPage,
});

type Rsvp = {
  id: string;
  name: string;
  contact: string | null;
  attending: boolean;
  guests: number;
  dietary: string | null;
  message: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (checked && !session) navigate({ to: "/auth" });
  }, [checked, session, navigate]);

  const { data: rsvps = [], isLoading } = useQuery({
    queryKey: ["rsvps"],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Rsvp[];
    },
  });

  const going = rsvps.filter((r) => r.attending);
  const totalPeople = going.reduce((sum, r) => sum + 1 + (r.guests ?? 0), 0);

  const exportCsv = () => {
    const header = ["Nome", "Contato", "Vai", "Acompanhantes", "Restrição", "Recado", "Data"];
    const rows = rsvps.map((r) => [
      r.name,
      r.contact ?? "",
      r.attending ? "Sim" : "Não",
      String(r.guests ?? 0),
      r.dietary ?? "",
      (r.message ?? "").replace(/\n/g, " "),
      new Date(r.created_at).toLocaleString("pt-BR"),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "confirmacoes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!checked || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Área dos noivos</p>
            <h1 className="mt-2 font-serif text-4xl text-foreground">Confirmações</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportCsv} disabled={!rsvps.length}>
              Exportar CSV
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
            >
              Sair
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Respostas", value: rsvps.length },
            { label: "Confirmados", value: going.length },
            { label: "Total de pessoas", value: totalPeople },
          ].map((s) => (
            <div key={s.label} className="bg-sage/40 p-6">
              <p className="eyebrow">{s.label}</p>
              <p className="mt-2 font-serif text-3xl text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-x-auto">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando lista…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Vai?</TableHead>
                  <TableHead>Acomp.</TableHead>
                  <TableHead>Restrição</TableHead>
                  <TableHead>Recado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.contact ?? "—"}</TableCell>
                    <TableCell>{r.attending ? "Sim" : "Não"}</TableCell>
                    <TableCell>{r.guests}</TableCell>
                    <TableCell>{r.dietary ?? "—"}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.message ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Link to="/" className="mt-10 inline-block text-xs uppercase tracking-[0.16em] text-sage-deep">
          Voltar ao site
        </Link>
      </div>
    </main>
  );
}
