import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Boton } from "@/components/ui/Boton";
import { Reveal } from "@/components/motion/Reveal";
import { faqJsonLd, migasJsonLd, jsonLdProps } from "@/lib/schema";
import { FAQS, SITE, waLink, WA_MENSAJES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Dónde está El Huerto en Ciudad UP, cuánto cuestan los smoothies y el café, opciones vegetarianas, combos y cómo pedir por WhatsApp entre clases.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

const migas = migasJsonLd([
  { nombre: "Inicio", url: "/" },
  { nombre: "Preguntas frecuentes", url: "/preguntas-frecuentes" },
]);

export default function PreguntasFrecuentesPage() {
  return (
    <div className="bg-cream-100 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6">
        <SectionHeading
          como="h1"
          kicker="Todo lo que nos preguntan"
          titulo="Preguntas frecuentes."
          subtitulo="Lo que más nos preguntan en el kiosco, resuelto en un minuto."
          alinear="izquierda"
        />

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.pregunta} delay={Math.min(i * 50, 250)}>
              <details className="group rounded-2xl border border-borde bg-cream-50 p-5 open:bg-warmwhite sm:p-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-condensed text-xl font-bold uppercase leading-tight tracking-[0.02em] text-green-950 marker:hidden">
                  <h2 className="text-inherit">{faq.pregunta}</h2>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-red-500 transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-5 w-5">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-muted">{faq.respuesta}</p>
              </details>
            </Reveal>
          ))}
        </div>

        {/* Enlazado interno útil */}
        <Reveal className="rounded-3xl border border-borde bg-cream-50 p-6 sm:p-8">
          <h2 className="titulo-huerto text-xl text-green-950">¿Buscabas algo más?</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/carta", label: "La carta completa" },
              { href: "/carta/smoothies", label: "Smoothies $99" },
              { href: "/carta/cafe", label: "Café desde $30" },
              { href: "/carta/bowls", label: "Bowls y açaí" },
              { href: "/combos", label: "Combos desde $125" },
              { href: "/ubicacion", label: "Cómo llegar" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block rounded-full border border-borde bg-warmwhite px-4 py-2 font-condensed text-sm font-bold uppercase tracking-[0.06em] text-green-900 transition-colors hover:border-red-600 hover:text-red-600"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-green-800 p-8 texture-papel">
          <p className="relative flex-1 basis-64 font-condensed text-2xl font-bold uppercase leading-tight text-cream-100">
            ¿Tu duda no está aquí? Escríbenos.
          </p>
          <div className="relative flex gap-3">
            <Boton href={waLink(WA_MENSAJES.general, "faq")} externo variante="rojo">
              WhatsApp
            </Boton>
            <Boton href="/contacto" variante="contornoCrema">
              Contacto
            </Boton>
          </div>
        </div>

        <p className="text-xs text-muted">
          Precios vigentes del menú oficial de El Huerto en {SITE.ubicacion.nombre},{" "}
          {SITE.ubicacion.zona}.
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdProps(faqJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdProps(migas)} />
    </div>
  );
}
