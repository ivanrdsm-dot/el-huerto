import Image from "next/image";
import type { Combo } from "@/types/menu";
import { Brote } from "@/components/brand/BotanicalPattern";
import { waLink, WA_MENSAJES } from "@/lib/site";

/** Tarjeta de combo sobre fondo verde, inspirada en los laterales impresos */
export function ComboCard({ combo }: { combo: Combo }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream-100/15 bg-green-900/60 p-6 transition-colors duration-300 hover:bg-green-900">
      <div className="flex items-start justify-between gap-3">
        <h3 className="titulo-huerto text-2xl text-cream-100 sm:text-3xl">{combo.nombre}</h3>
        <span className="etiqueta-precio text-xl sm:text-2xl">${combo.precio}</span>
      </div>

      {combo.badge ? (
        <span className="mt-3 self-start rounded-full border border-cream-100/30 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-[0.14em] text-cream-100/90">
          {combo.badge}
        </span>
      ) : null}

      <div className="relative my-5 flex aspect-[5/3] items-end justify-center gap-1">
        {combo.imagenes?.length ? (
          combo.imagenes.map((img, i) => (
            <div
              key={img.src}
              className={`relative h-full ${i === 0 ? "w-[42%] -rotate-2" : "w-[52%] rotate-2"}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 40vw, 200px"
                className="object-contain object-bottom drop-shadow-[0_16px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </div>
          ))
        ) : (
          <Brote className="h-14 w-14 self-center text-moss-300/60" />
        )}
      </div>

      <p className="font-condensed text-lg font-semibold uppercase tracking-[0.1em] text-cream-100/90">
        {combo.incluye.join(" + ")}
      </p>
      <p className="mt-1 text-sm text-cream-100/65">{combo.descripcion}</p>

      <a
        href={waLink(WA_MENSAJES.producto(`el combo ${combo.nombre}`), `combo-${combo.slug}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 self-start font-condensed text-sm font-bold uppercase tracking-[0.1em] text-cream-100 underline decoration-red-500 decoration-2 underline-offset-4 transition-colors hover:text-red-300"
      >
        Lo quiero
      </a>
    </article>
  );
}
