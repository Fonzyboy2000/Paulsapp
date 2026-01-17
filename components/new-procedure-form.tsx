"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  LinkIcon,
  Package,
  Camera,
  FileText,
  ImageIcon,
  File,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StepAttachment, StepSet, Operation } from "@/lib/data"

const CUSTOM_OPERATIONS_KEY = "depuy-custom-operations"
const DOCTOR_OPERATIONS_KEY = "depuy-doctor-operations"

function getCustomOperations(): Operation[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(CUSTOM_OPERATIONS_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveCustomOperation(operation: Operation) {
  const existing = getCustomOperations()
  const updated = [...existing.filter((op) => op.id !== operation.id), operation]
  localStorage.setItem(CUSTOM_OPERATIONS_KEY, JSON.stringify(updated))
}

function addOperationToDoctor(doctorId: string, operationId: string) {
  const stored = localStorage.getItem(DOCTOR_OPERATIONS_KEY)
  const allDoctorOps = stored ? JSON.parse(stored) : {}
  const currentOps = allDoctorOps[doctorId] || []
  if (!currentOps.includes(operationId)) {
    allDoctorOps[doctorId] = [...currentOps, operationId]
    localStorage.setItem(DOCTOR_OPERATIONS_KEY, JSON.stringify(allDoctorOps))
  }
}

interface NewProcedureFormProps {
  hospitalId: string
  doctorId: string
  hospitalName: string
  doctorName: string
}

interface NewStep {
  order: number
  description: string
  duration: string
  notes: string
  doctorPreferences: string
  attachments: StepAttachment[]
  sets: StepSet[]
}

export function NewProcedureForm({ hospitalId, doctorId, hospitalName, doctorName }: NewProcedureFormProps) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [category, setCategory] = useState<"joint" | "trauma" | "spine">("joint")
  const [description, setDescription] = useState("")
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const [steps, setSteps] = useState<NewStep[]>([
    {
      order: 1,
      description: "",
      duration: "10 min",
      notes: "",
      doctorPreferences: "",
      attachments: [],
      sets: [],
    },
  ])
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})
  const imageInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})
  const [showLinkModal, setShowLinkModal] = useState<number | null>(null)
  const [linkName, setLinkName] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const addStep = () => {
    setSteps([
      ...steps,
      {
        order: steps.length + 1,
        description: "",
        duration: "10 min",
        notes: "",
        doctorPreferences: "",
        attachments: [],
        sets: [],
      },
    ])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({
          ...step,
          order: i + 1,
        }))
      setSteps(newSteps)
    }
  }

  const updateStep = (index: number, field: keyof NewStep, value: string | StepAttachment[] | StepSet[]) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setSteps(newSteps)
  }

  const addSet = (stepIndex: number) => {
    const newSteps = [...steps]
    newSteps[stepIndex].sets.push({
      id: `set-${Date.now()}`,
      description: "",
      setsNumber: "",
    })
    setSteps(newSteps)
  }

  const updateSet = (stepIndex: number, setIndex: number, field: "description" | "setsNumber", value: string) => {
    const newSteps = [...steps]
    newSteps[stepIndex].sets[setIndex] = {
      ...newSteps[stepIndex].sets[setIndex],
      [field]: value,
    }
    setSteps(newSteps)
  }

  const removeSet = (stepIndex: number, setIndex: number) => {
    const newSteps = [...steps]
    newSteps[stepIndex].sets = newSteps[stepIndex].sets.filter((_, i) => i !== setIndex)
    setSteps(newSteps)
  }

  const getFileType = (filename: string): StepAttachment["type"] => {
    const ext = filename.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) return "image"
    if (ext === "pdf") return "pdf"
    if (["doc", "docx"].includes(ext || "")) return "word"
    return "document"
  }

  const getFileIcon = (type: StepAttachment["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "word":
        return <FileText className="h-4 w-4 text-blue-500" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const handleFileUpload = (stepIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newSteps = [...steps]
    Array.from(files).forEach((file) => {
      const fileType = getFileType(file.name)
      const url = URL.createObjectURL(file)
      newSteps[stepIndex].attachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: fileType,
        url: url,
      })
    })
    setSteps(newSteps)

    // Reset input
    if (fileInputRefs.current[stepIndex]) {
      fileInputRefs.current[stepIndex]!.value = ""
    }
  }

  const handleImageCapture = (stepIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newSteps = [...steps]
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      newSteps[stepIndex].attachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: "image",
        url: url,
      })
    })
    setSteps(newSteps)

    // Reset input
    if (imageInputRefs.current[stepIndex]) {
      imageInputRefs.current[stepIndex]!.value = ""
    }
  }

  const handleAddLink = (stepIndex: number) => {
    if (!linkName || !linkUrl) return

    const newSteps = [...steps]
    newSteps[stepIndex].attachments.push({
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: linkName,
      type: getFileType(linkName),
      url: linkUrl,
    })
    setSteps(newSteps)
    setShowLinkModal(null)
    setLinkName("")
    setLinkUrl("")
  }

  const removeAttachment = (stepIndex: number, attachmentIndex: number) => {
    const newSteps = [...steps]
    newSteps[stepIndex].attachments = newSteps[stepIndex].attachments.filter((_, i) => i !== attachmentIndex)
    setSteps(newSteps)
  }

  const handleSubmit = () => {
    const newOperationId = `op-${Date.now()}-${doctorId}`

    const newOperation: Operation = {
      id: newOperationId,
      name,
      category,
      description,
      estimatedDuration,
      steps: steps.map((step) => ({
        ...step,
        products: [],
      })),
      productsUsed: [],
    }

    // Save to localStorage so it persists
    saveCustomOperation(newOperation)

    addOperationToDoctor(doctorId, newOperationId)

    // Navigate to the new procedure page
    router.push(`/workflows/hospital/${hospitalId}/doctor/${doctorId}/operation/${newOperationId}`)
  }

  const durations = ["5 min", "10 min", "15 min", "20 min", "30 min", "45 min", "60 min"]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href={`/workflows/hospital/${hospitalId}/doctor/${doctorId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to procedures
      </Link>

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">{hospitalName}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{doctorName}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-foreground">New Procedure</span>
      </div>

      {/* Procedure Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Procedure Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Procedure Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Primary Total Knee"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as "joint" | "trauma" | "spine")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joint">Joint</SelectItem>
                  <SelectItem value="trauma">Trauma</SelectItem>
                  <SelectItem value="spine">Spine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Estimated Duration *</Label>
              <Input
                id="duration"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g., 2-3 hours"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the procedure..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Procedure Steps ({steps.length})</h2>
          <Button onClick={addStep} size="sm" variant="outline" className="gap-1 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Step
          </Button>
        </div>

        {steps.map((step, stepIndex) => (
          <Card key={stepIndex} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step.order}
                  </div>
                  <CardTitle className="text-base">Step {step.order}</CardTitle>
                </div>
                {steps.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(stepIndex)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step Title/Description */}
              <div className="space-y-2">
                <Label>Step Title/Description *</Label>
                <Input
                  value={step.description}
                  onChange={(e) => updateStep(stepIndex, "description", e.target.value)}
                  placeholder="e.g., Distal femoral resection"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={step.duration} onValueChange={(v) => updateStep(stepIndex, "duration", v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Doctor Preferences */}
              <div className="space-y-2">
                <Label>Doctor Preferences</Label>
                <Textarea
                  value={step.doctorPreferences}
                  onChange={(e) => updateStep(stepIndex, "doctorPreferences", e.target.value)}
                  placeholder="Specific preferences for this step..."
                  rows={2}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={step.notes}
                  onChange={(e) => updateStep(stepIndex, "notes", e.target.value)}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>

              {/* Sets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Sets
                  </Label>
                  <Button variant="outline" size="sm" onClick={() => addSet(stepIndex)} className="gap-1">
                    <Plus className="h-3 w-3" />
                    Add Set
                  </Button>
                </div>
                {step.sets.length > 0 && (
                  <div className="space-y-2 pl-4 border-l-2 border-muted">
                    {step.sets.map((set, setIndex) => (
                      <div key={set.id} className="flex items-center gap-2">
                        <Input
                          value={set.description}
                          onChange={(e) => updateSet(stepIndex, setIndex, "description", e.target.value)}
                          placeholder="Set description"
                          className="flex-1"
                        />
                        <Input
                          value={set.setsNumber}
                          onChange={(e) => updateSet(stepIndex, setIndex, "setsNumber", e.target.value)}
                          placeholder="Sets #"
                          className="w-24"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSet(stepIndex, setIndex)}
                          className="text-destructive hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Attachments</Label>
                  <div className="flex flex-wrap gap-2">
                    {/* Hidden file inputs */}
                    <input
                      ref={(el) => {
                        fileInputRefs.current[stepIndex] = el
                      }}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                      className="hidden"
                      onChange={(e) => handleFileUpload(stepIndex, e)}
                    />
                    <input
                      ref={(el) => {
                        imageInputRefs.current[stepIndex] = el
                      }}
                      type="file"
                      multiple
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleImageCapture(stepIndex, e)}
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowLinkModal(stepIndex)} className="gap-1">
                      <LinkIcon className="h-3 w-3" />
                      Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRefs.current[stepIndex]?.click()}
                      className="gap-1"
                    >
                      <Upload className="h-3 w-3" />
                      Upload
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => imageInputRefs.current[stepIndex]?.click()}
                      className="gap-1"
                    >
                      <Camera className="h-3 w-3" />
                      Photo
                    </Button>
                  </div>
                </div>

                {/* Link Modal */}
                {showLinkModal === stepIndex && (
                  <div className="p-3 bg-muted rounded-lg space-y-2">
                    <Input
                      value={linkName}
                      onChange={(e) => setLinkName(e.target.value)}
                      placeholder="Document name (e.g., Procedure Guide.pdf)"
                    />
                    <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="Document URL" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAddLink(stepIndex)}>
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowLinkModal(null)
                          setLinkName("")
                          setLinkUrl("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Display attachments */}
                {step.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {step.attachments.map((att, attIndex) => (
                      <div key={att.id} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm">
                        {getFileIcon(att.type)}
                        <span className="max-w-[150px] truncate">{att.name}</span>
                        <button
                          onClick={() => removeAttachment(stepIndex, attIndex)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1 bg-transparent" asChild>
          <Link href={`/workflows/hospital/${hospitalId}/doctor/${doctorId}`}>Cancel</Link>
        </Button>
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={!name || !estimatedDuration || steps.some((s) => !s.description)}
        >
          Create Procedure
        </Button>
      </div>
    </div>
  )
}
