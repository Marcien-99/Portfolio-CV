import { ReactNode } from "react"
import Link from "next/link"
import { AdminSidebar } from "./components/AdminSidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col md:flex-row font-sans">
      
      {/* Sidebar (Desktop & Mobile handled inside component) */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-[#121212]">
        {children}
      </main>

    </div>
  )
}
