"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cloudinaryImage } from "@/lib/cloudinaryImage"
import { useAffiliateContext } from "@/components/system/AffiliateContext"

/* ================= TYPES ================= */

type Props = {
  refCode?: string
  src?: string
}

/* ================= DATA ================= */

const slides = [
  {
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776504978/penerima-peace-qurban_fyowsq.jpg",
    title: "Qurban Kita, Harapan Mereka",
    subtitle:
      "Masih banyak saudara kita di pelosok negeri yang jarang merasakan daging qurban.",
  },
  {
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776504987/proses-qurban-bondowoso_utfay9.jpg",
    title: "Jangkau Mereka yang Membutuhkan",
    subtitle:
      "Salurkan qurban Anda ke daerah 3T, dhuafa, dan penyintas bencana.",
  },
]

/* ================= HELPERS ================= */

function buildAffiliateUrl(
  base: string,
  ref?: string,
  src?: string
) {
  try {
    const url = new URL(base, window.location.origin)

    if (ref) url.searchParams.set("ref", ref)
    if (src) url.searchParams.set("src", src)

    const query = url.searchParams.toString()

    return query ? `${url.pathname}?${query}` : url.pathname
  } catch {
    return base
  }
}

/* ================= COMPONENT ================= */

export default function HeroSection(props: Props) {
  const [index, setIndex] = useState(0)

  const ctx = useAffiliateContext()

  /* 🔥 PRIORITY:
     1. props (dari server page)
     2. context (fallback client)
  */
  const ref = props.refCode ?? ctx.ref
  const src = props.src ?? ctx.src ?? "hero"

  /* ================= SLIDER ================= */

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6000)

    return () => clearInterval(t)
  }, [])

  const slide = slides[index]

  /* ================= TRACKED URL ================= */

  const campaignUrl = useMemo(() => {
    return buildAffiliateUrl(
      "/campaign/peace-qurban",
      ref,
      src
    )
  }, [ref, src])

  const waUrl = useMemo(() => {
    const phone = "6281322817712"

    const fullUrl =
      typeof window !== "undefined"
        ? window.location.origin + campaignUrl
        : campaignUrl

    const message = encodeURIComponent(
      `Assalamu'alaikum 🙏

Saya tertarik dengan program *Peace Qurban*.

Mohon info lebih lanjut ya.

🔗 ${fullUrl}

Ref: ${ref || "-"}
Source: ${src || "hero"}`
    )

    return `https://wa.me/${phone}?text=${message}`
  }, [campaignUrl, ref, src])

  /* ================= UI ================= */

  return (
    <section
      className="
        relative
        min-h-[88vh] md:h-[100vh]
        -mt-[72px] pt-[72px]
        overflow-hidden
        bg-[rgb(var(--color-dark))]
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
            initial={{ scale: 1.06 }}
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

      {/* ================= OVERLAY ================= */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-dark))]/75 via-[rgb(var(--color-dark))]/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-dark))]/50 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(34,197,94,0.18),transparent_60%)]" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex items-center min-h-[88vh] md:h-full">
        <div className="container-wide w-full">
          <div className="max-w-[720px]">

            {/* LABEL */}
            <motion.p
              key={`label-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                text-[11px]
                tracking-[0.35em]
                uppercase
                font-semibold
                text-[rgb(var(--color-white))]/70
                mb-4 md:mb-6
              "
            >
              PROGRAM QURBAN 1447 H
            </motion.p>

            {/* HEADLINE */}
            <motion.h1
              key={slide.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                text-[30px] sm:text-[36px] md:text-[56px] lg:text-[72px]
                leading-[1.08]
                tracking-[-0.02em]
                font-bold
                mb-5 md:mb-6
              "
              style={{
                textShadow: "0 8px 32px rgba(0,0,0,0.45)",
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
                text-[15.5px] sm:text-[16.5px] md:text-[18px]
                leading-[1.8]
                text-[rgb(var(--color-white))]/85
                mb-7 md:mb-8
                max-w-[560px]
              "
            >
              {slide.subtitle}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                href={campaignUrl}
                className="
                  btn
                  bg-[rgb(var(--color-accent))]
                  text-[rgb(var(--color-white))]
                  px-6 py-3
                  text-[14px] md:text-[15px]
                  font-semibold
                  shadow-[var(--shadow-medium)]
                  hover:opacity-90
                "
              >
                Tunaikan Qurban Sekarang
              </Link>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-[rgb(var(--color-white))]/80
                  text-[12px]
                  uppercase
                  tracking-[0.15em]
                  border-b border-[rgb(var(--color-white))]/30
                  w-fit
                  hover:text-[rgb(var(--color-accent))]
                  hover:border-[rgb(var(--color-accent))]
                  transition
                "
              >
                Konsultasi via WhatsApp
              </a>
            </motion.div>

            {/* TRUST */}
            <p className="mt-5 text-[12.5px] text-[rgb(var(--color-white))]/70">
              ✔ Distribusi ke daerah 3T • ✔ Amanah • ✔ Sesuai syariat
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}