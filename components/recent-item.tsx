import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface RecentItemProps {
  href: string
  title: string
  subtitle: string
  meta?: string
}

export function RecentItem({ href, title, subtitle, meta }: RecentItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:bg-accent/50 active:scale-[0.99]"
    >
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-medium text-card-foreground">{title}</h4>
        <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  )
}
