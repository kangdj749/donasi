"use client"

import Image from "next/image"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function ClosingEmotionalSection() {
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
            "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776555567/IMG20240626135527_rrdk8n.jpg",
            "banner"
          )}
          alt="Anak-anak menerima manfaat qurban"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.3]"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/80" />

      {/* LIGHT GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,197,94,0.25),transparent_60%)]" />

      {/* ================= CONTENT ================= */}
      <div className="container-wide relative z-10">

        <div className="max-w-[760px] mx-auto text-center">

          {/* LINE 1 */}
          <p className="body-lg text-white/80 mb-6">
            Tahun ini…
          </p>

          {/* MAIN STATEMENT */}
          <h2
            className="
              text-[28px] md:text-[42px]
              font-semibold
              leading-[1.3]
              tracking-[-0.02em]
              mb-8
            "
          >
            jangan hanya berqurban.
          </h2>

          {/* SECOND LAYER */}
          <p
            className="
              text-[20px] md:text-[26px]
              font-semibold
              leading-[1.5]
              mb-8
            "
          >
            Jadikan qurban Anda{" "}
            <span className="text-[rgb(var(--color-accent))]">
              lebih berarti
            </span>.
          </p>

          {/* THIRD LAYER */}
          <div className="space-y-2 mb-10">
            <p className="body-lg text-white/85">
              Lebih luas manfaatnya.
            </p>
            <p className="body-lg text-white/85">
              Lebih dalam dampaknya.
            </p>
          </div>

          {/* TRANSITION */}
          <p className="body text-white/70 mb-6">
            Karena di luar sana…
          </p>

          {/* FINAL MESSAGE */}
          <p
            className="
              text-[18px] md:text-[22px]
              leading-[1.7]
              mb-4
            "
          >
            ada mereka yang menunggu,
          </p>

          <p
            className="
              text-[18px] md:text-[22px]
              leading-[1.7]
            "
          >
            bukan sekadar daging qurban,
          </p>

          <p
            className="
              mt-4
              text-[20px] md:text-[26px]
              font-semibold
              leading-[1.6]
            "
          >
            tapi{" "}
            <span className="text-[rgb(var(--color-primary))]">
              harapan
            </span>.
          </p>

        </div>

      </div>
    </section>
  )
}