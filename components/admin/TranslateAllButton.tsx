'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { translateTextsAction } from '@/lib/actions/translate-client'
import { Button } from '@/components/ui/button'

export interface FieldPair {
  sourceId: string
  targetId: string
}

interface TranslateAllButtonProps {
  pairs: FieldPair[]
  className?: string
}

export function TranslateAllButton({ pairs, className }: TranslateAllButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslateAll = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    const validPairs: { sourceEl: HTMLInputElement | HTMLTextAreaElement, targetEl: HTMLInputElement | HTMLTextAreaElement, text: string }[] = []
    
    pairs.forEach(pair => {
      const sourceEl = document.getElementById(pair.sourceId) as HTMLInputElement | HTMLTextAreaElement
      const targetEl = document.getElementById(pair.targetId) as HTMLInputElement | HTMLTextAreaElement
      
      if (sourceEl && targetEl) {
        const text = sourceEl.value
        if (text && text.trim() !== '') {
          validPairs.push({ sourceEl, targetEl, text })
        }
      }
    })

    if (validPairs.length === 0) return

    setIsTranslating(true)
    try {
      const textsToTranslate = validPairs.map(p => p.text)
      const result = await translateTextsAction(textsToTranslate)
      
      if (result.texts && result.texts.length === textsToTranslate.length) {
        validPairs.forEach((pair, index) => {
          pair.targetEl.value = result.texts![index]
          pair.targetEl.dispatchEvent(new Event('change', { bubbles: true }))
        })
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
      variant="outline"
      onClick={handleTranslateAll}
      disabled={isTranslating}
      className={`flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/10 transition-colors ${className || ''}`}
    >
      {isTranslating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Tout traduire en anglais
    </Button>
  )
}
