import { MapPin, Clock, Shirt, Car } from "lucide-react";
import { wedding, timeline } from "@/lib/wedding-data";
import coupleDinner from "@/assets/couple-dinner.jpg.asset.json";

const details = [
  { icon: MapPin, label: "Local", value: `${wedding.venue} — ${wedding.venueAddress}` },
  { icon: Clock, label: "Horário", value: `${wedding.dateLabel}, às ${wedding.timeLabel}` },
  { icon: Shirt, label: "Traje", value: wedding.dressCode },
  { icon: Car, label: "Estacionamento", value: "Gratuito, com manobrista na entrada" },
];

export function Ceremony() {
  return (
    <>
      <section className="bg-cream py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-[0.8fr_1fr]">
          <img
            src={coupleDinner.url}
            alt="Jessica e Rillan em um jantar especial a dois"
            loading="lazy"
            className="mx-auto w-full max-w-sm object-contain"
          />
          <p className="text-center font-serif text-3xl italic leading-snug text-sage-deep md:text-left md:text-4xl">
            “Que a nossa história continue sendo escrita todos os dias, com você.”
          </p>
        </div>
      </section>


      <section id="cerimonia" className="bg-sage/40 py-28">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <p className="eyebrow">Cerimônia e festa</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Onde tudo vai acontecer
            </h2>
          </div>

          <div className="mt-14 bg-background p-8 md:p-12">
            <ul className="grid gap-8 sm:grid-cols-2">
              {details.map((d) => (
                <li key={d.label} className="flex gap-4">
                  <d.icon className="mt-1 size-4 shrink-0 text-sage-deep" />
                  <div>
                    <p className="eyebrow">{d.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.value}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 text-center">
              <a
                href={wedding.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-sage-deep px-7 py-3 text-[0.7rem] uppercase tracking-[0.24em] text-sage-deep transition-colors hover:bg-sage-deep hover:text-primary-foreground"
              >
                Ver no mapa
              </a>
            </div>
          </div>
        </div>
      </section>


      <section id="programacao" className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <p className="eyebrow">Programação do dia</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Nosso cronograma</h2>
          </div>

          <ol className="mt-14 border-l border-border pl-8">
            {timeline.map((t) => (
              <li key={t.time} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[38px] top-1 size-2 rounded-full bg-sage-deep" />
                <p className="eyebrow">{t.time}</p>
                <h3 className="mt-1 font-serif text-2xl text-foreground">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
