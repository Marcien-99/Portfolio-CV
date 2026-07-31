'use client'

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItemProps {
  href: string
  icon: ReactNode
  label: string
  exact?: boolean
  isCollapsed?: boolean
}

export function NavItem({ href, icon, label, exact = false, isCollapsed = false }: NavItemProps) {
  const pathname = usePathname()
  
  const isActive = exact 
    ? pathname === href 
    : pathname.startsWith(href) && (pathname === href || pathname[href.length] === '/')

  return (
    <Link 
      href={href}
      title={isCollapsed ? label : undefined}
      className={`flex items-center gap-4 py-3.5 rounded-[1.25rem] text-sm font-medium transition-all duration-300 group ${
        isCollapsed ? "px-0 justify-center w-12 mx-auto" : "px-4 whitespace-nowrap"
      } ${
        isActive 
          ? "bg-[#111111] text-white shadow-xl shadow-black/10 scale-[1.02]" 
          : "text-[#111111]/60 hover:text-[#111111] hover:bg-black/5"
      }`}
    >
      <div className={`${isActive ? "text-primary" : "text-[#111111]/40 group-hover:text-primary group-hover:scale-110"} transition-transform duration-300 flex-shrink-0`}>
        {icon}
      </div>
      {!isCollapsed && <span className="mt-[1px] truncate">{label}</span>}
      {isActive && !isCollapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
      )}
    </Link>
  )
}
