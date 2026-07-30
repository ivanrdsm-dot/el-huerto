import Image from "next/image";
import { Hero } from "@/components/Hero";
import { CategoryCarousel } from "@/components/menu/CategoryCarousel";
import { ComboCard } from "@/components/menu/ComboCard";
import { BowlBuilder } from "@/components/menu/BowlBuilder";
import { LocationSection } from "@/components/LocationSection";
import { InstagramGallery } from "@/components/InstagramGallery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Boton } from "@/components/ui/Boton";
import { Reveal } from "@/components/motion/Reveal";
import { VideoLoop } from "@/components/motion/VideoLoop";
import { HojaRama, Brote } from "@/components/brand/BotanicalPattern";
import { PriceBadge } from "@/components/menu/PriceBadge";
import { COMBOS, PRODUCTOS } from "@/data/menu";

const SMOOTHIES_HOME = PRODUCTOS.filter((p) => p.categoria === "smoothies").slice(0, 4);

const PILARES = [
  {
    titulo: "Frescura diaria",
    texto: "Seleccionamos y preparamos nuestros ingredientes todos los días.",
    icono: "hoja",
  },
  {
    titulo: "Precios justos",
    texto: "Opciones pensadas para disfrutar entre clases sin gastar de más.",
    icono: "precio",
  },
  {
    titulo: "Variedad real",
    texto: "Smoothies, café, bowls, paninis, ensaladas y snacks en un solo lugar.",
    icono: "variedad",
  },
] as const;

function IconoPilar({ tipo }: { tipo: (typeof PILARES)[number]["icono"] }) {
  const comun = "h-10 w-10 text-green-800";
  if (tipo === "hoja") return <Brote className={comun} />;
  if (tipo === "precio")
    return (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" className={comun} aria-hidden="true">
        <path d="M8 20 22 6h12a8 8 0 0 1 8 8v12L28 40a5 5 0 0 1-7 0L8 27a5 5 0 0 1 0-7Z" strokeLinejoin="round" />
        <circle cx="33" cy="15" r="3" />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" className={comun} aria-hidden="true">
      <path d="M10 30c0-8 6-14 14-14s14 6 14 14" strokeLinecap="round" />
      <path d="M6 30h36l-3 8a5 5 0 0 1-5 4H14a5 5 0 0 1-5-4l-3-8Z" strokeLinejoin="round" />
      <path d="M24 16V9m0 0c3-1 5-3 5-3s-1 4-5 3Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      {/* Marquesina de marca */}
      <div className="overflow-hidden border-y-2 border-green-800/10 bg-cream-50 py-3" aria-hidden="true">
        <div className="anim-marquesina flex w-max gap-8 whitespace-nowrap font-condensed text-lg font-bold uppercase tracking-[0.2em] text-moss-500">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>Natural</span>
              <span className="text-red-500">·</span>
              <span>Fresco</span>
              <span className="text-red-500">·</span>
              <span>Saludable</span>
              <span className="text-red-500">·</span>
              <span>Nos vemos en Ciudad UP</span>
              <span className="text-red-500">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ¿Qué se te antoja? */}
      <section className="bg-cream-100 py-16 sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
          <SectionHeading
            kicker="La carta"
            titulo="¿Qué se te antoja?"
            subtitulo="Algo fresco, algo caliente o algo para seguir con tu día."
          />
          <CategoryCarousel />
        </div>
      </section>

      {/* Combos */}
      <section className="relative overflow-hidden bg-green-800 py-16 texture-papel sm:py-24">
        <HojaRama className="pointer-events-none absolute -right-10 top-4 h-80 w-48 text-moss-300/15 rotate-[24deg]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              kicker="Duplas de la casa"
              titulo="Los combos."
              subtitulo="Como en el kiosco: dos favoritos, un precio."
              tono="claro"
              alinear="izquierda"
            />
            <Reveal delay={100}>
              <Boton href="/combos" variante="crema">
                Ver todos los combos
              </Boton>
            </Reveal>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {COMBOS.slice(0, 3).map((combo, i) => (
              <Reveal key={combo.id} delay={i * 90}>
                <ComboCard combo={combo} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Smoothies */}
      <section className="bg-cream-100 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto w-full max-w-[300px]">
              <div className="overflow-hidden rounded-[2rem] border-4 border-green-950 shadow-flotante">
                <VideoLoop
                  src="/videos/smoothie-sediento-vertical.mp4"
                  poster="/videos/smoothie-sediento-poster.jpg"
                  etiqueta="Video del smoothie Pal’ Sediento de El Huerto"
                />
              </div>
              <span className="etiqueta-precio absolute -right-4 top-6 text-xl">$99</span>
            </div>
          </Reveal>

          <div className="order-1 flex flex-col gap-8 lg:order-2">
            <SectionHeading
              kicker="Smoothies"
              titulo="Un smoothie y seguimos."
              subtitulo="Fruta, sabor y energía para continuar con tu día. Todos a $99, con opción de proteína extra por $15."
              alinear="izquierda"
            />
            <ul className="grid grid-cols-2 gap-4">
              {SMOOTHIES_HOME.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 70}>
                  <div className="group flex flex-col items-center gap-2 rounded-2xl border border-borde bg-cream-50 p-4 text-center shadow-suave transition-all duration-300 hover:-translate-y-1">
                    {s.imagen ? (
                      <Image
                        src={s.imagen}
                        alt={s.imagenAlt ?? s.nombre}
                        width={160}
                        height={300}
                        className="h-32 w-auto drop-shadow-[0_12px_16px_rgba(36,33,30,0.18)] transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <p className="font-condensed text-lg font-bold uppercase leading-none text-green-950">
                      {s.nombre}
                    </p>
                    <p className="text-xs text-muted">{s.ingredientes?.join(" · ")}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Reveal>
              <Boton href="/carta/smoothies" variante="rojo" talla="lg">
                Ver todos los smoothies
              </Boton>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Café */}
      <section className="relative overflow-hidden bg-green-950 py-16 texture-papel sm:py-24">
        <HojaRama className="pointer-events-none absolute -left-12 bottom-0 h-72 w-44 text-moss-500/20 rotate-[12deg]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <SectionHeading
              kicker="Café desde $30"
              titulo="Tu café entre clases."
              subtitulo="Americano, latte, capuchino, flat white y más, preparados al momento."
              tono="claro"
              alinear="izquierda"
            />
            <ul className="flex flex-wrap gap-2.5">
              {["Espresso $30", "Americano $40", "Latte $50", "Capuchino $50", "Flat white $50", "Cortado $60"].map(
                (item) => (
                  <li
                    key={item}
                    className="rounded-full border border-cream-100/25 px-4 py-1.5 font-condensed text-base font-semibold uppercase tracking-[0.06em] text-cream-100/90"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
            <Reveal>
              <Boton href="/carta/cafe" variante="rojo" talla="lg">
                Ver café y té
              </Boton>
            </Reveal>
          </div>

          <Reveal delay={120} className="relative mx-auto">
            <Image
              src="/products/cafe-latte.png"
              alt="Latte de El Huerto en vaso verde con arte en la leche"
              width={657}
              height={793}
              className="anim-flotar w-64 drop-shadow-[0_28px_40px_rgba(0,0,0,0.5)] sm:w-80"
            />
            <PriceBadge valor={30} prefijo="desde" talla="lg" className="absolute -left-2 bottom-8" />
          </Reveal>
        </div>
      </section>

      {/* Arma tu bowl */}
      <section className="bg-cream-100 py-16 sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
          <SectionHeading
            kicker="Açaí y overnight oats"
            titulo="Arma tu bowl."
            subtitulo="Elige tu base, ponle tus toppings y ve el precio al momento."
          />
          <Reveal>
            <BowlBuilder />
          </Reveal>
        </div>
      </section>

      {/* Filosofía */}
      <section className="bg-cream-50 py-16 sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
          <SectionHeading
            kicker="Por qué El Huerto"
            titulo="Comer bien, sin complicarte."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {PILARES.map((pilar, i) => (
              <Reveal key={pilar.titulo} delay={i * 90} className="flex flex-col items-center gap-4 rounded-3xl border border-borde bg-cream-100 p-8 text-center">
                <IconoPilar tipo={pilar.icono} />
                <h3 className="titulo-huerto text-xl text-green-950">{pilar.titulo}</h3>
                <p className="text-sm text-muted">{pilar.texto}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LocationSection />
      <InstagramGallery />
    </>
  );
}
