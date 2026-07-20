import { getSkillCategories } from "@/lib/api/content"
import { notFound } from "next/navigation"
import { SkillForm } from "../SkillForm"
import { createClient } from "@/lib/supabase/server"

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: skill, error } = await supabase
    .from('skills')
    .select('*, skill_domains (domain)')
    .eq('id', id)
    .single()

  if (error || !skill) {
    notFound()
  }

  const categories = await getSkillCategories()

  const formattedSkill = {
    ...skill,
    domains: skill.skill_domains?.map((d: any) => d.domain) || []
  }

  return <SkillForm categories={categories} initialData={formattedSkill} />
}
