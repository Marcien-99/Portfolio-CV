import { logout } from './login/actions'
import { createClient } from '@/lib/supabase/server'
import { Code2, Briefcase, GraduationCap, FolderKanban, FileText } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()
  
  const [
    { count: competencesCount },
    { count: experiencesCount },
    { count: formationsCount },
    { count: projetsCount },
    { count: profilsCount }
  ] = await Promise.all([
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    supabase.from('educations').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('cv_profiles').select('*', { count: 'exact', head: true })
  ])

  return {
    competences: competencesCount || 0,
    experiences: experiencesCount || 0,
    formations: formationsCount || 0,
    projets: projetsCount || 0,
    profils: profilsCount || 0
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  // Fetch recent activities
  const supabase = await createClient()
  const [
    { data: recentExperiences },
    { data: recentProjects }
  ] = await Promise.all([
    supabase.from('experiences').select('id, title_fr, company, updated_at').order('updated_at', { ascending: false }).limit(3),
    supabase.from('projects').select('id, title_fr, updated_at').order('updated_at', { ascending: false }).limit(3)
  ])

  const statCards = [
    { label: 'Compétences', count: stats.competences, icon: <Code2 size={24} strokeWidth={1.5} />, href: '/admin/competences', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Expériences', count: stats.experiences, icon: <Briefcase size={24} strokeWidth={1.5} />, href: '/admin/experiences', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Formations', count: stats.formations, icon: <GraduationCap size={24} strokeWidth={1.5} />, href: '/admin/formations', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Projets', count: stats.projets, icon: <FolderKanban size={24} strokeWidth={1.5} />, href: '/admin/projets', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Profils CV', count: stats.profils, icon: <FileText size={24} strokeWidth={1.5} />, href: '/admin/cv-profils', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* Light Header */}
      <div className="bg-[#F5F5F7] p-10 md:p-16 flex-shrink-0 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-1.5 h-16 bg-primary rounded-full shrink-0"></div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter italic text-[#111111]">
                Vue d'ensemble
              </h1>
              <p className="text-[#111111]/70 mt-3 font-sans text-lg max-w-md leading-relaxed">
                Gérez le contenu de votre portfolio et configurez vos différents profils de CV.
              </p>
            </div>
          </div>
          <form>
            <button 
              formAction={logout}
              className="px-8 py-3 bg-[#111111] hover:bg-[#111111]/80 text-white font-medium rounded-full transition-all duration-300 text-sm hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      {/* Dark Content */}
      <div className="flex-1 bg-[#121212] p-10 md:p-16 text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat, i) => (
              <Link href={stat.href} key={i} className="group block">
                <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-white/5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-heading font-bold tracking-tight text-white">
                      {stat.count}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">{stat.label}</h3>
                  <p className="text-sm text-white/50 mt-2">Gérer les éléments</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Activités Récentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white mb-6">Projets Récents</h2>
              <div className="space-y-4">
                {recentProjects?.length === 0 ? (
                  <p className="text-white/50 italic text-sm">Aucun projet trouvé.</p>
                ) : (
                  recentProjects?.map(proj => (
                    <Link key={proj.id} href={`/admin/projets/${proj.id}`} className="block group">
                      <div className="p-5 rounded-2xl border border-white/5 bg-[#111111] hover:bg-white/5 hover:border-white/10 transition-all duration-300">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-primary transition-colors">{proj.title_fr}</h4>
                            <p className="text-xs text-white/40 mt-1">Modifié le {new Date(proj.updated_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <FolderKanban className="w-5 h-5 text-white/20 group-hover:text-primary/50" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white mb-6">Expériences Récentes</h2>
              <div className="space-y-4">
                {recentExperiences?.length === 0 ? (
                  <p className="text-white/50 italic text-sm">Aucune expérience trouvée.</p>
                ) : (
                  recentExperiences?.map(exp => (
                    <Link key={exp.id} href={`/admin/experiences/${exp.id}`} className="block group">
                      <div className="p-5 rounded-2xl border border-white/5 bg-[#111111] hover:bg-white/5 hover:border-white/10 transition-all duration-300">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-primary transition-colors">{exp.title_fr}</h4>
                            <p className="text-sm text-white/70">{exp.company}</p>
                            <p className="text-xs text-white/40 mt-1">Modifié le {new Date(exp.updated_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <Briefcase className="w-5 h-5 text-white/20 group-hover:text-primary/50" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

