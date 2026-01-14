import { Suspense } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { products } from "@/lib/data"
import { ProductsList } from "@/components/products-list"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to the Product Hub</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Product Hub provides a comprehensive overview of our orthopaedics portfolio. Browse product overviews,
            visual imagery, features and benefits, and specifications.
          </p>
        </div>

        <Suspense fallback={null}>
          <ProductsList products={products} />
        </Suspense>
      </main>

      <MobileNav />
    </div>
  )
}
