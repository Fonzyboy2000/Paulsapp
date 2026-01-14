import { Suspense } from "react"
import { doctors, hospitals, operations, getOperationById, getHospitalById } from "@/lib/data"
import { notFound } from "next/navigation"
import { DoctorProfileEditor } from "@/components/doctor-profile-editor"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { getRecentCallNotes, getCallNotesForDoctor } from "@/lib/call-notes"

export default async function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doctor = doctors.find((d) => d.id === id)

  if (!doctor) {
    notFound()
  }

  const doctorHospitals = doctor.hospitalIds.map((hId) => getHospitalById(hId)).filter(Boolean)
  const doctorOperations = doctor.operations.map((oId) => getOperationById(oId)).filter(Boolean)
  const recentCallNotes = getRecentCallNotes(doctor.id, 3)
  const totalCallNotes = getCallNotesForDoctor(doctor.id).length

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <Suspense fallback={null}>
        <DoctorProfileEditor
          doctor={doctor}
          doctorHospitals={doctorHospitals}
          doctorOperations={doctorOperations}
          allHospitals={hospitals}
          allOperations={operations}
          callNotes={recentCallNotes}
          totalCallNotes={totalCallNotes}
        />
      </Suspense>
      <MobileNav />
    </div>
  )
}
