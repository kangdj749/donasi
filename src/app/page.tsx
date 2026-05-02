// app/page.tsx

import type { Metadata } from "next"
import { Suspense } from "react"
import HomeClient from "@/components/HomeClient"

export const dynamic = "force-dynamic"

/* =========================================================
   🔥 SEO METADATA (NEXT 13+ APP ROUTER)
========================================================= */

const baseUrl = "https://donasi.grahadhuafa.org"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "Donasi Online Terpercaya | Graha Dhuafa",
    template: "%s | Graha Dhuafa",
  },

  description:
    "Platform donasi online terpercaya untuk membantu sesama. Salurkan sedekah, zakat, dan donasi kemanusiaan dengan mudah, aman, dan transparan di Graha Dhuafa.",

  keywords: [
    "donasi online",
    "sedekah online",
    "zakat online",
    "donasi terpercaya",
    "donasi Indonesia",
    "platform donasi",
    "graha dhuafa",
    "galang dana",
  ],

  authors: [{ name: "Graha Dhuafa" }],
  creator: "Graha Dhuafa",
  publisher: "Graha Dhuafa",

  alternates: {
    canonical: baseUrl,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: "Graha Dhuafa",
    title: "Donasi Online Terpercaya | Graha Dhuafa",
    description:
      "Bantu sesama dengan mudah melalui platform donasi terpercaya. Donasi, sedekah, dan zakat kini lebih transparan.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Donasi Online Graha Dhuafa",
      },
    ],
    locale: "id_ID",
  },

  twitter: {
    card: "summary_large_image",
    title: "Donasi Online Terpercaya | Graha Dhuafa",
    description:
      "Platform donasi online untuk sedekah, zakat, dan bantuan kemanusiaan.",
    images: [`${baseUrl}/og-image.jpg`],
    creator: "@grahadhuafa",
  },

  icons: {
    icon: "/favicon.ico",
  },
}

/* =========================================================
   🔥 STRUCTURED DATA (JSON-LD)
========================================================= */

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Graha Dhuafa",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://instagram.com/grahadhuafa",
      "https://facebook.com/grahadhuafa",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+62-000-000-000",
        contactType: "customer service",
        areaServed: "ID",
        availableLanguage: ["Indonesian"],
      },
    ],
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Graha Dhuafa",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  const nonprofit = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Graha Dhuafa",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Platform donasi untuk membantu sesama melalui zakat, sedekah, dan bantuan kemanusiaan.",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nonprofit) }}
      />
    </>
  )
}

/* =========================================================
   🔥 PAGE
========================================================= */

export default function HomePage() {
  return (
    <>
      <JsonLd />

      <Suspense fallback={null}>
        <HomeClient />
      </Suspense>
    </>
  )
}