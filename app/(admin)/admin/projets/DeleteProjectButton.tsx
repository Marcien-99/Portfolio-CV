'use client'

import { Trash2 } from "lucide-react"
import { deleteProject } from "@/lib/actions/projects"

export function DeleteProjectButton({ id }: { id: string }) {
  return (
    <form action={async () => {
      if (window.confirm("Voulez-vous vraiment supprimer ce projet ? L'action est irréversible.")) {
        await deleteProject(id)
      }
    }}>
      <button 
        type="submit" 
        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        title="Supprimer"
      >
        <Trash2 size={16} />
      </button>
    </form>
  )
}
