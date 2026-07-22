'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const educationSchema = z.object({
  title_fr: z.string().min(1, "Le titre (FR) est requis"),
  title_en: z.string().min(1, "Le titre (EN) est requis"),
  institution: z.string().min(1, "L'établissement est requis"),
  location: z.string().optional(),
  start_date: z.string().min(1, "Date de début requise"),
  end_date: z.string().optional().or(z.literal('')),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  en_auto_generated: z.boolean().default(true),
  status: z.enum(['draft', 'published']).default('draft'),
})

export async function createEducation(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    title_fr: formData.get('title_fr'),
    title_en: formData.get('title_en'),
    institution: formData.get('institution'),
    location: formData.get('location'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    description_fr: formData.get('description_fr'),
    description_en: formData.get('description_en'),
    en_auto_generated: formData.get('en_auto_generated') === 'on' || formData.get('en_auto_generated') === 'true',
    status: formData.get('status'),
  }

  const result = educationSchema.safeParse(rawData)
  
  if (!result.success) {
    return { error: 'Données invalides', details: result.error.flatten().fieldErrors }
  }

  const { end_date, ...eduData } = result.data

  // Traduction automatique DeepL
  if (eduData.en_auto_generated) {
    const { translateTexts } = await import('@/lib/translate')
    const translations = await translateTexts([
      eduData.title_fr,
      eduData.description_fr
    ])
    if (translations[0]) eduData.title_en = translations[0]
    if (translations[1]) eduData.description_en = translations[1]
  }

  const { error: eduError } = await supabase
    .from('educations')
    .insert([{
      ...eduData,
      end_date: end_date === '' ? null : end_date
    }])

  if (eduError) {
    console.error('Erreur création formation:', eduError)
    return { error: 'Erreur lors de la création' }
  }

  revalidatePath('/a-propos')
  revalidatePath('/admin/formations')
  
  return { success: true }
}

export async function updateEducation(id: string, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    title_fr: formData.get('title_fr'),
    title_en: formData.get('title_en'),
    institution: formData.get('institution'),
    location: formData.get('location'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    description_fr: formData.get('description_fr'),
    description_en: formData.get('description_en'),
    en_auto_generated: formData.get('en_auto_generated') === 'on' || formData.get('en_auto_generated') === 'true',
    status: formData.get('status'),
  }

  const result = educationSchema.safeParse(rawData)
  
  if (!result.success) {
    return { error: 'Données invalides', details: result.error.flatten().fieldErrors }
  }

  const { end_date, ...eduData } = result.data

  // Traduction automatique DeepL
  if (eduData.en_auto_generated) {
    const { translateTexts } = await import('@/lib/translate')
    const translations = await translateTexts([
      eduData.title_fr,
      eduData.description_fr
    ])
    if (translations[0]) eduData.title_en = translations[0]
    if (translations[1]) eduData.description_en = translations[1]
  }

  const { error: eduError } = await supabase
    .from('educations')
    .update({
      ...eduData,
      end_date: end_date === '' ? null : end_date,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (eduError) {
    console.error('Erreur mise à jour formation:', eduError)
    return { error: 'Erreur lors de la mise à jour' }
  }

  revalidatePath('/a-propos')
  revalidatePath('/admin/formations')
  
  return { success: true }
}

export async function deleteEducation(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('educations')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression formation:', error)
    return { error: 'Erreur lors de la suppression' }
  }

  revalidatePath('/a-propos')
  revalidatePath('/admin/formations')
  return { success: true }
}

export async function toggleEducationStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'published' ? 'draft' : 'published'
  
  const { error } = await supabase
    .from('educations')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Erreur bascule statut:', error)
    return { error: 'Erreur lors de la modification' }
  }

  revalidatePath('/a-propos')
  revalidatePath('/admin/formations')
  return { success: true, newStatus }
}
