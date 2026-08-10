import type { Metadata } from "next";
import { COMBOS } from "@/data/menu";
import { ComboCard } from "@/components/menu/ComboCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { HojaRama, Brote } from "@/components/brand/BotanicalPattern";
import { Boton } from "@/components/ui/Boton";
import { waLink, WA_MENSAJES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Combos desde $125",
  description:
    "Los combos de El Huerto en Ciudad UP: El OG, El Mañanero, El de Renee, Home Run, Gym Rat y El Fresa. Dos favoritos, un precio, desde $125.",
  alternates: { canonical: "/combos" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MenuSection",
  name: "Combos",
  hasMenuItem: COMBOS.map((c) => ({
    "@type": "MenuItem",
    name: c.nombre,
    description: c.incluye.join(" + "),
    offers: { "@type": "Offer", price: c.precio, priceCurrency: "MXN" },
  })),
};

export default function CombosPage() {
  return (
    <div className="relative overflow-hidden bg-green-800 pb-20 pt-28 texture-papel sm:pt-36">
      <HojaRama className="pointer-events-none absolute -left-14 top-24 h-96 w-56 text-moss-300/15 rotate-[14deg]" />
      <HojaRama className="pointer-events-none absolute -right-14 bottom-10 h-96 w-56 text-moss-300/12 -rotate-[28deg]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Brote className="h-10 w-10 text-cream-100/70" />
          <SectionHeading
          como="h1"
            kicker="Natural · Fresco · Saludable"
            titulo="Los combos de la casa."
            subtitulo="Como en los laterales del kiosco: dos favoritos, un precio. Del Mañanero al Fresa."
            tono="claro"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COMBOS.map((combo, i) => (
            <Reveal key={combo.id} delay={(i % 3) * 90}>
              <ComboCard combo={combo} />
            </Reveal>
          ))}
        </div>

        <Reveal className="flex flex-col items-center gap-4 rounded-3xl border border-cream-100/15 bg-green-900/50 p-8 text-center sm:p-10">
          <p className="titulo-huerto text-2xl text-cream-100 sm:text-3xl">
            ¿No sabes cuál va contigo?
          </p>
          <p className="max-w-md text-cream-100/75">
            Cuéntanos qué se te antoja y te armamos tu combo en el kiosco.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Boton
              href={waLink(WA_MENSAJES.producto("un combo"), "combos-cta")}
              externo
              variante="rojo"
              talla="lg"
            >
              Pregunta por WhatsApp
            </Boton>
            <Boton href="/carta" variante="contornoCrema" talla="lg">
              Ver toda la carta
            </Boton>
          </div>
        </Reveal>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
