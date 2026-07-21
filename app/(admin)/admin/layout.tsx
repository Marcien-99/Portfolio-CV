import { ReactNode } from "react"
import Link from "next/link"
import { logout } from "./login/actions"
import {
  LayoutDashboard,
  Code2,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Tags,
  UserCircle,
  Settings,
  LogOut,
  FileText,
  Image,
} from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-card/50 backdrop-blur-md border-b md:border-b-0 md:border-r border-border/10 flex flex-col flex-shrink-0">
        <div className="p-6">
          <Link href="/admin" className="font-heading font-bold text-xl tracking-tight text-foreground">
            marcien-bn<span className="text-primary">.dev</span>
          </Link>
          <div className="mt-1 text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Back-office
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Tableau de bord" exact />
          <div className="mt-8 mb-2 px-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contenu
            </p>
          </div>
          <NavItem href="/admin/competences" icon={<Code2 size={20} />} label="Compétences" />
          <NavItem href="/admin/categories" icon={<Tags size={20} />} label="Catégories" />
          <NavItem href="/admin/experiences" icon={<Briefcase size={20} />} label="Expériences" />
          <NavItem href="/admin/formations" icon={<GraduationCap size={20} />} label="Formations" />
          <NavItem href="/admin/projets" icon={<FolderKanban size={20} />} label="Projets" />
          
          <div className="hidden md:block pt-4 pb-2">
            <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Paramètres
            </p>
          </div>
          <NavItem href="/admin/cv-profils" icon={<FileText size={20} />} label="Profils CV" />
          <NavItem href="/admin/photo" icon={<Image size={20} />} label="Photo de profil" />
          <NavItem href="/admin/reglages" icon={<Settings size={20} />} label="Réglages" />
        </nav>

        <div className="p-4 border-t border-border/10 hidden md:block">
          <form>
            <button 
              formAction={logout}
              className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}

function NavItem({ href, icon, label, exact = false }: { href: string, icon: ReactNode, label: string, exact?: boolean }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors whitespace-nowrap"
    >
      {icon}
      {label}
    </Link>
  )
}
