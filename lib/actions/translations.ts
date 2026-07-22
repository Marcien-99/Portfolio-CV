'use server'

import { createAdminClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Marque un élément comme traduit (relu) manuellement
 * Force en_auto_generated = false
 */
export async function reviewTranslation(table: string, id: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from(table)
    .update({ en_auto_generated: false })
    .eq('id', id)

  if (error) {
    console.error(`Erreur reviewTranslation (${table}/${id}):`, error)
    return { error: 'Erreur lors de la validation de la traduction' }
  }

  // Revalider les pages correspondantes
  revalidatePath('/admin/projets')
  revalidatePath('/admin/experiences')
  revalidatePath('/admin/competences')
  revalidatePath('/admin/formations')
  
  return { success: true }
}
