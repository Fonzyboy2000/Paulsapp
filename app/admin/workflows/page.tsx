import { Suspense } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { AdminWorkflowsList } from "@/components/admin-workflows-list"

export default function AdminWorkflowsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        <Suspense fallback={null}>
          <AdminWorkflowsList />
        </Suspense>
      </main>

      <MobileNav />
    </div>
  )
}
