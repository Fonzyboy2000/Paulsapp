"use client"

import type React from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  GripVertical,
  Package,
  Upload,
  Camera,
  LinkIcon,
  FileText,
  ImageIcon,
  File,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import type { StepAttachment, StepSet } from "@/lib/data"

interface WorkflowStep {
  order: number
  description: string
  duration: string
  doctorPreferences: string
  notes: string
  sets: StepSet[]
  attachments: StepAttachment[]
}

export default function NewWorkflowPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { order: 1, description: "", duration: "10 min", doctorPreferences: "", notes: "", sets: [], attachments: [] },
  ])

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})
  const imageInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})
  const [showLinkModal, setShowLinkModal] = useState<number | null>(null)
  const [linkName, setLinkName] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        order: prev.length + 1,
        description: "",
        duration: "10 min",
        doctorPreferences: "",
        notes: "",
        sets: [],
        attachments: [],
      },
    ])
  }

  const removeStep = (index: number) => {
    setSteps((prev) => {
      const newSteps = prev.filter((_, i) => i !== index)
      return newSteps.map((step, i) => ({ ...step, order: i + 1 }))
    })
  }

  const updateStep = (index: number, field: keyof WorkflowStep, value: string | StepSet[] | StepAttachment[]) => {
    setSteps((prev) => prev.map((step, i) => (i === index ? { ...step, [field]: value } : step)))
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

  const handleSave = async () => {
    if (!name || !category || !description) {
      alert("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    router.push("/admin/workflows")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        <Link
          href="/admin/workflows"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workflows
        </Link>

        {/* Basic Info */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Workflow Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Primary Total Knee"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joint">Joint Replacement</SelectItem>
                  <SelectItem value="trauma">Trauma</SelectItem>
                  <SelectItem value="spine">Spine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this procedure..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="duration">Estimated Duration</Label>
              <Input
                id="duration"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g., 90-120 min"
              />
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Workflow Steps</CardTitle>
            <Button variant="outline" size="sm" onClick={addStep}>
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="rounded-lg border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Step {step.order}</span>
                  </div>
                  {steps.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeStep(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Step Description *</Label>
                  <Input
                    value={step.description}
                    onChange={(e) => updateStep(index, "description", e.target.value)}
                    placeholder="e.g., Patient positioning"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Duration</Label>
                    <Select value={step.duration} onValueChange={(value) => updateStep(index, "duration", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5 min">5 min</SelectItem>
                        <SelectItem value="10 min">10 min</SelectItem>
                        <SelectItem value="15 min">15 min</SelectItem>
                        <SelectItem value="20 min">20 min</SelectItem>
                        <SelectItem value="30 min">30 min</SelectItem>
                        <SelectItem value="45 min">45 min</SelectItem>
                        <SelectItem value="60 min">60 min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Default Doctor Preferences</Label>
                  <Textarea
                    value={step.doctorPreferences}
                    onChange={(e) => updateStep(index, "doctorPreferences", e.target.value)}
                    placeholder="Default preferences that can be customized per doctor..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Default Notes</Label>
                  <Textarea
                    value={step.notes || ""}
                    onChange={(e) => updateStep(index, "notes", e.target.value)}
                    placeholder="Standard notes for this step..."
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Sets
                    </Label>
                    <Button variant="outline" size="sm" onClick={() => addSet(index)} className="gap-1">
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
                            onChange={(e) => updateSet(index, setIndex, "description", e.target.value)}
                            placeholder="Set description"
                            className="flex-1"
                          />
                          <Input
                            value={set.setsNumber}
                            onChange={(e) => updateSet(index, setIndex, "setsNumber", e.target.value)}
                            placeholder="Sets #"
                            className="w-24"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSet(index, setIndex)}
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
                      <input
                        ref={(el) => {
                          fileInputRefs.current[index] = el
                        }}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                        className="hidden"
                        onChange={(e) => handleFileUpload(index, e)}
                      />
                      <input
                        ref={(el) => {
                          imageInputRefs.current[index] = el
                        }}
                        type="file"
                        multiple
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => handleImageCapture(index, e)}
                      />
                      <Button variant="outline" size="sm" onClick={() => setShowLinkModal(index)} className="gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRefs.current[index]?.click()}
                        className="gap-1"
                      >
                        <Upload className="h-3 w-3" />
                        Upload
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => imageInputRefs.current[index]?.click()}
                        className="gap-1"
                      >
                        <Camera className="h-3 w-3" />
                        Photo
                      </Button>
                    </div>
                  </div>

                  {/* Link Modal */}
                  {showLinkModal === index && (
                    <div className="p-3 bg-muted rounded-lg space-y-2">
                      <Input
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                        placeholder="Document name (e.g., Procedure Guide.pdf)"
                      />
                      <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="Document URL" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAddLink(index)}>
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
                            onClick={() => removeAttachment(index, attIndex)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full gap-2" onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Create Workflow Template"}
        </Button>
      </main>

      <MobileNav />
    </div>
  )
}
