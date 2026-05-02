import CampaignCard from "./CampaignCard"

type Campaign = {
  id: string
  slug: string
  title: string
  shortTagline: string
  category: string[]
  imageId: string
  goal: number
  collected: number
  donors: number
}

export default function CampaignList({
  campaigns,
}: {
  campaigns: Campaign[]
}) {
  if (!campaigns.length) {
    return (
      <div className="text-center py-10 text-muted">
        Belum ada campaign tersedia
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {campaigns.map((c) => (
        <CampaignCard key={c.id} data={c} />
      ))}
    </div>
  )
}