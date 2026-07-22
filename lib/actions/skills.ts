'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schéma de validation Zod
const skillSchema = z.object({
  name_fr: z.string().min(1, "Le nom (FR) est requis"),
  name_en: z.string().min(1, "Le nom (EN) est requis"),
  en_auto_generated: z.boolean().default(true),
  category_id: z.string().uuid("Catégorie invalide"),
  level: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
  domains: z.array(z.enum(['surete_fonctionnement', 'electronique', 'automatisme', 'informatique_ia'])).default([]),
})

export async function createSkill(formData: FormData) {
  const supabase = await createClient()

  // Extraire les données du formData
  const rawData = {
    name_fr: formData.get('name_fr'),
    name_en: formData.get('name_en'),
    en_auto_generated: formData.get('en_auto_generated') === 'on' || formData.get('en_auto_generated') === 'true',
    category_id: formData.get('category_id'),
    level: formData.get('level'),
    status: formData.get('status'),
    domains: formData.getAll('domains'), // Gestion des checkboxes multiples
  }

  // Validation Zod
  const result = skillSchema.safeParse(rawData)
  
  if (!result.success) {
    return { error: 'Données invalides', details: result.error.flatten().fieldErrors }
  }

  const { domains, level, ...skillData } = result.data

  // Traduction automatique DeepL
  if (skillData.en_auto_generated) {
    const { translateText } = await import('@/lib/translate')
    const translation = await translateText(skillData.name_fr)
    if (translation) skillData.name_en = translation
  }

  // Insertion de la compétence
  const { data: newSkill, error: skillError } = await supabase
    .from('skills')
    .insert([{
      ...skillData,
      level: level === '' ? null : level
    }])
    .select('id')
    .single()

  if (skillError) {
    console.error('Erreur création compétence:', skillError)
    return { error: 'Erreur lors de la création de la compétence' }
  }

  // Insertion des domaines liés
  if (domains.length > 0 && newSkill) {
    const domainInserts = domains.map(domain => ({
      skill_id: newSkill.id,
      domain
    }))
    
    const { error: domainsError } = await supabase
      .from('skill_domains')
      .insert(domainInserts)

    if (domainsError) {
      console.error('Erreur ajout domaines:', domainsError)
      // On continue quand même car la compétence est créée, mais on pourrait le gérer autrement
    }
  }

  revalidatePath('/competences')
  revalidatePath('/admin/competences')
  
  return { success: true }
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    name_fr: formData.get('name_fr'),
    name_en: formData.get('name_en'),
    en_auto_generated: formData.get('en_auto_generated') === 'on' || formData.get('en_auto_generated') === 'true',
    category_id: formData.get('category_id'),
    level: formData.get('level'),
    status: formData.get('status'),
    domains: formData.getAll('domains'),
  }

  const result = skillSchema.safeParse(rawData)
  
  if (!result.success) {
    return { error: 'Données invalides', details: result.error.flatten().fieldErrors }
  }

  const { domains, level, ...skillData } = result.data

  // Traduction automatique DeepL
  if (skillData.en_auto_generated) {
    const { translateText } = await import('@/lib/translate')
    const translation = await translateText(skillData.name_fr)
    if (translation) skillData.name_en = translation
  }

  // Mise à jour de la compétence
  const { error: skillError } = await supabase
    .from('skills')
    .update({
      ...skillData,
      level: level === '' ? null : level,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (skillError) {
    console.error('Erreur mise à jour compétence:', skillError)
    return { error: 'Erreur lors de la mise à jour de la compétence' }
  }

  // Mise à jour des domaines : on supprime tout et on recrée
  await supabase.from('skill_domains').delete().eq('skill_id', id)

  if (domains.length > 0) {
    const domainInserts = domains.map(domain => ({
      skill_id: id,
      domain
    }))
    
    await supabase.from('skill_domains').insert(domainInserts)
  }

  revalidatePath('/competences')
  revalidatePath('/admin/competences')
  
  return { success: true }
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression compétence:', error)
    return { error: 'Erreur lors de la suppression' }
  }

  revalidatePath('/competences')
  revalidatePath('/admin/competences')
  return { success: true }
}

export async function toggleSkillStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'published' ? 'draft' : 'published'
  
  const { error } = await supabase
    .from('skills')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Erreur bascule statut compétence:', error)
    return { error: 'Erreur lors de la modification du statut' }
  }

  revalidatePath('/competences')
  revalidatePath('/admin/competences')
  return { success: true, newStatus }
}
