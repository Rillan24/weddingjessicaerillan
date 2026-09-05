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

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => (
            <figure key={p.alt} className="flex aspect-[4/5] items-center justify-center bg-cream p-3">
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            </figure>

          ))}
        </div>
      </div>
    </section>
  );
}
