import { getSkills, getSkillCategories } from "@/lib/api/content"
import Link from "next/link"
import { Plus, Pencil, CheckCircle2, XCircle, Sparkles } from "lucide-react"
import { toggleSkillStatus } from "@/lib/actions/skills"
import { reviewTranslation } from "@/lib/actions/translations"
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
    <div className="flex flex-col min-h-full">
      {/* Light Header */}
      <div className="bg-[#F5F5F7] p-10 md:p-16 flex-shrink-0 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-1.5 h-16 bg-primary rounded-full shrink-0"></div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter italic text-[#111111]">
                Compétences
              </h1>
              <p className="text-[#111111]/70 mt-3 font-sans text-lg max-w-md leading-relaxed">
                Gérez vos compétences et leurs domaines associés.
              </p>
            </div>
          </div>
          <Link 
            href="/admin/competences/nouveau" 
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full transition-all duration-300 text-sm hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
          >
            <Plus size={18} />
            Nouvelle compétence
          </Link>
        </div>
      </div>

      {/* Dark Content */}
      <div className="flex-1 bg-[#121212] p-10 md:p-16 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#111111] text-white/50">
                  <tr>
                    <th className="px-6 py-5 font-medium tracking-wide">Nom (FR)</th>
                    <th className="px-6 py-5 font-medium tracking-wide">Catégorie</th>
                    <th className="px-6 py-5 font-medium tracking-wide hidden md:table-cell">Domaines</th>
                    <th className="px-6 py-5 font-medium tracking-wide text-center">Traduction EN</th>
                    <th className="px-6 py-5 font-medium tracking-wide text-center">Statut</th>
                    <th className="px-6 py-5 font-medium tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {skills.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                        Aucune compétence trouvée.
                      </td>
                    </tr>
                  ) : (
                    skills.map((skill) => (
                      <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5 font-medium text-white">{skill.name_fr}</td>
                        <td className="px-6 py-5 text-white/70">{getCategoryName(skill.category_id)}</td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          <div className="flex flex-wrap gap-2">
                            {skill.domains.map((d: string) => (
                              <span key={d} className="px-3 py-1 bg-[#111111] text-white/80 text-xs rounded-full border border-white/10">
                                {d.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          {skill.en_auto_generated ? (
                            <form action={async () => {
                              'use server'
                              await reviewTranslation('skills', skill.id)
                            }}>
                              <button type="submit" className="inline-flex items-center justify-center group gap-2" title="Marquer comme relu">
                                <span className="flex items-center text-yellow-500 group-hover:text-yellow-400 transition-colors bg-yellow-500/10 px-2 py-1 rounded-md text-xs">
                                  <Sparkles size={14} className="mr-1" /> Non relu
                                </span>
                              </button>
                            </form>
                          ) : (
                            <span className="flex items-center justify-center text-white/30 text-xs">
                              Relu
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <form action={async () => {
                            'use server'
                            await toggleSkillStatus(skill.id, skill.status)
                          }}>
                            <button type="submit" className="inline-flex items-center justify-center group" title="Basculer le statut">
                              {skill.status === 'published' ? (
                                <CheckCircle2 size={20} className="text-green-500 group-hover:text-green-400 transition-colors" />
                              ) : (
                                <XCircle size={20} className="text-white/30 group-hover:text-white transition-colors" />
                              )}
                            </button>
                          </form>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link 
                              href={`/admin/competences/${skill.id}`}
                              className="p-2 text-white/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Pencil size={18} />
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
      </div>
    </div>
  )
}
