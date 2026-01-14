import { notFound } from "next/navigation"
import { operations } from "@/lib/data"
import { AdminWorkflowEditor } from "@/components/admin-workflow-editor"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminWorkflowDetailPage({ params }: Props) {
  const { id } = await params
  const workflow = operations.find((op) => op.id === id)

  if (!workflow) {
    notFound()
  }

  return <AdminWorkflowEditor workflow={workflow} />
}
