"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { hospitals, getDoctorById, type Operation } from "@/lib/data"
import { getOperationByIdWithCustom } from "@/components/doctor-procedures-list"
import { ArrowLeft, ChevronRight, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditableWorkflowSteps } from "@/components/editable-workflow-steps"
import { EditableProductsUsed } from "@/components/editable-products-used"
import { EditableMetaTags } from "@/components/editable-meta-tags"

export default function OperationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [operation, setOperation] = useState<Operation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const hospitalId = params.hospitalId as string
  const doctorId = params.doctorId as string
  const operationId = params.operationId as string

  const hospital = hospitals.find((h) => h.id === hospitalId)
  const doctor = getDoctorById(doctorId)

  useEffect(() => {
    const foundOperation = getOperationByIdWithCustom(operationId)
    if (foundOperation) {
      setOperation(foundOperation)
    }
    setIsLoading(false)
  }, [operationId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="px-4 py-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded-xl" />
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </main>
        <MobileNav />
      </div>
    )
  }

  if (!hospital || !doctor || !operation) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="px-4 py-4">
          <div className="text-center py-12">
            <h1 className="text-xl font-bold text-foreground mb-2">Not Found</h1>
            <p className="text-muted-foreground mb-4">The requested procedure could not be found.</p>
            <Link
              href={`/workflows/hospital/${hospitalId}/doctor/${doctorId}`}
              className="text-primary hover:underline"
            >
              Back to procedures
            </Link>
          </div>
        </main>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        {/* Back Button */}
        <Link
          href={`/workflows/hospital/${hospitalId}/doctor/${doctorId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to procedures
        </Link>

        {/* Breadcrumb */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground truncate max-w-[100px]">{hospital.name}</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground truncate max-w-[80px]">{doctor.name}</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="font-medium text-foreground">{operation.name}</span>
        </div>

        {/* Operation Info */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex flex-col gap-2 mb-2">
              <h1 className="text-xl font-bold text-card-foreground">{operation.name}</h1>
              <EditableMetaTags operationId={operationId} initialTags={operation.metaTags || [operation.category]} />
            </div>
            <p className="text-sm text-muted-foreground mb-3">{operation.description}</p>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{operation.estimatedDuration}</span>
              </div>
              <Badge variant="secondary">{operation.steps.length} steps</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Preferences Alert */}
        {doctor.preferences.length > 0 && (
          <div className="mb-4 rounded-xl bg-primary/10 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-2">{doctor.name}&apos;s Preferences</h3>
                <ul className="space-y-1">
                  {doctor.preferences.map((pref, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {pref}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Steps */}
        <EditableWorkflowSteps operationId={operationId} initialSteps={operation.steps} />

        {/* Products Used */}
        <EditableProductsUsed operationId={operationId} initialProductIds={operation.productsUsed} />
      </main>

      <MobileNav />
    </div>
  )
}
