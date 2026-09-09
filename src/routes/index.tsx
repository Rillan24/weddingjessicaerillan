import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/wedding/Nav";
import { BottomNav } from "@/components/wedding/BottomNav";
import { Hero } from "@/components/wedding/Hero";
import { Story } from "@/components/wedding/Story";
import { Ceremony } from "@/components/wedding/Ceremony";
import { Gallery } from "@/components/wedding/Gallery";
import { Gifts } from "@/components/wedding/Gifts";
import { Rsvp } from "@/components/wedding/Rsvp";
import { Faq } from "@/components/wedding/Faq";
import { Footer } from "@/components/wedding/Footer";

const title = "Jessica & Rillan — Nosso casamento";
const description =
  "Site do casamento de Jessica e Rillan: cerimônia, programação do dia, lista de presentes e confirmação de presença.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <main className="overflow-x-hidden bg-background pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
        <Nav />
        <Hero />
        <Story />
        <Ceremony />
        <Gallery />
        <Gifts />
        <Rsvp />
        <Faq />
        <Footer />
      </main>
      <BottomNav />
    </>
  );
}
