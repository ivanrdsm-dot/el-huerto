export function PriceBadge({
  valor,
  prefijo,
  talla = "md",
  className = "",
}: {
  valor: number;
  prefijo?: string;
  talla?: "sm" | "md" | "lg";
  className?: string;
}) {
  const tallas = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl sm:text-3xl",
  } as const;
  return (
    <span className={`etiqueta-precio ${tallas[talla]} ${className}`}>
      {prefijo ? <span className="mr-1 text-[0.7em] font-semibold">{prefijo}</span> : null}
      ${valor}
    </span>
  );
}
