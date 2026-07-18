import { projects } from "@/lib/data/seed";
import { notFound } from "next/navigation";
import { DomainBadge, DomainType } from "@/components/profile/DomainBadge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Projet non trouvé" };
  
  return {
    title: `${project.title_fr} - Marcien B. Nzoussi`,
    description: project.context_fr,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Format the status
  const statusConfig = {
    'completed': { label: "Terminé", variant: "default" as const },
    'in_progress': { label: "En cours", variant: "secondary" as const },
    'planned': { label: "Planifié", variant: "outline" as const },
  };
  const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig['completed'];

  return (
    <>
      {/* SECTION HEADER - Clair */}
      <section className="bg-background pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <Link href="/projets" className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-4 text-foreground/70 hover:text-foreground hover:bg-black/5" })}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux projets
            </Link>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge variant={status.variant}>{status.label}</Badge>
                {project.domains.map((domain) => (
                  <DomainBadge key={domain} domain={domain as DomainType} />
                ))}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight tracking-tight">
                {project.title_fr}
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
            
            {project.context_fr && (
              <section className="space-y-4">
                <h2 className="text-xl font-heading font-semibold text-[#F5F5F7] flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">1</div>
                  Contexte
                </h2>
                <p className="text-[#F5F5F7]/70 leading-relaxed">
                  {project.context_fr}
                </p>
              </section>
            )}

            {project.approach_fr && (
              <section className="space-y-4">
                <h2 className="text-xl font-heading font-semibold text-[#F5F5F7] flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">2</div>
                  Démarche
                </h2>
                <p className="text-[#F5F5F7]/70 leading-relaxed whitespace-pre-line">
                  {project.approach_fr}
                </p>
              </section>
            )}

            {project.result_fr && (
              <section className="space-y-4">
                <h2 className="text-xl font-heading font-semibold text-[#F5F5F7] flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">3</div>
                  Résultat
                </h2>
                <p className="text-[#F5F5F7]/70 leading-relaxed whitespace-pre-line">
                  {project.result_fr}
                </p>
              </section>
            )}

            {project.gallery && project.gallery.length > 0 && (
              <section className="space-y-6 pt-8 border-t border-white/5">
                <h2 className="text-xl font-heading font-semibold text-[#F5F5F7] flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">4</div>
                  Galerie & Preuves visuelles
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.gallery.map((img, index) => (
                    <div key={index} className="space-y-3 group">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
                        <Image 
                          src={img.src} 
                          alt={img.description} 
                          fill 
                          className="object-contain sm:object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <p className="text-sm text-[#F5F5F7]/50 font-light leading-relaxed px-1">
                        {img.description}
                      </p>
                    </div>
                  ))}
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
