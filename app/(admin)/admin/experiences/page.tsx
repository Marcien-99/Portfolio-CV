import Link from "next/link"
import { Plus, Pencil, CheckCircle2, XCircle } from "lucide-react"
import { toggleExperienceStatus } from "@/lib/actions/experiences"
import { DeleteExperienceButton } from "./DeleteExperienceButton"

export default async function AdminExperiencesPage() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: allExperiences } = await supabase
    .from('experiences')
    .select('*, experience_domains (domain)')
    .order('position')
    .order('start_date', { ascending: false })

  const experiences = (allExperiences || []).map(item => ({
    ...item,
    domains: item.experience_domains?.map((d: any) => d.domain) || []
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Expériences</h1>
          <p className="text-muted-foreground mt-1">Gérez votre parcours professionnel.</p>
        </div>
        <Link 
          href="/admin/experiences/nouveau" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Nouvelle expérience
        </Link>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Poste (FR)</th>
                <th className="px-6 py-4 font-medium">Entreprise</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Domaines</th>
                <th className="px-6 py-4 font-medium text-center">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {experiences.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Aucune expérience trouvée.
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{exp.title_fr}</td>
                    <td className="px-6 py-4 text-muted-foreground">{exp.company}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {exp.domains.map((d: string) => (
                          <span key={d} className="px-2 py-0.5 bg-secondary text-xs rounded-full border border-border/10">
                            {d.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <form action={async () => {
                        'use server'
                        await toggleExperienceStatus(exp.id, exp.status)
                      }}>
                        <button type="submit" className="inline-flex items-center justify-center group" title="Basculer le statut">
                          {exp.status === 'published' ? (
                            <CheckCircle2 size={20} className="text-green-500 group-hover:text-green-600 transition-colors" />
                          ) : (
                            <XCircle size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                          )}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/experiences/${exp.id}`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteExperienceButton id={exp.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
