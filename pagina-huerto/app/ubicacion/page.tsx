import type { Metadata } from "next";
import { LocationSection } from "@/components/LocationSection";

export const metadata: Metadata = {
  title: "Ubicación — Ciudad UP, Bosque Real",
  description:
    "Encuentra el kiosco de El Huerto en Ciudad Universitaria Panamericana (Ciudad UP), Bosque Real, Huixquilucan. Abre Google Maps o escríbenos por WhatsApp.",
  alternates: { canonical: "/ubicacion" },
};

export default function UbicacionPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <LocationSection completa />
    </div>
  );
}
