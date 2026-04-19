"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

export default function AgitationSection() {
  return (
    <section
      className="
        relative
        bg-[rgb(var(--color-surface))]
        section
      "
    >
      <div className="container-wide">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p
            className="
              text-[12px]
              tracking-[0.3em]
              uppercase
              font-semibold
              text-[rgb(var(--color-primary))]
              mb-4
            "
          >
            Sebuah Kontras
          </p>

          <h2
            className="
              text-[26px] md:text-[34px]
              font-semibold
              leading-[1.35]
              tracking-[-0.01em]
              text-[rgb(var(--color-text))]
              max-w-[520px]
              mx-auto
            "
          >
            Sementara di kota…
            <br />
            <span className="text-[rgb(var(--color-accent))]">
              qurban justru menumpuk.
            </span>
          </h2>
        </motion.div>

        {/* ================= VISUAL CONTRAST ================= */}
        <div className="grid grid-cols-12 gap-6 mb-12">

          {/* LEFT (KOTA) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-6"
          >
            <div className="relative rounded-[14px] overflow-hidden shadow-[var(--shadow-medium)]">

              <Image
                src={cloudinaryImage(
                  "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776526108/daging-qurban_kjhvee.jpg",
                  "natural"
                )}
                alt="Distribusi qurban di kota yang berlebih"
                width={720}
                height={480}
                className="object-cover w-full h-full"
              />

              {/* overlay label */}
              <div className="absolute inset-0 bg-[rgb(var(--color-dark))]/30" />

              <div className="absolute bottom-4 left-4">
                <p className="text-white text-[13px] font-medium">
                  Distribusi di kota
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT (TEXT FLOW) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-6 flex flex-col justify-center"
          >

            <div className="space-y-5">

              <p className="text-[15.5px] text-[rgb(var(--color-muted))] leading-[1.8]">
                qurban sering kali menumpuk di satu tempat,
                dibagikan di lingkungan yang sama,
                bahkan terkadang berlebih.
              </p>

              <p className="text-[16.5px] text-[rgb(var(--color-text))] leading-[1.8] font-medium">
                Bukan karena kita tidak peduli,
              </p>

              <p className="text-[15.5px] text-[rgb(var(--color-muted))] leading-[1.8]">
                tapi karena distribusi belum merata.
              </p>

            </div>

            {/* EMPHASIS BOX */}
            <div
              className="
                mt-8
                p-5
                rounded-[14px]
                bg-[rgb(var(--color-bg))]
                border border-[rgb(var(--color-border))]
                shadow-[var(--shadow-soft)]
              "
            >
              <p
                className="
                  text-[15.5px]
                  leading-[1.8]
                  text-[rgb(var(--color-text))]
                "
              >
                Tanpa kita sadari,
                <span className="font-semibold">
                  {" "}ada yang menerima berlebih,
                </span>{" "}
                sementara di tempat lain…
                <span className="text-[rgb(var(--color-accent))] font-semibold">
                  {" "}belum merasakan sama sekali.
                </span>
              </p>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  )
}