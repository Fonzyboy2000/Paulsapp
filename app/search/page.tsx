"use client"

import { useState, useMemo, Suspense } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, Package, Clock, X } from "lucide-react"
import { surgeons, products } from "@/lib/data"
import Link from "next/link"

const recentSearches = ["Dr. Chen", "TitanFlex", "hip replacement", "ATTUNE"]

function SearchPageContent() {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const results = useMemo(() => {
    if (!query.trim()) {
      return { surgeons: [], products: [] }
    }

    const q = query.toLowerCase()

    return {
      surgeons: surgeons.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.specialty.toLowerCase().includes(q) ||
          s.hospital.toLowerCase().includes(q),
      ),
      products: products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      ),
    }
  }, [query])

  const totalResults = results.surgeons.length + results.products.length
  const hasResults = totalResults > 0
  const hasQuery = query.trim().length > 0

  return (
    <>
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search surgeons, products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>

      {/* Recent Searches (when no query) */}
      {!hasQuery && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => setQuery(search)}
                className="inline-flex items-center rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Quick Access (when no query) - Removed Intel card */}
      {!hasQuery && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/doctors">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="py-4 text-center">
                  <User className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-card-foreground">Surgeons</p>
                  <p className="text-xs text-muted-foreground">{surgeons.length}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="py-4 text-center">
                  <Package className="h-5 w-5 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium text-card-foreground">Products</p>
                  <p className="text-xs text-muted-foreground">{products.length}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* Search Results - Removed competitors tab */}
      {hasQuery && (
        <>
          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-4">
            {hasResults ? `${totalResults} results for "${query}"` : `No results for "${query}"`}
          </p>

          {hasResults && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
                <TabsTrigger value="surgeons">
                  <User className="h-3 w-3 mr-1" />
                  {results.surgeons.length}
                </TabsTrigger>
                <TabsTrigger value="products">
                  <Package className="h-3 w-3 mr-1" />
                  {results.products.length}
                </TabsTrigger>
              </TabsList>

              {/* All Results */}
              <TabsContent value="all" className="space-y-4">
                {results.surgeons.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Surgeons</h3>
                    <div className="space-y-2">
                      {results.surgeons.slice(0, 3).map((surgeon) => (
                        <SurgeonResult key={surgeon.id} surgeon={surgeon} />
                      ))}
                    </div>
                  </div>
                )}
                {results.products.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Products</h3>
                    <div className="space-y-2">
                      {results.products.slice(0, 3).map((product) => (
                        <ProductResult key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Surgeons Tab */}
              <TabsContent value="surgeons" className="space-y-2">
                {results.surgeons.map((surgeon) => (
                  <SurgeonResult key={surgeon.id} surgeon={surgeon} />
                ))}
                {results.surgeons.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No surgeons found</p>
                )}
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-2">
                {results.products.map((product) => (
                  <ProductResult key={product.id} product={product} />
                ))}
                {results.products.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No products found</p>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* No Results */}
          {!hasResults && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold text-foreground mb-1">No results found</h3>
              <p className="text-sm text-muted-foreground">Try searching for a surgeon name or product</p>
            </div>
          )}
        </>
      )}
    </>
  )
}

function SurgeonResult({ surgeon }: { surgeon: (typeof surgeons)[0] }) {
  return (
    <Link href={`/doctors/${surgeon.id}`}>
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="py-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-card-foreground truncate">{surgeon.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {surgeon.specialty} • {surgeon.hospital}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            Surgeon
          </Badge>
        </CardContent>
      </Card>
    </Link>
  )
}

function ProductResult({ product }: { product: (typeof products)[0] }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="py-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-card-foreground truncate">{product.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {product.sku} • {product.category}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            Product
          </Badge>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        <Suspense fallback={null}>
          <SearchPageContent />
        </Suspense>
      </main>

      <MobileNav />
    </div>
  )
}
