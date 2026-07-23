'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const experienceSchema = z.object({
  title_fr: z.string().min(1, "Le titre (FR) est requis"),
  title_en: z.string().optional().or(z.literal('')),
  company: z.string().min(1, "L'entreprise est requise"),
  location: z.string().optional(),
  start_date: z.string().min(1, "Date de début requise"),
  end_date: z.string().optional().or(z.literal('')),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  en_auto_generated: z.boolean().default(true),
  status: z.enum(['draft', 'published']).default('draft'),
  domains: z.array(z.enum(['surete_fonctionnement', 'electronique', 'automatisme', 'informatique_ia'])).default([]),
})

export async function createExperience(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    title_fr: formData.get('title_fr'),
    title_en: formData.get('title_en'),
    company: formData.get('company'),
    location: formData.get('location'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    description_fr: formData.get('description_fr'),
    description_en: formData.get('description_en'),
    en_auto_generated: formData.get('en_auto_generated') === 'on' || formData.get('en_auto_generated') === 'true',
    status: formData.get('status'),
    domains: formData.getAll('domains'),
  }

  const result = experienceSchema.safeParse(rawData)
  
  if (!result.success) {
    return { error: 'Données invalides', details: result.error.flatten().fieldErrors }
  }

  const { domains, end_date, ...expData } = result.data

  let usedDeepL = false
  const textsToTranslate: string[] = []
  
  if (expData.title_fr && !expData.title_en) textsToTranslate.push(expData.title_fr)
  if (expData.description_fr && !expData.description_en) textsToTranslate.push(expData.description_fr)
  
  if (textsToTranslate.length > 0) {
    const { translateTexts } = await import('@/lib/translate')
    const translations = await translateTexts(textsToTranslate)
    
    let i = 0
    if (expData.title_fr && !expData.title_en) expData.title_en = translations[i++] || ''
    if (expData.description_fr && !expData.description_en) expData.description_en = translations[i++] || ''
    usedDeepL = true
  }
  
  expData.en_auto_generated = usedDeepL

  const { data: newExp, error: expError } = await supabase
    .from('experiences')
    .insert([{
      ...expData,
      end_date: end_date === '' ? null : end_date
    }])
    .select('id')
    .single()

  if (expError) {
    console.error('Erreur création expérience:', expError)
    return { error: 'Erreur lors de la création' }
  }

  if (domains.length > 0 && newExp) {
    const domainInserts = domains.map(domain => ({
      experience_id: newExp.id,
      domain
    }))
    await supabase.from('experience_domains').insert(domainInserts)
  }

  revalidatePath('/experiences')
  revalidatePath('/admin/experiences')
  
  return { success: true }
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    title_fr: formData.get('title_fr'),
    title_en: formData.get('title_en'),
    company: formData.get('company'),
    location: formData.get('location'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    description_fr: formData.get('description_fr'),
    description_en: formData.get('description_en'),
    en_auto_generated: formData.get('en_auto_generated') === 'on' || formData.get('en_auto_generated') === 'true',
    status: formData.get('status'),
    domains: formData.getAll('domains'),
  }

  const result = experienceSchema.safeParse(rawData)
  
  if (!result.success) {
    return { error: 'Données invalides', details: result.error.flatten().fieldErrors }
  }

  const { domains, end_date, ...expData } = result.data

  let usedDeepL = false
  const textsToTranslate: string[] = []
  
  if (expData.title_fr && !expData.title_en) textsToTranslate.push(expData.title_fr)
  if (expData.description_fr && !expData.description_en) textsToTranslate.push(expData.description_fr)
  
  if (textsToTranslate.length > 0) {
    const { translateTexts } = await import('@/lib/translate')
    const translations = await translateTexts(textsToTranslate)
    
    let i = 0
    if (expData.title_fr && !expData.title_en) expData.title_en = translations[i++] || ''
    if (expData.description_fr && !expData.description_en) expData.description_en = translations[i++] || ''
    usedDeepL = true
  }
  
  expData.en_auto_generated = usedDeepL

  const { error: expError } = await supabase
    .from('experiences')
    .update({
      ...expData,
      end_date: end_date === '' ? null : end_date,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (expError) {
    console.error('Erreur mise à jour expérience:', expError)
    return { error: 'Erreur lors de la mise à jour' }
  }

  await supabase.from('experience_domains').delete().eq('experience_id', id)

  if (domains.length > 0) {
    const domainInserts = domains.map(domain => ({
      experience_id: id,
      domain
    }))
    await supabase.from('experience_domains').insert(domainInserts)
  }

  revalidatePath('/experiences')
  revalidatePath('/admin/experiences')
  
  return { success: true }
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression expérience:', error)
    return { error: 'Erreur lors de la suppression' }
  }

  revalidatePath('/experiences')
  revalidatePath('/admin/experiences')
  return { success: true }
}

export async function toggleExperienceStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'published' ? 'draft' : 'published'
  
  const { error } = await supabase
    .from('experiences')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Erreur bascule statut:', error)
    return { error: 'Erreur lors de la modification' }
  }

  revalidatePath('/experiences')
  revalidatePath('/admin/experiences')
  return { success: true, newStatus }
}
