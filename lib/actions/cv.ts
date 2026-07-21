'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ----- GESTION DES PHOTOS -----

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('photo') as File

  if (!file || file.size === 0) {
    return { error: 'Aucun fichier sélectionné' }
  }

  const ext = file.name.split('.').pop()
  const fileName = `photo-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

  // Upload dans le bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file)

  if (uploadError) {
    console.error("Upload error: ", uploadError)
    return { error: "Erreur lors de l'upload de l'image. Avez-vous configuré les permissions Storage (RLS) ?" }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName)

  // Enregistrer en base
  const { error: dbError } = await supabase
    .from('cv_photos')
    .insert([{ file_path: publicUrl, is_active: false }])

  if (dbError) {
    return { error: "Erreur lors de l'enregistrement en base" }
  }

  revalidatePath('/admin/photo')
  return { success: true }
}

export async function setActivePhoto(photoId: string) {
  const supabase = await createClient()

  // 1. Désactiver toutes les photos
  await supabase.from('cv_photos').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000') // Trick to update all

  // 2. Activer la photo sélectionnée
  const { error } = await supabase
    .from('cv_photos')
    .update({ is_active: true })
    .eq('id', photoId)

  if (error) return { error: "Erreur lors de l'activation de la photo" }

  revalidatePath('/admin/photo')
  return { success: true }
}

export async function deletePhoto(photoId: string, url: string) {
  const supabase = await createClient()

  const { error: dbError } = await supabase.from('cv_photos').delete().eq('id', photoId)
  if (dbError) return { error: "Erreur lors de la suppression en base" }

  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split('/profile-photos/')
  if (pathParts.length > 1) {
    const storagePath = pathParts[1]
    await supabase.storage.from('profile-photos').remove([storagePath])
  }

  revalidatePath('/admin/photo')
  return { success: true }
}

export async function getPhotos() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cv_photos')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

// ----- GESTION DES PROFILS CV -----

export async function getStandardProfile() {
  const supabase = await createClient()
  let { data: profile } = await supabase
    .from('cv_profiles')
    .select('*')
    .eq('template_key', 'standard')
    .single()

  if (!profile) {
    // Créer le profil s'il n'existe pas
    const { data: newProfile } = await supabase
      .from('cv_profiles')
      .insert([{ name: 'Standard', template_key: 'standard', is_default: true }])
      .select('*')
      .single()
    profile = newProfile
  }

  const { data: items } = await supabase
    .from('cv_profile_items')
    .select('*')
    .eq('cv_profile_id', profile.id)

  return { profile, items: items || [] }
}

export async function updateProfileItems(profileId: string, items: { item_type: string, item_id: string }[]) {
  const supabase = await createClient()

  // Supprimer les anciens items
  await supabase.from('cv_profile_items').delete().eq('cv_profile_id', profileId)

  // Insérer les nouveaux
  if (items.length > 0) {
    const inserts = items.map((item, index) => ({
      cv_profile_id: profileId,
      item_type: item.item_type,
      item_id: item.item_id,
      position: index
    }))
    const { error } = await supabase.from('cv_profile_items').insert(inserts)
    if (error) {
        console.error("Erreur mise à jour profil:", error)
        return { error: "Erreur lors de la mise à jour du profil" }
    }
  }

  revalidatePath('/admin/cv-profils')
  return { success: true }
}
