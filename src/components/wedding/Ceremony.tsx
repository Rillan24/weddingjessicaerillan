import { MapPin, Clock, Shirt, Car } from "lucide-react";
import { wedding, timeline } from "@/lib/wedding-data";
import coupleDinner from "@/assets/couple-dinner.jpg.asset.json";
import { Reveal } from "./Reveal";
import { assetUrl } from "@/lib/asset-url";

const details = [
  { icon: MapPin, label: "Local", value: wedding.venueAddress },
  { icon: Clock, label: "Horário", value: wedding.dateLabel + ", às " + wedding.timeLabel },
  { icon: Shirt, label: "Traje", value: wedding.dressCode },
  { icon: Car, label: "Estacionamento", value: wedding.parkingInfo },
];

export function Ceremony() {
  return (
    <>
      <section className="bg-cream py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-[0.8fr_1fr]">
          <Reveal>
            <div className="surface mx-auto w-full max-w-sm overflow-hidden p-2">
              <img
                src={assetUrl(coupleDinner.url)}
                alt="Jessica e Rillan em um jantar especial a dois"
                loading="lazy"
                className="w-full rounded-[0.9rem] object-contain"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-center font-serif text-3xl italic leading-snug text-sage-deep md:text-left md:text-4xl">
              “Assim, eles já não são dois, mas uma só carne.” — Mateus 19:6
            </p>
          </Reveal>
        </div>
      </section>

      <section id="cerimonia" className="bg-sage/40 py-24 md:py-28">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal className="text-center">
            <p className="eyebrow">Cerimônia e recepção</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Onde tudo vai acontecer
            </h2>
            <div className="rule-soft mx-auto mt-6 w-24" />
          </Reveal>

          <Reveal className="mt-12 md:mt-14" delay={80}>
            <div className="surface p-6 sm:p-8 md:p-12">
              <ul className="grid gap-5 sm:grid-cols-2 sm:gap-8">
                {details.map((d) => (
                  <li
                    key={d.label}
                    className="press flex gap-4 rounded-xl bg-cream/60 p-4 hover:bg-cream"
                  >
                    <d.icon className="mt-1 size-4 shrink-0 text-sage-deep" />
                    <div className="min-w-0">
                      <p className="eyebrow">{d.label}</p>
                      <p className="mt-1 text-base leading-relaxed text-muted-foreground">{d.value}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 overflow-hidden rounded-xl border border-border bg-muted md:mt-10">
                <iframe
                  src={wedding.mapEmbedUrl}
                  title={"Mapa de " + wedding.venueAddress}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full sm:h-80 md:h-96"
                />
              </div>

              <div className="mt-6 text-center">
                <a
                  href={wedding.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="press inline-flex min-h-12 items-center justify-center rounded-full border border-sage-deep px-8 text-[0.7rem] uppercase tracking-[0.24em] text-sage-deep hover:bg-sage-deep hover:text-primary-foreground"
                >
                  Ver no mapa
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="programacao" className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal className="text-center">
            <p className="eyebrow">Programação do dia</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Nosso cronograma
            </h2>
            <div className="rule-soft mx-auto mt-6 w-24" />
          </Reveal>

          <ol className="mt-12 border-l border-sage/70 pl-7 md:mt-14 md:pl-8">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.time} delay={i * 90} className="relative pb-9 last:pb-0">
                <span className="absolute -left-[34px] top-1.5 size-2.5 rounded-full bg-sage-deep ring-4 ring-background md:-left-[38px]" />
                <div className="surface press p-5">
                  <p className="eyebrow">{t.time}</p>
                  <h3 className="mt-1 font-serif text-2xl text-foreground">{t.title}</h3>
                  <p className="mt-1 text-base leading-relaxed text-muted-foreground">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
