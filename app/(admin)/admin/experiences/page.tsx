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
    <div className="flex flex-col min-h-full">
      {/* Light Header */}
      <div className="bg-[#F5F5F7] p-10 md:p-16 flex-shrink-0 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-1.5 h-16 bg-primary rounded-full shrink-0"></div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter italic text-[#111111]">
                Expériences
              </h1>
              <p className="text-[#111111]/70 mt-3 font-sans text-lg max-w-md leading-relaxed">
                Gérez votre parcours professionnel.
              </p>
            </div>
          </div>
          <Link 
            href="/admin/experiences/nouveau" 
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full transition-all duration-300 text-sm hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
          >
            <Plus size={18} />
            Nouvelle expérience
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
                    <th className="px-6 py-5 font-medium tracking-wide">Poste (FR)</th>
                    <th className="px-6 py-5 font-medium tracking-wide">Entreprise</th>
                    <th className="px-6 py-5 font-medium tracking-wide hidden md:table-cell">Domaines</th>
                    <th className="px-6 py-5 font-medium tracking-wide text-center">Statut</th>
                    <th className="px-6 py-5 font-medium tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {experiences.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                        Aucune expérience trouvée.
                      </td>
                    </tr>
                  ) : (
                    experiences.map((exp) => (
                      <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5 font-medium text-white">{exp.title_fr}</td>
                        <td className="px-6 py-5 text-white/70">{exp.company}</td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          <div className="flex flex-wrap gap-2">
                            {exp.domains.map((d: string) => (
                              <span key={d} className="px-3 py-1 bg-[#111111] text-white/80 text-xs rounded-full border border-white/10">
                                {d.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <form action={async () => {
                            'use server'
                            await toggleExperienceStatus(exp.id, exp.status)
                          }}>
                            <button type="submit" className="inline-flex items-center justify-center group" title="Basculer le statut">
                              {exp.status === 'published' ? (
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
                              href={`/admin/experiences/${exp.id}`}
                              className="p-2 text-white/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Pencil size={18} />
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
      </div>
    </div>
  )
}
