'use client'

import { Trash2 } from "lucide-react"
import { deleteEducation } from "@/lib/actions/educations"
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"

export function DeleteEducationButton({ id }: { id: string }) {
  return (
    <ConfirmActionDialog
      title="Supprimer cette formation"
      description="Voulez-vous vraiment supprimer cette formation ? L'action est irréversible."
      action={async () => {
        await deleteEducation(id)
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
