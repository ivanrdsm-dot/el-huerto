import type { Metadata } from "next";
import { InstagramGallery } from "@/components/InstagramGallery";

export const metadata: Metadata = {
  title: "Instagram — @elhuerto_mx",
  description:
    "Sigue a El Huerto en Instagram (@elhuerto_mx): menú del día, promos, combos y lo que se está antojando en Ciudad UP.",
  alternates: { canonical: "/instagram" },
};

export default function InstagramPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <InstagramGallery completa />
    </div>
  );
}
