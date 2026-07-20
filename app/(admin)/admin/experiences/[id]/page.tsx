import { notFound } from "next/navigation"
import { ExperienceForm } from "../ExperienceForm"
import { createClient } from "@/lib/supabase/server"

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: exp, error } = await supabase
    .from('experiences')
    .select('*, experience_domains (domain)')
    .eq('id', id)
    .single()

  if (error || !exp) {
    notFound()
  }

  const formattedExp = {
    ...exp,
    domains: exp.experience_domains?.map((d: any) => d.domain) || []
  }

  return <ExperienceForm initialData={formattedExp} />
}
