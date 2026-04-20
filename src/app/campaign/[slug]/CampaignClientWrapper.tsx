"use client"

import { useState } from "react"
import { CampaignProduct } from "@/lib/campaign.product.service"
import CampaignProductSection from "@/components/campaign/sections/CampaignProductSection"
import DonationDrawer from "./DonationDrawer"

type Props = {
  products: CampaignProduct[]
  campaignId: string
  organizationId: string
  campaignSlug: string
  organizationSlug: string
  category?: string
  affiliateCode: string | null
}

export default function CampaignClientWrapper({
  products,
  campaignId,
  organizationId,
  campaignSlug,
  organizationSlug,
  category,
  affiliateCode,
}: Props) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState<number>(50000)

  function handleOpenDonation(val: number) {
    console.log("🔥 OPEN GLOBAL DRAWER:", val)
    setAmount(val)
    setOpen(true)
  }

  return (
    <>
      <CampaignProductSection
        products={products}
        onSelectDonation={handleOpenDonation}
      />

      {open && (
        <DonationDrawer
          campaignId={campaignId}
          organizationId={organizationId}
          campaignSlug={campaignSlug}
          organizationSlug={organizationSlug}
          category={category}
          affiliateCode={affiliateCode}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}