import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { QuickActionCard } from "@/components/quick-action-card"
import { RecentItem } from "@/components/recent-item"
import { surgeons, products, hospitals } from "@/lib/data"
import { ClipboardList, Package, Search, Stethoscope, Users, Building2 } from "lucide-react"

export default function HomePage() {
  // Get recent items for display
  const recentSurgeons = surgeons.slice(0, 3)
  const recentProducts = products.slice(0, 2)

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-6">
        {/* Welcome Section */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">DePuy Synthes Workflows App</h1>
          <p className="text-muted-foreground">Access your surgical workflows and product data</p>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <QuickActionCard
              href="/workflows"
              icon={ClipboardList}
              title="Workflows"
              description="Surgeon preferences"
            />
            <QuickActionCard href="/doctors" icon={Users} title="Doctors" description="All surgeons" />
            <QuickActionCard href="/hospitals" icon={Building2} title="Hospitals" description="Locations" />
            <QuickActionCard href="/products" icon={Package} title="Products" description="Specs & assembly" />
            <QuickActionCard href="/search" icon={Search} title="Search" description="Find anything" />
            <QuickActionCard href="/admin" icon={Stethoscope} title="Admin" description="Manage data" />
          </div>
        </section>

        {/* Recent Surgeons */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Surgeons</h2>
            <a href="/doctors" className="text-sm font-medium text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="flex flex-col gap-2">
            {recentSurgeons.map((surgeon) => (
              <RecentItem
                key={surgeon.id}
                href={`/doctors/${surgeon.id}`}
                title={surgeon.name}
                subtitle={surgeon.specialty}
                meta={surgeon.hospital.split(" ")[0]}
              />
            ))}
          </div>
        </section>

        {/* Recent Products */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Products</h2>
            <a href="/products" className="text-sm font-medium text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="flex flex-col gap-2">
            {recentProducts.map((product) => (
              <RecentItem
                key={product.id}
                href={`/products/${product.id}`}
                title={product.name}
                subtitle={product.category}
                meta={product.sku}
              />
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your Coverage</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="flex justify-center mb-2">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-card-foreground">{surgeons.length}</p>
              <p className="text-xs text-muted-foreground">Surgeons</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="flex justify-center mb-2">
                <Building2 className="h-5 w-5 text-chart-2" />
              </div>
              <p className="text-2xl font-bold text-card-foreground">{hospitals.length}</p>
              <p className="text-xs text-muted-foreground">Hospitals</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="flex justify-center mb-2">
                <Package className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-card-foreground">{products.length}</p>
              <p className="text-xs text-muted-foreground">Products</p>
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
