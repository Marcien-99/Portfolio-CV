'use server'

import { createClient } from '@/lib/supabase/server'
import { Skill, SkillCategory, Experience, Education, Project, ItemDomain } from '@/lib/types'

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*')
    .order('position')
  
  if (error) {
    console.error('Error fetching skill categories:', error)
    return []
  }
  return data
}

export async function getSkills(domain?: ItemDomain): Promise<Skill[]> {
  const supabase = await createClient()
  let query = supabase
    .from('skills')
    .select(`
      *,
      skill_domains (domain)
    `)
    .eq('status', 'published')
    .order('position')
    
  if (domain) {
    // Supabase filtering on joined tables can be tricky. 
    // We fetch all published skills and filter them below, 
    // or we can use an inner join syntax: .eq('skill_domains.domain', domain) 
    // but the typed inner join in PostgREST is `.not('skill_domains', 'is', null)`
    query = query.eq('skill_domains.domain', domain).not('skill_domains', 'is', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching skills:', error)
    return []
  }

  return (data as any[]).map(item => ({
    ...item,
    domains: item.skill_domains?.map((d: any) => d.domain) || []
  }))
}

export async function getExperiences(domain?: ItemDomain): Promise<Experience[]> {
  const supabase = await createClient()
  let query = supabase
    .from('experiences')
    .select(`
      *,
      experience_domains (domain)
    `)
    .eq('status', 'published')
    .order('position')
    
  if (domain) {
    query = query.eq('experience_domains.domain', domain).not('experience_domains', 'is', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching experiences:', error)
    return []
  }

  return (data as any[]).map(item => ({
    ...item,
    domains: item.experience_domains?.map((d: any) => d.domain) || []
  }))
}

export async function getEducations(): Promise<Education[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('educations')
    .select('*')
    .eq('status', 'published')
    .order('position')

  if (error) {
    console.error('Error fetching educations:', error)
    return []
  }
  
  return data.map(item => ({
    ...item,
    domains: [] // formations don't have domains in spec
  }))
}

export async function getProjects(domain?: ItemDomain, status?: string): Promise<Project[]> {
  const supabase = await createClient()
  let query = supabase
    .from('projects')
    .select(`
      *,
      project_domains (domain),
      project_images (url, position)
    `)
    .eq('visibility', 'published')
    .order('position')
    
  if (domain) {
    query = query.eq('project_domains.domain', domain).not('project_domains', 'is', null)
  }
  
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return (data as any[]).map(item => ({
    ...item,
    domains: item.project_domains?.map((d: any) => d.domain) || [],
    gallery: item.project_images?.sort((a: any, b: any) => a.position - b.position).map((img: any) => ({ src: img.url, description: '' })) || []
  }))
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_domains (domain),
      project_images (url, position)
    `)
    .eq('slug', slug)
    .eq('visibility', 'published')
    .single()

  if (error || !data) {
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching project by slug:', error)
    }
    return null
  }

  return {
    ...data,
    domains: data.project_domains?.map((d: any) => d.domain) || [],
    gallery: data.project_images?.sort((a: any, b: any) => a.position - b.position).map((img: any) => ({ src: img.url, description: '' })) || []
  }
}

export async function getActivePhoto(): Promise<string | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cv_photos')
    .select('file_path')
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data.file_path
}
