"use client"

import Image from "next/image"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function USPSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[rgb(var(--color-bg))]
        section
      "
    >
      {/* ================= BACKGROUND ACCENT ================= */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-[rgb(var(--color-primary))]/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-[rgb(var(--color-accent))]/10 blur-3xl rounded-full" />
      </div>

      <div className="container-wide relative z-10">

        {/* ================= HEADER ================= */}
        <div className="max-w-[720px] mb-12">
          <p className="caption mb-3 tracking-[0.25em] uppercase">
            PROGRAM IMPACT
          </p>

          <h2
            className="
              text-[26px] md:text-[34px]
              font-semibold
              leading-[1.3]
              tracking-[-0.02em]
              text-[rgb(var(--color-text))]
              mb-6
            "
          >
            Qurban yang Tidak Hanya Dirasa Hari Itu…
          </h2>

          <p className="body-lg text-[rgb(var(--color-muted))]">
            Melalui program ini, qurban Anda dikelola agar memberikan manfaat lebih luas,
            lebih merata, dan lebih panjang dampaknya.
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">

          {/* ================= LIST USP ================= */}
          <div className="md:col-span-6 space-y-6">

            {[
              "Disalurkan ke daerah 3T (tertinggal, terdepan, terluar)",
              "Menjangkau keluarga dhuafa, santri, dan penyintas bencana",
              "Diolah menjadi makanan siap saji (bakso) agar tahan lama",
              "Didistribusikan bertahap ke lebih banyak penerima manfaat",
            ].map((item, i) => (
              <div
                key={i}
                className="
                  flex items-start gap-4
                  p-4
                  rounded-[var(--radius-md)]
                  bg-[rgb(var(--color-surface))]
                  border border-[rgb(var(--color-border))]
                  shadow-[var(--shadow-soft)]
                "
              >
                {/* ICON */}
                <div
                  className="
                    w-8 h-8 flex items-center justify-center
                    rounded-full
                    bg-[rgb(var(--color-primary))]/10
                    text-[rgb(var(--color-primary))]
                    text-sm font-bold
                    shrink-0
                  "
                >
                  ✓
                </div>

                {/* TEXT */}
                <p className="body text-[rgb(var(--color-text))]">
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* ================= IMAGE ================= */}
          <div className="md:col-span-6 relative">

            <div
              className="
                relative
                w-full
                aspect-[4/5]
                rounded-[var(--radius-lg)]
                overflow-hidden
                shadow-[var(--shadow-elevated)]
              "
            >
              <Image
                src={cloudinaryImage(
                  "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776552479/distribusi_hewan_qurban_v6lu2c.jpg",
                  "portrait"
                )}
                alt="Distribusi qurban ke daerah pelosok"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-dark))]/60 via-transparent to-transparent" />

              {/* CAPTION */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm leading-relaxed">
                  Distribusi dilakukan ke wilayah yang benar-benar membutuhkan
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ================= IMPACT STATEMENT ================= */}
        <div className="mt-16 max-w-[720px]">

          <p className="body-lg text-[rgb(var(--color-text))] leading-[1.8]">
            Sehingga…
          </p>

          <p
            className="
              mt-4
              text-[20px] md:text-[24px]
              font-semibold
              leading-[1.6]
              text-[rgb(var(--color-text))]
            "
          >
            qurban Anda tidak hanya dirasakan hari itu saja,
            <span className="text-[rgb(var(--color-primary))]">
              {" "}tapi menjadi harapan yang terus hidup.
            </span>
          </p>

        </div>

      </div>
    </section>
  )
}