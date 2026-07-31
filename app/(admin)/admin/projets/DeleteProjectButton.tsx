'use client'

import { Trash2 } from "lucide-react"
import { deleteProject } from "@/lib/actions/projects"
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"

export function DeleteProjectButton({ id }: { id: string }) {
  return (
    <ConfirmActionDialog
      title="Supprimer ce projet"
      description="Voulez-vous vraiment supprimer ce projet ? L'action est irréversible."
      action={async () => {
        const res = await deleteProject(id)
        if (res?.error) {
          alert(res.error)
        }
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
