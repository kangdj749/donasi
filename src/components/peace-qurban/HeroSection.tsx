"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

const slides = [
  {
    image: "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776504978/penerima-peace-qurban_fyowsq.jpg",
    title: "Qurban Kita, Harapan Mereka",
    subtitle:
      "Masih banyak saudara kita di pelosok negeri yang jarang merasakan daging qurban.",
  },
  {
    image: "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776504987/proses-qurban-bondowoso_utfay9.jpg",
    title: "Jangkau Mereka yang Membutuhkan",
    subtitle:
      "Salurkan qurban Anda ke daerah 3T, dhuafa, dan penyintas bencana.",
  },
]

export default function HeroSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6000)

    return () => clearInterval(t)
  }, [])

  const slide = slides[index]

  return (
    <section
      className="
        relative
        h-[100vh]
        min-h-[720px]
        -mt-[72px]
        pt-[72px]
        overflow-hidden
      "
    >

      {/* ================= BACKGROUND ================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={cloudinaryImage(slide.image, "banner")}
              alt={slide.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ================= OVERLAY (FIXED) ================= */}

      {/* 🔥 Gradient kiri → fokus teks (tidak terlalu gelap) */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-[rgb(var(--color-dark))]/70
          via-[rgb(var(--color-dark))]/35
          to-transparent
        "
      />

      {/* 🔥 Bottom depth (soft, bukan gelap total) */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-[rgb(var(--color-dark))]/40
          via-transparent
          to-transparent
        "
      />

      {/* 🔥 Brand light (halus banget, biar hidup) */}
      <div
        className="
          absolute inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_25%_45%,rgba(34,197,94,0.18),transparent_60%)]
        "
      />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-wide">

          <div className="grid grid-cols-12 gap-8">

            {/* TEXT */}
            <div className="col-span-12 md:col-span-7 max-w-[760px]">

              {/* LABEL */}
              <motion.p
                key={`label-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  text-[12px]
                  tracking-[0.35em]
                  uppercase
                  font-semibold
                  text-[rgb(var(--color-white))]/70
                  mb-6
                "
              >
                PROGRAM QURBAN 1447 H
              </motion.p>

              {/* HEADLINE */}
              <motion.h1
                key={slide.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  text-4xl sm:text-5xl md:text-7xl lg:text-[76px]
                  leading-[1.05]
                  tracking-[-0.02em]
                  mb-6
                  font-bold
                "
                style={{
                  textShadow: "0 10px 40px rgba(0,0,0,0.45)",
                }}
              >
                <span className="block text-[rgb(var(--color-white))]">
                  Qurban Kita,
                </span>

                <span className="block text-[rgb(var(--color-accent))]">
                  Harapan Mereka
                </span>
              </motion.h1>

              {/* SUBTEXT */}
              <motion.p
                key={slide.subtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  text-[18px] md:text-[20px]
                  leading-relaxed
                  text-[rgb(var(--color-white))]/85
                  mb-8
                  max-w-[560px]
                "
              >
                {slide.subtitle}
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/campaign/peace-qurban"
                  className="
                    btn
                    bg-[rgb(var(--color-accent))]
                    text-[rgb(var(--color-white))]
                    px-6 py-3
                    text-[15px]
                    font-semibold
                    shadow-lg
                    hover:opacity-90
                  "
                >
                  Tunaikan Qurban Sekarang
                </Link>

                <Link
                  href="#"
                  className="
                    text-[rgb(var(--color-white))]/80
                    text-[13px]
                    uppercase
                    tracking-[0.15em]
                    border-b border-[rgb(var(--color-white))]/30
                    hover:text-[rgb(var(--color-accent))]
                    hover:border-[rgb(var(--color-accent))]
                    transition
                  "
                >
                  Konsultasi via WhatsApp
                </Link>
              </motion.div>

              {/* TRUST */}
              <p className="mt-6 text-[13px] text-[rgb(var(--color-white))]/70">
                ✔ Distribusi ke daerah 3T • ✔ Amanah • ✔ Sesuai syariat
              </p>

            </div>

            {/* EMPTY SPACE */}
            <div className="hidden md:block md:col-span-5" />

          </div>
        </div>
      </div>
    </section>
  )
}