"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { operations, type Hospital, type Doctor, type Operation } from "@/lib/data"
import { ArrowLeft, ChevronRight, Clock, Activity, Plus, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

const CUSTOM_OPERATIONS_KEY = "depuy-custom-operations"

export function getCustomOperations(): Operation[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(CUSTOM_OPERATIONS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveCustomOperation(operation: Operation) {
  const existing = getCustomOperations()
  const updated = [...existing.filter((op) => op.id !== operation.id), operation]
  localStorage.setItem(CUSTOM_OPERATIONS_KEY, JSON.stringify(updated))
}

export function getOperationByIdWithCustom(operationId: string): Operation | undefined {
  // First check static operations
  const staticOp = operations.find((op) => op.id === operationId)
  if (staticOp) return staticOp

  // Then check custom operations in localStorage
  const customOps = getCustomOperations()
  return customOps.find((op) => op.id === operationId)
}

interface DoctorProceduresListProps {
  hospital: Hospital
  doctor: Doctor
  doctorOperations: Operation[]
}

export function DoctorProceduresList({ hospital, doctor, doctorOperations }: DoctorProceduresListProps) {
  const router = useRouter()
  const [localOperations, setLocalOperations] = useState<Operation[]>(doctorOperations)

  useEffect(() => {
    const customOps = getCustomOperations()
    const doctorCustomOps = customOps.filter((op) => op.id.includes(`-${doctor.id}`))
    if (doctorCustomOps.length > 0) {
      setLocalOperations((prev) => {
        const newOps = doctorCustomOps.filter((custom) => !prev.some((p) => p.id === custom.id))
        return [...prev, ...newOps]
      })
    }
  }, [doctor.id])

  // Get all template operations (baseline workflows from admin)
  const templateOperations = operations.filter(
    (op) => !localOperations.some((local) => local.id === op.id || local.id.startsWith(`${op.id}-`)),
  )

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "joint":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "trauma":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "spine":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const handleAddFromTemplate = (templateId: string) => {
    const template = operations.find((op) => op.id === templateId)
    if (template) {
      // Clone the template for this doctor
      const newOperation: Operation = {
        ...template,
        id: `${template.id}-${doctor.id}`, // Create unique ID for doctor's version
        steps: template.steps.map((step) => ({ ...step })),
      }

      saveCustomOperation(newOperation)

      setLocalOperations([...localOperations, newOperation])
      // Navigate to the new operation for editing
      router.push(`/workflows/hospital/${hospital.id}/doctor/${doctor.id}/operation/${newOperation.id}`)
    }
  }

  // Group templates by category
  const templatesByCategory = templateOperations.reduce(
    (acc, op) => {
      if (!acc[op.category]) {
        acc[op.category] = []
      }
      acc[op.category].push(op)
      return acc
    },
    {} as Record<string, Operation[]>,
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        {/* Back Button */}
        <Link
          href={`/workflows/hospital/${hospital.id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to surgeons
        </Link>

        {/* Breadcrumb */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">{hospital.name}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{doctor.name}</span>
        </div>

        {/* Doctor Info Card */}
        <div className="mb-4 rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-primary font-medium mb-2">{doctor.specialty}</p>
          {doctor.notes && <p className="text-sm text-muted-foreground">{doctor.notes}</p>}
        </div>

        {/* Operation Selection */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Select Procedure ({localOperations.length})
            </h2>
            <div className="flex items-center gap-2">
              {/* Template dropdown - green with + icon */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4" />
                    From Templates
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px] max-h-[400px] overflow-y-auto">
                  {Object.keys(templatesByCategory).length === 0 ? (
                    <DropdownMenuItem disabled>No templates available</DropdownMenuItem>
                  ) : (
                    Object.entries(templatesByCategory).map(([category, ops]) => (
                      <div key={category}>
                        <DropdownMenuLabel className="capitalize">{category}</DropdownMenuLabel>
                        {ops.map((op) => (
                          <DropdownMenuItem
                            key={op.id}
                            onClick={() => handleAddFromTemplate(op.id)}
                            className="flex flex-col items-start gap-1 cursor-pointer"
                          >
                            <span className="font-medium">{op.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {op.steps.length} steps - {op.estimatedDuration}
                            </span>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                      </div>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* New Procedure button - primary/red */}
              <Link href={`/workflows/hospital/${hospital.id}/doctor/${doctor.id}/new-procedure`}>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  New Procedure
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {localOperations.map((operation) => (
              <Link
                key={operation.id}
                href={`/workflows/hospital/${hospital.id}/doctor/${doctor.id}/operation/${operation.id}`}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground">{operation.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{operation.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Badge className={getCategoryColor(operation.category)}>{operation.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{operation.estimatedDuration}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{operation.steps.length} steps</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
