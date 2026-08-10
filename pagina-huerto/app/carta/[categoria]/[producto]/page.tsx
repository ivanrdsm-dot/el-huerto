import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoriaPorSlug,
  productoPorSlug,
  productosRelacionados,
  rutasDeProductos,
  precioDesde,
  TOPPINGS_BOWLS,
  TOPPINGS_ENSALADA,
} from "@/data/menu";
import { ProductCard } from "@/components/menu/ProductCard";
import { PriceBadge } from "@/components/menu/PriceBadge";
import { Boton } from "@/components/ui/Boton";
import { Reveal } from "@/components/motion/Reveal";
import { Brote } from "@/components/brand/BotanicalPattern";
import { migasJsonLd, productoJsonLd, jsonLdProps } from "@/lib/schema";
import { SITE, waLink, WA_MENSAJES } from "@/lib/site";

type Params = { categoria: string; producto: string };

export function generateStaticParams(): Params[] {
  return rutasDeProductos();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { categoria, producto } = await params;
  const p = productoPorSlug(categoria, producto);
  if (!p) return {};

  const desde = precioDesde(p);
  const varios = p.precios.length > 1;
  const titulo = `${p.nombre} ${varios ? `desde $${desde}` : `$${desde}`}`;

  return {
    title: titulo,
    description: `${p.descripcionCorta} ${
      p.ingredientes?.length ? `Con ${p.ingredientes.slice(0, 4).join(", ").toLowerCase()}. ` : ""
    }Pídelo en El Huerto, el kiosco de Ciudad UP en Bosque Real.`,
    alternates: { canonical: `/carta/${categoria}/${producto}` },
    openGraph: {
      title: `${p.nombre} — El Huerto Ciudad UP`,
      description: p.descripcionCorta,
      url: `/carta/${categoria}/${producto}`,
      ...(p.imagen ? { images: [{ url: p.imagen, alt: p.imagenAlt ?? p.nombre }] } : {}),
    },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { categoria, producto } = await params;
  const p = productoPorSlug(categoria, producto);
  const cat = categoriaPorSlug(categoria);
  if (!p || !cat) notFound();

  const relacionados = productosRelacionados(p);
  const esBowl = p.categoria === "bowls";
  const esEnsalada = p.categoria === "ensaladas";

  const migas = migasJsonLd([
    { nombre: "Inicio", url: "/" },
    { nombre: "Carta", url: "/carta" },
    { nombre: cat.nombre, url: `/carta/${cat.slug}` },
    { nombre: p.nombre, url: `/carta/${cat.slug}/${p.slug}` },
  ]);

  return (
    <div className="bg-cream-100 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
        {/* Migas de pan */}
        <nav
          aria-label="Migas de pan"
          className="font-condensed text-sm font-semibold uppercase tracking-[0.12em] text-muted"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-red-600">
                Inicio
              </Link>
              <span aria-hidden="true" className="ml-2 text-red-500">·</span>
            </li>
            <li>
              <Link href="/carta" className="hover:text-red-600">
                Carta
              </Link>
              <span aria-hidden="true" className="ml-2 text-red-500">·</span>
            </li>
            <li>
              <Link href={`/carta/${cat.slug}`} className="hover:text-red-600">
                {cat.nombre}
              </Link>
              <span aria-hidden="true" className="ml-2 text-red-500">·</span>
            </li>
            <li aria-current="page" className="text-green-900">
              {p.nombre}
            </li>
          </ol>
        </nav>

        {/* Ficha del producto */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-3xl border border-borde bg-cream-50 p-8">
            {p.imagen ? (
              <Image
                src={p.imagen}
                alt={p.imagenAlt ?? p.nombre}
                fill
                sizes="(max-width: 1024px) 90vw, 460px"
                priority
                className="object-contain p-10 drop-shadow-[0_24px_32px_rgba(36,33,30,0.18)]"
              />
            ) : (
              <Brote className="h-20 w-20 text-moss-300" />
            )}
            {p.badge ? (
              <span className="absolute left-5 top-5 rounded-full bg-green-800 px-4 py-1.5 font-condensed text-xs font-bold uppercase tracking-[0.12em] text-cream-100">
                {p.badge}
              </span>
            ) : null}
          </Reveal>

          <div className="flex flex-col items-start gap-5">
            <p className="kicker flex items-center gap-2 text-red-600">
              <Brote className="h-4 w-4" />
              {cat.nombre}
            </p>

            <h1 className="titulo-huerto text-4xl text-green-950 sm:text-5xl lg:text-6xl">
              {p.nombre}
            </h1>

            <p className="text-lg text-muted">{p.descripcionCorta}</p>

            {/* Precios */}
            <ul className="flex flex-wrap items-center gap-3">
              {p.precios.map((precio) => (
                <li key={precio.etiqueta ?? precio.valor} className="flex items-center gap-2">
                  {precio.etiqueta ? (
                    <span className="font-condensed text-base font-semibold uppercase tracking-[0.08em] text-green-900">
                      {precio.etiqueta}
                    </span>
                  ) : null}
                  <PriceBadge valor={precio.valor} talla="md" />
                </li>
              ))}
            </ul>

            {p.extras?.length ? (
              <ul className="flex flex-wrap gap-2">
                {p.extras.map((e) => (
                  <li
                    key={e.nombre}
                    className="rounded-full border border-red-600/30 bg-warmwhite px-4 py-1.5 text-sm font-semibold text-red-600"
                  >
                    {e.nombre} +${e.precio}
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Ingredientes */}
            {p.ingredientes?.length && !esEnsalada ? (
              <div className="w-full">
                <h2 className="kicker mb-3 text-green-900">Lleva</h2>
                <ul className="flex flex-wrap gap-2">
                  {p.ingredientes.map((i) => (
                    <li
                      key={i}
                      className="rounded-full border border-borde bg-warmwhite px-4 py-1.5 text-sm font-semibold text-green-900"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {p.notas ? (
              <p className="rounded-xl bg-green-800/10 px-4 py-3 text-sm font-semibold text-green-900">
                {p.notas}
              </p>
            ) : null}

            {!p.disponible ? (
              <p className="rounded-xl bg-ink/10 px-4 py-3 text-sm font-semibold text-ink">
                Ahorita no lo tenemos disponible. Escríbenos y te decimos cuándo vuelve.
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-1">
              <Boton
                href={waLink(WA_MENSAJES.producto(p.nombre), `producto-${p.slug}`)}
                externo
                variante="rojo"
                talla="lg"
              >
                Pedir por WhatsApp
              </Boton>
              <Boton href="/ubicacion" variante="contorno" talla="lg" className="text-green-900">
                Cómo llegar
              </Boton>
            </div>
          </div>
        </div>

        {/* Toppings cuando aplica */}
        {esBowl || esEnsalada ? (
          <Reveal className="rounded-3xl border border-borde bg-cream-50 p-6 sm:p-8">
            <h2 className="titulo-huerto text-xl text-green-950">
              {esBowl ? "Elige tus toppings" : "17 toppings a elegir"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {esBowl
                ? "Todos los bowls incluyen granola. Cada topping adicional cuesta $10."
                : "Tu ensalada incluye 3 toppings; cada topping adicional cuesta $10."}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(esBowl ? TOPPINGS_BOWLS : TOPPINGS_ENSALADA).map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-borde bg-warmwhite px-4 py-1.5 text-sm font-semibold text-green-900"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {/* Enlazado interno */}
        {relacionados.length ? (
          <section className="flex flex-col gap-6">
            <h2 className="titulo-huerto text-2xl text-green-950 sm:text-3xl">
              También se antoja
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((r) => (
                <ProductCard key={r.id} producto={r} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Cierre local */}
        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-green-800 p-8 texture-papel">
          <p className="relative flex-1 basis-64 font-condensed text-2xl font-bold uppercase leading-tight text-cream-100">
            {p.nombre} te espera en el kiosco de Ciudad UP.
          </p>
          <div className="relative flex gap-3">
            <Boton href={`/carta/${cat.slug}`} variante="crema">
              Ver {cat.nombre.toLowerCase()}
            </Boton>
            <Boton href={SITE.ubicacion.mapsUrl} externo variante="contornoCrema">
              Abrir en Maps
            </Boton>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdProps(productoJsonLd(p))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdProps(migas)} />
    </div>
  );
}
