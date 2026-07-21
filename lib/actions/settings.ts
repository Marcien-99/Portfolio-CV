'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('*')
  
  if (error) {
    if (error.code !== '42P01') { // 42P01 = undefined_table
      console.error('Error fetching settings:', error)
    }
    return {}
  }
  
  // Convert to object { key: value_fr }
  return data.reduce((acc: any, row: any) => {
    acc[row.key] = row.value_fr
    return acc
  }, {})
}

export async function updateSiteSettings(settings: Record<string, string>) {
  const supabase = await createClient()
  
  const updates = Object.entries(settings).map(([key, value]) => ({
    key,
    value_fr: value,
    en_auto_generated: true
  }))

  const { error } = await supabase.from('site_settings').upsert(updates)

  if (error) {
    console.error('Error updating settings:', error)
    return { error: 'Erreur lors de la mise à jour des paramètres' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
