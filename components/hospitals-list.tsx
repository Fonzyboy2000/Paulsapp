"use client"

import { useState, useMemo } from "react"
import { hospitals, doctors } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, Phone, Users, Search } from "lucide-react"
import Link from "next/link"

export function HospitalsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedHealthAuthority, setSelectedHealthAuthority] = useState<string>("all")

  // Get unique cities and health authorities
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(hospitals.map((h) => h.city))]
    return uniqueCities.sort()
  }, [])

  const healthAuthorities = useMemo(() => {
    const uniqueAuthorities = [...new Set(hospitals.map((h) => h.healthAuthority))]
    return uniqueAuthorities.sort()
  }, [])

  // Filter hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const matchesSearch =
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.code.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCity = selectedCity === "all" || hospital.city === selectedCity
      const matchesHealthAuthority =
        selectedHealthAuthority === "all" || hospital.healthAuthority === selectedHealthAuthority

      return matchesSearch && matchesCity && matchesHealthAuthority
    })
  }, [searchQuery, selectedCity, selectedHealthAuthority])

  // Count doctors per hospital
  const getDoctorCount = (hospitalId: string) => {
    return doctors.filter((d) => d.hospitalIds.includes(hospitalId)).length
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select value={selectedHealthAuthority} onValueChange={setSelectedHealthAuthority}>
            <SelectTrigger>
              <SelectValue placeholder="Health Authority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authorities</SelectItem>
              {healthAuthorities.map((authority) => (
                <SelectItem key={authority} value={authority}>
                  {authority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? "s" : ""} found
      </p>

      {/* Hospital Cards */}
      <div className="space-y-3">
        {filteredHospitals.map((hospital) => {
          const doctorCount = getDoctorCount(hospital.id)

          return (
            <Link key={hospital.id} href={`/hospitals/${hospital.id}`}>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{hospital.name}</h3>
                      <p className="text-xs text-primary font-medium">{hospital.code}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{hospital.city}</span>
                        </div>
                        {hospital.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{hospital.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                          <Users className="h-3 w-3" />
                          {doctorCount} doctor{doctorCount !== 1 ? "s" : ""}
                        </span>
                        <span className="text-xs text-muted-foreground">{hospital.healthAuthority}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="py-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No hospitals found</p>
        </div>
      )}
    </div>
  )
}
