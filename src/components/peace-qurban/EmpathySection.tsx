"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function EmpathySection() {
  return (
    <section
      className="
        relative
        section
        bg-[rgb(var(--color-bg))]
      "
    >
      <div className="container-wide">

        {/* ================= GRID ================= */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-10 md:gap-16
            items-center
          "
        >

          {/* ================= IMAGE ================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div
              className="
                relative
                w-full
                aspect-[4/3]
                md:aspect-[5/4]

                overflow-hidden
                rounded-[18px]

                shadow-[var(--shadow-elevated)]
              "
            >
              <Image
                src={cloudinaryImage(
                  "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776525084/memilukan-keluarga-di-purwakarta-ini-hidup-miskin-dengan-12-anak-qzo_ngjsio.jpg",
                  "natural"
                )}
                alt="Anak-anak di daerah terpencil menunggu qurban"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />

              {/* overlay subtle */}
              <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/10" />
            </div>
          </motion.div>

          {/* ================= TEXT ================= */}
          <div className="container-narrow md:container-none">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >

              {/* LABEL */}
              <p
                className="
                  text-[11px]
                  tracking-[0.35em]
                  uppercase
                  font-semibold
                  text-[rgb(var(--color-primary))]
                  mb-6
                "
              >
                Sebuah Realita
              </p>

              {/* HEADLINE */}
              <h2
                className="
                  text-[28px] sm:text-[32px] md:text-[38px]
                  leading-[1.25]
                  font-semibold
                  tracking-[-0.02em]
                  text-[rgb(var(--color-text))]
                  mb-6
                "
              >
                Di daerah terpencil,
                <br />
                di kampung yang jauh dari kota,
                <br />
                <span className="text-[rgb(var(--color-accent))]">
                  qurban bukan tradisi tahunan.
                </span>
              </h2>

              {/* BODY */}
              <div className="space-y-5">

                <p className="text-[rgb(var(--color-muted))] text-[15.5px] leading-[1.8]">
                  Bukan karena mereka tidak ingin…
                </p>

                <p
                  className="
                    text-[17.5px]
                    leading-[1.8]
                    text-[rgb(var(--color-text))]
                    font-medium
                  "
                >
                  tapi karena mereka belum mampu.
                </p>

                <p className="text-[rgb(var(--color-muted))] text-[15.5px] leading-[1.8]">
                  Ada anak-anak yang hanya bisa melihat,
                  tanpa pernah benar-benar merasakan.
                </p>

              </div>

              {/* EMOTIONAL BLOCK */}
              <div
                className="
                  mt-8
                  pl-5
                  border-l-[3px]
                  border-[rgb(var(--color-accent))]
                "
              >
                <p
                  className="
                    text-[16.5px]
                    leading-[1.8]
                    text-[rgb(var(--color-text))]
                    italic
                  "
                >
                  Mungkin bagi kita, qurban adalah rutinitas.
                  <br />
                  Tapi bagi mereka… itu adalah harapan.
                </p>
              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  )
}