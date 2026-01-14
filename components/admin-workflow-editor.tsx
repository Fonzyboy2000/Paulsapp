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
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Clock,
  Edit,
  Check,
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
import type { Operation, OperationStep, StepAttachment, StepSet } from "@/lib/data"

interface Props {
  workflow: Operation
}

export function AdminWorkflowEditor({ workflow }: Props) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isEditingBasic, setIsEditingBasic] = useState(false)
  const [name, setName] = useState(workflow.name)
  const [category, setCategory] = useState(workflow.category)
  const [description, setDescription] = useState(workflow.description)
  const [estimatedDuration, setEstimatedDuration] = useState(workflow.estimatedDuration)
  const [steps, setSteps] = useState<OperationStep[]>(workflow.steps)
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null)

  // For attachment handling
  const [showAddDoc, setShowAddDoc] = useState<number | null>(null)
  const [newDocUrl, setNewDocUrl] = useState("")
  const [newDocName, setNewDocName] = useState("")
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})
  const imageInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const addStep = () => {
    const newStep: OperationStep = {
      order: steps.length + 1,
      description: "New step",
      products: [],
      duration: "10 min",
      notes: "",
      doctorPreferences: "",
      attachments: [],
      sets: [],
    }
    setSteps((prev) => [...prev, newStep])
    setEditingStepIndex(steps.length)
  }

  const removeStep = (index: number) => {
    setSteps((prev) => {
      const newSteps = prev.filter((_, i) => i !== index)
      return newSteps.map((step, i) => ({ ...step, order: i + 1 }))
    })
  }

  const updateStep = (index: number, updates: Partial<OperationStep>) => {
    setSteps((prev) => prev.map((step, i) => (i === index ? { ...step, ...updates } : step)))
  }

  // Sets handling
  const addSet = (stepIndex: number) => {
    const newSet: StepSet = {
      id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: "",
      setsNumber: "",
    }
    const currentSets = steps[stepIndex].sets || []
    updateStep(stepIndex, { sets: [...currentSets, newSet] })
  }

  const updateSet = (stepIndex: number, setId: string, field: "description" | "setsNumber", value: string) => {
    const currentSets = steps[stepIndex].sets || []
    const updatedSets = currentSets.map((s) => (s.id === setId ? { ...s, [field]: value } : s))
    updateStep(stepIndex, { sets: updatedSets })
  }

  const removeSet = (stepIndex: number, setId: string) => {
    const currentSets = steps[stepIndex].sets || []
    updateStep(stepIndex, { sets: currentSets.filter((s) => s.id !== setId) })
  }

  // Attachments handling
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

    const currentAttachments = steps[stepIndex].attachments || []
    const newAttachments: StepAttachment[] = [...currentAttachments]

    Array.from(files).forEach((file) => {
      const fileType = getFileType(file.name)
      const url = URL.createObjectURL(file)
      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: fileType,
        url: url,
      })
    })

    updateStep(stepIndex, { attachments: newAttachments })
    if (fileInputRefs.current[stepIndex]) {
      fileInputRefs.current[stepIndex]!.value = ""
    }
  }

  const handleImageCapture = (stepIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const currentAttachments = steps[stepIndex].attachments || []
    const newAttachments: StepAttachment[] = [...currentAttachments]

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: "image",
        url: url,
      })
    })

    updateStep(stepIndex, { attachments: newAttachments })
    if (imageInputRefs.current[stepIndex]) {
      imageInputRefs.current[stepIndex]!.value = ""
    }
  }

  const handleAddDocLink = (stepIndex: number) => {
    if (!newDocUrl || !newDocName) return

    const currentAttachments = steps[stepIndex].attachments || []
    const fileType = getFileType(newDocName)
    const newAttachments: StepAttachment[] = [
      ...currentAttachments,
      {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newDocName,
        type: fileType,
        url: newDocUrl,
      },
    ]

    updateStep(stepIndex, { attachments: newAttachments })
    setNewDocUrl("")
    setNewDocName("")
    setShowAddDoc(null)
  }

  const removeAttachment = (stepIndex: number, attachmentId: string) => {
    const currentAttachments = steps[stepIndex].attachments || []
    updateStep(stepIndex, { attachments: currentAttachments.filter((a) => a.id !== attachmentId) })
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    router.push("/admin/workflows")
  }

  const categoryColors: Record<string, string> = {
    joint: "bg-blue-100 text-blue-700",
    trauma: "bg-orange-100 text-orange-700",
    spine: "bg-purple-100 text-purple-700",
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Basic Information</CardTitle>
            {!isEditingBasic ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingBasic(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setIsEditingBasic(false)}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isEditingBasic ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joint">Joint Replacement</SelectItem>
                      <SelectItem value="trauma">Trauma</SelectItem>
                      <SelectItem value="spine">Spine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Estimated Duration</Label>
                  <Input
                    id="duration"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold">{name}</h3>
                  <Badge className={`mt-1 capitalize ${categoryColors[category]}`}>{category}</Badge>
                </div>
                <p className="text-muted-foreground">{description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{estimatedDuration}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps */}
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Workflow Steps ({steps.length})</CardTitle>
            <Button variant="outline" size="sm" onClick={addStep}>
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="rounded-lg border border-border p-4">
                {editingStepIndex === index ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Step {step.order}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingStepIndex(null)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
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
                    </div>

                    {/* Step Description */}
                    <div>
                      <Label>Step Title</Label>
                      <Input
                        value={step.description}
                        onChange={(e) => updateStep(index, { description: e.target.value })}
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <Label>Duration</Label>
                      <Select
                        value={step.duration || "10 min"}
                        onValueChange={(value) => updateStep(index, { duration: value })}
                      >
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

                    {/* Notes */}
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={step.notes || ""}
                        onChange={(e) => updateStep(index, { notes: e.target.value })}
                        placeholder="Standard notes for this step..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Default Doctor Preferences</Label>
                      <Textarea
                        value={step.doctorPreferences || ""}
                        onChange={(e) => updateStep(index, { doctorPreferences: e.target.value })}
                        placeholder="Default preferences that can be customized per doctor..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Sets</Label>
                      <div className="space-y-2">
                        {(step.sets || []).map((set) => (
                          <div key={set.id} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={set.description}
                                onChange={(e) => updateSet(index, set.id, "description", e.target.value)}
                                placeholder="Set description (e.g., Primary Instrument Tray)"
                                className="text-sm"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">Sets #:</span>
                                <Input
                                  type="text"
                                  value={set.setsNumber}
                                  onChange={(e) => updateSet(index, set.id, "setsNumber", e.target.value)}
                                  placeholder="e.g., 1, 2, A1"
                                  className="text-sm"
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeSet(index, set.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => addSet(index)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Set
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Attachments</Label>

                      {/* Current attachments */}
                      {step.attachments && step.attachments.length > 0 && (
                        <div className="space-y-2 mb-2">
                          {step.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm"
                            >
                              {getFileIcon(attachment.type)}
                              <span className="flex-1 truncate">{attachment.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => removeAttachment(index, attachment.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload and Link buttons */}
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => fileInputRefs.current[index]?.click()}
                        >
                          <Upload className="h-3.5 w-3.5 mr-1" />
                          Upload File
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => imageInputRefs.current[index]?.click()}
                        >
                          <Camera className="h-3.5 w-3.5 mr-1" />
                          Photo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => setShowAddDoc(showAddDoc === index ? null : index)}
                        >
                          <LinkIcon className="h-3.5 w-3.5 mr-1" />
                          Add Link
                        </Button>
                      </div>

                      {/* Add document link form */}
                      {showAddDoc === index && (
                        <div className="mt-2 p-3 bg-muted rounded-lg space-y-2">
                          <Input
                            value={newDocName}
                            onChange={(e) => setNewDocName(e.target.value)}
                            placeholder="Document name (e.g., Procedure Guide.pdf)"
                            className="text-sm"
                          />
                          <Input
                            value={newDocUrl}
                            onChange={(e) => setNewDocUrl(e.target.value)}
                            placeholder="Document URL"
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" className="text-xs" onClick={() => handleAddDocLink(index)}>
                              Add Document
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs"
                              onClick={() => {
                                setShowAddDoc(null)
                                setNewDocUrl("")
                                setNewDocName("")
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer hover:bg-secondary/30 -m-4 p-4 rounded-lg transition-colors"
                    onClick={() => setEditingStepIndex(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {step.order}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{step.description}</p>
                          {step.duration && <p className="text-sm text-muted-foreground">{step.duration}</p>}

                          {step.doctorPreferences && (
                            <p className="text-xs text-primary mt-1">Preferences: {step.doctorPreferences}</p>
                          )}

                          {step.sets && step.sets.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Package className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{step.sets.length} set(s)</span>
                            </div>
                          )}

                          {step.attachments && step.attachments.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {step.attachments.length} attachment(s)
                            </span>
                          )}
                        </div>
                      </div>
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full gap-2" onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </main>

      <MobileNav />
    </div>
  )
}
