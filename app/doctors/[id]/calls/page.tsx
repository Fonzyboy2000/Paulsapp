import { Suspense } from "react"
import { doctors } from "@/lib/data"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { getCallNotesForDoctor } from "@/lib/call-notes"
import { ArrowLeft, PhoneCall, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DoctorCallsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doctor = doctors.find((d) => d.id === id)

  if (!doctor) {
    notFound()
  }

  const callNotes = getCallNotesForDoctor(doctor.id)

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 py-4">
        {/* Back Button */}
        <Link
          href={`/doctors/${doctor.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {doctor.name}
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Call Notes</h1>
          <p className="text-muted-foreground">{doctor.name}</p>
        </div>

        {/* Add New Call Note Button */}
        <div className="mb-4">
          <Link href={`/doctors/${doctor.id}/calls/new`}>
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add New Call Note
            </Button>
          </Link>
        </div>

        {/* Call Notes List */}
        <Suspense fallback={null}>
          <div className="space-y-4">
            {callNotes.length > 0 ? (
              callNotes.map((note) => (
                <div key={note.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/10 shrink-0">
                      <PhoneCall className="h-5 w-5 text-chart-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="font-semibold text-card-foreground">
                          {new Date(note.date).toLocaleDateString("en-CA", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {note.createdBy && (
                        <p className="text-xs text-muted-foreground mb-2">Logged by {note.createdBy}</p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed">{note.notes}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <PhoneCall className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="font-medium text-card-foreground mb-1">No call notes yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking your interactions with {doctor.name}
                </p>
                <Link href={`/doctors/${doctor.id}/calls/new`}>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    Add First Call Note
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Suspense>
      </main>
      <MobileNav />
    </div>
  )
}
