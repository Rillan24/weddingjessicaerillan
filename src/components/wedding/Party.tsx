import { party, wedding } from "@/lib/wedding-data";

export function Party() {
  return (
    <section id="padrinhos" className="bg-blush/50 py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <p className="eyebrow">Ao nosso lado</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Padrinhos e madrinhas
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            As pessoas que seguram nossa mão desde muito antes do sim.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {party.map((p) => (
            <li key={p.name} className="text-center">
              <div className="mx-auto flex aspect-square w-full max-w-[9rem] items-center justify-center rounded-full bg-background">
                <span className="font-serif text-3xl text-sage-deep">
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <p className="mt-4 font-serif text-xl text-foreground">{p.name}</p>
              <p className="eyebrow mt-1">{p.role}</p>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center font-serif text-xl italic text-sage-deep">
          “{wedding.quote}”
        </p>
      </div>
    </section>
  );
}
