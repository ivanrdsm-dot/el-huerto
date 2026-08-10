import type { MetadataRoute } from "next";
import { CATEGORIAS, rutasDeProductos } from "@/data/menu";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const ahora = new Date();

  const principales: MetadataRoute.Sitemap = (
    [
      { url: `${base}`, priority: 1, changeFrequency: "weekly" },
      { url: `${base}/carta`, priority: 0.9, changeFrequency: "weekly" },
      { url: `${base}/combos`, priority: 0.9, changeFrequency: "weekly" },
      { url: `${base}/ubicacion`, priority: 0.9, changeFrequency: "monthly" },
      { url: `${base}/preguntas-frecuentes`, priority: 0.7, changeFrequency: "monthly" },
      { url: `${base}/nosotros`, priority: 0.6, changeFrequency: "monthly" },
      { url: `${base}/instagram`, priority: 0.5, changeFrequency: "weekly" },
      { url: `${base}/contacto`, priority: 0.5, changeFrequency: "monthly" },
    ] satisfies MetadataRoute.Sitemap
  ).map((r) => ({ ...r, lastModified: ahora }));

  const categorias: MetadataRoute.Sitemap = CATEGORIAS.filter(
    (c) => c.slug !== "combos"
  ).map((c) => ({
    url: `${base}/carta/${c.slug}`,
    lastModified: ahora,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productos: MetadataRoute.Sitemap = rutasDeProductos().map((r) => ({
    url: `${base}/carta/${r.categoria}/${r.producto}`,
    lastModified: ahora,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...principales, ...categorias, ...productos];
}
