import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { hospitals, getDoctorById, getOperationsByDoctor } from "@/lib/data"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight, Clock, Activity } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "joint":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "trauma":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "spine":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={doctor.name} />

      <main className="px-4 py-4">
        {/* Back Button */}
        <Link
          href={`/workflows/hospital/${hospitalId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to surgeons
        </Link>

        {/* Breadcrumb */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">{hospital.name}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{doctor.name}</span>
        </div>

        {/* Doctor Info Card */}
        <div className="mb-4 rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-primary font-medium mb-2">{doctor.specialty}</p>
          {doctor.notes && <p className="text-sm text-muted-foreground">{doctor.notes}</p>}
        </div>

        {/* Operation Selection */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Select Procedure ({doctorOperations.length})
          </h2>
          <div className="flex flex-col gap-3">
            {doctorOperations.map((operation) => (
              <Link
                key={operation.id}
                href={`/workflows/hospital/${hospitalId}/doctor/${doctorId}/operation/${operation.id}`}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground">{operation.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{operation.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Badge className={getCategoryColor(operation.category)}>{operation.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{operation.estimatedDuration}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{operation.steps.length} steps</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
