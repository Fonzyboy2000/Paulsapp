import { doctors } from "@/lib/data"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { NewCallNoteForm } from "@/components/new-call-note-form"

export default async function NewCallNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doctor = doctors.find((d) => d.id === id)

  if (!doctor) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 py-4">
        <NewCallNoteForm doctor={doctor} />
      </main>
      <MobileNav />
    </div>
  )
}
