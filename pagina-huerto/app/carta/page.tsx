import type { Metadata } from "next";
import { MenuTabs } from "@/components/menu/MenuTabs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "La carta",
  description:
    "Consulta la carta completa de El Huerto en Ciudad UP: smoothies, café, boba, bowls, paninis, ensaladas, snacks y combos con precios actualizados.",
  alternates: { canonical: "/carta" },
};

export default function CartaPage() {
  return (
    <div className="bg-cream-100 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <SectionHeading
          kicker="Menú oficial"
          titulo="La carta."
          subtitulo="Pídete algo que sí se antoje. Precios vigentes del menú oficial."
          alinear="izquierda"
        />
        <MenuTabs />
      </div>
    </div>
  );
}
