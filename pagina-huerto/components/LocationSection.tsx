import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Boton } from "@/components/ui/Boton";
import { Reveal } from "@/components/motion/Reveal";
import { SITE, waLink, WA_MENSAJES } from "@/lib/site";

/**
 * Sección de ubicación. Sin coordenadas exactas todavía
 * (pendiente de validación): el botón abre la búsqueda de Ciudad UP en Maps.
 */
export function LocationSection({ completa = false }: { completa?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-cream-50 py-16 sm:py-24" id="ubicacion">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <SectionHeading
          kicker="Nos vemos en Ciudad UP"
          titulo="Encuéntranos en Ciudad UP."
          subtitulo="Ven a visitarnos entre clases. Te esperamos con todo fresquito."
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Tarjeta principal */}
          <Reveal className="flex flex-col justify-between gap-8 rounded-3xl bg-green-800 p-8 text-cream-100 texture-papel sm:p-10">
            <div className="relative flex flex-col gap-3">
              <p className="kicker text-red-300">El kiosco</p>
              <p className="titulo-huerto text-3xl sm:text-4xl">
                {SITE.ubicacion.nombre}
              </p>
              <p className="max-w-md text-cream-100/80">
                {SITE.ubicacion.zona}, {SITE.ubicacion.municipio},{" "}
                {SITE.ubicacion.estado}.
              </p>
              <p className="text-sm text-cream-100/60">
                Horario de servicio en días de clases. Consulta el calendario
                académico o escríbenos antes de venir.
              </p>
            </div>
            <div className="relative flex flex-wrap gap-3">
              <Boton href={SITE.ubicacion.mapsUrl} externo variante="rojo" talla="lg">
                Abrir en Google Maps
              </Boton>
              <Boton
                href={waLink(WA_MENSAJES.ubicacion, "ubicacion")}
                externo
                variante="contornoCrema"
                talla="lg"
              >
                Escríbenos
              </Boton>
            </div>
          </Reveal>

          {/* Visual */}
          <Reveal delay={120} className="relative min-h-[280px] overflow-hidden rounded-3xl border border-borde bg-cream-100">
            <Image
              src="/photos/bebidas-brindis-cafe-chocolate.png"
              alt="Dos bebidas de El Huerto chocando en un brindis"
              fill
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-cover"
            />
          </Reveal>
        </div>

        {completa ? (
          <Reveal className="grid gap-4 sm:grid-cols-3">
            {[
              {
                titulo: "Dentro del campus",
                texto:
                  "Somos el kiosco de El Huerto dentro de Ciudad UP. La referencia exacta del punto se publicará muy pronto.",
              },
              {
                titulo: "Pide por WhatsApp",
                texto: `Escríbenos al ${SITE.whatsappDisplay} y tenemos tu pedido listo para que solo pases por él.`,
              },
              {
                titulo: "Síguenos",
                texto: `En Instagram @${SITE.instagramUser} publicamos el menú del día, promos y novedades.`,
              },
            ].map((item) => (
              <div key={item.titulo} className="rounded-2xl border border-borde bg-warmwhite p-6">
                <h3 className="font-condensed text-xl font-bold uppercase tracking-[0.06em] text-green-900">
                  {item.titulo}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.texto}</p>
              </div>
            ))}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
