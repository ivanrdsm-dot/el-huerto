"use client";

import { useState } from "react";
import { z } from "zod";
import { waLink } from "@/lib/site";

const esquema = z.object({
  nombre: z.string().min(2, "Cuéntanos tu nombre.").max(80),
  contacto: z
    .string()
    .min(5, "Déjanos un correo o teléfono para responderte.")
    .max(120),
  motivo: z.enum([
    "Información",
    "Alianzas",
    "Eventos",
    "Comentarios",
    "Trabajar con El Huerto",
    "Otro",
  ]),
  mensaje: z.string().min(10, "Cuéntanos un poco más (mínimo 10 caracteres).").max(1000),
  // Honeypot anti-spam: debe quedar vacío
  sitio: z.string().max(0).optional().or(z.literal("")),
});

type Errores = Partial<Record<"nombre" | "contacto" | "mensaje", string>>;

const MOTIVOS = esquema.shape.motivo.options;

/**
 * Formulario de contacto. Valida con Zod y entrega el mensaje por WhatsApp
 * (el canal real de atención de El Huerto). Integración de correo pendiente:
 * ver .env.example y docs/guia-conectores.md.
 */
export function ContactForm() {
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const resultado = esquema.safeParse(data);

    if (!resultado.success) {
      const nuevos: Errores = {};
      for (const issue of resultado.error.issues) {
        const campo = issue.path[0] as keyof Errores;
        if (campo && !nuevos[campo]) nuevos[campo] = issue.message;
      }
      setErrores(nuevos);
      return;
    }

    setErrores({});
    const { nombre, contacto, motivo, mensaje } = resultado.data;
    const texto = `Hola, soy ${nombre} (${contacto}). Motivo: ${motivo}. ${mensaje}`;
    window.open(waLink(texto, "contacto"), "_blank", "noopener,noreferrer");
    setEnviado(true);
  }

  const inputCls =
    "w-full rounded-xl border-2 border-borde bg-warmwhite px-4 py-3 text-base text-ink placeholder:text-muted/60 focus:border-green-800 focus:outline-none";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="kicker mb-2 block text-green-900">
            Nombre
          </label>
          <input id="nombre" name="nombre" type="text" autoComplete="name" className={inputCls} placeholder="Tu nombre" />
          {errores.nombre ? (
            <p className="mt-1.5 text-sm font-semibold text-red-600">{errores.nombre}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contacto" className="kicker mb-2 block text-green-900">
            Correo o teléfono
          </label>
          <input id="contacto" name="contacto" type="text" autoComplete="email" className={inputCls} placeholder="cómo te respondemos" />
          {errores.contacto ? (
            <p className="mt-1.5 text-sm font-semibold text-red-600">{errores.contacto}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="motivo" className="kicker mb-2 block text-green-900">
          Motivo
        </label>
        <select id="motivo" name="motivo" className={inputCls} defaultValue="Información">
          {MOTIVOS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mensaje" className="kicker mb-2 block text-green-900">
          Mensaje
        </label>
        <textarea id="mensaje" name="mensaje" rows={4} className={inputCls} placeholder="Cuéntanos qué necesitas" />
        {errores.mensaje ? (
          <p className="mt-1.5 text-sm font-semibold text-red-600">{errores.mensaje}</p>
        ) : null}
      </div>

      {/* Honeypot invisible para bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="sitio">No llenes este campo</label>
        <input id="sitio" name="sitio" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        className="self-start rounded-full bg-red-600 px-8 py-4 font-condensed text-lg font-bold uppercase tracking-[0.08em] text-warmwhite transition-colors hover:bg-red-700"
      >
        Enviar por WhatsApp
      </button>

      {enviado ? (
        <p role="status" className="rounded-xl bg-green-800/10 p-4 text-sm font-semibold text-green-900">
          ¡Listo! Abrimos WhatsApp con tu mensaje. Si no se abrió, escríbenos
          directamente y te respondemos en horario de kiosco.
        </p>
      ) : (
        <p className="text-xs text-muted">
          Al enviar, tu mensaje se abre en WhatsApp — el canal donde respondemos
          más rápido. No guardamos tus datos en esta página.
        </p>
      )}
    </form>
  );
}
