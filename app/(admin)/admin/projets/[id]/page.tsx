import { notFound } from "next/navigation"
import { ProjectForm } from "../ProjectForm"
import { createClient } from "@/lib/supabase/server"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: proj, error } = await supabase
    .from('projects')
    .select('*, project_domains (domain), project_images (id, url, position, caption_fr, caption_en), project_links (id, url, label_fr, label_en, position)')
    .eq('id', id)
    .single()

  if (error || !proj) {
    notFound()
  }

  const formattedProj = {
    ...proj,
    domains: proj.project_domains?.map((d: any) => d.domain) || [],
    images: (proj.project_images || []).sort((a: any, b: any) => a.position - b.position),
    links: (proj.project_links || []).sort((a: any, b: any) => a.position - b.position)
  }

  return <ProjectForm initialData={formattedProj} />
}
