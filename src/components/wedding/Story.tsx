import coupleKiss from "@/assets/couple-kiss.jpg.asset.json";
import couplePark from "@/assets/couple-park.jpg.asset.json";
import { Reveal } from "./Reveal";
import { assetUrl } from "@/lib/asset-url";


export function Story() {
  return (
    <section id="historia" className="bg-background py-24 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16">
        <Reveal className="relative">
          <div className="absolute -left-5 -top-5 hidden size-40 rounded-2xl border border-sage md:block" />
          <img
            src={assetUrl(coupleKiss.url)}
            alt="Jessica e Rillan se beijando no dia do pedido de casamento"
            loading="lazy"
            className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-[0_28px_60px_-40px_rgba(0,0,0,0.55)]"
          />
          <img
            src={assetUrl(couplePark.url)}
            alt="Jessica e Rillan sorrindo juntos na praça"
            loading="lazy"
            className="relative -mt-24 ml-auto hidden aspect-square w-2/5 rounded-2xl border-8 border-background object-cover shadow-lg sm:block"
          />
        </Reveal>


        <Reveal className="md:pl-6" delay={120}>
          <p className="eyebrow">Nossa história</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Melhor juntos,
            <br />
            desde o primeiro dia
          </h2>
          <div className="rule-soft mt-6 w-24" />
          <div className="mt-8 space-y-5 text-[0.95rem] leading-loose text-muted-foreground">
            <p>
              Um amor que chegou leve e ficou para sempre.
            </p>
            <p>
              Desde o início, tudo entre nós foi leve, verdadeiro e natural. Fomos nos conhecendo,
              compartilhando a vida e, aos poucos, percebendo que queríamos muito mais do que viver
              momentos juntos: queríamos construir uma vida juntos.
            </p>
            <p>
              Hoje, celebramos esse amor e o sonho de formar a nossa família.
            </p>
            <p>
              E que bom que a nossa história nos trouxe até aqui.
            </p>
          </div>
          <p className="mt-8 max-w-xl font-serif text-xl italic text-sage-deep">
            “O amor é paciente, o amor é bondoso.” — 1 Coríntios 13:4
          </p>
          <p className="mt-6 font-serif text-2xl italic text-sage-deep">
            Obrigado por fazer parte da nossa história.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
