"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function SolutionSection() {
  return (
    <section className="relative bg-[rgb(var(--color-bg))] overflow-hidden">

      {/* ================= BACKGROUND GLOW ================= */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.06),transparent_60%)]" />
      </div>

      <div className="relative z-10 section">

        <div className="container-wide">

          <div className="grid gap-10 md:grid-cols-2 md:gap-14 items-center">

            {/* ================= TEXT ================= */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              {/* LABEL */}
              <p
                className="
                  text-[rgb(var(--color-primary))]
                  text-[11px]
                  tracking-[0.4em]
                  uppercase
                  font-semibold
                  mb-4
                "
              >
                SOLUSI
              </p>

              {/* HEADLINE */}
              <h2
                className="
                  text-[26px] sm:text-[30px] md:text-[38px]
                  leading-[1.3]
                  font-semibold
                  tracking-[-0.01em]
                  text-[rgb(var(--color-text))]
                  mb-5
                "
              >
                Di sinilah{" "}
                <span className="text-[rgb(var(--color-primary))]">
                  Peace Qurban
                </span>{" "}
                hadir.
              </h2>

              {/* DESCRIPTION */}
              <p
                className="
                  text-[15.5px] sm:text-[16.5px] md:text-[17.5px]
                  leading-[1.85]
                  text-[rgb(var(--color-muted))]
                  mb-7
                  max-w-[560px]
                "
              >
                Sebuah ikhtiar untuk menjadikan qurban lebih bermakna,
                lebih luas jangkauannya, dan lebih panjang dampaknya.
              </p>

              {/* EMPHASIS LINE */}
              <div
                className="
                  border-l-2
                  border-[rgb(var(--color-accent))]
                  pl-4
                "
              >
                <p
                  className="
                    text-[15.5px]
                    leading-[1.8]
                    text-[rgb(var(--color-text))]
                  "
                >
                  Bukan sekadar qurban biasa —
                  <br />
                  tapi qurban yang dirancang untuk memberi dampak lebih luas.
                </p>
              </div>
            </motion.div>

            {/* ================= IMAGE ================= */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div
                className="
                  relative
                  w-full
                  aspect-[4/3] md:aspect-[5/4]
                  rounded-[var(--radius-lg)]
                  overflow-hidden
                  shadow-[var(--shadow-elevated)]
                "
              >
                <Image
                  src={cloudinaryImage(
                    "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776551409/IMG_2043_ayf9jy.jpg",
                    "banner"
                  )}
                  alt="Distribusi qurban ke daerah pelosok Indonesia"
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />

                {/* overlay tipis biar nyatu */}
                <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/10" />
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}