import { Link } from "@tanstack/react-router";
import { wedding } from "@/lib/wedding-data";
import wreath from "@/assets/wreath.png";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-blush/60 py-16 text-center">
      <img
        src={wreath}
        alt=""
        aria-hidden
        width={800}
        height={800}
        loading="lazy"
        className="pointer-events-none absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 opacity-30"
      />
      <div className="relative mx-auto max-w-xl px-5">
        <p className="font-serif text-3xl tracking-[0.3em] text-foreground">{wedding.monogram}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {wedding.dateLabel} · {wedding.venue}, {wedding.city}
        </p>
        <p className="mt-6 font-serif text-lg italic text-sage-deep">
          Com amor, {wedding.brideFirst} e {wedding.groomFirst}
        </p>
        <Link
          to="/admin"
          className="mt-8 inline-block text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/70 hover:text-sage-deep"
        >
          Área dos noivos
        </Link>
      </div>
    </footer>
  );
}
