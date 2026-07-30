"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIAS, PRODUCTOS } from "@/data/menu";
import type { CategoriaSlug } from "@/types/menu";
import { ProductCard } from "@/components/menu/ProductCard";

const TABS = CATEGORIAS.filter((c) => c.slug !== "combos");

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Menú digital: tabs por categoría + buscador. */
export function MenuTabs({ inicial = "smoothies" }: { inicial?: CategoriaSlug }) {
  const [activa, setActiva] = useState<CategoriaSlug>(inicial);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    if (q) {
      return PRODUCTOS.filter(
        (p) =>
          normalizar(p.nombre).includes(q) ||
          normalizar(p.descripcionCorta).includes(q) ||
          (p.ingredientes ?? []).some((i) => normalizar(i).includes(q))
      );
    }
    return PRODUCTOS.filter((p) => p.categoria === activa);
  }, [activa, busqueda]);

  const buscando = busqueda.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Buscador */}
      <div className="relative max-w-md">
        <label htmlFor="buscar-menu" className="sr-only">
          Buscar en la carta
        </label>
        <input
          id="buscar-menu"
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Busca fresa, matcha, panini…"
          className="w-full rounded-full border-2 border-borde bg-warmwhite px-5 py-3 pr-12 text-base text-ink placeholder:text-muted/70 focus:border-green-800 focus:outline-none"
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Tabs */}
      {!buscando ? (
        <div
          role="tablist"
          aria-label="Categorías de la carta"
          className="carrusel -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {TABS.map((cat) => (
            <button
              key={cat.slug}
              role="tab"
              aria-selected={activa === cat.slug}
              onClick={() => setActiva(cat.slug)}
              className={`shrink-0 rounded-full px-5 py-2.5 font-condensed text-base font-bold uppercase tracking-[0.08em] transition-colors ${
                activa === cat.slug
                  ? "bg-green-800 text-cream-100"
                  : "border border-borde bg-cream-50 text-green-900 hover:border-green-800"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
          <Link
            href="/combos"
            className="shrink-0 rounded-full bg-red-600 px-5 py-2.5 font-condensed text-base font-bold uppercase tracking-[0.08em] text-warmwhite transition-colors hover:bg-red-700"
          >
            Combos
          </Link>
        </div>
      ) : (
        <p className="text-sm text-muted" role="status">
          {filtrados.length === 0
            ? "No encontramos nada con ese antojo. Prueba con otra palabra."
            : `${filtrados.length} resultado${filtrados.length === 1 ? "" : "s"} para “${busqueda.trim()}”`}
        </p>
      )}

      {/* Grid de productos */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>

      {filtrados.length === 0 && !buscando ? (
        <p className="rounded-2xl border border-borde bg-cream-50 p-8 text-center text-muted">
          Muy pronto encontrarás aquí esta categoría.
        </p>
      ) : null}
    </div>
  );
}
