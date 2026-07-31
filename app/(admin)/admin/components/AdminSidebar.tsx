'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout, logoutAndReturn } from "../login/actions"
import { NavItem } from "./NavItem"
import {
  LayoutDashboard,
  Code2,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Tags,
  Settings,
  LogOut,
  FileText,
  Image as ImageIcon,
  Menu,
  X,
  Globe,
  PanelLeftClose,
  PanelLeft
} from "lucide-react"

interface NavActionProps {
  icon: React.ReactNode
  label: string
  isCollapsed?: boolean
  formAction: string | ((formData: FormData) => void | Promise<void>)
  danger?: boolean
}

const NavAction = ({ icon, label, isCollapsed, formAction, danger }: NavActionProps) => (
  <button 
    formAction={formAction}
    title={isCollapsed ? label : undefined}
    className={`flex items-center gap-4 py-3.5 rounded-[1.25rem] text-sm font-medium transition-all duration-300 group ${
      isCollapsed ? "px-0 justify-center w-12 mx-auto" : "px-4 w-full text-left"
    } ${
      danger 
        ? "text-[#111111]/60 hover:text-red-500 hover:bg-red-500/10" 
        : "text-[#111111]/60 hover:text-primary hover:bg-primary/10"
    }`}
  >
    <div className={`transition-transform duration-300 flex-shrink-0 ${danger ? "group-hover:-translate-x-1" : "group-hover:rotate-12"}`}>
      {icon}
    </div>
    {!isCollapsed && <span className="mt-[1px] truncate">{label}</span>}
  </button>
)

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  // Fermer le menu sur mobile lors de la navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Empêcher le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navContent = (
    <div className="flex flex-col h-full">
      <div className={`p-6 pb-4 hidden md:flex ${isCollapsed ? 'flex-col items-center gap-6 px-2 pt-8' : 'items-center justify-between'}`}>
        {!isCollapsed ? (
          <div>
            <Link href="/admin" className="font-heading font-bold text-2xl tracking-tighter text-[#111111] hover:opacity-80 transition-opacity whitespace-nowrap">
              marcien-bn<span className="text-primary italic">.dev</span>
            </Link>
            <div className="mt-1 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-[10px] text-[#111111]/50 font-mono uppercase tracking-[0.2em] font-medium">
                Back-office
              </span>
            </div>
          </div>
        ) : (
          <Link href="/admin" className="font-heading font-bold text-xl tracking-tighter text-primary italic hover:opacity-80 transition-opacity" title="marcien-bn.dev">
            .dev
          </Link>
        )}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-[#111111]/40 hover:text-[#111111] hover:bg-black/5 rounded-xl transition-all flex-shrink-0"
          title={isCollapsed ? "Développer" : "Réduire"}
        >
          {isCollapsed ? <PanelLeft size={20} strokeWidth={1.5} /> : <PanelLeftClose size={20} strokeWidth={1.5} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <NavItem href="/admin" icon={<LayoutDashboard size={20} strokeWidth={1.5} />} label="Tableau de bord" exact isCollapsed={isCollapsed} />
        
        <div className={`mt-8 mb-4 px-2 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {!isCollapsed && <div className="h-[1px] flex-1 bg-black/5" />}
          {!isCollapsed ? (
            <p className="text-[10px] font-bold text-[#111111]/40 uppercase tracking-[0.2em]">Contenu</p>
          ) : (
            <div className="w-4 h-[1px] bg-black/10" />
          )}
          {!isCollapsed && <div className="h-[1px] flex-1 bg-black/5" />}
        </div>
        <NavItem href="/admin/competences" icon={<Code2 size={20} strokeWidth={1.5} />} label="Compétences" isCollapsed={isCollapsed} />
        <NavItem href="/admin/categories" icon={<Tags size={20} strokeWidth={1.5} />} label="Catégories" isCollapsed={isCollapsed} />
        <NavItem href="/admin/experiences" icon={<Briefcase size={20} strokeWidth={1.5} />} label="Expériences" isCollapsed={isCollapsed} />
        <NavItem href="/admin/formations" icon={<GraduationCap size={20} strokeWidth={1.5} />} label="Formations" isCollapsed={isCollapsed} />
        <NavItem href="/admin/projets" icon={<FolderKanban size={20} strokeWidth={1.5} />} label="Projets" isCollapsed={isCollapsed} />
        
        <div className={`mt-8 mb-4 px-2 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {!isCollapsed && <div className="h-[1px] flex-1 bg-black/5" />}
          {!isCollapsed ? (
            <p className="text-[10px] font-bold text-[#111111]/40 uppercase tracking-[0.2em]">Paramètres</p>
          ) : (
            <div className="w-4 h-[1px] bg-black/10" />
          )}
          {!isCollapsed && <div className="h-[1px] flex-1 bg-black/5" />}
        </div>
        <NavItem href="/admin/cv-profils" icon={<FileText size={20} strokeWidth={1.5} />} label="Profils CV" isCollapsed={isCollapsed} />
        <NavItem href="/admin/photo" icon={<ImageIcon size={20} strokeWidth={1.5} />} label="Photo de profil" isCollapsed={isCollapsed} />
        <NavItem href="/admin/reglages" icon={<Settings size={20} strokeWidth={1.5} />} label="Réglages" isCollapsed={isCollapsed} />
        
        <div className={`mt-8 mb-4 px-2 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {!isCollapsed && <div className="h-[1px] flex-1 bg-black/5" />}
          {!isCollapsed ? (
            <p className="text-[10px] font-bold text-[#111111]/40 uppercase tracking-[0.2em]">Actions</p>
          ) : (
            <div className="w-4 h-[1px] bg-black/10" />
          )}
          {!isCollapsed && <div className="h-[1px] flex-1 bg-black/5" />}
        </div>
        
        <form className="space-y-1.5">
          <NavAction formAction={logoutAndReturn} icon={<Globe size={20} strokeWidth={1.5} />} label="Retour au site" isCollapsed={isCollapsed} />
          <NavAction formAction={logout} icon={<LogOut size={20} strokeWidth={1.5} />} label="Déconnexion" isCollapsed={isCollapsed} danger />
        </form>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-5 sm:p-6 bg-[#F5F5F7]/90 backdrop-blur-xl border-b border-black/5 sticky top-0 z-30">
        <Link href="/admin" className="font-heading font-bold text-2xl tracking-tighter text-[#111111]">
          marcien-bn<span className="text-primary italic">.dev</span>
        </Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-3 bg-[#111111]/5 rounded-full text-[#111111] hover:bg-[#111111]/10 transition-colors"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile Full Screen Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#F5F5F7] flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between p-6 border-b border-black/5">
            <Link href="/admin" className="font-heading font-bold text-2xl tracking-tighter text-[#111111]">
              marcien-bn<span className="text-primary italic">.dev</span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 bg-[#111111]/5 rounded-full text-[#111111] hover:bg-[#111111]/10 transition-colors"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pb-8">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Sticky + Collapsible) */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out bg-[#F5F5F7] border-r border-black/5 sticky top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {navContent}
      </aside>
    </>
  )
}
