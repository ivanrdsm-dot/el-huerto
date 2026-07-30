import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "El Huerto — Ciudad UP",
    short_name: "El Huerto",
    description:
      "Smoothies, bowls, paninis, ensaladas y café frescos todos los días en Ciudad UP.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4eedf",
    theme_color: "#344526",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
