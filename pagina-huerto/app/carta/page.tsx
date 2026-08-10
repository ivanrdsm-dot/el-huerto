import type { Metadata } from "next";
import Link from "next/link";
import { MenuTabs } from "@/components/menu/MenuTabs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORIAS } from "@/data/menu";
import { menuCompletoJsonLd, migasJsonLd, jsonLdProps } from "@/lib/schema";

export const metadata: Metadata = {
  title: "La carta completa con precios",
  description:
    "Carta completa de El Huerto en Ciudad UP: smoothies $99, café desde $30, boba tea $49, açaí bowls desde $129, paninis $89, ensaladas $99 y combos desde $125.",
  alternates: { canonical: "/carta" },
  openGraph: {
    title: "La carta de El Huerto — Ciudad UP",
    description:
      "Smoothies, café, bowls, paninis, ensaladas y combos con precios vigentes del menú oficial.",
    url: "/carta",
  },
};

const migas = migasJsonLd([
  { nombre: "Inicio", url: "/" },
  { nombre: "Carta", url: "/carta" },
]);

export default function CartaPage() {
  return (
    <div className="bg-cream-100 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <SectionHeading
          como="h1"
          kicker="Menú oficial"
          titulo="La carta."
          subtitulo="Pídete algo que sí se antoje. Precios vigentes del menú oficial."
          alinear="izquierda"
        />
        <MenuTabs />

        {/* Enlazado interno a cada categoría: ayuda a Google a rastrear todo el menú */}
        <nav aria-label="Todas las categorías" className="border-t border-borde pt-8">
          <h2 className="kicker mb-4 text-green-900">Explora por categoría</h2>
          <ul className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <li key={c.slug}>
                <Link
                  href={c.slug === "combos" ? "/combos" : `/carta/${c.slug}`}
                  className="inline-block rounded-full border border-borde bg-cream-50 px-4 py-2 font-condensed text-sm font-bold uppercase tracking-[0.06em] text-green-900 transition-colors hover:border-red-600 hover:text-red-600"
                >
                  {c.nombre} desde ${c.desde}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/preguntas-frecuentes"
                className="inline-block rounded-full border border-borde bg-cream-50 px-4 py-2 font-condensed text-sm font-bold uppercase tracking-[0.06em] text-green-900 transition-colors hover:border-red-600 hover:text-red-600"
              >
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdProps(menuCompletoJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdProps(migas)} />
    </div>
  );
}
