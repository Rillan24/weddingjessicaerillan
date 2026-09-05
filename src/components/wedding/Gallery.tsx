import coupleBalloon from "@/assets/couple-balloon.jpg.asset.json";
import brideRing from "@/assets/bride-ring.jpg.asset.json";
import brideLeaf from "@/assets/bride-leaf.jpg.asset.json";
import coupleBasket from "@/assets/couple-basket.jpg.asset.json";
import coupleNight from "@/assets/couple-night.jpg.asset.json";

const photos = [
  {
    src: brideLeaf.url,
    alt: "Jessica segurando uma folha de outono",
    className: "md:col-span-1 md:row-span-2 aspect-[3/4] md:aspect-auto",
  },
  {
    src: coupleBalloon.url,
    alt: "Jessica e Rillan em frente ao balão colorido",
    className: "md:col-span-2 aspect-[4/3] md:aspect-auto",
  },
  {
    src: brideRing.url,
    alt: "Jessica mostrando a aliança com o buquê de rosas",
    className: "aspect-square md:aspect-auto",
  },
  {
    src: coupleBasket.url,
    alt: "Jessica e Rillan dentro do cesto do balão",
    className: "aspect-square md:aspect-auto",
  },
  {
    src: coupleNight.url,
    alt: "Jessica e Rillan juntos em uma noite especial",
    className: "md:col-span-3 aspect-[16/9] md:aspect-auto md:h-[320px]",
  },
];

export function Gallery() {
  return (
    <section id="galeria" className="bg-cream py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="eyebrow">Galeria</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Nossos momentos preferidos
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:auto-rows-[240px]">
          {photos.map((p) => (
            <figure key={p.alt} className={`overflow-hidden ${p.className}`}>
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
