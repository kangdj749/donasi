"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function EmpathySection() {
  return (
    <section
      className="
        relative
        bg-[rgb(var(--color-bg))]
        section
      "
    >
      <div className="container-wide">

        <div className="grid grid-cols-12 gap-10 items-center">

          {/* ================= IMAGE ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-6"
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-[16px]
                shadow-[var(--shadow-elevated)]
              "
            >
              <Image
                src={cloudinaryImage(
                  "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776525084/memilukan-keluarga-di-purwakarta-ini-hidup-miskin-dengan-12-anak-qzo_ngjsio.jpg",
                  "natural"
                )}
                alt="Anak-anak di daerah terpencil menunggu qurban"
                width={720}
                height={520}
                className="object-cover w-full h-full"
                priority={false}
              />

              {/* subtle overlay biar nyatu */}
              <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/10" />
            </div>
          </motion.div>

          {/* ================= TEXT ================= */}
          <div className="col-span-12 md:col-span-6">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >

              {/* LABEL */}
              <p
                className="
                  text-[12px]
                  tracking-[0.3em]
                  uppercase
                  font-semibold
                  text-[rgb(var(--color-primary))]
                  mb-5
                "
              >
                Sebuah Realita
              </p>

              {/* HEADLINE (EMOTIONAL BREAK) */}
              <h2
                className="
                  text-[26px] md:text-[34px]
                  leading-[1.35]
                  font-semibold
                  tracking-[-0.01em]
                  text-[rgb(var(--color-text))]
                  mb-6
                "
              >
                Di daerah terpencil, di kampung yang jauh dari kota,
                <br />
                <span className="text-[rgb(var(--color-accent))]">
                  qurban bukan tradisi tahunan.
                </span>
              </h2>

              {/* BODY STORY */}
              <div className="space-y-5">

                <p className="text-[rgb(var(--color-muted))] text-[15.5px] leading-[1.8]">
                  Bukan karena mereka tidak ingin…
                </p>

                <p
                  className="
                    text-[17px]
                    leading-[1.8]
                    text-[rgb(var(--color-text))]
                    font-medium
                  "
                >
                  tapi karena mereka belum mampu.
                </p>

                <p className="text-[rgb(var(--color-muted))] text-[15.5px] leading-[1.8]">
                  Ada anak-anak yang hanya bisa melihat,
                  <br />
                  tanpa pernah benar-benar merasakan.
                </p>

              </div>

              {/* EMOTIONAL LINE */}
              <div
                className="
                  mt-8
                  border-l-2
                  border-[rgb(var(--color-accent))]
                  pl-4
                "
              >
                <p
                  className="
                    text-[16px]
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