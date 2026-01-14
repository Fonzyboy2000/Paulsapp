import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface QuickActionCardProps {
  href: string
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function QuickActionCard({ href, icon: Icon, title, description, className }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.98]",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
