import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { hospitals } from "@/lib/data"
import { Building2, ChevronRight, Users } from "lucide-react"
import Link from "next/link"

export default function WorkflowsPage() {
  const surgicalHospitals = hospitals.filter((h) => h.hasSurgicalWorkflows)

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Surgical Workflows" />

      <main className="px-4 py-4">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Select Hospital</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Choose a hospital to view available surgeons and procedures
          </p>
          <div className="flex flex-col gap-3">
            {surgicalHospitals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hospitals with surgical workflows configured.</p>
            ) : (
              surgicalHospitals.map((hospital) => (
                <Link
                  key={hospital.id}
                  href={`/workflows/hospital/${hospital.id}`}
                  className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-card-foreground truncate">{hospital.name}</h3>
                        <p className="text-sm text-muted-foreground">{hospital.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        <Users className="h-3 w-3" />
                        {hospital.doctors.length}
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
