"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, PhoneCall, Calendar, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Doctor, doctors } from "@/lib/data"
import { addCallNote } from "@/lib/call-notes"

interface NewCallNoteFormProps {
  doctor: Doctor
}

export function NewCallNoteForm({ doctor }: NewCallNoteFormProps) {
  const router = useRouter()
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctor.id)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctor

  const handleSave = async () => {
    if (!notes.trim()) return

    setIsSaving(true)

    addCallNote({
      doctorId: selectedDoctorId,
      date: date,
      notes: notes.trim(),
      createdBy: "Current User", // In production, this would come from auth
    })

    await new Promise((resolve) => setTimeout(resolve, 300))

    router.push(`/doctors/${selectedDoctorId}`)
    router.refresh()
  }

  return (
    <>
      {/* Back Button */}
      <Link
        href={`/doctors/${doctor.id}/calls`}
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Call Notes
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-3/10">
            <PhoneCall className="h-6 w-6 text-chart-3" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Call Note</h1>
            <p className="text-muted-foreground">{selectedDoctor.name}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="surgeon" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Surgeon
          </Label>
          <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select a surgeon" />
            </SelectTrigger>
            <SelectContent>
              {doctors
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Field */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date
          </Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-card" />
        </div>

        {/* Notes Field */}
        <div className="space-y-2">
          <Label htmlFor="notes">Call Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What was discussed during the call? Include any follow-up items, product discussions, case planning, etc."
            rows={8}
            className="bg-card"
          />
          <p className="text-xs text-muted-foreground">
            Include details about products discussed, surgical cases, follow-up items, and any commitments made.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Link href={`/doctors/${doctor.id}/calls`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Cancel
            </Button>
          </Link>
          <Button className="flex-1" onClick={handleSave} disabled={!notes.trim() || isSaving}>
            {isSaving ? "Saving..." : "Save Call Note"}
          </Button>
        </div>
      </div>
    </>
  )
}
