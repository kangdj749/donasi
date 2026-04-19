"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function CTASection() {
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
            "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776556685/1748182980004-57k78l_rgrwqq.jpg",
            "banner"
          )}
          alt="Ajakan Qurban"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
      </div>

      {/* ================= OVERLAY ================= */}
      <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/80" />

      {/* ACCENT LIGHT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(249,115,22,0.25),transparent_65%)]" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 container-wide text-center">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-[760px] mx-auto"
        >

          {/* LABEL */}
          <p className="caption tracking-[0.3em] uppercase mb-6 text-white/60">
            Saatnya Bertindak
          </p>

          {/* HEADLINE */}
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-8">
            Tunaikan Qurban Anda,
            <br />
            <span className="text-[rgb(var(--color-accent))]">
              Lebih Bermakna Hari Ini
            </span>
          </h2>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">

            {/* PRIMARY */}
            <Link
              href="/campaign/peace-qurban"
              className="
                btn
                bg-[rgb(var(--color-accent))]
                text-[rgb(var(--color-white))]
                px-6 py-3 text-[15px] font-semibold

                shadow-lg
                hover:bg-[rgb(var(--color-accent-dark))]
                hover:translate-y-[-2px]
                transition
              "
            >
              👉 Tunaikan Qurban Sekarang
            </Link>

            {/* SECONDARY */}
            <Link
              href="#"
              className="
                btn
                border border-white/30
                text-white

                px-6 py-3 text-[14px]

                hover:bg-white/10
                transition
              "
            >
              👉 Konsultasi dengan Tim Kami
            </Link>
          </div>

          {/* TRUST LINE */}
          <p className="caption text-white/60">
            ✔ Amanah • ✔ Transparan • ✔ Sesuai Syariat
          </p>

        </motion.div>
      </div>

      {/* ================= GRAIN ================= */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('/images/grain.png')]" />
    </section>
  )
}