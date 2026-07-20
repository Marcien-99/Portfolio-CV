import Link from "next/link"
import { Plus, Pencil, CheckCircle2, XCircle } from "lucide-react"
import { toggleEducationStatus } from "@/lib/actions/educations"
import { DeleteEducationButton } from "./DeleteEducationButton"

export default async function AdminEducationsPage() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: educations } = await supabase
    .from('educations')
    .select('*')
    .order('position')
    .order('start_date', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Formations</h1>
          <p className="text-muted-foreground mt-1">Gérez votre parcours académique.</p>
        </div>
        <Link 
          href="/admin/formations/nouveau" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Nouvelle formation
        </Link>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Diplôme / Titre (FR)</th>
                <th className="px-6 py-4 font-medium">Établissement</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Lieu</th>
                <th className="px-6 py-4 font-medium text-center">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {(!educations || educations.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Aucune formation trouvée.
                  </td>
                </tr>
              ) : (
                educations.map((edu) => (
                  <tr key={edu.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{edu.title_fr}</td>
                    <td className="px-6 py-4 text-muted-foreground">{edu.institution}</td>
                    <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">{edu.location}</td>
                    <td className="px-6 py-4 text-center">
                      <form action={async () => {
                        'use server'
                        await toggleEducationStatus(edu.id, edu.status)
                      }}>
                        <button type="submit" className="inline-flex items-center justify-center group" title="Basculer le statut">
                          {edu.status === 'published' ? (
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
                          href={`/admin/formations/${edu.id}`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteEducationButton id={edu.id} />
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
