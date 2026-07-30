import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad del sitio web de El Huerto.",
  alternates: { canonical: "/privacidad" },
  robots: { index: false },
};

export default function PrivacidadPage() {
  return (
    <div className="bg-cream-100 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6">
        <SectionHeading kicker="Legal" titulo="Aviso de privacidad." alinear="izquierda" />
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-ink/85">
          <p>
            Este sitio web de El Huerto es informativo: aquí consultas la carta,
            los combos y la ubicación del kiosco en Ciudad UP.
          </p>
          <p>
            <strong>Datos que recibimos.</strong> El formulario de contacto no
            almacena tu información en esta página: tu mensaje se envía
            directamente por WhatsApp desde tu propio dispositivo. Los datos que
            compartas por WhatsApp o Instagram se rigen por las políticas de
            privacidad de esas plataformas.
          </p>
          <p>
            <strong>Analítica.</strong> Podemos usar métricas anónimas de visitas
            (páginas vistas, clics a WhatsApp o Maps) para mejorar el sitio. No
            vendemos ni compartimos datos personales con terceros.
          </p>
          <p>
            <strong>Contacto.</strong> Para cualquier duda sobre este aviso,
            escríbenos por WhatsApp o Instagram (@elhuerto_mx).
          </p>
          <p className="text-muted">
            Última actualización: julio 2026. Este aviso se ampliará cuando se
            activen la analítica y las integraciones definitivas.
          </p>
        </div>
      </div>
    </div>
  );
}
