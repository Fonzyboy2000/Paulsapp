"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EditableWorkflowStep } from "./editable-workflow-step"
import type { OperationStep } from "@/lib/data"

interface EditableWorkflowStepsProps {
  operationId: string
  initialSteps: OperationStep[]
}

export function EditableWorkflowSteps({ operationId, initialSteps }: EditableWorkflowStepsProps) {
  const [steps, setSteps] = useState<OperationStep[]>(initialSteps)

  const handleUpdateStep = (index: number, updatedStep: OperationStep) => {
    const newSteps = [...steps]
    newSteps[index] = updatedStep
    setSteps(newSteps)
    // In a real app, you would save to a database here
  }

  const handleAddStep = () => {
    const newStep: OperationStep = {
      order: steps.length + 1,
      description: "New step",
      products: [],
      duration: "5 min",
      notes: "",
      doctorPreferences: "",
      attachments: [],
    }
    setSteps([...steps, newStep])
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Surgical Workflow</CardTitle>
        <Button variant="outline" size="sm" onClick={handleAddStep}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Step
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <EditableWorkflowStep
              key={`${step.order}-${index}`}
              step={step}
              index={index}
              totalSteps={steps.length}
              onUpdate={(updatedStep) => handleUpdateStep(index, updatedStep)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
