"use client";

import { Boton } from "@/components/ui/Boton";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-cream-100 px-6 pt-24 text-center">
      <h1 className="titulo-huerto text-4xl text-green-950">Algo se nos cayó en la licuadora.</h1>
      <p className="max-w-md text-muted">
        Hubo un error inesperado. Intenta de nuevo o vuelve al inicio.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-red-600 px-8 py-4 font-condensed text-lg font-bold uppercase tracking-[0.08em] text-warmwhite transition-colors hover:bg-red-700"
        >
          Reintentar
        </button>
        <Boton href="/" variante="contorno" talla="lg" className="text-green-900">
          Ir al inicio
        </Boton>
      </div>
    </div>
  );
}
