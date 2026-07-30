import Image from "next/image";
import { Boton } from "@/components/ui/Boton";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-cream-100 px-6 pt-24 text-center">
      <Image
        src="/brand/logo-rojo.svg"
        alt=""
        width={160}
        height={160}
        className="h-32 w-auto opacity-90"
      />
      <h1 className="titulo-huerto text-4xl text-green-950 sm:text-5xl">
        Esta página se nos acabó.
      </h1>
      <p className="max-w-md text-muted">
        Como los açaí bowls a mediodía: lo que buscabas ya no está aquí. Pero la
        carta completa sigue fresquita.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Boton href="/" variante="rojo" talla="lg">
          Volver al inicio
        </Boton>
        <Boton href="/carta" variante="contorno" talla="lg" className="text-green-900">
          Ver la carta
        </Boton>
      </div>
    </div>
  );
}
