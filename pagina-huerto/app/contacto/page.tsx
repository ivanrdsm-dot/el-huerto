import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { SITE, waLink, WA_MENSAJES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbele a El Huerto: información, alianzas, eventos o comentarios. Respondemos por WhatsApp en horario de kiosco en Ciudad UP.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <div className="bg-cream-100 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-6">
          <SectionHeading
            kicker="Hablemos"
            titulo="Escríbenos."
            subtitulo="Información, alianzas, eventos o simplemente decirnos qué se te antoja: respondemos rápido por WhatsApp."
            alinear="izquierda"
          />
          <ul className="flex flex-col gap-3 text-sm text-muted">
            <li>
              <span className="font-semibold text-green-900">WhatsApp:</span>{" "}
              <a
                href={waLink(WA_MENSAJES.general, "contacto-directo")}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-red-500 decoration-2 underline-offset-4 hover:text-red-600"
              >
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li>
              <span className="font-semibold text-green-900">Instagram:</span>{" "}
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-red-500 decoration-2 underline-offset-4 hover:text-red-600"
              >
                @{SITE.instagramUser}
              </a>
            </li>
            <li>
              <span className="font-semibold text-green-900">Kiosco:</span>{" "}
              {SITE.ubicacion.nombre}, {SITE.ubicacion.zona}.
            </li>
          </ul>
        </div>

        <Reveal delay={100} className="rounded-3xl border border-borde bg-cream-50 p-6 shadow-suave sm:p-10">
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
