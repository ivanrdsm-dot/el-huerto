"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/carta", label: "Carta" },
  { href: "/combos", label: "Combos" },
  { href: "/ubicacion", label: "Ubicación" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/instagram", label: "Instagram" },
] as const;

/** Rutas cuyo hero es verde: el header transparente usa logo y texto crema */
const RUTAS_HERO_VERDE = ["/", "/combos"];

export function Header() {
  const [conFondo, setConFondo] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();
  const sobreVerde = RUTAS_HERO_VERDE.includes(pathname) && !conFondo && !abierto;

  useEffect(() => {
    const onScroll = () => setConFondo(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        conFondo || abierto
          ? "bg-cream-50/95 backdrop-blur-sm shadow-suave py-2"
          : "bg-transparent py-3.5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="El Huerto — inicio" className="shrink-0">
          <Image
            src={sobreVerde ? "/brand/logo-crema.svg" : "/brand/logo-rojo.svg"}
            alt="El Huerto"
            width={132}
            height={132}
            priority
            className={`w-auto transition-all duration-300 ${conFondo || abierto ? "h-12" : "h-14 sm:h-16"}`}
          />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-condensed text-lg font-semibold uppercase tracking-[0.1em] transition-colors ${
                pathname.startsWith(item.href)
                  ? sobreVerde
                    ? "text-red-300"
                    : "text-red-600"
                  : sobreVerde
                    ? "text-cream-100 hover:text-red-300"
                    : "text-green-950 hover:text-red-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/carta"
            className="rounded-full bg-red-600 px-5 py-2.5 font-condensed text-base font-bold uppercase tracking-[0.08em] text-warmwhite transition-colors hover:bg-red-700"
          >
            Ver la carta
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/carta"
            onClick={() => setAbierto(false)}
            className="rounded-full bg-red-600 px-4 py-2 font-condensed text-sm font-bold uppercase tracking-[0.08em] text-warmwhite"
          >
            La carta
          </Link>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className={`flex h-11 w-11 items-center justify-center rounded-full ${sobreVerde ? "text-cream-100" : "text-green-950"}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="h-6 w-6" aria-hidden="true">
              {abierto ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          abierto ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Navegación móvil" className="flex flex-col gap-1 px-6 pb-6 pt-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAbierto(false)}
              className="rounded-xl px-3 py-3.5 font-condensed text-2xl font-semibold uppercase tracking-[0.08em] text-green-950 hover:bg-cream-100"
            >
              {item.label}
            </Link>
          ))}
          <p className="mt-3 px-3 text-sm text-muted">{SITE.tagline}</p>
        </nav>
      </div>
    </header>
  );
}
