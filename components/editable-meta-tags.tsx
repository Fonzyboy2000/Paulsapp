"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, X, Plus, Check, Tag } from "lucide-react"

interface EditableMetaTagsProps {
  operationId: string
  initialTags?: string[]
}

export function EditableMetaTags({ operationId, initialTags = [] }: EditableMetaTagsProps) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [isEditing, setIsEditing] = useState(false)
  const [newTag, setNewTag] = useState("")

  // Load persisted tags on mount
  useEffect(() => {
    const stored = localStorage.getItem(`operation-meta-tags-${operationId}`)
    if (stored) {
      setTags(JSON.parse(stored))
    }
  }, [operationId])

  // Persist tags to localStorage
  const saveTags = (updatedTags: string[]) => {
    setTags(updatedTags)
    localStorage.setItem(`operation-meta-tags-${operationId}`, JSON.stringify(updatedTags))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      saveTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    saveTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag className="h-4 w-4 text-muted-foreground" />

      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
          {tag}
          {isEditing && (
            <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}

      {tags.length === 0 && !isEditing && <span className="text-sm text-muted-foreground">No tags</span>}

      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tag..."
            className="h-7 w-28 text-sm"
          />
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleAddTag} disabled={!newTag.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-600" onClick={() => setIsEditing(false)}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
