'use client'

import { useState, useTransition, ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface ConfirmActionDialogProps {
  title: string
  description?: string
  action: () => Promise<void>
  trigger: ReactNode
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export function ConfirmActionDialog({
  title,
  description = "Êtes-vous sûr de vouloir continuer ?",
  action,
  trigger,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  danger = true,
}: ConfirmActionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleConfirm = () => {
    startTransition(async () => {
      await action()
      setIsOpen(false)
    })
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="inline-block">
        {trigger}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => !isPending && setIsOpen(false)}
          />
          <div className="bg-white dark:bg-[#1A1A1A] border border-border/10 shadow-2xl rounded-[2rem] w-full max-w-md p-8 relative z-50 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm font-sans mb-8 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl font-medium text-sm text-foreground hover:bg-secondary/50 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${
                  danger 
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 hover:shadow-red-500/40" 
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40"
                }`}
              >
                {isPending && <Loader2 size={16} className="animate-spin" />}
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
