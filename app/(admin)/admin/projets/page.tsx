import Link from "next/link"
import { Plus, Pencil, CheckCircle2, XCircle, Timer, CheckSquare } from "lucide-react"
import { toggleProjectVisibility, toggleProjectStatus } from "@/lib/actions/projects"
import { DeleteProjectButton } from "./DeleteProjectButton"

export default async function AdminProjectsPage() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: allProjects } = await supabase
    .from('projects')
    .select('*, project_domains (domain)')
    .order('position')
    .order('created_at', { ascending: false })

  const projects = (allProjects || []).map(item => ({
    ...item,
    domains: item.project_domains?.map((d: any) => d.domain) || []
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground mt-1">Gérez vos réalisations et études de cas.</p>
        </div>
        <Link 
          href="/admin/projets/nouveau" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Nouveau projet
        </Link>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Titre (FR) & Slug</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Domaines</th>
                <th className="px-6 py-4 font-medium text-center">Avancement</th>
                <th className="px-6 py-4 font-medium text-center">Visibilité</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Aucun projet trouvé.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{proj.title_fr}</div>
                      <div className="text-xs text-muted-foreground mt-1">/{proj.slug}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {proj.domains.map((d: string) => (
                          <span key={d} className="px-2 py-0.5 bg-secondary text-xs rounded-full border border-border/10">
                            {d.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    
                    {/* Bascule Rapide: Avancement */}
                    <td className="px-6 py-4 text-center">
                      <form action={async () => {
                        'use server'
                        await toggleProjectStatus(proj.id, proj.status)
                      }}>
                        <button type="submit" className="inline-flex items-center justify-center group gap-2" title="Basculer l'avancement">
                          {proj.status === 'termine' ? (
                            <span className="flex items-center text-green-500 group-hover:text-green-600 transition-colors bg-green-500/10 px-2 py-1 rounded-md">
                              <CheckSquare size={16} className="mr-1" /> Terminé
                            </span>
                          ) : (
                            <span className="flex items-center text-orange-400 group-hover:text-orange-500 transition-colors bg-orange-400/10 px-2 py-1 rounded-md">
                              <Timer size={16} className="mr-1" /> En cours
                            </span>
                          )}
                        </button>
                      </form>
                    </td>

                    {/* Bascule Rapide: Visibilité */}
                    <td className="px-6 py-4 text-center">
                      <form action={async () => {
                        'use server'
                        await toggleProjectVisibility(proj.id, proj.visibility)
                      }}>
                        <button type="submit" className="inline-flex items-center justify-center group" title="Basculer la visibilité">
                          {proj.visibility === 'published' ? (
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
                          href={`/admin/projets/${proj.id}`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteProjectButton id={proj.id} />
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
