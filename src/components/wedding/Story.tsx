import coupleKiss from "@/assets/couple-kiss.jpg.asset.json";
import couplePark from "@/assets/couple-park.jpg.asset.json";

export function Story() {
  return (
    <section id="historia" className="bg-background py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 md:grid-cols-2">
        <div className="relative">
          <div className="absolute -left-5 -top-5 hidden size-40 border border-sage md:block" />
          <img
            src={coupleKiss.url}
            alt="Jessica e Rillan se beijando no dia do pedido de casamento"
            loading="lazy"
            className="relative aspect-[4/5] w-full object-cover"
          />
          <img
            src={couplePark.url}
            alt="Jessica e Rillan sorrindo juntos na praça"
            loading="lazy"
            className="relative -mt-24 ml-auto hidden aspect-square w-2/5 border-8 border-background object-cover shadow-lg sm:block"
          />
        </div>

        <div className="md:pl-6">
          <p className="eyebrow">Nossa história</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Melhor juntos,
            <br />
            desde o primeiro dia
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-loose text-muted-foreground">
            <p>
              A gente se conheceu num sábado qualquer que virou o mais importante de todos.
              Entre conversas que não acabavam e viagens improvisadas, descobrimos que a vida
              fica mais leve quando é dividida.
            </p>
            <p>
              Fooi o ano de planos feitos a dois, risadas fora de hora e sonhos anotados em
              papel de guardanapo — e agora um sim para dizer na frente de quem a gente ama.
            </p>
          </div>
          <p className="mt-8 font-serif text-2xl italic text-sage-deep">
            Obrigado por fazer parte da nossa história.
          </p>
        </div>
      </div>
    </section>
  );
}
