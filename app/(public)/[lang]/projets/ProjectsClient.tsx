"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/profile/ProjectCard";
import { DomainType } from "@/components/profile/DomainBadge";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { GsapReveal } from "@/components/animations/GsapReveal";
import { Project } from "@/lib/types";

export default function ProjectsClient({ projects, lang, dict }: { projects: Project[], lang: string, dict: any }) {
  const [activeFilter, setActiveFilter] = useState<DomainType | "all">("all");

  const domains: { value: DomainType | "all", label: string }[] = [
    { value: "all", label: lang === 'en' ? "All projects" : "Tous les projets" },
    { value: "surete_fonctionnement", label: dict.domains.surete_fonctionnement },
    { value: "electronique", label: dict.domains.electronique },
    { value: "automatisme", label: dict.domains.automatisme },
    { value: "informatique_ia", label: dict.domains.informatique_ia },
  ];

  const filteredProjects = projects.filter(project => {
    if (activeFilter === "all") return true;
    return project.domains.includes(activeFilter);
  });

  return (
    <>
      {/* SECTION HEADER - Clair */}
      <section className="bg-background min-h-[50vh] flex flex-col justify-center py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GsapReveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start max-w-7xl mx-auto">
            
            <div className="lg:col-span-4 flex lg:justify-end">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading italic font-light text-foreground tracking-tight lg:text-right">
                {dict.nav.projects}
              </h1>
            </div>

            <div className="hidden lg:block lg:col-span-1">
              <div className="w-[2px] h-full min-h-[150px] bg-primary mx-auto"></div>
            </div>
            <div className="block lg:hidden w-full h-[2px] bg-primary my-4"></div>

            <div className="lg:col-span-7">
              <p className="font-sans text-[18px] sm:text-[20px] leading-[1.8] text-gray-700 font-light mb-6">
                {lang === 'en' 
                  ? "Explore my case studies and technical accomplishments. These projects reflect my ability to design robust solutions, from hardware architecture to software logic." 
                  : "Explorez mes études de cas et réalisations techniques. Ces projets reflètent ma capacité à concevoir des solutions robustes, de l'architecture matérielle à la logique logicielle."}
              </p>
            </div>
          </GsapReveal>
        </div>
      </section>

      {/* SECTION PROJETS - Sombre */}
      <section className="dark-section bg-[#121212] py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-12">

            <GsapReveal>
              <div className="flex flex-wrap gap-3 pt-4">
                {domains.map((domain) => (
                  <Badge 
                    key={domain.value}
                    variant={activeFilter === domain.value ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-1.5 text-sm transition-colors ${
                      activeFilter !== domain.value ? "hover:bg-primary/10 hover:text-primary" : ""
                    }`}
                    onClick={() => setActiveFilter(domain.value)}
                  >
                    {domain.label}
                  </Badge>
                ))}
              </div>
            </GsapReveal>

            <GsapReveal key={activeFilter} delay={0.2} stagger={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/${lang}/projets/${project.slug}`} className="block h-full">
                  <ProjectCard 
                    title={lang === 'en' && project.title_en ? project.title_en : project.title_fr}
                    description={lang === 'en' && project.context_en ? project.context_en : (project.context_fr || "")}
                    status={project.status as any}
                    domains={project.domains as DomainType[]}
                    dict={dict}
                  />
                </Link>
              ))}
              
              {filteredProjects.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  {lang === 'en' ? "No projects found for this domain." : "Aucun projet trouvé pour ce domaine."}
                </div>
              )}
            </GsapReveal>

          </div>
        </div>
      </section>
    </>
  );
}
