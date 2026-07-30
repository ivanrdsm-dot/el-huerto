"use client";

import { useEffect, useRef } from "react";

/**
 * Video en loop silencioso con poster.
 * Solo reproduce (y descarga) el video si el usuario no pidió
 * reducción de movimiento ni tiene activado el ahorro de datos:
 * en esos casos se queda la imagen estática del poster.
 */
export function VideoLoop({
  src,
  poster,
  className = "",
  aspecto = "aspect-[9/16]",
  etiqueta,
}: {
  src: string;
  poster: string;
  className?: string;
  aspecto?: string;
  etiqueta: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    type ConexionConAhorro = { saveData?: boolean };
    const conexion = (navigator as Navigator & { connection?: ConexionConAhorro }).connection;
    const ahorroDatos = conexion?.saveData === true;
    if (reduceMotion || ahorroDatos) return;

    // Reproduce solo mientras es visible; con preload="none" no descarga antes
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`relative overflow-hidden ${aspecto} ${className}`}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-label={etiqueta}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
