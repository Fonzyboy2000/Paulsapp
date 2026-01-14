"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { hospitals as initialHospitals, type Hospital } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Building2, Trash2, Edit2, X, Check, Users, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newHospital, setNewHospital] = useState({ name: "", city: "", hasSurgicalWorkflows: false })
  const [editHospital, setEditHospital] = useState({ name: "", city: "", hasSurgicalWorkflows: false })

  const handleAdd = () => {
    if (!newHospital.name.trim() || !newHospital.city.trim()) return

    const newId = `h${Date.now()}`
    setHospitals([
      ...hospitals,
      {
        id: newId,
        name: newHospital.name.trim(),
        city: newHospital.city.trim(),
        code: "",
        address: "",
        phone: "",
        website: "",
        healthAuthority: "",
        hasSurgicalWorkflows: newHospital.hasSurgicalWorkflows,
        doctors: [],
      },
    ])
    setNewHospital({ name: "", city: "", hasSurgicalWorkflows: false })
    setIsAdding(false)
  }

  const handleEdit = (hospital: Hospital) => {
    setEditingId(hospital.id)
    setEditHospital({
      name: hospital.name,
      city: hospital.city,
      hasSurgicalWorkflows: hospital.hasSurgicalWorkflows,
    })
  }

  const handleSaveEdit = (id: string) => {
    if (!editHospital.name.trim() || !editHospital.city.trim()) return

    setHospitals(
      hospitals.map((h) =>
        h.id === id
          ? {
              ...h,
              name: editHospital.name.trim(),
              city: editHospital.city.trim(),
              hasSurgicalWorkflows: editHospital.hasSurgicalWorkflows,
            }
          : h,
      ),
    )
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setHospitals(hospitals.filter((h) => h.id !== id))
  }

  const handleToggleSurgicalWorkflows = (id: string) => {
    setHospitals(hospitals.map((h) => (h.id === id ? { ...h, hasSurgicalWorkflows: !h.hasSurgicalWorkflows } : h)))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Manage Hospitals" />

      <main className="px-4 py-4">
        {/* Back Button */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to admin
        </Link>

        {/* Add Hospital Button */}
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="w-full mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Hospital
          </Button>
        )}

        {/* Add Hospital Form */}
        {isAdding && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Add New Hospital</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Hospital name"
                value={newHospital.name}
                onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
              />
              <Input
                placeholder="City"
                value={newHospital.city}
                onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-surgical"
                  checked={newHospital.hasSurgicalWorkflows}
                  onCheckedChange={(checked) =>
                    setNewHospital({ ...newHospital, hasSurgicalWorkflows: checked === true })
                  }
                />
                <label
                  htmlFor="new-surgical"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Surgical Workflows (Hospital performs surgeries)
                </label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1">
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hospital List */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Hospitals ({hospitals.length})
          </h2>
          <div className="flex flex-col gap-3">
            {hospitals.map((hospital) => (
              <Card key={hospital.id}>
                <CardContent className="pt-4">
                  {editingId === hospital.id ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Hospital name"
                        value={editHospital.name}
                        onChange={(e) => setEditHospital({ ...editHospital, name: e.target.value })}
                      />
                      <Input
                        placeholder="City"
                        value={editHospital.city}
                        onChange={(e) => setEditHospital({ ...editHospital, city: e.target.value })}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-surgical-${hospital.id}`}
                          checked={editHospital.hasSurgicalWorkflows}
                          onCheckedChange={(checked) =>
                            setEditHospital({ ...editHospital, hasSurgicalWorkflows: checked === true })
                          }
                        />
                        <label htmlFor={`edit-surgical-${hospital.id}`} className="text-sm font-medium leading-none">
                          Surgical Workflows
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSaveEdit(hospital.id)} size="sm" className="flex-1">
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
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-card-foreground truncate">{hospital.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{hospital.city}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {hospital.doctors.length} doctors
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className="flex items-center gap-1.5 cursor-pointer"
                          onClick={() => handleToggleSurgicalWorkflows(hospital.id)}
                        >
                          <Checkbox
                            checked={hospital.hasSurgicalWorkflows}
                            onCheckedChange={() => handleToggleSurgicalWorkflows(hospital.id)}
                          />
                          <Stethoscope
                            className={`h-4 w-4 ${hospital.hasSurgicalWorkflows ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(hospital)} className="h-8 w-8">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(hospital.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
