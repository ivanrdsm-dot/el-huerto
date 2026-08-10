import Image from "next/image";
import Link from "next/link";
import { HojaRama } from "@/components/brand/BotanicalPattern";
import { SITE, waLink, WA_MENSAJES } from "@/lib/site";

const COLUMNAS = [
  {
    titulo: "Carta",
    enlaces: [
      { href: "/carta/smoothies", label: "Smoothies" },
      { href: "/carta/cafe", label: "Café" },
      { href: "/carta/bowls", label: "Bowls" },
      { href: "/carta/paninis", label: "Paninis" },
      { href: "/combos", label: "Combos" },
    ],
  },
  {
    titulo: "El Huerto",
    enlaces: [
      { href: "/ubicacion", label: "Ubicación" },
      { href: "/nosotros", label: "Nosotros" },
      { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
      { href: "/instagram", label: "Instagram" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  {
    titulo: "Legal",
    enlaces: [
      { href: "/privacidad", label: "Aviso de privacidad" },
      { href: "/terminos", label: "Términos y condiciones" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-green-950 text-cream-100">
      <HojaRama className="pointer-events-none absolute -left-10 top-6 h-72 w-44 text-moss-500/25 rotate-12" />
      <HojaRama className="pointer-events-none absolute -right-8 bottom-0 h-64 w-40 text-moss-500/20 -rotate-45" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Image
              src="/brand/logo-crema.svg"
              alt="El Huerto"
              width={150}
              height={150}
              className="h-28 w-auto self-start"
            />
            <p className="kicker text-red-300">{SITE.tagline}</p>
            <p className="max-w-xs text-sm text-cream-100/70">
              {SITE.ubicacion.nombre}, {SITE.ubicacion.zona}, {SITE.ubicacion.municipio},{" "}
              {SITE.ubicacion.estado}.
            </p>
            <div className="mt-1 flex gap-3">
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de El Huerto"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-100/30 transition-colors hover:border-red-300 hover:text-red-300"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={waLink(WA_MENSAJES.general, "footer")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de El Huerto"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-100/30 transition-colors hover:border-red-300 hover:text-red-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2Z" />
                </svg>
              </a>
            </div>
          </div>

          {COLUMNAS.map((col) => (
            <nav key={col.titulo} aria-label={`Enlaces de ${col.titulo}`}>
              <h3 className="kicker mb-4 text-moss-300">{col.titulo}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.enlaces.map((e) => (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      className="text-sm text-cream-100/80 transition-colors hover:text-warmwhite"
                    >
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-cream-100/15 pt-6 text-xs text-cream-100/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} El Huerto. Todos los derechos reservados.
          </p>
          <p>Nos vemos entre clases · Ciudad UP, Bosque Real</p>
        </div>
      </div>
    </footer>
  );
}
