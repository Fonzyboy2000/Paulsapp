"use client"

import { useState, useMemo } from "react"
import { doctors, hospitals } from "@/lib/data"
import { Search, Filter, MapPin, Building2, Stethoscope, ChevronDown, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function DoctorsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedHospital, setSelectedHospital] = useState<string>("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")

  // Get unique regions (cities)
  const regions = useMemo(() => {
    const cities = [...new Set(hospitals.map((h) => h.city))]
    return cities.sort()
  }, [])

  // Get unique specialties
  const specialties = useMemo(() => {
    const specs = [...new Set(doctors.map((d) => d.specialty))]
    return specs.sort()
  }, [])

  // Filter hospitals by selected region
  const filteredHospitals = useMemo(() => {
    if (!selectedRegion) return hospitals
    return hospitals.filter((h) => h.city === selectedRegion)
  }, [selectedRegion])

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query) ||
          doctor.email.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Region filter
      if (selectedRegion) {
        const doctorHospitals = hospitals.filter((h) => doctor.hospitalIds.includes(h.id))
        const matchesRegion = doctorHospitals.some((h) => h.city === selectedRegion)
        if (!matchesRegion) return false
      }

      // Hospital filter
      if (selectedHospital) {
        if (!doctor.hospitalIds.includes(selectedHospital)) return false
      }

      // Specialty filter
      if (selectedSpecialty) {
        if (doctor.specialty !== selectedSpecialty) return false
      }

      return true
    })
  }, [searchQuery, selectedRegion, selectedHospital, selectedSpecialty])

  const activeFiltersCount = [selectedRegion, selectedHospital, selectedSpecialty].filter(Boolean).length

  const clearFilters = () => {
    setSelectedRegion("")
    setSelectedHospital("")
    setSelectedSpecialty("")
  }

  const getHospitalName = (hospitalId: string) => {
    return hospitals.find((h) => h.id === hospitalId)?.name || "Unknown"
  }

  const getDoctorHospitals = (doctor: (typeof doctors)[0]) => {
    if (doctor.hospitalIds.length === 0) return ["No hospital assigned"]
    return doctor.hospitalIds.map((id) => getHospitalName(id))
  }

  return (
    <>
      {/* Page Header */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">All Surgeons</h1>
        <p className="text-muted-foreground">
          {filteredDoctors.length} of {doctors.length} surgeons
        </p>
      </section>

      {/* Search and Filter */}
      <section className="mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="mb-4 rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto py-1 text-xs">
                Clear all
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {/* Region Filter */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Region
              </label>
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value)
                    setSelectedHospital("") // Reset hospital when region changes
                  }}
                  className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Hospital Filter */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                Hospital
              </label>
              <div className="relative">
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Hospitals</option>
                  {filteredHospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Specialty Filter */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Stethoscope className="h-3.5 w-3.5" />
                Specialty
              </label>
              <div className="relative">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && !showFilters && (
        <section className="mb-4 flex flex-wrap gap-2">
          {selectedRegion && (
            <Badge variant="secondary" className="gap-1 pl-2">
              <MapPin className="h-3 w-3" />
              {selectedRegion}
              <button
                onClick={() => {
                  setSelectedRegion("")
                  setSelectedHospital("")
                }}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedHospital && (
            <Badge variant="secondary" className="gap-1 pl-2">
              <Building2 className="h-3 w-3" />
              {getHospitalName(selectedHospital).split(" ")[0]}
              <button onClick={() => setSelectedHospital("")} className="ml-1 rounded-full hover:bg-muted">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedSpecialty && (
            <Badge variant="secondary" className="gap-1 pl-2">
              <Stethoscope className="h-3 w-3" />
              {selectedSpecialty}
              <button onClick={() => setSelectedSpecialty("")} className="ml-1 rounded-full hover:bg-muted">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </section>
      )}

      {/* Doctors List */}
      <section className="flex flex-col gap-3">
        {filteredDoctors.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Stethoscope className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-1 font-medium text-foreground">No surgeons found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <Link
              key={doctor.id}
              href={`/doctors/${doctor.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50 active:bg-accent"
            >
              <Avatar className="h-14 w-14 border-2 border-border">
                <AvatarImage src={doctor.imageUrl || "/placeholder.svg"} alt={doctor.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3 shrink-0" />
                  <span className="truncate">{getDoctorHospitals(doctor)[0]}</span>
                  {doctor.hospitalIds.length > 1 && (
                    <span className="shrink-0 ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      +{doctor.hospitalIds.length - 1} more
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 text-xs">
                {doctor.operations.length} ops
              </Badge>
            </Link>
          ))
        )}
      </section>
    </>
  )
}
