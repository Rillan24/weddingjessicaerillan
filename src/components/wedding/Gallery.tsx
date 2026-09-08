import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import coupleBalloon from "@/assets/couple-balloon.jpg.asset.json";
import brideRing from "@/assets/bride-ring.jpg.asset.json";
import brideLeaf from "@/assets/bride-leaf.jpg.asset.json";
import coupleBasket from "@/assets/couple-basket.jpg.asset.json";
import coupleNight from "@/assets/couple-night.jpg.asset.json";

const photos = [
  { src: brideLeaf.url, alt: "Jessica segurando uma folha de outono" },
  { src: coupleBalloon.url, alt: "Jessica e Rillan em frente ao balão colorido" },
  { src: brideRing.url, alt: "Jessica mostrando a aliança com o buquê de rosas" },
  { src: coupleBasket.url, alt: "Jessica e Rillan dentro do cesto do balão" },
  { src: coupleNight.url, alt: "Jessica e Rillan juntos em uma noite especial" },
];

function Frame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={`relative bg-cream p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-sage/20 ${className}`}
    >
      {/* outer frame line */}
      <div className="absolute inset-2 border border-gold/30 pointer-events-none" />
      {/* inner mat */}
      <div className="relative flex h-full w-full items-center justify-center bg-white p-4">
        {children}
      </div>
      {/* corner ornaments */}
      <span className="absolute top-1.5 left-1.5 h-3 w-3 border-t border-l border-sage-deep/40" />
      <span className="absolute top-1.5 right-1.5 h-3 w-3 border-t border-r border-sage-deep/40" />
      <span className="absolute bottom-1.5 left-1.5 h-3 w-3 border-b border-l border-sage-deep/40" />
      <span className="absolute bottom-1.5 right-1.5 h-3 w-3 border-b border-r border-sage-deep/40" />
    </figure>
  );
}

export function Gallery() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const goTo = useCallback((nextIndex: number, dir: "left" | "right") => {
    setDirection(dir);
    setIndex(nextIndex);
  }, []);

  const prev = useCallback(() => {
    const nextIndex = index === 0 ? photos.length - 1 : index - 1;
    goTo(nextIndex, "left");
  }, [index, goTo]);

  const next = useCallback(() => {
    const nextIndex = index === photos.length - 1 ? 0 : index + 1;
    goTo(nextIndex, "right");
  }, [index, goTo]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  const current = photos[index];

  if (!current) {
    return null;
  }

  return (
    <section id="galeria" className="bg-background py-28">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <p className="eyebrow">Galeria</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Nossos momentos preferidos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Clique nas setas ou nas miniaturas para folhear o álbum
          </p>
        </div>

        {/* main album viewer */}
        <div className="mt-14 flex items-center justify-center gap-3 md:gap-6">
          <button
            type="button"
            onClick={prev}
            aria-label="Foto anterior"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sage/30 bg-cream text-foreground shadow-sm transition hover:bg-sage/10 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-12 md:w-12"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <div className="relative w-full max-w-2xl overflow-hidden">
            <Frame className="aspect-[4/5] w-full">
              <img
                key={current.src}
                src={current.src}
                alt={current.alt}
                loading="lazy"
                className={`max-h-full max-w-full object-contain ${
                  direction ? "animate-fade-slide" : ""
                }`}
              />
            </Frame>

            {/* caption */}
            <div className="mt-5 text-center">
              <p className="font-serif text-lg italic text-foreground md:text-xl">
                {current.alt}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {index + 1} / {photos.length}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Próxima foto"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sage/30 bg-cream text-foreground shadow-sm transition hover:bg-sage/10 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-12 md:w-12"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* thumbnail filmstrip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {photos.map((photo, i) => {
            const isActive = i === index;
            return (
              <button
                key={photo.src}
                type="button"
                onClick={() => goTo(i, i > index ? "right" : "left")}
                aria-label={`Ver foto ${i + 1}: ${photo.alt}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative w-16 md:w-20 transition ${
                  isActive
                    ? "scale-105 ring-2 ring-gold ring-offset-2 ring-offset-background"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Frame className="aspect-square">
                  <img
                    src={photo.src}
                    alt=""
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </Frame>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fade-slide-in {
          from {
            opacity: 0;
            transform: translateX(var(--slide-offset, 20px));
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-slide {
          --slide-offset: ${direction === "left" ? "-20px" : "20px"};
          animation: fade-slide-in 0.35s ease-out both;
        }
      `}</style>
    </section>
  );
}
