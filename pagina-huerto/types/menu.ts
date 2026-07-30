export type CategoriaSlug =
  | "smoothies"
  | "cafe"
  | "te-y-boba"
  | "bowls"
  | "snacks"
  | "paninis"
  | "ensaladas"
  | "pan-tia-renee"
  | "combos";

export interface Precio {
  etiqueta?: string; // "Chico", "Grande", "1 topping"…
  valor: number; // MXN
}

export interface Extra {
  nombre: string;
  precio: number;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  categoria: CategoriaSlug;
  descripcionCorta: string;
  ingredientes?: string[];
  precios: Precio[];
  extras?: Extra[];
  imagen?: string; // ruta en /public
  imagenAlt?: string;
  destacado?: boolean;
  disponible: boolean;
  badge?: string;
  notas?: string; // p. ej. "Incluye granola"
}

export interface Categoria {
  slug: CategoriaSlug;
  nombre: string;
  titulo: string; // título editorial de la página
  descripcion: string;
  desde: number; // precio inicial confirmado
  imagen?: string;
  imagenAlt?: string;
}

export interface Combo {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  incluye: string[];
  precio: number;
  badge?: string;
  /** Par de recortes que componen el combo (como en los laterales impresos) */
  imagenes?: { src: string; alt: string }[];
  disponible: boolean;
}
