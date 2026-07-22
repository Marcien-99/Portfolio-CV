'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Si échec de la connexion, on redirige vers /admin/login avec une erreur
    redirect('/admin/login?error=true')
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword) return { error: "L'ancien mot de passe est requis." }
  if (!newPassword || newPassword.length < 6) return { error: "Le nouveau mot de passe doit faire au moins 6 caractères." }
  if (newPassword !== confirmPassword) return { error: "Les nouveaux mots de passe ne correspondent pas." }

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.email) return { error: "Utilisateur non trouvé." }

  // 2. Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword
  })

  if (signInError) {
    return { error: "L'ancien mot de passe est incorrect." }
  }

  // 3. Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (updateError) {
    return { error: 'Erreur lors de la mise à jour: ' + updateError.message }
  }

  return { success: true }
}
