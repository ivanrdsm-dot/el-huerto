import type { MetadataRoute } from "next";
import { CATEGORIAS } from "@/data/menu";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const estaticas = [
    "",
    "/carta",
    "/combos",
    "/ubicacion",
    "/nosotros",
    "/instagram",
    "/contacto",
  ].map((ruta) => ({
    url: `${base}${ruta}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: ruta === "" ? 1 : 0.8,
  }));

  const categorias = CATEGORIAS.filter((c) => c.slug !== "combos").map((c) => ({
    url: `${base}/carta/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...estaticas, ...categorias];
}
