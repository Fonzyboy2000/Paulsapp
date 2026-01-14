import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Building2, Users, Activity, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const adminSections = [
    {
      title: "Manage Hospitals",
      description: "Add, edit, or remove hospitals",
      icon: Building2,
      href: "/admin/hospitals",
      count: 5,
    },
    {
      title: "Manage Doctors",
      description: "Add doctors and assign to hospitals",
      icon: Users,
      href: "/admin/doctors",
      count: 10,
    },
    {
      title: "Manage Operations",
      description: "Configure surgical procedures",
      icon: Activity,
      href: "/admin/operations",
      count: 7,
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Admin Panel" />

      <main className="px-4 py-4">
        <div className="mb-6 rounded-xl bg-primary/10 p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Administrator Access</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Manage hospitals, doctors, and surgical procedures</p>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Management</h2>
          <div className="flex flex-col gap-3">
            {adminSections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {section.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
