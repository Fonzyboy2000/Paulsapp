"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import type { Hospital, Doctor } from "@/lib/data"
import { Building2, MapPin, Phone, Globe, Users, ChevronLeft, ExternalLink, Stethoscope } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface HospitalDetailClientProps {
  hospital: Hospital
  hospitalDoctors: Doctor[]
}

export function HospitalDetailClient({ hospital: initialHospital, hospitalDoctors }: HospitalDetailClientProps) {
  const [hospital, setHospital] = useState(initialHospital)

  const handleToggleSurgicalWorkflows = () => {
    setHospital((prev) => ({
      ...prev,
      hasSurgicalWorkflows: !prev.hasSurgicalWorkflows,
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-6">
        {/* Back Button */}
        <Link
          href="/hospitals"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Hospitals
        </Link>

        {/* Hospital Header */}
        <div className="mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{hospital.name}</h1>
              <p className="text-sm font-medium text-primary">{hospital.code}</p>
              <p className="text-sm text-muted-foreground">{hospital.healthAuthority}</p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Stethoscope
                  className={`h-5 w-5 ${hospital.hasSurgicalWorkflows ? "text-primary" : "text-muted-foreground"}`}
                />
                <div>
                  <Label htmlFor="surgical-workflows" className="font-semibold text-foreground cursor-pointer">
                    Surgical Workflows
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {hospital.hasSurgicalWorkflows
                      ? "This hospital performs surgeries and appears in Surgical Workflows"
                      : "This hospital does not perform surgeries"}
                  </p>
                </div>
              </div>
              <Switch
                id="surgical-workflows"
                checked={hospital.hasSurgicalWorkflows}
                onCheckedChange={handleToggleSurgicalWorkflows}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold text-foreground">Contact Information</h2>

            {hospital.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">{hospital.address}</p>
                  <p className="text-sm text-foreground">{hospital.city}</p>
                </div>
              </div>
            )}

            {hospital.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${hospital.phone}`} className="text-sm text-primary hover:underline">
                  {hospital.phone}
                </a>
              </div>
            )}

            {hospital.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={hospital.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Doctors at this Hospital */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Doctors ({hospitalDoctors.length})
            </h2>
          </div>

          {hospitalDoctors.length > 0 ? (
            <div className="space-y-3">
              {hospitalDoctors.map((doctor) => (
                <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
                  <Card className="hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={doctor.imageUrl || "/placeholder.svg"} alt={doctor.name} />
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground">{doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {doctor.operationIds.length} operation
                            {doctor.operationIds.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No doctors assigned to this hospital yet</p>
                <Button asChild variant="outline" className="mt-4 bg-transparent">
                  <Link href="/admin/doctors">Add Doctors</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
