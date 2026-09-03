import { MapPin, Clock, Shirt, Car } from "lucide-react";
import { wedding, timeline } from "@/lib/wedding-data";
import venue from "@/assets/venue.jpg";

const details = [
  { icon: MapPin, label: "Local", value: `${wedding.venue} — ${wedding.venueAddress}` },
  { icon: Clock, label: "Horário", value: `${wedding.dateLabel}, às ${wedding.timeLabel}` },
  { icon: Shirt, label: "Traje", value: wedding.dressCode },
  { icon: Car, label: "Estacionamento", value: "Gratuito, com manobrista na entrada" },
];

export function Ceremony() {
  return (
    <>
      <section id="cerimonia" className="bg-sage/40 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="eyebrow">Cerimônia e festa</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Onde tudo vai acontecer
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <img
              src={venue}
              alt="Cerimônia ao ar livre com arco de flores brancas em frente ao lago"
              width={1400}
              height={900}
              loading="lazy"
              className="w-full object-cover shadow-sm"
            />

            <div className="bg-background p-8">
              <ul className="space-y-6">
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

              <a
                href={wedding.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block border border-sage-deep px-7 py-3 text-[0.7rem] uppercase tracking-[0.24em] text-sage-deep transition-colors hover:bg-sage-deep hover:text-primary-foreground"
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
