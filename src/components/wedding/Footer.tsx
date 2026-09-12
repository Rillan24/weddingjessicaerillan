import { wedding } from "@/lib/wedding-data";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="bg-sage-deep py-20 text-center">
      <Reveal className="mx-auto max-w-xl px-5">
        <p className="font-serif text-4xl tracking-[0.3em] text-cream">{wedding.monogram}</p>
        <div className="mx-auto mt-6 h-px w-16 bg-cream/40" />
        <p className="mt-6 text-[0.7rem] uppercase leading-relaxed tracking-[0.25em] text-cream/80">
          {wedding.dateLabel} · {wedding.venue}
        </p>
        <p className="mt-6 font-serif text-xl italic text-cream">
          Com amor, {wedding.brideFirst} e {wedding.groomFirst}
        </p>
      </Reveal>
    </footer>
  );
}
