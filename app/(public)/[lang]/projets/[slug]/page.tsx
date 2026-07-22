import { getProjectBySlug } from "@/lib/api/content";
import { notFound } from "next/navigation";
import { DomainBadge, DomainType } from "@/components/profile/DomainBadge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projet non trouvé" };
  
  const title = lang === 'en' && project.title_en ? project.title_en : project.title_fr;
  const description = lang === 'en' && project.context_en ? project.context_en : project.context_fr;

  return {
    title: `${title} - Marcien B. Nzoussi`,
    description: description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const project = await getProjectBySlug(slug);
  const dict = await getDictionary(lang as any);

  if (!project) {
    notFound();
  }

  // Format the status
  const statusConfig = {
    'completed': { label: dict.project.status_completed || "Terminé", variant: "default" as const },
    'in_progress': { label: dict.project.status_in_progress || "En cours", variant: "secondary" as const },
    'planned': { label: "Planifié", variant: "outline" as const },
  };
  const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig['completed'];

  return (
    <>
      {/* SECTION HEADER - Clair */}
      <section className="bg-background pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <Link href={`/${lang}/projets`} className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-4 text-gray-600 hover:text-foreground hover:bg-black/5" })}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {dict.project.back_to_projects}
            </Link>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge variant={status.variant}>{status.label}</Badge>
                {project.domains.map((domain) => (
                  <DomainBadge key={domain} domain={domain as DomainType} dict={dict} />
                ))}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight tracking-tight">
                {lang === 'en' && project.title_en ? project.title_en : project.title_fr}
              </h1>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION CONTENU - Sombre */}
      <section className="dark-section bg-[#121212] py-16 sm:py-24 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Contenu détaillé */}
            <div className="bg-[#1A1A1A] border-transparent p-8 sm:p-12 rounded-[2rem] shadow-xl space-y-12">
            
            {(lang === 'en' && project.context_en ? project.context_en : project.context_fr) && (
              <section className="space-y-4">
                <h2 className="text-xl font-heading font-semibold text-[#F5F5F7] flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">1</div>
                  {dict.project.context}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {lang === 'en' && project.context_en ? project.context_en : project.context_fr}
                </p>
              </section>
            )}

            {(lang === 'en' && project.approach_en ? project.approach_en : project.approach_fr) && (
              <section className="space-y-4">
                <h2 className="text-xl font-heading font-semibold text-[#F5F5F7] flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">2</div>
                  {dict.project.approach}
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {lang === 'en' && project.approach_en ? project.approach_en : project.approach_fr}
                </p>
              </section>
            )}

            {(lang === 'en' && project.result_en ? project.result_en : project.result_fr) && (
              <section className="space-y-4">
                <h2 className="text-xl font-heading font-semibold text-[#F5F5F7] flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">3</div>
                  {dict.project.results}
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {lang === 'en' && project.result_en ? project.result_en : project.result_fr}
                </p>
              </section>
            )}

            {project.gallery && project.gallery.length > 0 && (
              <section className="space-y-6 pt-8 border-t border-white/5">
                <h2 className="text-xl font-heading font-semibold text-[#F5F5F7] flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">4</div>
                  {lang === 'en' ? "Gallery & Visuals" : "Galerie & Preuves visuelles"}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {project.gallery.map((img: any, index: number) => (
                    <div key={index} className="space-y-3 group">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
                        {/* On utilise une balise img native ici pour éviter les erreurs Next/Image si l'image vient d'une source non configurée (ex: anciens fichiers locaux) */}
                        <img 
                          src={img.url} 
                          alt={(lang === 'en' && img.caption_en ? img.caption_en : img.caption_fr) || `Image ${index + 1}`} 
                          className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      {(lang === 'en' && img.caption_en ? img.caption_en : img.caption_fr) && (
                        <p className="text-sm text-gray-400 text-center italic">
                          {lang === 'en' && img.caption_en ? img.caption_en : img.caption_fr}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION LIENS */}
            {project.links && project.links.length > 0 && (
              <section className="space-y-6 pt-8 border-t border-white/5">
                <h2 className="text-xl font-heading font-semibold text-[#F5F5F7] flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    {project.gallery && project.gallery.length > 0 ? '5' : '4'}
                  </div>
                  {lang === 'en' ? "Associated Links" : "Liens associés"}
                </h2>
                
                <div className="flex flex-wrap gap-4">
                  {project.links.map((link: any, idx: number) => {
                    // Try to extract domain for better styling/icons if wanted
                    const isGithub = link.url.toLowerCase().includes('github.com');
                    
                    return (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 overflow-hidden rounded-xl bg-[#2A2A2A] text-[#F5F5F7] font-medium transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-95 shadow-lg"
                      >
                        {isGithub ? (
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        )}
                        {(lang === 'en' && link.label_en ? link.label_en : link.label_fr) || (isGithub ? dict.project.github : dict.project.view_live)}
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
