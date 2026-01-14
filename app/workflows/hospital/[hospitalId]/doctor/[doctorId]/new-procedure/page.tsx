import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { hospitals, getDoctorById } from "@/lib/data"
import { notFound } from "next/navigation"
import { NewProcedureForm } from "@/components/new-procedure-form"

interface PageProps {
  params: Promise<{ hospitalId: string; doctorId: string }>
}

export default async function NewProcedurePage({ params }: PageProps) {
  const { hospitalId, doctorId } = await params
  const hospital = hospitals.find((h) => h.id === hospitalId)
  const doctor = getDoctorById(doctorId)

  if (!hospital || !doctor) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        <NewProcedureForm
          hospitalId={hospitalId}
          doctorId={doctorId}
          hospitalName={hospital.name}
          doctorName={doctor.name}
        />
      </main>

      <MobileNav />
    </div>
  )
}
