import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { HospitalsList } from "@/components/hospitals-list"
import { Suspense } from "react"

export default function HospitalsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Hospitals</h1>
          <p className="text-muted-foreground">Browse all hospitals in your coverage area</p>
        </div>

        <Suspense fallback={null}>
          <HospitalsList />
        </Suspense>
      </main>

      <MobileNav />
    </div>
  )
}
