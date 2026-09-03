import { stays } from "@/lib/wedding-data";

export function Stay() {
  return (
    <section id="hospedagem" className="bg-sage/40 py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <p className="eyebrow">Hospedagem</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Onde ficar por perto
          </h2>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {stays.map((s) => (
            <li key={s.name} className="bg-background p-7">
              <h3 className="font-serif text-2xl text-foreground">{s.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block text-[0.7rem] uppercase tracking-[0.2em] text-sage-deep underline underline-offset-4"
              >
                Ver detalhes
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
