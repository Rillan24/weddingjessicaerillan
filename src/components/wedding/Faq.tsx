import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/wedding-data";
import { Reveal } from "./Reveal";

export function Faq() {
  return (
    <section id="faq" className="bg-background py-24">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal className="text-center">
          <p className="eyebrow">Dúvidas</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Perguntas frequentes
          </h2>
          <div className="rule-soft mx-auto mt-6 w-24" />
        </Reveal>

        <Reveal delay={80}>
          <Accordion type="single" collapsible className="mt-10 space-y-3 md:mt-12">
            {faqs.map((f) => (
              <AccordionItem
                key={f.q}
                value={f.q}
                className="surface border-b-0 px-5 transition-colors data-[state=open]:bg-cream"
              >
                <AccordionTrigger className="py-5 text-left font-serif text-xl hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
