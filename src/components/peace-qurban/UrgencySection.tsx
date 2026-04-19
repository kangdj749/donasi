"use client"

import Image from "next/image"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function UrgencySection() {
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
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        <Image
          src={cloudinaryImage(
            "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776504978/penerima-peace-qurban_fyowsq.jpg",
            "banner"
          )}
          alt="Distribusi qurban ke masyarakat"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.25]"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/80" />

      {/* SOFT LIGHT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(249,115,22,0.25),transparent_60%)]" />

      {/* ================= CONTENT ================= */}
      <div className="container-wide relative z-10">

        <div className="max-w-[820px] mx-auto text-center">

          {/* LABEL */}
          <p className="caption text-white/70 tracking-[0.3em] uppercase mb-6">
            TARGET TAHUN INI
          </p>

          {/* TITLE */}
          <h2
            className="
              text-[28px] md:text-[40px]
              font-semibold
              leading-[1.3]
              tracking-[-0.02em]
              mb-12
            "
          >
            Kesempatan Berbagi yang Terbatas
          </h2>

          {/* ================= NUMBERS ================= */}
          <div className="grid grid-cols-2 gap-6 mb-12">

            {/* DOMBA */}
            <div
              className="
                p-6 md:p-8
                rounded-[var(--radius-lg)]
                bg-white/5
                backdrop-blur-md
                border border-white/10
                shadow-[var(--shadow-soft)]
              "
            >
              <p className="text-3xl md:text-5xl font-semibold mb-2">
                200
              </p>
              <p className="body-lg">Ekor Domba</p>
            </div>

            {/* SAPI */}
            <div
              className="
                p-6 md:p-8
                rounded-[var(--radius-lg)]
                bg-white/5
                backdrop-blur-md
                border border-white/10
                shadow-[var(--shadow-soft)]
              "
            >
              <p className="text-3xl md:text-5xl font-semibold mb-2">
                20
              </p>
              <p className="body-lg">Ekor Sapi</p>
            </div>

          </div>

          {/* ================= MESSAGE ================= */}
          <div className="max-w-[640px] mx-auto">

            <p className="body-lg text-white/85 mb-4">
              Setiap qurban yang Anda tunaikan,
            </p>

            <p
              className="
                text-[18px] md:text-[22px]
                font-semibold
                leading-[1.6]
              "
            >
              akan langsung menjadi bagian dari{" "}
              <span className="text-[rgb(var(--color-accent))]">
                harapan mereka
              </span>
            </p>

          </div>

        </div>

      </div>
    </section>
  )
}