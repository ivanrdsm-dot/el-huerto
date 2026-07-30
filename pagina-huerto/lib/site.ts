/**
 * Constantes globales de El Huerto.
 * PENDIENTE DE VALIDAR (ver docs/pendientes.md):
 *  - Número de WhatsApp (56 4666 5718)
 *  - Coordenadas exactas y horario del kiosco
 */

export const SITE = {
  nombre: "El Huerto",
  tagline: "NATURAL · FRESCO · SALUDABLE",
  descriptor: "Fruta · Paninis · Smoothies · Café",
  propuesta: "Comer bien en la universidad no debería ser un lujo.",
  url: "https://pagina-huerto.vercel.app",
  instagramUser: "elhuerto_mx",
  instagramUrl: "https://www.instagram.com/elhuerto_mx",
  /** Número a validar antes de producción */
  whatsappNumero: "525646665718",
  whatsappDisplay: "56 4666 5718",
  ubicacion: {
    nombre: "Ciudad Universitaria Panamericana (Ciudad UP)",
    zona: "Bosque Real",
    municipio: "Huixquilucan",
    estado: "Estado de México",
    pais: "MX",
    /** Búsqueda genérica: las coordenadas exactas del kiosco están pendientes */
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Universidad+Panamericana+Bosque+Real+Huixquilucan",
  },
} as const;

/** Enlace de WhatsApp con mensaje precargado y UTM interna para analítica */
export function waLink(mensaje: string, fuente: string): string {
  const texto = `${mensaje} [web:${fuente}]`;
  return `https://wa.me/${SITE.whatsappNumero}?text=${encodeURIComponent(texto)}`;
}

export const WA_MENSAJES = {
  general: "Hola, vi la página de El Huerto y quiero pedir información.",
  producto: (nombre: string) =>
    `Hola, vi ${nombre} en la página de El Huerto y quiero saber si está disponible.`,
  ubicacion: "Hola, quiero saber cómo encontrar El Huerto dentro de Ciudad UP.",
} as const;

export function precioMX(n: number): string {
  return `$${n}`;
}
