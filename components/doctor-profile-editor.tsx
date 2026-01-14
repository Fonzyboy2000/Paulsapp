"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Stethoscope,
  ClipboardList,
  Building2,
  Pencil,
  Check,
  X,
  Plus,
  Trash2,
  Camera,
  PhoneCall,
  PlayCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Doctor, Hospital, Operation } from "@/lib/data"
import { getRecentCallNotes, getCallNotesForDoctor, loadPersistedCallNotes } from "@/lib/call-notes"

interface DoctorProfileEditorProps {
  doctor: Doctor
  doctorHospitals: (Hospital | undefined)[]
  doctorOperations: (Operation | undefined)[]
  allHospitals: Hospital[]
  allOperations: Operation[]
}

export function DoctorProfileEditor({
  doctor: initialDoctor,
  doctorHospitals: initialHospitals,
  doctorOperations: initialOperations,
  allHospitals,
  allOperations,
}: DoctorProfileEditorProps) {
  const [doctor, setDoctor] = useState(initialDoctor)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState<string>("")
  const [tempPreferences, setTempPreferences] = useState<string[]>([])
  const [tempHospitalIds, setTempHospitalIds] = useState<string[]>([])
  const [tempOperations, setTempOperations] = useState<string[]>([])
  const [newPreference, setNewPreference] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [callNotesRefresh, setCallNotesRefresh] = useState(0)

  useEffect(() => {
    loadPersistedCallNotes()
    setCallNotesRefresh((prev) => prev + 1)
  }, [])

  const doctorHospitals = doctor.hospitalIds.map((hId) => allHospitals.find((h) => h.id === hId)).filter(Boolean)
  const doctorOperations = doctor.operations.map((oId) => allOperations.find((o) => o.id === oId)).filter(Boolean)
  const callNotes = getRecentCallNotes(doctor.id, 3)
  const totalCallNotes = getCallNotesForDoctor(doctor.id).length

  const startEdit = (field: string, value: string | string[]) => {
    setEditingField(field)
    if (Array.isArray(value)) {
      if (field === "preferences") {
        setTempPreferences([...value])
      } else if (field === "hospitalIds") {
        setTempHospitalIds([...value])
      } else if (field === "operations") {
        setTempOperations([...value])
      }
    } else {
      setTempValue(value)
    }
  }

  const cancelEdit = () => {
    setEditingField(null)
    setTempValue("")
    setTempPreferences([])
    setTempHospitalIds([])
    setTempOperations([])
    setNewPreference("")
  }

  const saveEdit = (field: string) => {
    if (field === "preferences") {
      setDoctor({ ...doctor, preferences: tempPreferences })
    } else if (field === "hospitalIds") {
      setDoctor({ ...doctor, hospitalIds: tempHospitalIds })
    } else if (field === "operations") {
      setDoctor({ ...doctor, operations: tempOperations })
    } else {
      setDoctor({ ...doctor, [field]: tempValue })
    }
    cancelEdit()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDoctor({ ...doctor, imageUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const addPreference = () => {
    if (newPreference.trim()) {
      setTempPreferences([...tempPreferences, newPreference.trim()])
      setNewPreference("")
    }
  }

  const removePreference = (index: number) => {
    setTempPreferences(tempPreferences.filter((_, i) => i !== index))
  }

  const EditableField = ({
    field,
    value,
    icon: Icon,
    label,
    iconBgClass = "bg-primary/10",
    iconClass = "text-primary",
    isLink = false,
    linkPrefix = "",
  }: {
    field: string
    value: string
    icon: React.ElementType
    label: string
    iconBgClass?: string
    iconClass?: string
    isLink?: boolean
    linkPrefix?: string
  }) => (
    <div className="flex items-center gap-4 p-4 group">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgClass}`}>
        <Icon className={`h-5 w-5 ${iconClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {editingField === field ? (
          <div className="flex items-center gap-2 mt-1">
            <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="h-8" autoFocus />
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => saveEdit(field)}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={cancelEdit}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {isLink ? (
              <a href={`${linkPrefix}${value}`} className="truncate font-medium text-card-foreground hover:underline">
                {value}
              </a>
            ) : (
              <p className="truncate font-medium text-card-foreground">{value}</p>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={() => startEdit(field, value)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <main className="px-4 py-4">
      {/* Back Button */}
      <Link
        href="/doctors"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Doctors
      </Link>

      {/* Doctor Header Card */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
          {/* Photo - Editable */}
          <div className="relative group">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-primary/20">
              {doctor.imageUrl ? (
                <Image src={doctor.imageUrl || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Stethoscope className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          {/* Name and Specialty */}
          <div className="flex-1">
            {editingField === "name" ? (
              <div className="flex items-center gap-2 mb-1">
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="text-2xl font-bold h-10"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={() => saveEdit("name")}>
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit}>
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group justify-center sm:justify-start">
                <h1 className="text-2xl font-bold text-card-foreground">{doctor.name}</h1>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => startEdit("name", doctor.name)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}

            {editingField === "specialty" ? (
              <div className="flex items-center gap-2 mb-1">
                <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="h-8" autoFocus />
                <Button size="icon" variant="ghost" onClick={() => saveEdit("specialty")}>
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit}>
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group justify-center sm:justify-start">
                <p className="text-primary font-medium">{doctor.specialty}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => startEdit("specialty", doctor.specialty)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}

            <p className="mt-1 text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Last visit:{" "}
              {new Date(doctor.lastVisit).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Contact Information
        </h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          <EditableField field="email" value={doctor.email} icon={Mail} label="Email" isLink linkPrefix="mailto:" />
          <EditableField
            field="phone"
            value={doctor.phone}
            icon={Phone}
            label="Phone"
            iconBgClass="bg-chart-3/10"
            iconClass="text-chart-3"
            isLink
            linkPrefix="tel:"
          />
          <EditableField
            field="address"
            value={doctor.address}
            icon={MapPin}
            label="Address"
            iconBgClass="bg-accent/50"
            iconClass="text-muted-foreground"
          />
        </div>
      </section>

      {/* Hospitals - Editable */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Hospitals</h2>
          {editingField !== "hospitalIds" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => startEdit("hospitalIds", doctor.hospitalIds)}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingField === "hospitalIds" ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {allHospitals.map((hospital) => (
                <label
                  key={hospital.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer"
                >
                  <Checkbox
                    checked={tempHospitalIds.includes(hospital.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTempHospitalIds([...tempHospitalIds, hospital.id])
                      } else {
                        setTempHospitalIds(tempHospitalIds.filter((id) => id !== hospital.id))
                      }
                    }}
                  />
                  <div>
                    <p className="font-medium text-sm">{hospital.name}</p>
                    <p className="text-xs text-muted-foreground">{hospital.city}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => saveEdit("hospitalIds")}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {doctorHospitals.length > 0 ? (
              doctorHospitals.map((hospital) => (
                <div key={hospital!.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{hospital!.name}</p>
                    <p className="text-sm text-muted-foreground">{hospital!.city}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No hospitals assigned</p>
            )}
          </div>
        )}
      </section>

      {/* Preferences - Editable */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Preferences</h2>
          {editingField !== "preferences" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => startEdit("preferences", doctor.preferences)}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingField === "preferences" ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="space-y-2 mb-4">
              {tempPreferences.map((pref, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-accent/30">
                  <span className="flex-1 text-sm">{pref}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removePreference(idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                placeholder="Add new preference..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && addPreference()}
              />
              <Button variant="outline" size="icon" onClick={addPreference}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => saveEdit("preferences")}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-4">
            {doctor.preferences.length > 0 ? (
              <ul className="space-y-2">
                {doctor.preferences.map((pref, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-card-foreground">{pref}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No preferences recorded</p>
            )}
          </div>
        )}
      </section>

      {/* Notes - Editable */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Notes</h2>
          {editingField !== "notes" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => startEdit("notes", doctor.notes || "")}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingField === "notes" ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <Textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder="Add notes about this doctor..."
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => saveEdit("notes")}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-4">
            {doctor.notes ? (
              <p className="text-card-foreground leading-relaxed">{doctor.notes}</p>
            ) : (
              <p className="text-muted-foreground">No notes recorded</p>
            )}
          </div>
        )}
      </section>

      {/* Call Notes */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Call Notes</h2>
          <Link href={`/doctors/${doctor.id}/calls`} className="text-xs text-primary hover:underline">
            View all ({totalCallNotes})
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {callNotes.length > 0 ? (
            callNotes.map((note) => (
              <div key={note.id} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-3/10">
                    <PhoneCall className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">
                      {new Date(note.date).toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {note.createdBy && <p className="text-xs text-muted-foreground">by {note.createdBy}</p>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-10">{note.notes}</p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center">
              <PhoneCall className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No call notes recorded</p>
              <Link
                href={`/doctors/${doctor.id}/calls/new`}
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                Add first call note
              </Link>
            </div>
          )}
        </div>

        {callNotes.length > 0 && (
          <div className="mt-3 flex justify-center">
            <Link href={`/doctors/${doctor.id}/calls/new`}>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Add Call Note
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Operations - Editable */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Operations Performed</h2>
          {editingField !== "operations" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => startEdit("operations", doctor.operations)}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingField === "operations" ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {allOperations.map((operation) => (
                <label
                  key={operation.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer"
                >
                  <Checkbox
                    checked={tempOperations.includes(operation.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTempOperations([...tempOperations, operation.id])
                      } else {
                        setTempOperations(tempOperations.filter((id) => id !== operation.id))
                      }
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{operation.name}</p>
                    <p className="text-xs text-muted-foreground">{operation.category}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => saveEdit("operations")}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {doctorOperations.length > 0 ? (
              doctorOperations.map((operation) => {
                const surgicalHospital = doctorHospitals.find((h) => h?.hasSurgicalWorkflows)
                const workflowLink = surgicalHospital
                  ? `/workflows/hospital/${surgicalHospital.id}/doctor/${doctor.id}/operation/${operation!.id}`
                  : null

                return (
                  <div
                    key={operation!.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                      <ClipboardList className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground">{operation!.name}</p>
                      <p className="text-sm text-muted-foreground">{operation!.estimatedDuration}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          operation!.category === "joint"
                            ? "bg-primary/10 text-primary"
                            : operation!.category === "trauma"
                              ? "bg-chart-3/10 text-chart-3"
                              : "bg-accent text-muted-foreground"
                        }`}
                      >
                        {operation!.category}
                      </span>
                      {workflowLink && (
                        <Link href={workflowLink}>
                          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs bg-transparent">
                            <PlayCircle className="h-3 w-3" />
                            Workflow
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-muted-foreground text-sm">No operations assigned</p>
            )}
            {doctorOperations.length > 0 && doctorHospitals.some((h) => h?.hasSurgicalWorkflows) && (
              <div className="mt-3 flex justify-center">
                <Link
                  href={`/workflows/hospital/${doctorHospitals.find((h) => h?.hasSurgicalWorkflows)?.id}/doctor/${doctor.id}`}
                >
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    Add Procedure Workflow
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
