import galleryOne from "@/assets/gallery-1.jpg";
import galleryThree from "@/assets/gallery-3.jpg";

export function Story() {
  return (
    <section id="historia" className="relative bg-background py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:items-center">
        <div className="relative">
          <div className="absolute -left-4 -top-6 hidden h-64 w-40 bg-sage/60 md:block" />
          <img
            src={galleryOne}
            alt="Casal se abraçando em um vinhedo ao pôr do sol"
            width={1000}
            height={1200}
            loading="lazy"
            className="relative w-full object-cover"
          />
          <img
            src={galleryThree}
            alt="Casal caminhando de mãos dadas por um caminho de eucaliptos"
            width={1200}
            height={900}
            loading="lazy"
            className="relative -mt-20 ml-auto w-2/3 border-8 border-background object-cover shadow-md"
          />
        </div>

        <div>
          <p className="eyebrow">Nossa história</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Melhor juntos, desde o primeiro café
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              A gente se conheceu num sábado qualquer que virou o mais importante de todos.
              Entre conversas que não acabavam e viagens improvisadas, descobrimos que a vida
              fica mais leve quando é dividida.
            </p>
            <p>
              Foram anos de casa nova, cachorro adotado, sonhos anotados em papel de guardanapo —
              e agora um sim para dizer na frente de quem a gente ama.
            </p>
            <p className="font-serif text-xl italic text-sage-deep">
              Obrigado por fazer parte da nossa história.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
