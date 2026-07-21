'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*')
    .order('position')
    
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data
}

export async function createCategory(data: { name_fr: string; name_en: string; position: number }) {
  const supabase = await createClient()
  const { error } = await supabase.from('skill_categories').insert([data])
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateCategory(id: string, data: { name_fr: string; name_en: string; position: number }) {
  const supabase = await createClient()
  const { error } = await supabase.from('skill_categories').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('skill_categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}
