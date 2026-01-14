"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DepuySynthesLogo } from "@/components/depuy-synthes-logo"

export function Header() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.forward()}>
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Go forward</span>
          </Button>
          <Link href="/" className="flex items-center gap-2 ml-1">
            <DepuySynthesLogo className="h-8" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
