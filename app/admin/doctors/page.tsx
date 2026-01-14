"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import {
  hospitals as initialHospitals,
  doctors as initialDoctors,
  operations,
  type Doctor,
  type Hospital,
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Plus,
  User,
  Trash2,
  Edit2,
  X,
  Check,
  Building2,
  Activity,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Camera,
  ImageIcon,
} from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors)
  const [hospitals] = useState<Hospital[]>(initialHospitals)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const newImageInputRef = useRef<HTMLInputElement>(null)
  const editImageInputRef = useRef<HTMLInputElement>(null)

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    address: "",
    imageUrl: "",
    hospitalIds: [] as string[],
    operations: [] as string[],
    preferences: [] as string[],
    notes: "",
  })

  const [editDoctor, setEditDoctor] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    address: "",
    imageUrl: "",
    hospitalIds: [] as string[],
    operations: [] as string[],
    preferences: [] as string[],
    notes: "",
  })

  const [newPreference, setNewPreference] = useState("")
  const [editPreference, setEditPreference] = useState("")

  const specialties = [
    "Joint Replacement",
    "Trauma Surgery",
    "Spine Surgery",
    "General Orthopedics",
    "Orthopedic Surgery",
  ]

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setNewDoctor({ ...newDoctor, imageUrl: url })
    }
  }

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setEditDoctor({ ...editDoctor, imageUrl: url })
    }
  }

  const handleAdd = () => {
    if (!newDoctor.name.trim() || !newDoctor.specialty || newDoctor.hospitalIds.length === 0) return

    const newId = `d${Date.now()}`
    const today = new Date().toISOString().split("T")[0]

    setDoctors([
      ...doctors,
      {
        id: newId,
        name: newDoctor.name.trim(),
        specialty: newDoctor.specialty,
        email: newDoctor.email.trim(),
        phone: newDoctor.phone.trim(),
        address: newDoctor.address.trim(),
        imageUrl: newDoctor.imageUrl || "/professional-doctor.png",
        hospitalIds: newDoctor.hospitalIds,
        operations: newDoctor.operations,
        preferences: newDoctor.preferences,
        notes: newDoctor.notes,
        lastVisit: today,
      },
    ])

    setNewDoctor({
      name: "",
      specialty: "",
      email: "",
      phone: "",
      address: "",
      imageUrl: "",
      hospitalIds: [],
      operations: [],
      preferences: [],
      notes: "",
    })
    setIsAdding(false)
  }

  const handleEdit = (doctor: Doctor) => {
    setEditingId(doctor.id)
    setEditDoctor({
      name: doctor.name,
      specialty: doctor.specialty,
      email: doctor.email,
      phone: doctor.phone,
      address: doctor.address,
      imageUrl: doctor.imageUrl,
      hospitalIds: doctor.hospitalIds,
      operations: doctor.operations,
      preferences: doctor.preferences,
      notes: doctor.notes,
    })
  }

  const handleSaveEdit = (id: string) => {
    if (!editDoctor.name.trim() || !editDoctor.specialty || editDoctor.hospitalIds.length === 0) return

    setDoctors(
      doctors.map((d) =>
        d.id === id
          ? {
              ...d,
              name: editDoctor.name.trim(),
              specialty: editDoctor.specialty,
              email: editDoctor.email.trim(),
              phone: editDoctor.phone.trim(),
              address: editDoctor.address.trim(),
              imageUrl: editDoctor.imageUrl,
              hospitalIds: editDoctor.hospitalIds,
              operations: editDoctor.operations,
              preferences: editDoctor.preferences,
              notes: editDoctor.notes,
            }
          : d,
      ),
    )
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setDoctors(doctors.filter((d) => d.id !== id))
  }

  const toggleHospital = (hospitalId: string, isEdit: boolean) => {
    if (isEdit) {
      setEditDoctor((prev) => ({
        ...prev,
        hospitalIds: prev.hospitalIds.includes(hospitalId)
          ? prev.hospitalIds.filter((id) => id !== hospitalId)
          : [...prev.hospitalIds, hospitalId],
      }))
    } else {
      setNewDoctor((prev) => ({
        ...prev,
        hospitalIds: prev.hospitalIds.includes(hospitalId)
          ? prev.hospitalIds.filter((id) => id !== hospitalId)
          : [...prev.hospitalIds, hospitalId],
      }))
    }
  }

  const toggleOperation = (operationId: string, isEdit: boolean) => {
    if (isEdit) {
      setEditDoctor((prev) => ({
        ...prev,
        operations: prev.operations.includes(operationId)
          ? prev.operations.filter((id) => id !== operationId)
          : [...prev.operations, operationId],
      }))
    } else {
      setNewDoctor((prev) => ({
        ...prev,
        operations: prev.operations.includes(operationId)
          ? prev.operations.filter((id) => id !== operationId)
          : [...prev.operations, operationId],
      }))
    }
  }

  const addPreference = (isEdit: boolean) => {
    if (isEdit && editPreference.trim()) {
      setEditDoctor((prev) => ({
        ...prev,
        preferences: [...prev.preferences, editPreference.trim()],
      }))
      setEditPreference("")
    } else if (!isEdit && newPreference.trim()) {
      setNewDoctor((prev) => ({
        ...prev,
        preferences: [...prev.preferences, newPreference.trim()],
      }))
      setNewPreference("")
    }
  }

  const removePreference = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditDoctor((prev) => ({
        ...prev,
        preferences: prev.preferences.filter((_, i) => i !== index),
      }))
    } else {
      setNewDoctor((prev) => ({
        ...prev,
        preferences: prev.preferences.filter((_, i) => i !== index),
      }))
    }
  }

  const getHospitalNames = (hospitalIds: string[]) => {
    return hospitalIds
      .map((id) => hospitals.find((h) => h.id === id)?.name)
      .filter(Boolean)
      .join(", ")
  }

  const getOperationCount = (operationIds: string[]) => {
    return operationIds.length
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Manage Doctors" />

      <main className="px-4 py-4">
        {/* Back Button */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to admin
        </Link>

        {/* Add Doctor Button */}
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="w-full mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        )}

        {/* Add Doctor Form */}
        {isAdding && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Add New Doctor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative h-24 w-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors"
                  onClick={() => newImageInputRef.current?.click()}
                >
                  {newDoctor.imageUrl ? (
                    <img
                      src={newDoctor.imageUrl || "/placeholder.svg"}
                      alt="Doctor preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <input
                  ref={newImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleNewImageUpload}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => newImageInputRef.current?.click()}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>

              <Input
                placeholder="Doctor name (e.g., Dr. John Smith)"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
              />

              <Select
                value={newDoctor.specialty}
                onValueChange={(value) => setNewDoctor({ ...newDoctor, specialty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Contact Information</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Email address"
                    type="email"
                    className="pl-10"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Phone number"
                    type="tel"
                    className="pl-10"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    placeholder="Office address"
                    className="pl-10 min-h-[60px]"
                    value={newDoctor.address}
                    onChange={(e) => setNewDoctor({ ...newDoctor, address: e.target.value })}
                  />
                </div>
              </div>

              {/* Hospital Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Assign to Hospitals</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                  {hospitals.map((hospital) => (
                    <div key={hospital.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`new-hospital-${hospital.id}`}
                        checked={newDoctor.hospitalIds.includes(hospital.id)}
                        onCheckedChange={() => toggleHospital(hospital.id, false)}
                      />
                      <label htmlFor={`new-hospital-${hospital.id}`} className="text-sm cursor-pointer flex-1">
                        {hospital.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operation Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Assigned Operations</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                  {operations.map((operation) => (
                    <div key={operation.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`new-operation-${operation.id}`}
                        checked={newDoctor.operations.includes(operation.id)}
                        onCheckedChange={() => toggleOperation(operation.id, false)}
                      />
                      <label htmlFor={`new-operation-${operation.id}`} className="text-sm cursor-pointer flex-1">
                        {operation.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Preferences</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a preference..."
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPreference(false))}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => addPreference(false)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {newDoctor.preferences.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newDoctor.preferences.map((pref, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                      >
                        {pref}
                        <button onClick={() => removePreference(index, false)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <Textarea
                placeholder="Additional notes..."
                value={newDoctor.notes}
                onChange={(e) => setNewDoctor({ ...newDoctor, notes: e.target.value })}
              />

              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1">
                  <Check className="h-4 w-4 mr-1" />
                  Save Doctor
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Doctor List */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Doctors ({doctors.length})
          </h2>
          <div className="flex flex-col gap-3">
            {doctors.map((doctor) => (
              <Card key={doctor.id}>
                <CardContent className="pt-4">
                  {editingId === doctor.id ? (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="relative h-24 w-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors"
                          onClick={() => editImageInputRef.current?.click()}
                        >
                          {editDoctor.imageUrl ? (
                            <img
                              src={editDoctor.imageUrl || "/placeholder.svg"}
                              alt="Doctor preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <input
                          ref={editImageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleEditImageUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editImageInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                      </div>

                      <Input
                        placeholder="Doctor name"
                        value={editDoctor.name}
                        onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                      />

                      <Select
                        value={editDoctor.specialty}
                        onValueChange={(value) => setEditDoctor({ ...editDoctor, specialty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Contact Information</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Email address"
                            type="email"
                            className="pl-10"
                            value={editDoctor.email}
                            onChange={(e) => setEditDoctor({ ...editDoctor, email: e.target.value })}
                          />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Phone number"
                            type="tel"
                            className="pl-10"
                            value={editDoctor.phone}
                            onChange={(e) => setEditDoctor({ ...editDoctor, phone: e.target.value })}
                          />
                        </div>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            placeholder="Office address"
                            className="pl-10 min-h-[60px]"
                            value={editDoctor.address}
                            onChange={(e) => setEditDoctor({ ...editDoctor, address: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Hospital Selection */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Assign to Hospitals</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                          {hospitals.map((hospital) => (
                            <div key={hospital.id} className="flex items-center gap-2">
                              <Checkbox
                                id={`edit-hospital-${hospital.id}`}
                                checked={editDoctor.hospitalIds.includes(hospital.id)}
                                onCheckedChange={() => toggleHospital(hospital.id, true)}
                              />
                              <label htmlFor={`edit-hospital-${hospital.id}`} className="text-sm cursor-pointer flex-1">
                                {hospital.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Operation Selection */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Assigned Operations</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                          {operations.map((operation) => (
                            <div key={operation.id} className="flex items-center gap-2">
                              <Checkbox
                                id={`edit-operation-${operation.id}`}
                                checked={editDoctor.operations.includes(operation.id)}
                                onCheckedChange={() => toggleOperation(operation.id, true)}
                              />
                              <label
                                htmlFor={`edit-operation-${operation.id}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {operation.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preferences */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Preferences</label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add a preference..."
                            value={editPreference}
                            onChange={(e) => setEditPreference(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPreference(true))}
                          />
                          <Button type="button" variant="outline" size="icon" onClick={() => addPreference(true)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {editDoctor.preferences.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {editDoctor.preferences.map((pref, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                              >
                                {pref}
                                <button onClick={() => removePreference(index, true)}>
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      <Textarea
                        placeholder="Additional notes..."
                        value={editDoctor.notes}
                        onChange={(e) => setEditDoctor({ ...editDoctor, notes: e.target.value })}
                      />

                      <div className="flex gap-2">
                        <Button onClick={() => handleSaveEdit(doctor.id)} size="sm" className="flex-1">
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingId(null)} size="sm" className="flex-1">
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                          {doctor.imageUrl ? (
                            <img
                              src={doctor.imageUrl || "/placeholder.svg"}
                              alt={doctor.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-card-foreground truncate">{doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpandedId(expandedId === doctor.id ? null : doctor.id)}
                            className="h-8 w-8"
                          >
                            {expandedId === doctor.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(doctor)} className="h-8 w-8">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(doctor.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Summary badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                          <Building2 className="h-3 w-3" />
                          {doctor.hospitalIds.length} hospital(s)
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                          <Activity className="h-3 w-3" />
                          {getOperationCount(doctor.operations)} operation(s)
                        </span>
                      </div>

                      {/* Expanded details */}
                      {expandedId === doctor.id && (
                        <div className="mt-4 pt-4 border-t border-border space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase text-muted-foreground">Contact</h4>
                            {doctor.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${doctor.email}`} className="text-primary hover:underline">
                                  {doctor.email}
                                </a>
                              </div>
                            )}
                            {doctor.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${doctor.phone}`} className="text-primary hover:underline">
                                  {doctor.phone}
                                </a>
                              </div>
                            )}
                            {doctor.address && (
                              <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{doctor.address}</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Hospitals</h4>
                            <p className="text-sm text-foreground">{getHospitalNames(doctor.hospitalIds)}</p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Operations</h4>
                            <div className="flex flex-wrap gap-1">
                              {doctor.operations.map((opId) => {
                                const op = operations.find((o) => o.id === opId)
                                return op ? (
                                  <span
                                    key={opId}
                                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                                  >
                                    {op.name}
                                  </span>
                                ) : null
                              })}
                            </div>
                          </div>

                          {doctor.preferences.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                                Preferences
                              </h4>
                              <ul className="text-sm text-foreground space-y-1">
                                {doctor.preferences.map((pref, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    {pref}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {doctor.notes && (
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Notes</h4>
                              <p className="text-sm text-muted-foreground">{doctor.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
