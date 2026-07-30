"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { TOPPINGS_BOWLS, TOPPING_EXTRA_PRECIO } from "@/data/menu";
import { waLink } from "@/lib/site";

const BASES = [
  {
    id: "overnight",
    nombre: "Overnight oats",
    imagen: "/products/overnight-oats.png",
    precios: [79, 89, 99], // 1, 2, 3 toppings
  },
  {
    id: "acai",
    nombre: "Açaí bowl",
    imagen: "/products/acai-bowl.png",
    precios: [129, 139, 149],
  },
] as const;

/**
 * Simulador informativo de bowls: elige base y toppings, ve el precio
 * y consulta por WhatsApp. No genera un pedido real.
 */
export function BowlBuilder() {
  const [baseId, setBaseId] = useState<(typeof BASES)[number]["id"]>("acai");
  const [toppings, setToppings] = useState<string[]>(["Fresa", "Granola"]);

  const base = BASES.find((b) => b.id === baseId)!;

  const precio = useMemo(() => {
    const n = toppings.length;
    if (n === 0) return base.precios[0];
    const incluidos = Math.min(n, 3);
    const extras = Math.max(0, n - 3);
    return base.precios[incluidos - 1] + extras * TOPPING_EXTRA_PRECIO;
  }, [base, toppings]);

  function alternarTopping(t: string) {
    setToppings((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  const mensaje = `Hola, vi el armador de bowls en la página de El Huerto. Quiero un ${base.nombre} con ${
    toppings.length ? toppings.join(", ") : "granola"
  } (aprox. $${precio}). ¿Está disponible?`;

  return (
    <div className="grid gap-8 rounded-3xl border border-borde bg-cream-50 p-6 shadow-suave sm:p-8 lg:grid-cols-[1fr_1.2fr]">
      {/* Visual */}
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative aspect-square w-full max-w-[320px]">
          <Image
            src={base.imagen}
            alt={base.nombre}
            fill
            sizes="320px"
            className="object-contain drop-shadow-[0_20px_30px_rgba(36,33,30,0.18)]"
          />
        </div>
        <p aria-live="polite" className="flex items-baseline gap-3">
          <span className="font-condensed text-lg font-semibold uppercase tracking-[0.1em] text-green-900">
            Tu bowl
          </span>
          <span className="etiqueta-precio text-3xl">${precio}</span>
        </p>
        <p className="text-xs text-muted">Todos los bowls incluyen granola.</p>
      </div>

      {/* Controles */}
      <div className="flex flex-col gap-6">
        <fieldset>
          <legend className="kicker mb-3 text-red-600">1 · Elige tu base</legend>
          <div className="flex gap-3">
            {BASES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBaseId(b.id)}
                aria-pressed={baseId === b.id}
                className={`rounded-full px-5 py-2.5 font-condensed text-base font-bold uppercase tracking-[0.06em] transition-colors ${
                  baseId === b.id
                    ? "bg-green-800 text-cream-100"
                    : "border border-borde bg-warmwhite text-green-900 hover:border-green-800"
                }`}
              >
                {b.nombre}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="kicker mb-3 text-red-600">
            2 · Tus toppings <span className="normal-case tracking-normal text-muted">(3 incluidos, extra +${TOPPING_EXTRA_PRECIO})</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {TOPPINGS_BOWLS.map((t) => {
              const activo = toppings.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => alternarTopping(t)}
                  aria-pressed={activo}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activo
                      ? "bg-red-600 text-warmwhite"
                      : "border border-borde bg-warmwhite text-ink hover:border-red-600"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-auto flex flex-col gap-2">
          <a
            href={waLink(mensaje, "bowl-builder")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-4 font-condensed text-lg font-bold uppercase tracking-[0.08em] text-warmwhite transition-colors hover:bg-red-700"
          >
            Consultar por WhatsApp
          </a>
          <p className="text-center text-xs text-muted">
            Simulador informativo: el pedido se confirma directo en el kiosco o por WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
