import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, wedding } from "@/lib/wedding-data";
import { cn } from "@/lib/utils";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-md"
          : "bg-gradient-to-b from-foreground/45 to-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a
          href="#topo"
          className={cn(
            "font-serif text-xl tracking-[0.25em] transition-colors",
            scrolled ? "text-foreground" : "text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]",
          )}
        >
          {wedding.monogram}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "text-xs uppercase tracking-[0.16em] transition-colors",
                scrolled
                  ? "text-foreground/80 hover:text-sage-deep"
                  : "text-cream hover:text-cream/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "md:hidden",
            scrolled || open
              ? "text-foreground"
              : "text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]",
          )}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>


      {open && (
        <nav className="border-t border-border bg-background px-5 pb-6 pt-2 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-xs uppercase tracking-[0.16em] text-foreground/80"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
