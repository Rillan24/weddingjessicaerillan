import coupleRails from "@/assets/couple-rails.jpg.asset.json";
import coupleBalloon from "@/assets/couple-balloon.jpg.asset.json";
import couplePark from "@/assets/couple-park.jpg.asset.json";
import brideLeaf from "@/assets/bride-leaf.jpg.asset.json";
import coupleDinner from "@/assets/couple-dinner.jpg.asset.json";
import coupleBasket from "@/assets/couple-basket.jpg.asset.json";
import coupleKiss from "@/assets/couple-kiss.jpg.asset.json";
import brideRing from "@/assets/bride-ring.jpg.asset.json";
import coupleNight from "@/assets/couple-night.jpg.asset.json";

const photos = [
  { src: coupleRails.url, alt: "Rillan beijando Jessica na testa sobre os trilhos", span: "row-span-2" },
  { src: coupleBalloon.url, alt: "Jessica e Rillan em frente ao balão colorido", span: "" },
  { src: brideRing.url, alt: "Jessica mostrando a aliança com o buquê de rosas", span: "" },
  { src: coupleKiss.url, alt: "O beijo no dia do pedido de casamento", span: "" },
  { src: brideLeaf.url, alt: "Jessica segurando uma folha de outono", span: "row-span-2" },
  { src: coupleDinner.url, alt: "Jessica e Rillan em um jantar", span: "" },
  { src: coupleBasket.url, alt: "Jessica e Rillan dentro do cesto do balão", span: "" },
  { src: couplePark.url, alt: "Jessica e Rillan na praça em um dia de sol", span: "" },
  { src: coupleNight.url, alt: "Jessica e Rillan em uma noite juntos", span: "" },
];

export function Gallery() {
  return (
    <section id="galeria" className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="eyebrow">Galeria</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Nossos momentos preferidos
          </h2>
        </div>

        <div className="mt-14 grid auto-rows-[190px] grid-cols-2 gap-4 md:grid-cols-3 md:auto-rows-[230px]">
          {photos.map((p) => (
            <figure key={p.alt} className={`overflow-hidden ${p.span}`}>
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
