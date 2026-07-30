import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 font-condensed font-bold uppercase tracking-[0.08em] rounded-full transition-transform duration-200 active:scale-[0.97] text-center";

const variantes = {
  rojo: "bg-red-600 text-warmwhite hover:bg-red-700",
  crema: "bg-cream-50 text-green-950 hover:bg-warmwhite",
  contorno:
    "border-2 border-current text-inherit hover:bg-green-950/5",
  contornoCrema:
    "border-2 border-cream-100/70 text-cream-100 hover:bg-cream-100/10",
  verde: "bg-green-800 text-cream-100 hover:bg-green-900",
} as const;

const tallas = {
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  sm: "px-4 py-2 text-sm",
} as const;

export function Boton({
  href,
  children,
  variante = "rojo",
  talla = "md",
  externo = false,
  className = "",
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variante?: keyof typeof variantes;
  talla?: keyof typeof tallas;
  externo?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const cls = `${base} ${variantes[variante]} ${tallas[talla]} ${className}`;
  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
