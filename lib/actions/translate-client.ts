'use server'

import { translateText, translateTexts } from '../translate'

/**
 * Traduit un texte depuis le français vers l'anglais.
 * Utilisable depuis un composant client.
 */
export async function translateTextAction(text: string): Promise<{ text?: string, error?: string }> {
  try {
    if (!text || text.trim() === '') return { text: '' }
    const translated = await translateText(text)
    return { text: translated }
  } catch (error) {
    console.error("Erreur translateTextAction:", error)
    return { error: "Erreur lors de la traduction" }
  }
}

/**
 * Traduit plusieurs textes depuis le français vers l'anglais.
 * Utilisable depuis un composant client.
 */
export async function translateTextsAction(texts: string[]): Promise<{ texts?: string[], error?: string }> {
  try {
    if (!texts || texts.length === 0) return { texts: [] }
    const translated = await translateTexts(texts)
    return { texts: translated }
  } catch (error) {
    console.error("Erreur translateTextsAction:", error)
    return { error: "Erreur lors de la traduction" }
  }
}
