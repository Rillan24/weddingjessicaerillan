import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/wedding/Nav";
import { Hero } from "@/components/wedding/Hero";
import { Story } from "@/components/wedding/Story";
import { Ceremony } from "@/components/wedding/Ceremony";
import { Party } from "@/components/wedding/Party";
import { Gallery } from "@/components/wedding/Gallery";
import { Stay } from "@/components/wedding/Stay";
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
    <main className="bg-background">
      <Nav />
      <Hero />
      <Story />
      <Ceremony />
      <Party />
      <Gallery />
      <Stay />
      <Gifts />
      <Rsvp />
      <Faq />
      <Footer />
    </main>
  );
}
