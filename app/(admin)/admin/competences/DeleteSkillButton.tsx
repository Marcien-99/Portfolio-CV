'use client'

import { Trash2 } from "lucide-react"
import { deleteSkill } from "@/lib/actions/skills"
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"

export function DeleteSkillButton({ id }: { id: string }) {
  return (
    <ConfirmActionDialog
      title="Supprimer cette compétence"
      description="Voulez-vous vraiment supprimer cette compétence ? L'action est irréversible."
      action={async () => {
        await deleteSkill(id)
      }}
      trigger={
        <button 
          type="button" 
          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      }
    />
  )
}
