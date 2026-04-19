"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function SolutionSection() {
  return (
    <section className="relative bg-[rgb(var(--color-bg))] overflow-hidden">

      {/* ================= SOFT LIGHT BACKGROUND ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.06),transparent_60%)]" />
      </div>

      <div className="relative z-10 section">

        <div className="container-wide">

          <div className="grid grid-cols-12 gap-10 items-center">

            {/* ================= TEXT ================= */}
            <div className="col-span-12 md:col-span-6">

              {/* LABEL */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
              </motion.p>

              {/* HEADLINE */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="
                  text-[30px] sm:text-[34px] md:text-[40px]
                  font-semibold
                  leading-[1.3]
                  text-[rgb(var(--color-text))]
                  mb-6
                "
              >
                Di sinilah{" "}
                <span className="text-[rgb(var(--color-primary))]">
                  Peace Qurban
                </span>{" "}
                hadir.
              </motion.h2>

              {/* DESCRIPTION */}
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="
                  text-[16px] md:text-[18px]
                  leading-[1.9]
                  text-[rgb(var(--color-muted))]
                  mb-8
                  max-w-[520px]
                "
              >
                Sebuah ikhtiar untuk menjadikan qurban lebih bermakna,
                lebih luas jangkauannya, dan lebih panjang dampaknya.
              </motion.p>

              {/* TRANSITION LINE */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="
                  text-[15px]
                  text-[rgb(var(--color-subtle))]
                  leading-[1.8]
                  max-w-[460px]
                "
              >
                Bukan sekadar qurban biasa —
                <br />
                tapi qurban yang dirancang untuk memberi dampak lebih luas.
              </motion.p>

            </div>

            {/* ================= IMAGE ================= */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="col-span-12 md:col-span-6"
            >
              <div
                className="
                  relative
                  w-full
                  h-[260px] sm:h-[320px] md:h-[380px]
                  rounded-[var(--radius-lg)]
                  overflow-hidden
                  shadow-[var(--shadow-medium)]
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
                />

                {/* SUBTLE OVERLAY */}
                <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/10" />
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}