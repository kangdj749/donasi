import AgitationSection from "@/components/peace-qurban/AgitationSection";
import ClosingEmotionalSection from "@/components/peace-qurban/ClosingEmotionalSection";
import CTASection from "@/components/peace-qurban/CTASection";
import EmpathySection from "@/components/peace-qurban/EmpathySection";
import HeroSection from "@/components/peace-qurban/HeroSection";
import ImpactVisualizationSection from "@/components/peace-qurban/ImpactVisualizationSection";
import ProgramSection from "@/components/peace-qurban/ProgramSection";
import ShiftSection from "@/components/peace-qurban/ShiftSection";
import SolutionSection from "@/components/peace-qurban/SolutionSection";
import SpiritualAnchorSection from "@/components/peace-qurban/SpiritualAnchorSection";
import UrgencySection from "@/components/peace-qurban/UrgencySection";
import USPSection from "@/components/peace-qurban/USPSection";

import type { Metadata } from "next";

/* ================= SEO ================= */

export const metadata: Metadata = {
  title: "Qurban Kita, Harapan Mereka | Peace Qurban",
  description:
    "Tunaikan qurban Anda dan bantu saudara di daerah 3T, dhuafa, dan penyintas bencana. Distribusi luas, transparan, dan sesuai syariat.",
  keywords: [
    "qurban online",
    "qurban terpercaya",
    "donasi qurban",
    "qurban 3T",
    "qurban dhuafa",
    "graha dhuafa indonesia",
  ],
  openGraph: {
    title: "Qurban Kita, Harapan Mereka",
    description:
      "Salurkan qurban Anda ke daerah 3T, dhuafa, dan penyintas bencana.",
    url: "https://donasi.grahadhuafa.org/peace-qurban",
    siteName: "GDI Donasi",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776504978/penerima-peace-qurban_fyowsq.jpg",
        width: 1200,
        height: 630,
        alt: "Peace Qurban",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qurban Kita, Harapan Mereka",
    description:
      "Salurkan qurban ke daerah terpencil dan mereka yang membutuhkan.",
  },
};

/* ================= JSON-LD ================= */

const campaignSchema = {
  "@context": "https://schema.org",
  "@type": "DonateAction",
  name: "Peace Qurban",
  description:
    "Program distribusi qurban ke daerah 3T dan masyarakat dhuafa.",
  url: "https://donasi.grahadhuafa.org/peace-qurban",
  recipient: {
    "@type": "Organization",
    name: "Graha Dhuafa Indonesia",
  },
};

/* ================= PAGE ================= */

export default function Page({
  searchParams,
}: {
  searchParams?: { ref?: string; src?: string };
}) {
  /**
   * 🔥 OPTIONAL SSR FALLBACK
   * - hanya untuk jaga-jaga kalau user share link langsung
   * - tracking utama tetap di useAttribution (client)
   */
  const ref = searchParams?.ref ?? "";
  const src = searchParams?.src ?? "landing";

  return (
    <>
      {/* ================= STRUCTURED DATA ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(campaignSchema),
        }}
      />

      <main className="bg-[rgb(var(--color-bg))]">

        {/* 🔥 NOTE:
            ref & src DIKIRIM KE CLIENT COMPONENT
            supaya CTA di dalamnya bisa pakai
        */}

        <HeroSection refCode={ref} src={src} />
        <EmpathySection />
        <AgitationSection />
        <ShiftSection />
        <SolutionSection />
        <USPSection />
        <ImpactVisualizationSection />
        <SpiritualAnchorSection />
        <ProgramSection />
        <UrgencySection />
        <ClosingEmotionalSection />

        <CTASection refCode={ref} src={src} />

      </main>
    </>
  );
}