"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function ShiftSection() {
  return (
    <section className="relative overflow-hidden bg-[rgb(var(--color-dark))]">

      {/* ================= BACKGROUND IMAGE ================= */}
      <div className="absolute inset-0">
        <Image
          src={cloudinaryImage(
            "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776526997/kurban_adalah_fdh6s3.webp",
            "banner"
          )}
          alt="Makna qurban yang sesungguhnya"
          fill
          sizes="100vw"
          className="object-cover opacity-70"
        />
      </div>

      {/* ================= OVERLAY ================= */}

      {/* DARK BASE */}
      <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/80" />

      {/* CENTER LIGHT FOCUS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />

      {/* TOP FADE */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-dark))]/70 via-transparent to-transparent" />

      {/* BOTTOM FADE */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-dark))]/90 via-transparent to-transparent" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 py-28 md:py-36">

        <div className="container-narrow text-center">

          {/* LABEL */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="
              text-[rgb(var(--color-accent))]
              text-[11px]
              tracking-[0.4em]
              uppercase
              font-semibold
              mb-6
            "
          >
            RENUNGAN
          </motion.p>

          {/* HEADLINE */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="
              text-[28px] sm:text-[34px] md:text-[42px]
              font-semibold
              leading-[1.3]
              text-[rgb(var(--color-white))]
              mb-10
            "
            style={{
              textShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            Padahal…
          </motion.h2>

          {/* MAIN MESSAGE */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-[18px] md:text-[20px] leading-[1.9] text-[rgb(var(--color-white))]/90">
              qurban bukan hanya tentang menyembelih,
            </p>

            <p className="text-[18px] md:text-[20px] leading-[1.9] text-[rgb(var(--color-white))]/90">
              tapi tentang siapa yang benar-benar merasakan manfaatnya.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}