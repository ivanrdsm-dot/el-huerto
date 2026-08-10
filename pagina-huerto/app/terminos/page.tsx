import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones del sitio web de El Huerto.",
  alternates: { canonical: "/terminos" },
  robots: { index: false },
};

export default function TerminosPage() {
  return (
    <div className="bg-cream-100 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6">
        <SectionHeading
          como="h1" kicker="Legal" titulo="Términos y condiciones." alinear="izquierda" />
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-ink/85">
          <p>
            Al usar este sitio aceptas estos términos. El sitio es un canal
            informativo de El Huerto, kiosco ubicado en Ciudad Universitaria
            Panamericana (Ciudad UP), Bosque Real, Huixquilucan.
          </p>
          <p>
            <strong>Precios y disponibilidad.</strong> Los precios publicados
            corresponden al menú oficial vigente y pueden cambiar sin previo
            aviso. La disponibilidad de productos depende de la operación diaria
            del kiosco y del calendario académico.
          </p>
          <p>
            <strong>Pedidos.</strong> Este sitio no procesa pagos ni pedidos en
            línea. Las consultas por WhatsApp se confirman directamente con el
            equipo del kiosco.
          </p>
          <p>
            <strong>Propiedad intelectual.</strong> El logotipo, el personaje
            huertero, las fotografías y los textos de este sitio son propiedad
            de El Huerto. No se permite su uso sin autorización.
          </p>
          <p className="text-muted">Última actualización: julio 2026.</p>
        </div>
      </div>
    </div>
  );
}
