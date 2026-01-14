import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { hospitals, getDoctorsByHospital } from "@/lib/data"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight, Stethoscope, Calendar } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ hospitalId: string }>
}

export default async function HospitalDoctorsPage({ params }: PageProps) {
  const { hospitalId } = await params
  const hospital = hospitals.find((h) => h.id === hospitalId)

  if (!hospital) {
    notFound()
  }

  const hospitalDoctors = getDoctorsByHospital(hospitalId)

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        {/* Back Button */}
        <Link
          href="/workflows"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to hospitals
        </Link>

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Hospital</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{hospital.name}</span>
        </div>

        {/* Doctor Selection */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Select Surgeon ({hospitalDoctors.length})
          </h2>
          <div className="flex flex-col gap-3">
            {hospitalDoctors.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/workflows/hospital/${hospitalId}/doctor/${doctor.id}`}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Stethoscope className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground">{doctor.name}</h3>
                      <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {doctor.operations.length} procedures
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(doctor.lastVisit).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {doctor.preferences.slice(0, 2).map((pref, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                    >
                      {pref.length > 25 ? pref.substring(0, 25) + "..." : pref}
                    </span>
                  ))}
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
