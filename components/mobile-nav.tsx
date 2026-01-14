"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ClipboardList, Package, Building2, Users, Settings } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/workflows", label: "Workflows", icon: ClipboardList },
  { href: "/products", label: "Products", icon: Package },
  { href: "/hospitals", label: "Hospitals", icon: Building2 },
  { href: "/doctors", label: "Doctors", icon: Users },
  { href: "/admin", label: "Admin", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-bottom">
      <div className="flex items-center justify-between px-2 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className={cn("font-medium", isActive && "font-semibold")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
