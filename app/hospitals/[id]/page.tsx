import { hospitals, doctors } from "@/lib/data"
import { notFound } from "next/navigation"
import { HospitalDetailClient } from "@/components/hospital-detail-client"

export default async function HospitalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const hospital = hospitals.find((h) => h.id === id)

  if (!hospital) {
    notFound()
  }

  // Get doctors at this hospital
  const hospitalDoctors = doctors.filter((d) => d.hospitalIds.includes(hospital.id))

  return <HospitalDetailClient hospital={hospital} hospitalDoctors={hospitalDoctors} />
}
