'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { translateTextAction } from '@/lib/actions/translate-client'
import { Button } from '@/components/ui/button'

interface TranslateFieldButtonProps {
  sourceId: string
  targetId: string
  className?: string
}

export function TranslateFieldButton({ sourceId, targetId, className }: TranslateFieldButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    const sourceEl = document.getElementById(sourceId) as HTMLInputElement | HTMLTextAreaElement
    const targetEl = document.getElementById(targetId) as HTMLInputElement | HTMLTextAreaElement
    
    if (!sourceEl || !targetEl) {
      console.error('Source or target element not found')
      return
    }

    const textToTranslate = sourceEl.value
    if (!textToTranslate || textToTranslate.trim() === '') return

    setIsTranslating(true)
    try {
      const result = await translateTextAction(textToTranslate)
      if (result.text) {
        targetEl.value = result.text
        // Dispatch an event so that any onChange handlers trigger
        targetEl.dispatchEvent(new Event('change', { bubbles: true }))
      } else if (result.error) {
        console.error(result.error)
      }
    } catch (error) {
      console.error('Translation failed', error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleTranslate}
      disabled={isTranslating}
      className={`h-6 w-6 p-0 text-primary/70 hover:text-primary hover:bg-primary/10 rounded-full transition-colors ${className || ''}`}
      title="Traduire ce champ depuis le français"
    >
      {isTranslating ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Sparkles className="h-3.5 w-3.5" />
      )}
    </Button>
  )
}
