import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/types/menu";
import { precioDesde } from "@/data/menu";
import { PriceBadge } from "@/components/menu/PriceBadge";
import { Brote } from "@/components/brand/BotanicalPattern";
import { waLink, WA_MENSAJES } from "@/lib/site";

export function ProductCard({ producto }: { producto: Producto }) {
  const desde = precioDesde(producto);
  const variosPrecios = producto.precios.length > 1;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-borde bg-cream-50 shadow-suave transition-all duration-300 hover:-translate-y-1 hover:shadow-flotante ${
        producto.disponible ? "" : "opacity-60"
      }`}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-cream-100">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.imagenAlt ?? producto.nombre}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <Brote className="h-14 w-14 text-moss-300" />
        )}
        {producto.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-green-800 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-[0.12em] text-cream-100">
            {producto.badge}
          </span>
        ) : null}
        {!producto.disponible ? (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-[0.12em] text-warmwhite">
            Agotado
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-condensed text-2xl font-bold uppercase leading-none text-green-950">
            {/* El enlace cubre toda la tarjeta (ver ::after) para no anidar interactivos */}
            <Link
              href={`/carta/${producto.categoria}/${producto.slug}`}
              className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-red-600"
            >
              {producto.nombre}
            </Link>
          </h3>
          <PriceBadge valor={desde} prefijo={variosPrecios ? "desde" : undefined} talla="sm" />
        </div>
        <p className="text-sm text-muted">{producto.descripcionCorta}</p>

        {producto.ingredientes && producto.categoria === "smoothies" ? (
          <p className="text-xs text-moss-500">{producto.ingredientes.join(" · ")}</p>
        ) : null}

        {variosPrecios ? (
          <ul className="mt-1 flex flex-wrap gap-2">
            {producto.precios.map((p) => (
              <li
                key={p.etiqueta ?? p.valor}
                className="rounded-full border border-borde bg-warmwhite px-3 py-1 font-condensed text-sm font-semibold text-green-900"
              >
                {p.etiqueta ? `${p.etiqueta} · ` : ""}${p.valor}
              </li>
            ))}
          </ul>
        ) : null}

        {producto.extras?.length ? (
          <p className="text-xs font-semibold text-red-600">
            {producto.extras.map((e) => `${e.nombre} +$${e.precio}`).join(" · ")}
          </p>
        ) : null}

        {producto.notas ? <p className="text-xs text-moss-500">{producto.notas}</p> : null}

        {/* z-10 mantiene el WhatsApp por encima del enlace que cubre la tarjeta */}
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3">
          <a
            href={waLink(WA_MENSAJES.producto(producto.nombre), `producto-${producto.slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-condensed text-sm font-bold uppercase tracking-[0.1em] text-green-800 underline decoration-red-500 decoration-2 underline-offset-4 transition-colors hover:text-red-600"
          >
            Pedir por WhatsApp
          </a>
          <Link
            href={`/carta/${producto.categoria}/${producto.slug}`}
            className="font-condensed text-sm font-bold uppercase tracking-[0.1em] text-muted transition-colors hover:text-green-900"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
