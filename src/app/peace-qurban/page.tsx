import AgitationSection from "@/components/peace-qurban/AgitationSection"
import ClosingEmotionalSection from "@/components/peace-qurban/ClosingEmotionalSection"
import CTASection from "@/components/peace-qurban/CTASection"
import EmpathySection from "@/components/peace-qurban/EmpathySection"
import HeroSection from "@/components/peace-qurban/HeroSection"
import ImpactVisualizationSection from "@/components/peace-qurban/ImpactVisualizationSection"
import ProgramSection from "@/components/peace-qurban/ProgramSection"
import ShiftSection from "@/components/peace-qurban/ShiftSection"
import SolutionSection from "@/components/peace-qurban/SolutionSection"
import SpiritualAnchorSection from "@/components/peace-qurban/SpiritualAnchorSection"
import UrgencySection from "@/components/peace-qurban/UrgencySection"
import USPSection from "@/components/peace-qurban/USPSection"
import type { Metadata } from "next"

/* ================= SEO ================= */

export const metadata: Metadata = {
  title: "Qurban Kita, Harapan Mereka | Peace Qurban",
  description:
    "Tunaikan qurban Anda dan bantu saudara di daerah 3T, dhuafa, dan penyintas bencana. Distribusi luas, transparan, dan sesuai syariat.",
}

/* ================= JSON-LD ================= */

const campaignSchema = {
  "@context": "https://schema.org",
  "@type": "DonateAction",
  name: "Peace Qurban",
  description:
    "Program distribusi qurban ke daerah 3T dan masyarakat dhuafa.",
}

/* ================= PAGE ================= */

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(campaignSchema),
        }}
      />

      <main className="bg-[rgb(var(--color-bg))]">

        {/* HERO FULL WIDTH */}
        <HeroSection />
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
        <CTASection />

        {/* NEXT SECTION CONTAINER */}
        

      </main>
    </>
  )
}