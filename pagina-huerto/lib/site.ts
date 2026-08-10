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
  /** Dominio canónico. El apex redirige 308 a www, así que el canónico es www. */
  url: "https://www.elhuertomx.com",
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

/**
 * Preguntas frecuentes reales del kiosco.
 * Alimentan /preguntas-frecuentes y el schema FAQPage (rich results de Google).
 * Solo información confirmada: nada de horarios ni certificaciones sin validar.
 */
export const FAQS: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Dónde está El Huerto?",
    respuesta:
      "El Huerto es el kiosco dentro de Ciudad Universitaria Panamericana (Ciudad UP), en Bosque Real, Huixquilucan, Estado de México. Si es tu primera vez, escríbenos por WhatsApp y te decimos exactamente cómo llegar desde tu edificio.",
  },
  {
    pregunta: "¿Cuánto cuesta un smoothie en El Huerto?",
    respuesta:
      "Todos los smoothies cuestan $99 e incluyen fruta natural. Puedes agregar un extra de proteína por $15. Tenemos ocho sabores: Pal’ Mamado, Pal’ Fresa, Pal’ Sediento, Pal’ Matcha Gains, Pal’ Chai Lover, Pal’ Berry Fuerte, Pal’ Crudo y Pal’ Changuito.",
  },
  {
    pregunta: "¿Cuánto cuesta el café?",
    respuesta:
      "El café empieza en $30 con el espresso. El americano cuesta $40 chico y $55 grande; el latte y el capuchino $50 chico y $60 grande; el flat white $50 chico y $55 grande; el cortado $60 y el espresso doble $50.",
  },
  {
    pregunta: "¿Qué opciones saludables hay para desayunar entre clases?",
    respuesta:
      "Los overnight oats desde $79 y el açaí bowl desde $129 son los favoritos de la mañana: ambos incluyen granola y eliges tus toppings. También tenemos cóctel de fruta a $69 y ensaladas a $99 con tres toppings a elegir.",
  },
  {
    pregunta: "¿Puedo pedir por WhatsApp para pasar rápido entre clases?",
    respuesta:
      "Sí. Escríbenos por WhatsApp con lo que quieres y lo dejamos listo para que solo pases por él al kiosco. Es la forma más rápida si tienes poco tiempo entre clases.",
  },
  {
    pregunta: "¿Tienen combos?",
    respuesta:
      "Sí, seis combos desde $125: El de Renee (pan de la Tía Renee y capuchino chico), El Mañanero (panini y capuchino chico) a $129, Gym Rat (smoothie y cóctel de fruta) a $159, Home Run (smoothie y overnight oats) a $169, El OG (smoothie y panini) a $179 y El Fresa (smoothie y açaí bowl) a $229.",
  },
  {
    pregunta: "¿Tienen opciones vegetarianas?",
    respuesta:
      "Sí. Los smoothies, el açaí bowl, los overnight oats, el cóctel de fruta, el boba tea y las infusiones son sin carne, igual que los paninis de queso mozzarella y 4 quesos. En las ensaladas eliges tus tres toppings, así que puedes armarla completamente vegetariana.",
  },
  {
    pregunta: "¿Cuánto cuesta agregar toppings a mi bowl?",
    respuesta:
      "Todos los bowls incluyen granola. El overnight oats cuesta $79 con un topping, $89 con dos y $99 con tres. El açaí bowl cuesta $129, $139 y $149 respectivamente. Cualquier topping adicional cuesta $10.",
  },
];

/** Palabras clave de SEO local. Se usan como referencia editorial, no para stuffing. */
export const KEYWORDS_LOCALES = [
  "El Huerto Ciudad UP",
  "cafetería Ciudad UP",
  "café Universidad Panamericana",
  "smoothies Ciudad UP",
  "comida saludable Ciudad UP",
  "açaí bowl Bosque Real",
  "paninis Ciudad UP",
  "ensaladas Ciudad UP",
  "boba tea Ciudad UP",
  "matcha Ciudad UP",
  "comida para estudiantes Bosque Real",
] as const;
