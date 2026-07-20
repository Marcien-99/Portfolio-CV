'use client'

import { Trash2 } from "lucide-react"
import { deleteSkill } from "@/lib/actions/skills"

export function DeleteSkillButton({ id }: { id: string }) {
  return (
    <form action={async () => {
      if (window.confirm("Voulez-vous vraiment supprimer cette compétence ?")) {
        await deleteSkill(id)
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
