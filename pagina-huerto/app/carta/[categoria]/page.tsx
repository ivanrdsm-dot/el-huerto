import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIAS,
  categoriaPorSlug,
  productosDeCategoria,
  TOPPINGS_BOWLS,
  TOPPINGS_ENSALADA,
} from "@/data/menu";
import { ProductCard } from "@/components/menu/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Boton } from "@/components/ui/Boton";
import { Reveal } from "@/components/motion/Reveal";
import { listaCategoriaJsonLd, migasJsonLd, jsonLdProps } from "@/lib/schema";
import { SITE } from "@/lib/site";

type Params = { categoria: string };

// Combos tiene su propia página /combos
const SLUGS = CATEGORIAS.filter((c) => c.slug !== "combos").map((c) => c.slug);

export function generateStaticParams(): Params[] {
  return SLUGS.map((categoria) => ({ categoria }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const cat = categoriaPorSlug(categoria);
  if (!cat) return {};

  const nombres = productosDeCategoria(cat.slug)
    .slice(0, 4)
    .map((p) => p.nombre)
    .join(", ");

  return {
    title: `${cat.nombre} desde $${cat.desde} en Ciudad UP`,
    description: `${cat.descripcion}${nombres ? ` ${nombres}.` : ""} Precios vigentes de El Huerto, el kiosco de Ciudad UP en Bosque Real, Huixquilucan.`,
    alternates: { canonical: `/carta/${cat.slug}` },
    openGraph: {
      title: `${cat.nombre} — El Huerto Ciudad UP`,
      description: cat.descripcion,
      url: `/carta/${cat.slug}`,
      ...(cat.imagen ? { images: [{ url: cat.imagen, alt: cat.imagenAlt ?? cat.nombre }] } : {}),
    },
  };
}

export default async function CategoriaPage({ params }: { params: Promise<Params> }) {
  const { categoria } = await params;
  const cat = categoriaPorSlug(categoria);
  if (!cat || cat.slug === "combos") notFound();

  const productos = productosDeCategoria(cat.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuSection",
    name: cat.nombre,
    description: cat.descripcion,
    url: `${SITE.url}/carta/${cat.slug}`,
    hasMenuItem: productos.map((p) => ({
      "@type": "MenuItem",
      name: p.nombre,
      description: p.descripcionCorta,
      url: `${SITE.url}/carta/${cat.slug}/${p.slug}`,
      ...(p.imagen ? { image: `${SITE.url}${p.imagen}` } : {}),
      offers: p.precios.map((precio) => ({
        "@type": "Offer",
        price: precio.valor,
        priceCurrency: "MXN",
        availability: p.disponible
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        ...(precio.etiqueta ? { name: precio.etiqueta } : {}),
      })),
    })),
  };

  const migas = migasJsonLd([
    { nombre: "Inicio", url: "/" },
    { nombre: "Carta", url: "/carta" },
    { nombre: cat.nombre, url: `/carta/${cat.slug}` },
  ]);

  return (
    <div className="bg-cream-100 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        {/* Migas de pan */}
        <nav aria-label="Migas de pan" className="font-condensed text-sm font-semibold uppercase tracking-[0.12em] text-muted">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-red-600">Inicio</Link>
              <span aria-hidden="true" className="ml-2 text-red-500">·</span>
            </li>
            <li>
              <Link href="/carta" className="hover:text-red-600">Carta</Link>
              <span aria-hidden="true" className="ml-2 text-red-500">·</span>
            </li>
            <li aria-current="page" className="text-green-900">{cat.nombre}</li>
          </ol>
        </nav>

        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionHeading
          como="h1"
            kicker={`${cat.nombre} · desde $${cat.desde}`}
            titulo={cat.titulo}
            subtitulo={cat.descripcion}
            alinear="izquierda"
          />
          {cat.imagen ? (
            <Reveal delay={100} className="relative mx-auto h-56 w-full max-w-sm sm:h-72">
              <Image
                src={cat.imagen}
                alt={cat.imagenAlt ?? cat.nombre}
                fill
                sizes="(max-width: 640px) 90vw, 380px"
                priority
                className={
                  cat.imagen.startsWith("/photos/")
                    ? "rounded-3xl border border-borde object-cover"
                    : "object-contain drop-shadow-[0_24px_32px_rgba(36,33,30,0.2)]"
                }
              />
            </Reveal>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>

        {cat.slug === "bowls" ? (
          <Reveal className="rounded-3xl border border-borde bg-cream-50 p-6 sm:p-8">
            <h2 className="titulo-huerto text-xl text-green-950">Toppings disponibles</h2>
            <p className="mt-2 text-sm text-muted">
              Todos los bowls incluyen granola. Topping extra +$10.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {TOPPINGS_BOWLS.map((t) => (
                <li key={t} className="rounded-full border border-borde bg-warmwhite px-4 py-1.5 text-sm font-semibold text-green-900">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {cat.slug === "ensaladas" ? (
          <Reveal className="rounded-3xl border border-borde bg-cream-50 p-6 sm:p-8">
            <h2 className="titulo-huerto text-xl text-green-950">17 toppings a elegir</h2>
            <p className="mt-2 text-sm text-muted">
              Tu ensalada incluye 3 toppings; cada topping adicional +$10.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {TOPPINGS_ENSALADA.map((t) => (
                <li key={t} className="rounded-full border border-borde bg-warmwhite px-4 py-1.5 text-sm font-semibold text-green-900">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-green-800 p-8 texture-papel">
          <p className="relative flex-1 basis-64 font-condensed text-2xl font-bold uppercase leading-tight text-cream-100">
            ¿Se te antojó? Nos vemos en {SITE.ubicacion.nombre.includes("Ciudad UP") ? "Ciudad UP" : SITE.ubicacion.nombre}.
          </p>
          <div className="relative flex gap-3">
            <Boton href="/ubicacion" variante="crema">Cómo llegar</Boton>
            <Boton href="/carta" variante="contornoCrema">Toda la carta</Boton>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdProps(jsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdProps(migas)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdProps(listaCategoriaJsonLd(cat.slug))}
      />
    </div>
  );
}
