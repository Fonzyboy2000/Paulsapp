"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { products, getProductById, type Product } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil, X, Plus, Check, ExternalLink } from "lucide-react"

interface EditableProductsUsedProps {
  operationId: string
  initialProductIds: string[]
}

export function EditableProductsUsed({ operationId, initialProductIds }: EditableProductsUsedProps) {
  const [productIds, setProductIds] = useState<string[]>(initialProductIds)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>("")

  // Load saved products from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`operation-products-${operationId}`)
    if (saved) {
      setProductIds(JSON.parse(saved))
    }
  }, [operationId])

  // Save products to localStorage when changed
  const saveProducts = (newProductIds: string[]) => {
    setProductIds(newProductIds)
    localStorage.setItem(`operation-products-${operationId}`, JSON.stringify(newProductIds))
  }

  // Group products by category for the dropdown
  const productsByCategory = products.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    },
    {} as Record<string, Product[]>,
  )

  // Get available products (not already selected)
  const availableProducts = products.filter((p) => !productIds.includes(p.id))

  const handleAddProduct = () => {
    if (selectedProductId && !productIds.includes(selectedProductId)) {
      saveProducts([...productIds, selectedProductId])
      setSelectedProductId("")
    }
  }

  const handleRemoveProduct = (productId: string) => {
    saveProducts(productIds.filter((id) => id !== productId))
  }

  const categoryLabels: Record<string, string> = {
    knee: "Knee",
    hip: "Hip",
    trauma: "Trauma",
    spine: "Spine",
    cmf: "CMF",
    shoulder: "Shoulder",
    "hand-wrist": "Hand & Wrist",
    "foot-ankle": "Foot & Ankle",
    biomaterials: "Biomaterials",
    "bone-cement": "Bone Cement",
    "power-tools": "Power Tools",
    navigation: "Navigation",
    robotics: "Robotics",
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Products Used</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-8 w-8 p-0">
            {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Product list with links */}
        <div className="flex flex-wrap gap-2 mb-3">
          {productIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products assigned</p>
          ) : (
            productIds.map((productId) => {
              const product = getProductById(productId)
              if (!product) return null

              return (
                <div key={productId} className="flex items-center gap-1">
                  <Link href={`/products/${productId}`}>
                    <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer flex items-center gap-1">
                      {product.name}
                      <ExternalLink className="h-3 w-3" />
                    </Badge>
                  </Link>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProduct(productId)}
                      className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Add product dropdown - only show when editing */}
        {isEditing && availableProducts.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a product to add..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(productsByCategory).map(([category, categoryProducts]) => {
                  const availableInCategory = categoryProducts.filter((p) => !productIds.includes(p.id))
                  if (availableInCategory.length === 0) return null

                  return (
                    <SelectGroup key={category}>
                      <SelectLabel>{categoryLabels[category] || category}</SelectLabel>
                      {availableInCategory.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )
                })}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleAddProduct} disabled={!selectedProductId} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
