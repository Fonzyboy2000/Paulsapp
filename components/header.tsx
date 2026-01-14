"use client"

import Link from "next/link"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DepuySynthesLogo } from "@/components/depuy-synthes-logo"

interface HeaderProps {
  title?: string
  showBack?: boolean
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center gap-2">
          <DepuySynthesLogo className="h-8" />
          {title && <span className="font-semibold text-foreground text-sm">{title}</span>}
        </Link>

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
