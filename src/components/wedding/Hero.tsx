import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding-data";
import brideBw from "@/assets/bride-bw.jpg";
import bouquets from "@/assets/bouquets.jpg";
import groomBw from "@/assets/groom-bw.jpg";
import wreath from "@/assets/wreath.png";

function useCountdown(target: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now();
      const clamped = Math.max(diff, 0);
      setLeft({
        d: Math.floor(clamped / 86400000),
        h: Math.floor((clamped / 3600000) % 24),
        m: Math.floor((clamped / 60000) % 60),
        s: Math.floor((clamped / 1000) % 60),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return left;
}

export function Hero() {
  const left = useCountdown(wedding.date);

  return (
    <section id="topo" className="relative overflow-hidden bg-blush/60 pt-28 pb-16">
      <img
        src={wreath}
        alt=""
        aria-hidden
        width={800}
        height={800}
        className="pointer-events-none absolute -left-24 top-40 w-72 opacity-40"
      />
      <img
        src={wreath}
        alt=""
        aria-hidden
        width={800}
        height={800}
        className="pointer-events-none absolute -right-28 bottom-0 w-80 opacity-30"
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[1fr_1.15fr] md:items-center">
        <div className="fade-up">
          <p className="eyebrow">Vamos nos casar</p>
          <h1 className="mt-5 font-serif text-5xl italic leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
            {wedding.brideFirst}
            <span className="not-italic"> & </span>
            {wedding.groomFirst}
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {wedding.dateLabel} · {wedding.timeLabel} — {wedding.venue}, {wedding.city}.
            Vem celebrar com a gente o começo dessa história para sempre.
          </p>

          {left && (
            <dl className="mt-8 flex gap-6">
              {[
                { v: left.d, l: "dias" },
                { v: left.h, l: "horas" },
                { v: left.m, l: "min" },
                { v: left.s, l: "seg" },
              ].map((item) => (
                <div key={item.l}>
                  <dt className="font-serif text-3xl text-sage-deep">
                    {String(item.v).padStart(2, "0")}
                  </dt>
                  <dd className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {item.l}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <a
            href="#confirmar"
            className="mt-9 inline-block border border-sage-deep px-8 py-3 text-[0.7rem] uppercase tracking-[0.24em] text-sage-deep transition-colors hover:bg-sage-deep hover:text-primary-foreground"
          >
            Confirmar presença
          </a>
        </div>

        <div className="relative">
          <img
            src={bouquets}
            alt="Damas de honra com buquês de peônias brancas"
            width={1200}
            height={900}
            className="ml-auto w-[88%] object-cover shadow-sm"
          />
          <img
            src={brideBw}
            alt="Retrato em preto e branco da noiva"
            width={900}
            height={1200}
            loading="lazy"
            className="absolute -bottom-8 left-0 w-[42%] border-8 border-background object-cover shadow-md"
          />
          <img
            src={groomBw}
            alt="Retrato em preto e branco do noivo"
            width={900}
            height={1200}
            loading="lazy"
            className="absolute -right-2 -bottom-14 hidden w-[30%] border-8 border-background object-cover shadow-md sm:block"
          />
        </div>
      </div>
    </section>
  );
}
