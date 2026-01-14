"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/data"

interface ProductsListProps {
  products: Product[]
}

export function ProductsList({ products }: ProductsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))]
    return cats.sort()
  }, [products])

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === null || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  // Group filtered products by category for counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1
    })
    return counts
  }, [products])

  return (
    <>
      {/* Search and Filter Row */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">{filteredProducts.length} Results found</p>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-4 px-4 scrollbar-hide">
        <Badge
          variant={selectedCategory === null ? "secondary" : "outline"}
          className={`shrink-0 cursor-pointer ${
            selectedCategory === null ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-secondary"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All ({products.length})
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "secondary" : "outline"}
            className={`shrink-0 cursor-pointer ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-secondary"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category} ({categoryCounts[category] || 0})
          </Badge>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg active:scale-[0.99]"
            >
              {/* Product Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-muted to-muted/50">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Badge variant="outline" className="mb-2 text-xs text-primary border-primary/30">
                  {product.category}
                </Badge>
                <h3 className="font-bold text-card-foreground text-lg leading-tight mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{product.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  )
}
