"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Clock,
  Pencil,
  Check,
  X,
  Trash2,
  FileText,
  ImageIcon,
  File,
  Upload,
  LinkIcon,
  Plus,
  Package,
  Camera,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getProductById, type OperationStep, type StepAttachment, type StepSet } from "@/lib/data"
import Link from "next/link"

interface EditableWorkflowStepProps {
  step: OperationStep
  index: number
  totalSteps: number
  onUpdate: (updatedStep: OperationStep) => void
  onDelete?: () => void
}

export function EditableWorkflowStep({ step, index, totalSteps, onUpdate, onDelete }: EditableWorkflowStepProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedStep, setEditedStep] = useState<OperationStep>(step)
  const [newDocUrl, setNewDocUrl] = useState("")
  const [newDocName, setNewDocName] = useState("")
  const [showAddDoc, setShowAddDoc] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    onUpdate(editedStep)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedStep(step)
    setIsEditing(false)
    setShowAddDoc(false)
    setNewDocUrl("")
    setNewDocName("")
  }

  const handleAddSet = () => {
    const newSet: StepSet = {
      id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: "",
      setsNumber: "",
    }
    setEditedStep({
      ...editedStep,
      sets: [...(editedStep.sets || []), newSet],
    })
  }

  const handleUpdateSet = (setId: string, field: "description" | "setsNumber", value: string) => {
    const updatedSets = (editedStep.sets || []).map((s) => (s.id === setId ? { ...s, [field]: value } : s))
    setEditedStep({ ...editedStep, sets: updatedSets })
  }

  const handleRemoveSet = (setId: string) => {
    const updatedSets = (editedStep.sets || []).filter((s) => s.id !== setId)
    setEditedStep({ ...editedStep, sets: updatedSets })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments: StepAttachment[] = [...(editedStep.attachments || [])]

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

    setEditedStep({ ...editedStep, attachments: newAttachments })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments: StepAttachment[] = [...(editedStep.attachments || [])]

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: "image",
        url: url,
      })
    })

    setEditedStep({ ...editedStep, attachments: newAttachments })
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  const handleAddDocLink = () => {
    if (!newDocUrl || !newDocName) return

    const fileType = getFileType(newDocName)
    const newAttachments: StepAttachment[] = [
      ...(editedStep.attachments || []),
      {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newDocName,
        type: fileType,
        url: newDocUrl,
      },
    ]

    setEditedStep({ ...editedStep, attachments: newAttachments })
    setNewDocUrl("")
    setNewDocName("")
    setShowAddDoc(false)
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    const newAttachments = (editedStep.attachments || []).filter((a) => a.id !== attachmentId)
    setEditedStep({ ...editedStep, attachments: newAttachments })
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

  return (
    <div className="relative pl-8 pb-4 last:pb-0 group">
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-white text-black hover:bg-gray-200 z-10 shadow-lg"
              onClick={(e) => {
                e.stopPropagation()
                setPreviewImage(null)
              }}
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={previewImage.url || "/placeholder.svg"}
              alt={previewImage.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-center mt-2 text-sm">{previewImage.name}</p>
          </div>
        </div>
      )}

      {/* Timeline line */}
      {index < totalSteps - 1 && <div className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-border" />}

      {/* Step number */}
      <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {step.order}
      </div>

      <div className="relative">
        {/* Edit and Delete buttons */}
        {!isEditing && (
          <div className="absolute -right-2 -top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3 pr-2">
            {/* Title/Description */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Step Title</label>
              <Input
                value={editedStep.description}
                onChange={(e) => setEditedStep({ ...editedStep, description: e.target.value })}
                className="text-sm"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration</label>
              <Input
                value={editedStep.duration}
                onChange={(e) => setEditedStep({ ...editedStep, duration: e.target.value })}
                className="text-sm"
                placeholder="e.g., 15 min"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
              <Textarea
                value={editedStep.notes || ""}
                onChange={(e) => setEditedStep({ ...editedStep, notes: e.target.value })}
                className="text-sm min-h-[60px]"
                placeholder="Additional notes for this step..."
              />
            </div>

            {/* Doctor Preferences */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Doctor Preferences</label>
              <Textarea
                value={editedStep.doctorPreferences || ""}
                onChange={(e) => setEditedStep({ ...editedStep, doctorPreferences: e.target.value })}
                className="text-sm min-h-[60px]"
                placeholder="Specific doctor preferences for this step..."
              />
            </div>

            {/* Sets */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Sets</label>
              <div className="space-y-2">
                {(editedStep.sets || []).map((set) => (
                  <div key={set.id} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={set.description}
                        onChange={(e) => handleUpdateSet(set.id, "description", e.target.value)}
                        placeholder="Set description (e.g., Primary Instrument Tray)"
                        className="text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Sets #:</span>
                        <Input
                          type="text"
                          value={set.setsNumber}
                          onChange={(e) => handleUpdateSet(set.id, "setsNumber", e.target.value)}
                          placeholder="e.g., 1, 2, A1"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveSet(set.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={handleAddSet}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Set
                </Button>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Attachments</label>

              {/* Current attachments */}
              {editedStep.attachments && editedStep.attachments.length > 0 && (
                <div className="space-y-2 mb-2">
                  {editedStep.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm">
                      {getFileIcon(attachment.type)}
                      <span className="flex-1 truncate">{attachment.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload and Link buttons */}
              <div className="flex flex-wrap gap-2">
                {/* File upload - documents */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {/* Image upload - with camera capture on mobile */}
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageCapture}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  Upload File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Camera className="h-3.5 w-3.5 mr-1" />
                  Photo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                  onClick={() => setShowAddDoc(!showAddDoc)}
                >
                  <LinkIcon className="h-3.5 w-3.5 mr-1" />
                  Add Link
                </Button>
              </div>

              {/* Add document link form */}
              {showAddDoc && (
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
                    <Button size="sm" className="text-xs" onClick={handleAddDocLink}>
                      Add Document
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => {
                        setShowAddDoc(false)
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

            {/* Save/Cancel buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={handleSave}>
                <Check className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-medium text-card-foreground">{step.description}</p>

            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{step.duration}</span>
            </div>

            {step.notes && <p className="mt-1.5 text-xs text-muted-foreground italic">{step.notes}</p>}

            {/* Doctor Preferences display */}
            {step.doctorPreferences && (
              <div className="mt-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs font-medium text-primary mb-1">Doctor Preferences:</p>
                <p className="text-xs text-muted-foreground">{step.doctorPreferences}</p>
              </div>
            )}

            {/* Sets display */}
            {step.sets && step.sets.length > 0 && (
              <div className="mt-2 p-2 bg-secondary/50 rounded-lg border border-secondary">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Package className="h-3.5 w-3.5 text-secondary-foreground" />
                  <p className="text-xs font-medium text-secondary-foreground">Sets:</p>
                </div>
                <div className="space-y-1">
                  {step.sets.map((set) => (
                    <div key={set.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{set.description}</span>
                      <Badge variant="secondary" className="text-xs">
                        Sets # {set.setsNumber}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {step.products.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {step.products.map((productId) => {
                  const product = getProductById(productId)
                  return product ? (
                    <Link key={productId} href={`/products/${productId}`}>
                      <Badge variant="outline" className="text-xs hover:bg-secondary cursor-pointer">
                        {product.name}
                      </Badge>
                    </Link>
                  ) : null
                })}
              </div>
            )}

            {/* Attachments display */}
            {step.attachments && step.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Attachments:</p>
                <div className="flex flex-wrap gap-1.5">
                  {step.attachments.map((attachment) =>
                    attachment.type === "image" ? (
                      <button
                        key={attachment.id}
                        onClick={() => setPreviewImage({ url: attachment.url, name: attachment.name })}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                        {getFileIcon(attachment.type)}
                        <span className="max-w-[120px] truncate">{attachment.name}</span>
                      </button>
                    ) : (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80 transition-colors"
                      >
                        {getFileIcon(attachment.type)}
                        <span className="max-w-[120px] truncate">{attachment.name}</span>
                      </a>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
