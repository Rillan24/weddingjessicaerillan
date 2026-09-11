import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { assetUrl } from "@/lib/asset-url";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import coupleBalloon from "@/assets/couple-balloon.jpg.asset.json";
import brideRing from "@/assets/bride-ring.jpg.asset.json";
import brideLeaf from "@/assets/bride-leaf.jpg.asset.json";
import coupleBasket from "@/assets/couple-basket.jpg.asset.json";
import coupleNight from "@/assets/couple-night.jpg.asset.json";

const photos = [
  { src: assetUrl(brideLeaf.url), alt: "Jessica segurando uma folha de outono", chapter: "Um instante só nosso", title: "Leveza nos pequenos momentos", note: "Há beleza em tudo aquilo que vivemos sem pressa." },
  { src: assetUrl(coupleBalloon.url), alt: "Jessica e Rillan em frente ao balão colorido", chapter: "Capítulo 02", title: "Sonhos que ganharam céu", note: "Quando estamos juntos, qualquer horizonte parece possível." },
  { src: assetUrl(brideRing.url), alt: "Jessica mostrando a aliança com o buquê de rosas", chapter: "Capítulo 03", title: "O nosso sim", note: "Um detalhe delicado, uma promessa imensa e uma vida inteira pela frente." },
  { src: assetUrl(coupleBasket.url), alt: "Jessica e Rillan dentro do cesto do balão", chapter: "Capítulo 04", title: "A vida vista de cima", note: "Colecionando paisagens, risadas e histórias para lembrar." },
  { src: assetUrl(coupleNight.url), alt: "Jessica e Rillan juntos em uma noite especial", chapter: "Capítulo 05", title: "Até a noite fica mais bonita", note: "O melhor lugar continua sendo onde a gente está lado a lado." },
];

function GalleryFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <figure className={"relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/20 shadow-[0_28px_80px_rgba(0,0,0,0.22)] " + className}>{children}</figure>;
}

export function Gallery() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const current = photos[index];
  const goTo = useCallback((nextIndex: number, dir: "left" | "right") => { setDirection(dir); setIndex(nextIndex); }, []);
  const prev = useCallback(() => { setIndex((currentIndex) => { setDirection("left"); return currentIndex === 0 ? photos.length - 1 : currentIndex - 1; }); }, []);
  const next = useCallback(() => { setIndex((currentIndex) => { setDirection("right"); return currentIndex === photos.length - 1 ? 0 : currentIndex + 1; }); }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      else if (event.key === "ArrowLeft") { event.preventDefault(); prev(); }
      else if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  useEffect(() => {
    if (isOpen) return;
    const timer = window.setInterval(next, 6500);
    return () => window.clearInterval(timer);
  }, [isOpen, next]);

  const handleTouchEnd = (endX: number | undefined) => {
    if (touchStartX.current === null || endX === undefined) return;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 44) return;
    if (delta < 0) next(); else prev();
  };

  return (
    <section id="galeria" className="bg-background py-24 md:py-32">
      <style>{"@keyframes gallery-cinematic-in-right { from { opacity: 0; transform: scale(1.045) translateX(2.5%); } to { opacity: 1; transform: scale(1) translateX(0); } } @keyframes gallery-cinematic-in-left { from { opacity: 0; transform: scale(1.045) translateX(-2.5%); } to { opacity: 1; transform: scale(1) translateX(0); } } @keyframes gallery-glow { 0%, 100% { opacity: .3; transform: scale(1); } 50% { opacity: .58; transform: scale(1.08); }}"}</style>
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Galeria</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Nossos momentos preferidos</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">Uma pequena coleção de instantes que continuam passando dentro da gente.</p>
        </div>
        <div className="relative mx-auto mt-12 max-w-5xl">
          <div className="pointer-events-none absolute -left-8 top-12 h-40 w-40 rounded-full bg-gold/20 blur-3xl" style={{ animation: "gallery-glow 7s ease-in-out infinite" }} />
          <div className="pointer-events-none absolute -right-8 bottom-8 h-48 w-48 rounded-full bg-sage/20 blur-3xl" style={{ animation: "gallery-glow 9s ease-in-out infinite reverse" }} />
          <GalleryFrame>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#17211f] sm:aspect-[16/10] md:aspect-[16/9]" onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX)}>
              <img key={current.src + index} src={current.src} alt={current.alt} className="absolute inset-0 h-full w-full object-cover" style={{ animation: direction === "right" ? "gallery-cinematic-in-right 900ms cubic-bezier(.2,.7,.2,1) both" : "gallery-cinematic-in-left 900ms cubic-bezier(.2,.7,.2,1) both" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/15" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-7"><span className="rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/85 backdrop-blur-sm">{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span><button type="button" onClick={() => setIsOpen(true)} aria-label="Abrir foto em tela cheia" className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Maximize2 className="size-4" /></button></div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10"><p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-light">{current.chapter}</p><h3 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-white md:text-5xl">{current.title}</h3><p className="mt-3 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">{current.note}</p></div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15"><div className="h-full bg-gold transition-all duration-700" style={{ width: ((index + 1) / photos.length) * 100 + "%" }} /></div>
            </div>
          </GalleryFrame>
          <button type="button" onClick={prev} aria-label="Foto anterior" className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:-left-6 md:size-14"><ChevronLeft className="size-5 md:size-6" /></button>
          <button type="button" onClick={next} aria-label="Próxima foto" className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:-right-6 md:size-14"><ChevronRight className="size-5 md:size-6" /></button>
        </div>
        <div className="mx-auto mt-7 max-w-5xl rounded-2xl border border-border/70 bg-card/50 p-4 shadow-sm md:p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-medium text-muted-foreground">Folheie a nossa história</p><button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">Ver em tela cheia <Maximize2 className="size-4" /></button></div><div className="flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Selecionar momento">{photos.map((photo, photoIndex) => <button key={photo.src} type="button" role="tab" aria-selected={photoIndex === index} aria-label={"Ver foto " + (photoIndex + 1) + ": " + photo.alt} onClick={() => goTo(photoIndex, photoIndex > index ? "right" : "left")} className={"group relative shrink-0 overflow-hidden rounded-xl border-2 transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold " + (photoIndex === index ? "border-gold shadow-[0_8px_24px_rgba(182,147,82,0.25)]" : "border-transparent opacity-65 hover:border-gold/50 hover:opacity-100")}><img src={photo.src} alt="" className="size-20 object-cover transition duration-700 group-hover:scale-110 md:size-24" /><span className="absolute inset-x-0 bottom-0 bg-black/55 px-1 py-1 text-center text-[10px] font-semibold tracking-[0.2em] text-white">{String(photoIndex + 1).padStart(2, "0")}</span></button>)}</div></div>
      </div>
      {isOpen && <div role="dialog" aria-modal="true" aria-label={current.title} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md md:p-8" onClick={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}><button type="button" onClick={() => setIsOpen(false)} aria-label="Fechar tela cheia" className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><X className="size-5" /></button><button type="button" onClick={prev} aria-label="Foto anterior" className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:left-8 md:size-14"><ChevronLeft className="size-5 md:size-6" /></button><div className="grid max-h-[90vh] w-full max-w-6xl gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(260px,.7fr)] md:items-center"><div className="overflow-hidden rounded-2xl border border-white/15 bg-black/30 shadow-2xl"><img key={current.src + "-lightbox" + index} src={current.src} alt={current.alt} className="max-h-[64vh] w-full object-contain md:max-h-[78vh]" style={{ animation: "gallery-cinematic-in-right 700ms ease both" }} /></div><div className="px-2 text-white md:px-0"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">{current.chapter}</p><h3 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">{current.title}</h3><p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">{current.note}</p><p className="mt-8 text-sm text-white/45">Use as setas do teclado ou deslize para continuar</p></div></div><button type="button" onClick={next} aria-label="Próxima foto" className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:right-8 md:size-14"><ChevronRight className="size-5 md:size-6" /></button></div>}
    </section>
  );
}
