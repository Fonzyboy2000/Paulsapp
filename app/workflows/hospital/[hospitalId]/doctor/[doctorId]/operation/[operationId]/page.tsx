import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { hospitals, getDoctorById, getOperationById, getProductById } from "@/lib/data"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditableWorkflowSteps } from "@/components/editable-workflow-steps"

interface PageProps {
  params: Promise<{ hospitalId: string; doctorId: string; operationId: string }>
}

export default async function OperationDetailPage({ params }: PageProps) {
  const { hospitalId, doctorId, operationId } = await params
  const hospital = hospitals.find((h) => h.id === hospitalId)
  const doctor = getDoctorById(doctorId)
  const operation = getOperationById(operationId)

  if (!hospital || !doctor || !operation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={operation.name} />

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
            <h1 className="text-xl font-bold text-card-foreground mb-2">{operation.name}</h1>
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
        {operation.productsUsed.length > 0 && (
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Products Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {operation.productsUsed.map((productId) => {
                  const product = getProductById(productId)
                  return product ? (
                    <Link key={productId} href={`/products/${productId}`}>
                      <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                        {product.name}
                      </Badge>
                    </Link>
                  ) : null
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav />
    </div>
  )
}
