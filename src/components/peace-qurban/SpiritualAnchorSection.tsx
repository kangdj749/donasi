"use client"

import Image from "next/image"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function SpiritualAnchorSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        section
        bg-[rgb(var(--color-bg))]
      "
    >
      {/* ================= BACKGROUND IMAGE (SUBTLE) ================= */}
      <div className="absolute inset-0">
        <Image
          src={cloudinaryImage(
            "https://res.cloudinary.com/de7fqcvpf/image/upload/v1774597368/rekayasa_tvkzi7.jpg",
            "banner"
          )}
          alt="Suasana ibadah qurban"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.08]"
        />
      </div>

      {/* ================= SOFT GRADIENT ================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-bg))] via-[rgb(var(--color-bg))]/95 to-[rgb(var(--color-bg))]" />

      {/* ================= CONTENT ================= */}
      <div className="container-wide relative z-10">

        <div className="max-w-[760px] mx-auto text-center">

          {/* ================= LABEL ================= */}
          <p className="caption tracking-[0.3em] uppercase mb-6">
            SPIRITUAL REFLECTION
          </p>

          {/* ================= TITLE ================= */}
          <h2
            className="
              text-[26px] md:text-[34px]
              font-semibold
              leading-[1.3]
              tracking-[-0.02em]
              text-[rgb(var(--color-text))]
              mb-10
            "
          >
            Bukan Sekadar Qurban…
          </h2>

          {/* ================= AYAT ================= */}
          <blockquote
            className="
              relative
              px-6 md:px-10
              py-8 md:py-10
              rounded-[var(--radius-lg)]
              bg-[rgb(var(--color-surface))]
              border border-[rgb(var(--color-border))]
              shadow-[var(--shadow-soft)]
              mb-8
            "
          >
            {/* QUOTE MARK */}
            <div className="absolute top-4 left-4 text-[rgb(var(--color-primary))] text-2xl opacity-40">
              “
            </div>

            <p
              className="
                text-[16px] md:text-[18px]
                leading-[1.9]
                text-[rgb(var(--color-text))]
              "
            >
              Daging-daging unta dan darahnya itu sekali-kali tidak dapat mencapai
              keridhaan Allah, tetapi ketakwaan dari kamulah yang dapat mencapainya.
            </p>

            <p className="caption mt-6 text-[rgb(var(--color-muted))]">
              (QS. Al-Hajj: 37)
            </p>
          </blockquote>

          {/* ================= REFLECTION ================= */}
          <div className="space-y-4">

            <p className="body-lg text-[rgb(var(--color-text))]">
              Qurban bukan tentang besar kecilnya hewan,
            </p>

            <p
              className="
                text-[18px] md:text-[22px]
                font-semibold
                leading-[1.6]
                text-[rgb(var(--color-text))]
              "
            >
              tapi tentang{" "}
              <span className="text-[rgb(var(--color-primary))]">
                keikhlasan
              </span>{" "}
              dan{" "}
              <span className="text-[rgb(var(--color-accent))]">
                dampak
              </span>{" "}
              yang ditinggalkan.
            </p>

          </div>

        </div>

      </div>
    </section>
  )
}