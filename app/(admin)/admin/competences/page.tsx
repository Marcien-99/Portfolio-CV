import { getSkills, getSkillCategories } from "@/lib/api/content"
import Link from "next/link"
import { Plus, Pencil, CheckCircle2, XCircle } from "lucide-react"
import { toggleSkillStatus } from "@/lib/actions/skills"
import { DeleteSkillButton } from "./DeleteSkillButton"

// Server Component pour la liste
export default async function AdminSkillsPage() {
  // On récupère toutes les compétences, même les brouillons, 
  // car l'admin doit tout voir.
  // getSkills() par défaut ne ramène que les published. On doit créer une fonction ou modifier la requête.
  // Puisque getSkills de lib/api/content.ts a un eq('status', 'published'),
  // on va faire la requête manuellement ici pour l'admin (qui doit tout voir).
  
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data: allSkills } = await supabase
    .from('skills')
    .select('*, skill_domains (domain)')
    .order('position')
    .order('created_at', { ascending: false });

  const skills = (allSkills || []).map(item => ({
    ...item,
    domains: item.skill_domains?.map((d: any) => d.domain) || []
  }));

  const categories = await getSkillCategories();
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name_fr || 'Inconnu';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Compétences</h1>
          <p className="text-muted-foreground mt-1">Gérez vos compétences et leurs domaines associés.</p>
        </div>
        <Link 
          href="/admin/competences/nouveau" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Nouvelle compétence
        </Link>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Nom (FR)</th>
                <th className="px-6 py-4 font-medium">Catégorie</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Domaines</th>
                <th className="px-6 py-4 font-medium text-center">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {skills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Aucune compétence trouvée.
                  </td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{skill.name_fr}</td>
                    <td className="px-6 py-4 text-muted-foreground">{getCategoryName(skill.category_id)}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {skill.domains.map((d: string) => (
                          <span key={d} className="px-2 py-0.5 bg-secondary text-xs rounded-full border border-border/10">
                            {d.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <form action={async () => {
                        'use server'
                        await toggleSkillStatus(skill.id, skill.status)
                      }}>
                        <button type="submit" className="inline-flex items-center justify-center group" title="Basculer le statut">
                          {skill.status === 'published' ? (
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
                          href={`/admin/competences/${skill.id}`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteSkillButton id={skill.id} />
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
