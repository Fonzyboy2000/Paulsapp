import { hospitals, getDoctorById, getOperationsByDoctor } from "@/lib/data"
import { notFound } from "next/navigation"
import { DoctorProceduresList } from "@/components/doctor-procedures-list"

interface PageProps {
  params: Promise<{ hospitalId: string; doctorId: string }>
}

export default async function DoctorOperationsPage({ params }: PageProps) {
  const { hospitalId, doctorId } = await params
  const hospital = hospitals.find((h) => h.id === hospitalId)
  const doctor = getDoctorById(doctorId)

  if (!hospital || !doctor) {
    notFound()
  }

  const doctorOperations = getOperationsByDoctor(doctorId)

  return <DoctorProceduresList hospital={hospital} doctor={doctor} doctorOperations={doctorOperations} />
}
