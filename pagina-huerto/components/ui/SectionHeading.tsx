import { Brote } from "@/components/brand/BotanicalPattern";
import { Reveal } from "@/components/motion/Reveal";

export function SectionHeading({
  kicker,
  titulo,
  subtitulo,
  tono = "oscuro",
  alinear = "centro",
  como: Titulo = "h2",
}: {
  kicker?: string;
  titulo: string;
  subtitulo?: string;
  /** oscuro = texto verde sobre crema · claro = texto crema sobre verde */
  tono?: "oscuro" | "claro";
  alinear?: "centro" | "izquierda";
  /** Cada página necesita exactamente un h1: úsalo en el encabezado principal */
  como?: "h1" | "h2";
}) {
  const colorTitulo = tono === "oscuro" ? "text-green-950" : "text-cream-100";
  const colorSub = tono === "oscuro" ? "text-muted" : "text-cream-100/80";
  const colorKicker = tono === "oscuro" ? "text-red-600" : "text-red-300";
  const alineado = alinear === "centro" ? "text-center items-center" : "text-left items-start";

  return (
    <Reveal className={`flex flex-col gap-3 ${alineado}`}>
      {kicker ? (
        <p className={`kicker ${colorKicker} flex items-center gap-2`}>
          <Brote className="h-4 w-4" />
          {kicker}
        </p>
      ) : null}
      <Titulo className={`titulo-huerto text-3xl sm:text-4xl lg:text-5xl ${colorTitulo} text-balance`}>
        {titulo}
      </Titulo>
      {subtitulo ? (
        <p className={`max-w-xl text-base sm:text-lg ${colorSub}`}>{subtitulo}</p>
      ) : null}
    </Reveal>
  );
}
