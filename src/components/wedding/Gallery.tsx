import galleryOne from "@/assets/gallery-1.jpg";
import galleryTwo from "@/assets/gallery-2.jpg";
import galleryThree from "@/assets/gallery-3.jpg";
import bouquets from "@/assets/bouquets.jpg";
import venue from "@/assets/venue.jpg";
import brideBw from "@/assets/bride-bw.jpg";

const photos = [
  { src: galleryOne, alt: "Casal no vinhedo ao entardecer", span: "row-span-2" },
  { src: venue, alt: "Cerimônia à beira do lago", span: "" },
  { src: galleryTwo, alt: "Mesa posta com eucalipto e velas", span: "" },
  { src: bouquets, alt: "Buquês de peônias brancas", span: "" },
  { src: brideBw, alt: "Retrato da noiva em preto e branco", span: "row-span-2" },
  { src: galleryThree, alt: "Casal caminhando entre eucaliptos", span: "" },
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
