import Image from "next/image";
import { HojaRama } from "@/components/brand/BotanicalPattern";
import { Boton } from "@/components/ui/Boton";
import { SITE, waLink, WA_MENSAJES } from "@/lib/site";

const TITULO = "COMER BIEN EN LA UNI NO DEBERÍA SER UN LUJO.";

/**
 * Hero — Opción A: fondo verde olivo, texto crema, CTA rojo,
 * producto real protagonista (recortes oficiales del menú).
 */
export function Hero() {
  const palabras = TITULO.split(" ");

  return (
    <section className="relative overflow-hidden bg-green-800 text-cream-100 texture-papel">
      {/* Hojas lineales de fondo */}
      <HojaRama className="pointer-events-none absolute -left-14 -top-8 h-[420px] w-64 text-moss-300/20 rotate-[18deg]" />
      <HojaRama className="pointer-events-none absolute -right-16 bottom-0 h-[380px] w-56 text-moss-300/15 -rotate-[30deg]" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-32 sm:pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-6 lg:pb-24 lg:pt-40">
        {/* Texto */}
        <div className="flex flex-col items-start gap-6">
          <p
            className="kicker text-red-300 hero-palabra"
            style={{ animationDelay: "80ms" }}
          >
            {SITE.tagline}
          </p>

          <h1 className="titulo-huerto text-[2.6rem] leading-[0.98] text-cream-50 sm:text-6xl lg:text-7xl">
            {palabras.map((palabra, i) => (
              <span
                key={i}
                className="hero-palabra mr-[0.24em]"
                style={{ animationDelay: `${140 + i * 70}ms` }}
              >
                {palabra === "LUJO." ? (
                  <span className="text-red-300">{palabra}</span>
                ) : (
                  palabra
                )}
              </span>
            ))}
          </h1>

          <p
            className="hero-palabra max-w-md text-lg text-cream-100/85"
            style={{ animationDelay: `${140 + palabras.length * 70 + 100}ms` }}
          >
            Smoothies, bowls, paninis, ensaladas y café preparados frescos todos
            los días. Encuéntranos en Ciudad UP.
          </p>

          <div
            className="hero-palabra flex flex-wrap gap-3"
            style={{ animationDelay: `${140 + palabras.length * 70 + 220}ms` }}
          >
            <Boton href="/carta" variante="rojo" talla="lg">
              Ver la carta
            </Boton>
            <Boton href="/ubicacion" variante="contornoCrema" talla="lg">
              Cómo llegar
            </Boton>
          </div>

          <a
            href={waLink(WA_MENSAJES.general, "hero")}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-palabra font-condensed text-base font-semibold uppercase tracking-[0.12em] text-cream-100/70 underline decoration-red-300 decoration-2 underline-offset-4 transition-colors hover:text-cream-50"
            style={{ animationDelay: `${140 + palabras.length * 70 + 340}ms` }}
          >
            o escríbenos por WhatsApp
          </a>
        </div>

        {/* Producto protagonista: recortes oficiales flotando */}
        <div className="relative mx-auto h-[380px] w-full max-w-[420px] sm:h-[460px]" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream-100/10 sm:h-80 sm:w-80" />
          <Image
            src="/products/smoothie-fresa.png"
            alt=""
            width={413}
            height={830}
            priority
            className="anim-flotar absolute left-[8%] top-1/2 w-36 -translate-y-1/2 rotate-[-6deg] drop-shadow-[0_24px_32px_rgba(0,0,0,0.35)] sm:w-44"
          />
          <Image
            src="/products/smoothie-matcha.png"
            alt=""
            width={714}
            height={1404}
            priority
            className="anim-flotar absolute right-[10%] top-[46%] w-32 -translate-y-1/2 rotate-[7deg] drop-shadow-[0_24px_32px_rgba(0,0,0,0.35)] sm:w-40"
            style={{ animationDelay: "1.2s" }}
          />
          <Image
            src="/products/panini-jamon.png"
            alt=""
            width={1392}
            height={693}
            className="anim-flotar absolute bottom-[4%] left-1/2 w-52 -translate-x-1/2 rotate-[-3deg] drop-shadow-[0_20px_28px_rgba(0,0,0,0.4)] sm:w-64"
            style={{ animationDelay: "0.6s" }}
          />
          <span className="etiqueta-precio absolute right-[4%] top-[16%] text-xl sm:text-2xl">
            smoothies $99
          </span>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="relative flex justify-center pb-6" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 animate-bounce text-cream-100/60">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
