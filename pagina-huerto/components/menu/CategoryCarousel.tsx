import Image from "next/image";
import Link from "next/link";
import { CATEGORIAS } from "@/data/menu";
import { Reveal } from "@/components/motion/Reveal";

/**
 * "¿Qué se te antoja?" — navegación visual de categorías.
 * Carrusel con snap en móvil, grid editorial en escritorio.
 */
export function CategoryCarousel() {
  return (
    <ul
      className="carrusel -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-3"
      aria-label="Categorías del menú"
    >
      {CATEGORIAS.map((cat, i) => {
        const href = cat.slug === "combos" ? "/combos" : `/carta/${cat.slug}`;
        return (
          <Reveal as="li" key={cat.slug} delay={Math.min(i * 60, 240)} className="min-w-[240px] snap-start sm:min-w-0">
            <Link
              href={href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-borde bg-cream-50 shadow-suave transition-all duration-300 hover:-translate-y-1.5 hover:shadow-flotante"
            >
              <div className="relative aspect-square overflow-hidden bg-cream-100">
                {cat.imagen ? (
                  <Image
                    src={cat.imagen}
                    alt={cat.imagenAlt ?? cat.nombre}
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 33vw, 360px"
                    className={`transition-transform duration-500 group-hover:scale-[1.06] ${
                      cat.imagen.startsWith("/photos/") ? "object-cover" : "object-contain p-6"
                    }`}
                  />
                ) : null}
                <span className="absolute bottom-3 right-3 etiqueta-precio text-sm">
                  desde ${cat.desde}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <h3 className="font-condensed text-2xl font-bold uppercase leading-none text-green-950 transition-colors group-hover:text-red-600">
                  {cat.nombre}
                </h3>
                <p className="text-sm text-muted">{cat.descripcion}</p>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
