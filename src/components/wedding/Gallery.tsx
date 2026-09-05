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

export function Gallery() {
  return (
    <section id="galeria" className="bg-background py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="eyebrow">Galeria</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Nossos momentos preferidos
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => (
            <figure
              key={p.alt}
              className="relative aspect-[4/5] bg-cream p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-sage/20"
            >
              {/* outer frame line */}
              <div className="absolute inset-2 border border-gold/30 pointer-events-none" />
              {/* inner mat */}
              <div className="relative flex h-full w-full items-center justify-center bg-white p-4">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {/* corner ornaments */}
              <span className="absolute top-1.5 left-1.5 h-3 w-3 border-t border-l border-sage-deep/40" />
              <span className="absolute top-1.5 right-1.5 h-3 w-3 border-t border-r border-sage-deep/40" />
              <span className="absolute bottom-1.5 left-1.5 h-3 w-3 border-b border-l border-sage-deep/40" />
              <span className="absolute bottom-1.5 right-1.5 h-3 w-3 border-b border-r border-sage-deep/40" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
