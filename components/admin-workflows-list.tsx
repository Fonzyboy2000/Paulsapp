"use client"

import { operations, products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  Plus,
  Clock,
  ListOrdered,
  ChevronRight,
  Activity,
  Bone,
  Layers,
  Wrench,
  Edit,
  Trash2,
  Package,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const categoryIcons: Record<string, typeof Activity> = {
  joint: Bone,
  trauma: Wrench,
  spine: Layers,
}

const categoryColors: Record<string, string> = {
  joint: "bg-blue-100 text-blue-700",
  trauma: "bg-orange-100 text-orange-700",
  spine: "bg-purple-100 text-purple-700",
}

export function AdminWorkflowsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [workflowList, setWorkflowList] = useState(operations)

  const categories = Array.from(new Set(operations.map((op) => op.category)))

  const filteredWorkflows = workflowList.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || workflow.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this workflow template?")) {
      setWorkflowList((prev) => prev.filter((w) => w.id !== id))
    }
  }

  return (
    <>
      {/* Info Banner */}
      <div className="mb-4 rounded-xl bg-primary/10 p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Workflow Templates</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          These are base workflow templates. Customization happens when a workflow is associated with a specific doctor.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search workflows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          All ({workflowList.length})
        </Badge>
        {categories.map((category) => {
          const count = workflowList.filter((w) => w.category === category).length
          return (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({count})
            </Badge>
          )
        })}
      </div>

      {/* Add New Button */}
      <Link href="/admin/workflows/new">
        <Button className="mb-4 w-full gap-2">
          <Plus className="h-4 w-4" />
          Add New Workflow Template
        </Button>
      </Link>

      {/* Workflow List */}
      <div className="space-y-3">
        {filteredWorkflows.map((workflow) => {
          const CategoryIcon = categoryIcons[workflow.category] || Activity
          const categoryColor = categoryColors[workflow.category] || "bg-gray-100 text-gray-700"
          const workflowProducts = workflow.productsUsed
            .map((pid) => products.find((p) => p.id === pid))
            .filter(Boolean)

          return (
            <Card key={workflow.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${categoryColor}`}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{workflow.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 capitalize text-xs">
                        {workflow.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/admin/workflows/${workflow.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(workflow.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{workflow.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ListOrdered className="h-4 w-4" />
                    <span>{workflow.steps.length} steps</span>
                  </div>
                  {workflowProducts.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{workflowProducts.length} products</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/admin/workflows/${workflow.id}`}
                  className="mt-3 flex items-center justify-between rounded-lg bg-secondary/50 p-2 text-sm hover:bg-secondary transition-colors"
                >
                  <span>View & Edit Steps</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          )
        })}

        {filteredWorkflows.length === 0 && (
          <div className="py-12 text-center">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No workflows found</p>
          </div>
        )}
      </div>
    </>
  )
}
