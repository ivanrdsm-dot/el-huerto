import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Boton } from "@/components/ui/Boton";
import { Reveal } from "@/components/motion/Reveal";
import { SITE } from "@/lib/site";

/**
 * Galería administrable con contenido oficial propio.
 * No simula un feed en vivo: cuando exista conexión con la API de Instagram,
 * este componente se sustituirá por el feed real (ver docs/guia-conectores.md).
 */
const GALERIA = [
  {
    src: "/photos/bebidas-brindis-cafe-chocolate.png",
    alt: "Brindis con dos bebidas de El Huerto: latte helado y smoothie de chocolate",
  },
  {
    src: "/photos/smoothie-zanahoria-canasta.png",
    alt: "Smoothie de zanahoria de El Huerto dentro de una canasta con fruta fresca",
  },
  {
    src: "/photos/smoothies-vista-superior.png",
    alt: "Cuatro smoothies de El Huerto vistos desde arriba",
  },
  {
    src: "/photos/smoothies-gato-sabores.png",
    alt: "Cinco smoothies de El Huerto de distintos sabores en cuadrícula",
  },
] as const;

export function InstagramGallery() {
  return (
    <section className="bg-cream-100 py-16 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6">
        <SectionHeading
          kicker={`@${SITE.instagramUser}`}
          titulo="Lo que se está antojando."
          subtitulo="Un poco de lo que pasa todos los días en el kiosco."
        />

        <ul className="grid w-full grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {GALERIA.map((foto, i) => (
            <Reveal as="li" key={foto.src} delay={i * 80}>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-2xl border border-borde"
                aria-label={`${foto.alt} — ver Instagram de El Huerto`}
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-green-950/0 transition-colors duration-300 group-hover:bg-green-950/20" />
              </a>
            </Reveal>
          ))}
        </ul>

        <Boton href={SITE.instagramUrl} externo variante="verde" talla="lg">
          Síguenos en Instagram
        </Boton>
      </div>
    </section>
  );
}
