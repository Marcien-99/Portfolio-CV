'use client'

import { Trash2 } from "lucide-react"
import { deleteEducation } from "@/lib/actions/educations"

export function DeleteEducationButton({ id }: { id: string }) {
  return (
    <form action={async () => {
      if (window.confirm("Voulez-vous vraiment supprimer cette formation ?")) {
        await deleteEducation(id)
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
