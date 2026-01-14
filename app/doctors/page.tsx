import { Suspense } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { DoctorsList } from "@/components/doctors-list"

export default function DoctorsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading surgeons...</div>
            </div>
          }
        >
          <DoctorsList />
        </Suspense>
      </main>

      <MobileNav />
    </div>
  )
}
