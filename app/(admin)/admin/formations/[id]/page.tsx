import { notFound } from "next/navigation"
import { EducationForm } from "../EducationForm"
import { createClient } from "@/lib/supabase/server"

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: edu, error } = await supabase
    .from('educations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !edu) {
    notFound()
  }

  return <EducationForm initialData={edu} />
}
