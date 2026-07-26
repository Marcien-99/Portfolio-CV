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
  let { data: profiles } = await supabase
    .from('cv_profiles')
    .select('*')
    .eq('is_default', true)
    .limit(1)

  let profile = profiles && profiles.length > 0 ? profiles[0] : null

  if (!profile) {
    const { data: anyProfiles } = await supabase
      .from('cv_profiles')
      .select('*')
      .limit(1)
    if (anyProfiles && anyProfiles.length > 0) {
      profile = anyProfiles[0]
    } else {
      const { data: newProfile } = await supabase
        .from('cv_profiles')
        .insert([{ name: 'Standard', template_key: 'standard', is_default: true, show_github: true, is_public: true }])
        .select('*')
        .single()
      profile = newProfile
    }
  }

  const { data: items } = await supabase
    .from('cv_profile_items')
    .select('*')
    .eq('cv_profile_id', profile?.id)

  return { profile: profile!, items: items || [] }
}

export async function getProfileByIdOrDefault(profileId?: string) {
  const supabase = await createClient()
  let profile = null

  if (profileId && profileId !== 'standard' && profileId !== 'default') {
    const { data: profiles } = await supabase
      .from('cv_profiles')
      .select('*')
      .eq('id', profileId)
      .limit(1)
    if (profiles && profiles.length > 0) {
      profile = profiles[0]
    }
  }

  if (!profile) {
    return await getStandardProfile()
  }

  const { data: items } = await supabase
    .from('cv_profile_items')
    .select('*')
    .eq('cv_profile_id', profile.id)

  return { profile, items: items || [] }
}

export async function updateProfileItems(
  profileId: string, 
  items: { item_type: string, item_id: string }[],
  options?: { projects_before_experiences?: boolean }
) {
  const supabase = await createClient()

  if (options && options.projects_before_experiences !== undefined) {
    await supabase
      .from('cv_profiles')
      .update({ projects_before_experiences: options.projects_before_experiences })
      .eq('id', profileId)
  }

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

export async function getAllProfiles() {
  const supabase = await createClient()
  let { data: profiles } = await supabase
    .from('cv_profiles')
    .select('*')

  if (!profiles || profiles.length === 0) {
    const { data: newProfile } = await supabase
      .from('cv_profiles')
      .insert([{ name: 'Standard', template_key: 'standard', is_default: true, show_github: true, is_public: true }])
      .select('*')
      .single()
    if (newProfile) {
      profiles = [newProfile]
    } else {
      profiles = []
    }
  }

  // NETTOYAGE AUTO: Supprimer les profils "Standard" en double créés accidentellement
  if (profiles && profiles.length > 1) {
    const defaultProfiles = profiles.filter(p => p.is_default || p.name === 'Standard')
    if (defaultProfiles.length > 1) {
      const keepId = defaultProfiles[0].id
      const duplicatesToDelete = defaultProfiles.slice(1).map(p => p.id)
      if (duplicatesToDelete.length > 0) {
        console.log("Nettoyage automatique des profils Standard en double :", duplicatesToDelete)
        await supabase.from('cv_profiles').delete().in('id', duplicatesToDelete)
        profiles = profiles.filter(p => !duplicatesToDelete.includes(p.id))
      }
    }
  }

  // Trier pour mettre le profil par défaut (le vrai Standard) en premier
  profiles = (profiles || []).sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))

  const { data: items } = await supabase
    .from('cv_profile_items')
    .select('*')

  return profiles.map(profile => ({
    profile,
    items: (items || []).filter(item => item.cv_profile_id === profile.id)
  }))
}

export async function createProfile(name: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cv_profiles')
    .insert([{ 
      name, 
      template_key: 'standard', 
      is_default: false, 
      show_github: true, 
      is_public: true 
    }])
    .select('*')
    .single()

  if (error) {
    console.error("Erreur création profil:", error)
    return { error: `Erreur lors de la création du profil (${error.message})` }
  }

  revalidatePath('/admin/cv-profils')
  return { success: true, profile: data }
}

export async function updateProfileMetadata(
  profileId: string,
  metadata: {
    name?: string;
    bio_fr?: string;
    bio_en?: string;
    show_github?: boolean;
    is_public?: boolean;
    skills_order?: string[];
  }
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('cv_profiles')
    .update(metadata)
    .eq('id', profileId)

  if (error) {
    console.error("Erreur mise à jour métadonnées profil:", error)
    return { error: `Erreur lors de la mise à jour des informations du profil (${error.message})` }
  }

  revalidatePath('/admin/cv-profils')
  return { success: true }
}

export async function deleteProfile(profileId: string) {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('cv_profiles')
    .select('is_default')
    .eq('id', profileId)
    .single()

  if (profile?.is_default) {
    return { error: "Impossible de supprimer le profil par défaut." }
  }

  const { error } = await supabase
    .from('cv_profiles')
    .delete()
    .eq('id', profileId)

  if (error) {
    console.error("Erreur suppression profil:", error)
    return { error: `Erreur lors de la suppression du profil (${error.message})` }
  }

  revalidatePath('/admin/cv-profils')
  return { success: true }
}
