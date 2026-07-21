'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const projectSchema = z.object({
  title_fr: z.string().min(1, "Le titre (FR) est requis"),
  title_en: z.string().min(1, "Le titre (EN) est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  context_fr: z.string().optional(),
  context_en: z.string().optional(),
  approach_fr: z.string().optional(),
  approach_en: z.string().optional(),
  result_fr: z.string().optional(),
  result_en: z.string().optional(),
  en_auto_generated: z.boolean().default(true),
  status: z.enum(['en_cours', 'termine']).default('en_cours'),
  visibility: z.enum(['draft', 'published']).default('draft'),
  domains: z.array(z.enum(['surete_fonctionnement', 'electronique', 'automatisme', 'informatique_ia'])).default([]),
})

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    title_fr: formData.get('title_fr'),
    title_en: formData.get('title_en'),
    slug: formData.get('slug'),
    context_fr: formData.get('context_fr'),
    context_en: formData.get('context_en'),
    approach_fr: formData.get('approach_fr'),
    approach_en: formData.get('approach_en'),
    result_fr: formData.get('result_fr'),
    result_en: formData.get('result_en'),
    en_auto_generated: formData.get('en_auto_generated') === 'on' || formData.get('en_auto_generated') === 'true',
    status: formData.get('status'),
    visibility: formData.get('visibility'),
    domains: formData.getAll('domains'),
  }

  const result = projectSchema.safeParse(rawData)
  
  if (!result.success) {
    return { error: 'Données invalides', details: result.error.flatten().fieldErrors }
  }

  const { domains, ...projectData } = result.data

  const { data: newProject, error: projectError } = await supabase
    .from('projects')
    .insert([projectData])
    .select('id')
    .single()

  if (projectError) {
    console.error('Erreur création projet:', projectError)
    if (projectError.code === '23505') return { error: 'Ce slug existe déjà.' }
    return { error: 'Erreur lors de la création' }
  }

  // 1. Insérer les domaines
  if (domains.length > 0 && newProject) {
    const domainInserts = domains.map(domain => ({
      project_id: newProject.id,
      domain
    }))
    await supabase.from('project_domains').insert(domainInserts)
  }

  // 2. Insérer les liens
  const linksCount = parseInt(formData.get('links_count') as string || '0')
  for (let i = 0; i < linksCount; i++) {
    const url = formData.get(`link_url_${i}`) as string
    const label_fr = formData.get(`link_label_fr_${i}`) as string
    const label_en = formData.get(`link_label_en_${i}`) as string
    if (url) {
      await supabase.from('project_links').insert([{
        project_id: newProject.id,
        url,
        label_fr,
        label_en,
        position: i
      }])
    }
  }

  // 3. Upload de nouvelles images
  const newImagesCount = parseInt(formData.get('new_images_count') as string || '0')
  for (let i = 0; i < newImagesCount; i++) {
    const file = formData.get(`new_image_file_${i}`) as File
    const caption_fr = formData.get(`new_image_caption_fr_${i}`) as string
    const caption_en = formData.get(`new_image_caption_en_${i}`) as string

    if (file && file.size > 0) {
      const ext = file.name.split('.').pop()
      const fileName = `${newProject.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file)

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName)

        await supabase.from('project_images').insert([{
          project_id: newProject.id,
          url: publicUrl,
          position: i,
          caption_fr,
          caption_en
        }])
      } else {
        console.error("Upload error: ", uploadError)
        return { error: "Erreur lors de l'upload de l'image. Avez-vous configuré les permissions Storage (RLS) ?" }
      }
    }
  }

  revalidatePath('/projets')
  revalidatePath('/admin/projets')
  
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    title_fr: formData.get('title_fr'),
    title_en: formData.get('title_en'),
    slug: formData.get('slug'),
    context_fr: formData.get('context_fr'),
    context_en: formData.get('context_en'),
    approach_fr: formData.get('approach_fr'),
    approach_en: formData.get('approach_en'),
    result_fr: formData.get('result_fr'),
    result_en: formData.get('result_en'),
    en_auto_generated: formData.get('en_auto_generated') === 'on' || formData.get('en_auto_generated') === 'true',
    status: formData.get('status'),
    visibility: formData.get('visibility'),
    domains: formData.getAll('domains'),
  }

  const result = projectSchema.safeParse(rawData)
  
  if (!result.success) {
    return { error: 'Données invalides', details: result.error.flatten().fieldErrors }
  }

  const { domains, ...projectData } = result.data

  const { error: projectError } = await supabase
    .from('projects')
    .update({
      ...projectData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (projectError) {
    console.error('Erreur mise à jour projet:', projectError)
    if (projectError.code === '23505') return { error: 'Ce slug existe déjà.' }
    return { error: 'Erreur lors de la mise à jour' }
  }

  // 1. Màj des domaines
  await supabase.from('project_domains').delete().eq('project_id', id)
  if (domains.length > 0) {
    const domainInserts = domains.map(domain => ({
      project_id: id,
      domain
    }))
    await supabase.from('project_domains').insert(domainInserts)
  }

  // 2. Màj des liens (on supprime tout et on recrée)
  await supabase.from('project_links').delete().eq('project_id', id)
  const linksCount = parseInt(formData.get('links_count') as string || '0')
  for (let i = 0; i < linksCount; i++) {
    const url = formData.get(`link_url_${i}`) as string
    const label_fr = formData.get(`link_label_fr_${i}`) as string
    const label_en = formData.get(`link_label_en_${i}`) as string
    if (url) {
      await supabase.from('project_links').insert([{
        project_id: id,
        url,
        label_fr,
        label_en,
        position: i
      }])
    }
  }

  // 3. Màj des légendes des images existantes
  const existingImagesCount = parseInt(formData.get('existing_images_count') as string || '0')
  for (let i = 0; i < existingImagesCount; i++) {
    const imgId = formData.get(`existing_image_id_${i}`) as string
    const caption_fr = formData.get(`existing_image_caption_fr_${i}`) as string
    const caption_en = formData.get(`existing_image_caption_en_${i}`) as string
    
    await supabase.from('project_images')
      .update({ caption_fr, caption_en })
      .eq('id', imgId)
  }

  // 4. Upload nouvelles images
  const newImagesCount = parseInt(formData.get('new_images_count') as string || '0')
  for (let i = 0; i < newImagesCount; i++) {
    const file = formData.get(`new_image_file_${i}`) as File
    const caption_fr = formData.get(`new_image_caption_fr_${i}`) as string
    const caption_en = formData.get(`new_image_caption_en_${i}`) as string

    if (file && file.size > 0) {
      const ext = file.name.split('.').pop()
      const fileName = `${id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file)

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName)

        const { error: dbError } = await supabase.from('project_images').insert([{
          project_id: id,
          url: publicUrl,
          position: 100 + i, // Fix: Date.now() overflows 32-bit integer
          caption_fr,
          caption_en
        }])
        if (dbError) {
          console.error("DB insert error: ", dbError)
          return { error: "Erreur DB lors de l'enregistrement de l'image." }
        }
      } else {
        console.error("Upload error: ", uploadError)
        return { error: "Erreur lors de l'upload de l'image. Avez-vous configuré les permissions Storage (RLS) ?" }
      }
    }
  }

  revalidatePath('/projets')
  revalidatePath(`/projets/${projectData.slug}`)
  revalidatePath('/admin/projets')
  
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  
  // 1. Lister les images du projet pour les supprimer du Storage
  const { data: images } = await supabase
    .from('project_images')
    .select('url')
    .eq('project_id', id)

  // 2. Supprimer le projet de la base de données (les lignes project_images seront supprimées via CASCADE)
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression projet:', error)
    return { error: 'Erreur lors de la suppression' }
  }

  // 3. Supprimer physiquement les fichiers du Storage
  if (images && images.length > 0) {
    const pathsToRemove = images.map(img => {
      try {
        const urlObj = new URL(img.url)
        const pathParts = urlObj.pathname.split('/portfolio/')
        return pathParts.length > 1 ? pathParts[1] : null
      } catch (e) {
        return null
      }
    }).filter(Boolean) as string[]

    if (pathsToRemove.length > 0) {
      await supabase.storage.from('portfolio').remove(pathsToRemove)
    }
  }

  revalidatePath('/projets')
  revalidatePath('/admin/projets')
  return { success: true }
}

export async function deleteProjectImage(imageId: string, imageUrl: string) {
  const supabase = await createClient()
  
  // Supprimer de la BDD
  const { error: dbError } = await supabase
    .from('project_images')
    .delete()
    .eq('id', imageId)

  if (dbError) {
    return { error: 'Impossible de supprimer l\'image de la base.' }
  }

  // Supprimer du storage
  const urlObj = new URL(imageUrl)
  const pathParts = urlObj.pathname.split('/portfolio/')
  if (pathParts.length > 1) {
    const storagePath = pathParts[1]
    await supabase.storage.from('portfolio').remove([storagePath])
  }

  revalidatePath('/admin/projets')
  return { success: true }
}

export async function toggleProjectStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'en_cours' ? 'termine' : 'en_cours'
  
  const { error } = await supabase
    .from('projects')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return { error: 'Erreur lors de la modification du statut' }

  revalidatePath('/projets')
  revalidatePath('/admin/projets')
  return { success: true, newStatus }
}

export async function toggleProjectVisibility(id: string, currentVisibility: string) {
  const supabase = await createClient()
  const newVisibility = currentVisibility === 'published' ? 'draft' : 'published'
  
  const { error } = await supabase
    .from('projects')
    .update({ 
      visibility: newVisibility,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return { error: 'Erreur lors de la modification de la visibilité' }

  revalidatePath('/projets')
  revalidatePath('/admin/projets')
  return { success: true, newVisibility }
}
