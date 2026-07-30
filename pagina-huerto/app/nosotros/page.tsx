import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { VideoLoop } from "@/components/motion/VideoLoop";
import { Boton } from "@/components/ui/Boton";
import { HojaRama } from "@/components/brand/BotanicalPattern";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "El Huerto es el kiosco de Ciudad UP donde comer bien no es un lujo: smoothies, café, bowls, paninis y ensaladas preparados frescos todos los días.",
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosPage() {
  return (
    <div className="bg-cream-100 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <SectionHeading
              kicker="Nuestra historia"
              titulo="Comer bien en la uni no debería ser un lujo."
              subtitulo="Con esa idea nació El Huerto: un kiosco dentro de Ciudad UP donde lo natural, lo fresco y lo saludable están al alcance de cualquier estudiante."
              alinear="izquierda"
            />
            <p className="max-w-xl text-muted">
              Todos los días seleccionamos fruta, horneamos con calma y
              preparamos cada smoothie, bowl, panini y café al momento. Sin
              menús eternos ni precios de centro comercial: comida real, rica y
              pensada para tu ritmo entre clases.
            </p>
            <div className="flex flex-wrap gap-3">
              <Boton href="/carta" variante="rojo" talla="lg">
                Conoce la carta
              </Boton>
              <Boton href="/ubicacion" variante="contorno" talla="lg" className="text-green-900">
                Visítanos
              </Boton>
            </div>
          </div>

          <Reveal delay={120} className="relative mx-auto w-full max-w-sm">
            <Image
              src="/photos/smoothie-zanahoria-canasta.png"
              alt="Smoothie de zanahoria de El Huerto en una canasta con fruta fresca"
              width={900}
              height={900}
              className="rounded-3xl border border-borde shadow-flotante"
            />
          </Reveal>
        </div>

        {/* Valores */}
        <section className="relative overflow-hidden rounded-3xl bg-green-800 p-8 texture-papel sm:p-12">
          <HojaRama className="pointer-events-none absolute -right-10 -top-6 h-72 w-44 text-moss-300/15 rotate-[30deg]" />
          <div className="relative grid gap-8 sm:grid-cols-3">
            {[
              {
                titulo: "Natural",
                texto: "Ingredientes de verdad, seleccionados y preparados el mismo día.",
              },
              {
                titulo: "Fresco",
                texto: "Nada recalentado ni de máquina: todo sale al momento del kiosco.",
              },
              {
                titulo: "Saludable",
                texto: "Opciones dulces, saladas y ligeras para armar tu día como quieras.",
              },
            ].map((v, i) => (
              <Reveal key={v.titulo} delay={i * 90} className="flex flex-col gap-2">
                <h2 className="titulo-huerto text-2xl text-cream-50">{v.titulo}</h2>
                <p className="text-sm text-cream-100/75">{v.texto}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* La pantera / comunidad UP */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="order-2 mx-auto w-full max-w-sm lg:order-1">
            <div className="overflow-hidden rounded-3xl border border-borde shadow-suave">
              <VideoLoop
                src="/videos/pantera-bici.mp4"
                poster="/videos/pantera-bici-poster.jpg"
                aspecto="aspect-square"
                etiqueta="Animación de la pantera de la UP en bicicleta con su bebida de El Huerto"
              />
            </div>
          </Reveal>
          <div className="order-1 flex flex-col gap-4 lg:order-2">
            <SectionHeading
              kicker="Hecho para la comunidad UP"
              titulo="Aquí empieza tu break."
              subtitulo="Estudiantes, profes y todo el campus pasan por El Huerto entre clases. Súmate: el primer smoothie casi siempre se convierte en costumbre."
              alinear="izquierda"
            />
            <Boton href={SITE.instagramUrl} externo variante="verde" talla="lg" className="self-start">
              Síguenos en @{SITE.instagramUser}
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
}
