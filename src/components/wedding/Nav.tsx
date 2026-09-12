import { useEffect, useState } from "react";
import { navLinks, wedding } from "@/lib/wedding-data";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(pageHeight > 0 ? Math.min((window.scrollY / pageHeight) * 100, 100) : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/90 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "bg-gradient-to-b from-foreground/45 to-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <a
          href="#topo"
          className={cn(
            "min-w-0 truncate font-serif text-xl tracking-[0.25em] transition-colors",
            scrolled ? "text-foreground" : "text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]",
          )}
        >
          {wedding.monogram}
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "press rounded-full px-3 py-2 text-xs uppercase tracking-[0.16em]",
                l.label === "Confirmar presença" && "glow-cta",
                scrolled
                  ? "text-foreground/75 hover:bg-sage/40 hover:text-sage-deep"
                  : "text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] hover:bg-cream/15",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="https://wa.me/5511925308573?text=Oi%20J%C3%A9ssica%2C%20gostaria%20de%20confirmar%20minha%20presen%C3%A7a%20em%20seu%20casamento%F0%9F%A5%B0"
          className={cn(
            "glow-cta press inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-[0.6rem] uppercase tracking-[0.18em] md:hidden",
            scrolled
              ? "bg-sage-deep text-primary-foreground"
              : "border border-cream/70 text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]",
          )}
        >
          Confirmar
        </a>
      </div>

      <div className="scroll-progress" aria-hidden="true">
        <span style={{ width: progress + "%" }} />
      </div>
    </header>
  );
}
