import { CATEGORIAS, COMBOS, PRODUCTOS, precioDesde } from "@/data/menu";
import type { Producto } from "@/types/menu";
import { FAQS, SITE } from "@/lib/site";

/**
 * Generadores de JSON-LD (schema.org).
 *
 * REGLA: solo se declara información confirmada. No se publican horarios,
 * coordenadas, reseñas ni calificaciones hasta que estén validados
 * (ver docs/pendientes.md) — datos falsos en schema penalizan en Google.
 */

const ID_NEGOCIO = `${SITE.url}/#negocio`;
const ID_SITIO = `${SITE.url}/#website`;

/** Ficha del negocio: la entidad principal para SEO local */
export function negocioJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": ID_NEGOCIO,
    name: "El Huerto",
    alternateName: "El Huerto Ciudad UP",
    description:
      "Cafetería y concepto gastronómico universitario en Ciudad UP: smoothies, café, açaí bowls, paninis, ensaladas y snacks preparados frescos todos los días.",
    slogan: "Natural · Fresco · Saludable",
    url: SITE.url,
    logo: `${SITE.url}/brand/icon-512.png`,
    image: `${SITE.url}/brand/og-el-huerto.png`,
    telephone: `+${SITE.whatsappNumero}`,
    priceRange: "$$",
    currenciesAccepted: "MXN",
    servesCuisine: [
      "Smoothies",
      "Café",
      "Açaí bowls",
      "Paninis",
      "Ensaladas",
      "Boba tea",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Ciudad Universitaria Panamericana (Ciudad UP), Bosque Real",
      addressLocality: "Huixquilucan",
      addressRegion: "Estado de México",
      addressCountry: "MX",
    },
    areaServed: [
      { "@type": "Place", name: "Ciudad Universitaria Panamericana" },
      { "@type": "Place", name: "Bosque Real, Huixquilucan" },
    ],
    sameAs: [SITE.instagramUrl],
    hasMenu: `${SITE.url}/carta`,
    // OMITIDO a propósito: openingHoursSpecification y geo — pendientes de validar.
  };
}

/** Sitio con búsqueda interna: habilita el sitelinks searchbox */
export function sitioJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ID_SITIO,
    url: SITE.url,
    name: "El Huerto",
    inLanguage: "es-MX",
    publisher: { "@id": ID_NEGOCIO },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/carta?buscar={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function ofertasDe(p: Producto) {
  return p.precios.map((precio) => ({
    "@type": "Offer",
    price: precio.valor,
    priceCurrency: "MXN",
    availability: p.disponible
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    ...(precio.etiqueta ? { name: precio.etiqueta } : {}),
  }));
}

/** Un producto del menú */
export function productoJsonLd(p: Producto) {
  const cat = CATEGORIAS.find((c) => c.slug === p.categoria);
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    "@id": `${SITE.url}/carta/${p.categoria}/${p.slug}#producto`,
    name: p.nombre,
    description: p.descripcionCorta,
    ...(p.imagen ? { image: `${SITE.url}${p.imagen}` } : {}),
    ...(p.ingredientes?.length
      ? { menuAddOn: undefined, suitableForDiet: undefined }
      : {}),
    offers: ofertasDe(p),
    isPartOf: {
      "@type": "MenuSection",
      name: cat?.nombre ?? p.categoria,
      url: `${SITE.url}/carta/${p.categoria}`,
    },
  };
}

/** Menú completo del restaurante: la pieza fuerte para /carta */
export function menuCompletoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${SITE.url}/carta#menu`,
    name: "Carta de El Huerto",
    inLanguage: "es-MX",
    provider: { "@id": ID_NEGOCIO },
    hasMenuSection: [
      ...CATEGORIAS.filter((c) => c.slug !== "combos").map((cat) => ({
        "@type": "MenuSection",
        name: cat.nombre,
        description: cat.descripcion,
        url: `${SITE.url}/carta/${cat.slug}`,
        hasMenuItem: PRODUCTOS.filter((p) => p.categoria === cat.slug).map(
          (p) => ({
            "@type": "MenuItem",
            name: p.nombre,
            description: p.descripcionCorta,
            ...(p.imagen ? { image: `${SITE.url}${p.imagen}` } : {}),
            offers: ofertasDe(p),
          })
        ),
      })),
      {
        "@type": "MenuSection",
        name: "Combos",
        description: "Duplas de la casa, dos favoritos a un precio.",
        url: `${SITE.url}/combos`,
        hasMenuItem: COMBOS.map((c) => ({
          "@type": "MenuItem",
          name: c.nombre,
          description: `${c.incluye.join(" + ")}. ${c.descripcion}`,
          offers: {
            "@type": "Offer",
            price: c.precio,
            priceCurrency: "MXN",
            availability: c.disponible
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        })),
      },
    ],
  };
}

/** Migas de pan: Google las muestra en lugar de la URL cruda */
export function migasJsonLd(items: { nombre: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nombre,
      item: `${SITE.url}${item.url}`,
    })),
  };
}

/** Preguntas frecuentes: elegible para rich result de FAQ */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  };
}

/** Listado de una categoría: ayuda a Google a entender el conjunto */
export function listaCategoriaJsonLd(slug: string) {
  const productos = PRODUCTOS.filter((p) => p.categoria === slug);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: productos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.nombre,
      url: `${SITE.url}/carta/${p.categoria}/${p.slug}`,
    })),
  };
}

/** Helper para inyectar cualquier bloque en una página */
export function jsonLdProps(data: object) {
  return { __html: JSON.stringify(data) };
}

export { precioDesde };
