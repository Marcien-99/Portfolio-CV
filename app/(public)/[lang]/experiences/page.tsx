import { getExperiences } from "@/lib/api/content";
import { ExperienceCard } from "@/components/profile/ExperienceCard";
import { DomainType } from "@/components/profile/DomainBadge";
import { GsapReveal } from "@/components/animations/GsapReveal";
import { getDictionary, Locale } from "@/lib/i18n/dictionaries";

export const metadata = {
  title: "Expériences - Marcien B. Nzoussi",
  description: "Mon parcours professionnel",
};

export default async function ExperiencesPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  
  const experiences = await getExperiences();
  const sortedExperiences = [...experiences].sort((a, b) => 
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <>
      {/* SECTION HEADER - Clair */}
      <section className="bg-background min-h-[50vh] flex flex-col justify-center py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GsapReveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start max-w-7xl mx-auto">
            
            {/* Colonne Gauche : Titre Dramatique */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading italic font-light text-foreground tracking-tight lg:text-right">
                {dict.nav.experiences}
              </h1>
            </div>

            {/* Ligne Verticale Accent */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="w-[2px] h-full min-h-[150px] bg-primary mx-auto"></div>
            </div>
            {/* Ligne Horizontale Mobile */}
            <div className="block lg:hidden w-full h-[2px] bg-primary my-4"></div>

            <div className="lg:col-span-7">
              <p className="font-sans text-[18px] sm:text-[20px] leading-[1.8] text-gray-700 font-light mb-6">
                {lang === 'en' 
                  ? "Discover my professional background, my internships, and the missions I've carried out in companies. Each experience has allowed me to refine my expertise and provide concrete solutions to RAMS and software development challenges." 
                  : "Découvrez mon parcours professionnel, mes stages et les missions que j'ai menées en entreprise. Chaque expérience m'a permis d'affiner mon expertise et d'apporter des solutions concrètes aux défis de la sûreté de fonctionnement et du développement."}
              </p>
            </div>
          </GsapReveal>
        </div>
      </section>

      {/* SECTION TIMELINE - Sombre */}
      <section className="dark-section bg-[#121212] py-24 sm:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Timeline Centrée Alternée */}
          <div className="relative max-w-5xl mx-auto">
            {/* Ligne centrale (Desktop) / Ligne à gauche (Mobile) */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-primary/20 md:-translate-x-1/2"></div>

            <GsapReveal direction="up" stagger={0.2} delay={0.2} className="space-y-16 sm:space-y-24">
              {sortedExperiences.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={exp.id} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} group`}>
                    
                    {/* Point on timeline */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] md:-translate-x-1/2 z-10 group-hover:scale-125 transition-transform duration-300" />
                    
                    {/* Espace vide de l'autre côté sur Desktop */}
                    <div className="hidden md:block md:w-1/2"></div>

                    {/* Contenu de la carte */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-16 lg:pr-24' : 'md:pl-16 lg:pl-24'}`}>
                      <div className="bg-[#1A1A1A] p-8 sm:p-10 rounded-[2rem] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                        <div className="flex flex-col gap-4">
                          <span className="font-mono text-primary text-sm tracking-wider uppercase">
                            {exp.start_date.substring(0, 7)} — {exp.end_date ? exp.end_date.substring(0, 7) : (lang === 'en' ? "Present" : "Présent")}
                          </span>
                          <div>
                            <h3 className="text-2xl font-sans font-bold text-[#F5F5F7] mb-1">
                              {lang === 'en' && exp.title_en ? exp.title_en : exp.title_fr}
                            </h3>
                            <p className="font-sans text-primary/80 text-lg mb-4">{exp.company}{exp.location ? ` • ${exp.location}` : ""}</p>
                            {(lang === 'en' && exp.description_en ? exp.description_en : exp.description_fr) && (
                              <p className="font-sans text-gray-300 leading-relaxed font-light whitespace-pre-wrap">
                                {lang === 'en' && exp.description_en ? exp.description_en : exp.description_fr}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </GsapReveal>
          </div>

        </div>
      </section>
    </>
  );
}
