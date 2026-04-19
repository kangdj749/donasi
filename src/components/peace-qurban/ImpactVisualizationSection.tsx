"use client"

import Image from "next/image"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function ImpactVisualizationSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        section
        bg-[rgb(var(--color-dark))]
        text-[rgb(var(--color-white))]
      "
    >
      {/* ================= BACKGROUND IMAGE ================= */}
      <div className="absolute inset-0">
        <Image
          src={cloudinaryImage(
            "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776553003/distribusi_ke_masyarakat_feihhp.jpg",
            "banner"
          )}
          alt="Distribusi makanan qurban ke masyarakat"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* ================= OVERLAY ================= */}
      <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/75" />

      {/* SOFT LIGHT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,197,94,0.25),transparent_60%)]" />

      {/* ================= CONTENT ================= */}
      <div className="container-wide relative z-10 text-center">

        {/* ================= HEAD ================= */}
        <div className="max-w-[760px] mx-auto mb-14">

          <p className="caption text-white/70 tracking-[0.3em] uppercase mb-4">
            VISUALISASI DAMPAK
          </p>

          <h2
            className="
              text-[28px] md:text-[40px]
              font-semibold
              leading-[1.3]
              tracking-[-0.02em]
              mb-6
            "
          >
            Bayangkan…
          </h2>

          <p className="body-lg text-white/85">
            dari satu qurban Anda:
          </p>
        </div>

        {/* ================= IMPACT GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[900px] mx-auto">

          {/* ITEM 1 */}
          <div
            className="
              p-6
              rounded-[var(--radius-lg)]
              bg-white/5
              backdrop-blur-md
              border border-white/10
              shadow-[var(--shadow-soft)]
              transition
              hover:bg-white/10
            "
          >
            <div className="text-3xl mb-3">🍲</div>
            <p className="body-lg font-semibold">
              ratusan porsi makanan
            </p>
            <p className="caption text-white/70 mt-1">
              bisa dihasilkan
            </p>
          </div>

          {/* ITEM 2 */}
          <div
            className="
              p-6
              rounded-[var(--radius-lg)]
              bg-white/5
              backdrop-blur-md
              border border-white/10
              shadow-[var(--shadow-soft)]
              transition
              hover:bg-white/10
            "
          >
            <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
            <p className="body-lg font-semibold">
              puluhan keluarga
            </p>
            <p className="caption text-white/70 mt-1">
              bisa merasakan
            </p>
          </div>

          {/* ITEM 3 */}
          <div
            className="
              p-6
              rounded-[var(--radius-lg)]
              bg-white/5
              backdrop-blur-md
              border border-white/10
              shadow-[var(--shadow-soft)]
              transition
              hover:bg-white/10
            "
          >
            <div className="text-3xl mb-3">🏕</div>
            <p className="body-lg font-semibold">
              daerah bencana
            </p>
            <p className="caption text-white/70 mt-1">
              tetap mendapatkan
            </p>
          </div>

        </div>

        {/* ================= CLOSING ================= */}
        <div className="max-w-[720px] mx-auto mt-16">

          <p className="body-lg text-white/85 mb-4">
            Ini bukan hanya ibadah…
          </p>

          <p
            className="
              text-[20px] md:text-[26px]
              font-semibold
              leading-[1.6]
            "
          >
            ini adalah{" "}
            <span className="text-[rgb(var(--color-accent))]">
              jejak kebaikan
            </span>{" "}
            yang terus mengalir.
          </p>

        </div>

      </div>
    </section>
  )
}