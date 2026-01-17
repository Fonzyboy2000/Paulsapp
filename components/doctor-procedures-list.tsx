"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { operations, type Hospital, type Doctor, type Operation } from "@/lib/data"
import { ArrowLeft, ChevronRight, Clock, Activity, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const CUSTOM_OPERATIONS_KEY = "depuy-custom-operations"
const DOCTOR_OPERATIONS_KEY = "depuy-doctor-operations"

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

function saveDoctorOperations(doctorId: string, operationIds: string[]) {
  const stored = localStorage.getItem(DOCTOR_OPERATIONS_KEY)
  const allDoctorOps = stored ? JSON.parse(stored) : {}
  allDoctorOps[doctorId] = operationIds
  localStorage.setItem(DOCTOR_OPERATIONS_KEY, JSON.stringify(allDoctorOps))
}

function getDoctorOperations(doctorId: string): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(DOCTOR_OPERATIONS_KEY)
  const allDoctorOps = stored ? JSON.parse(stored) : {}
  return allDoctorOps[doctorId] || []
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
  const [localOperations, setLocalOperations] = useState<Operation[]>(doctorOperations)

  useEffect(() => {
    // Load custom operations for this doctor
    const customOps = getCustomOperations()
    const doctorCustomOps = customOps.filter((op) => op.id.includes(`-${doctor.id}`))

    // Load saved doctor operation IDs
    const savedOpIds = getDoctorOperations(doctor.id)

    // Build full list: baseline ops assigned to doctor + custom ops
    const baselineOps = doctorOperations
    const allDoctorOps = [...baselineOps]

    // Add custom ops that aren't already in the list
    doctorCustomOps.forEach((customOp) => {
      if (!allDoctorOps.some((op) => op.id === customOp.id)) {
        allDoctorOps.push(customOp)
      }
    })

    // Also include any baseline ops from savedOpIds that aren't already included
    savedOpIds.forEach((opId) => {
      const baselineOp = operations.find((op) => op.id === opId)
      if (baselineOp && !allDoctorOps.some((op) => op.id === opId)) {
        allDoctorOps.push(baselineOp)
      }
    })

    setLocalOperations(allDoctorOps)

    const allOpIds = allDoctorOps.map((op) => op.id)
    saveDoctorOperations(doctor.id, allOpIds)
  }, [doctor.id, doctorOperations])

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
            <Link href={`/workflows/hospital/${hospital.id}/doctor/${doctor.id}/new-procedure`}>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New Procedure
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {localOperations.length > 0 ? (
              localOperations.map((operation) => (
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-card-foreground">{operation.name}</h3>
                          {operation.id.includes(`-${doctor.id}`) && (
                            <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                              Custom
                            </Badge>
                          )}
                        </div>
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
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No procedures assigned to this doctor.</p>
                <p className="text-sm mt-1">
                  Create a new procedure or assign baseline templates from the doctor profile.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
