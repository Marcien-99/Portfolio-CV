'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "../login/actions"
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
  Globe
} from "lucide-react"

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
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
      <div className="p-10 pb-6 hidden md:block">
        <Link href="/admin" className="font-heading font-bold text-3xl tracking-tighter text-[#111111] hover:opacity-80 transition-opacity">
          marcien-bn<span className="text-primary italic">.dev</span>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs text-[#111111]/50 font-mono uppercase tracking-[0.2em] font-medium">
            Back-office
          </span>
        </div>
      </div>

      <nav className="flex-1 px-6 py-6 md:py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <NavItem href="/admin" icon={<LayoutDashboard size={20} strokeWidth={1.5} />} label="Tableau de bord" exact />
        
        <div className="mt-10 mb-4 px-4 flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-black/5" />
          <p className="text-[10px] font-bold text-[#111111]/40 uppercase tracking-[0.2em]">
            Contenu
          </p>
          <div className="h-[1px] flex-1 bg-black/5" />
        </div>
        <NavItem href="/admin/competences" icon={<Code2 size={20} strokeWidth={1.5} />} label="Compétences" />
        <NavItem href="/admin/categories" icon={<Tags size={20} strokeWidth={1.5} />} label="Catégories" />
        <NavItem href="/admin/experiences" icon={<Briefcase size={20} strokeWidth={1.5} />} label="Expériences" />
        <NavItem href="/admin/formations" icon={<GraduationCap size={20} strokeWidth={1.5} />} label="Formations" />
        <NavItem href="/admin/projets" icon={<FolderKanban size={20} strokeWidth={1.5} />} label="Projets" />
        
        <div className="mt-10 mb-4 px-4 flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-black/5" />
          <p className="text-[10px] font-bold text-[#111111]/40 uppercase tracking-[0.2em]">
            Paramètres
          </p>
          <div className="h-[1px] flex-1 bg-black/5" />
        </div>
        <NavItem href="/admin/cv-profils" icon={<FileText size={20} strokeWidth={1.5} />} label="Profils CV" />
        <NavItem href="/admin/photo" icon={<ImageIcon size={20} strokeWidth={1.5} />} label="Photo de profil" />
        <NavItem href="/admin/reglages" icon={<Settings size={20} strokeWidth={1.5} />} label="Réglages" />
      </nav>

      <div className="p-6 border-t border-black/5 space-y-3">
        <Link 
          href="/"
          className="flex items-center justify-center gap-3 px-4 py-4 w-full text-sm font-medium rounded-[1.25rem] bg-[#111111] text-[#F5F5F7] hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
        >
          <Globe size={18} strokeWidth={1.5} className="group-hover:rotate-12 transition-transform" />
          Retour au site
        </Link>
        <form>
          <button 
            formAction={logout}
            className="flex items-center justify-center gap-3 px-4 py-4 w-full text-sm font-medium rounded-[1.25rem] text-[#111111]/60 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
          >
            <LogOut size={20} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
            Déconnexion
          </button>
        </form>
      </div>
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

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-full md:w-80 bg-[#F5F5F7] border-r border-black/5 flex-col flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {navContent}
      </aside>
    </>
  )
}
