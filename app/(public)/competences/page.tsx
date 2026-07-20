import { ItemDomain } from "@/lib/types";
import { getSkillCategories, getSkills } from "@/lib/api/content";
import { SkillCard } from "@/components/profile/SkillCard";
import { DomainType } from "@/components/profile/DomainBadge";
import { GsapReveal } from "@/components/animations/GsapReveal";

export const metadata = {
  title: "Compétences - Marcien B. Nzoussi",
  description: "Mon expertise technique par domaine",
};

// Map DB enum to DomainType used by the badge
const mapDomain = (d: ItemDomain): DomainType => {
  switch (d) {
    case 'surete_fonctionnement': return 'surete_fonctionnement';
    case 'informatique_ia': return 'informatique_ia';
    default: return d;
  }
};

export default async function SkillsPage() {
  const skills = await getSkills();
  const skillCategories = await getSkillCategories();
  
  // Trier les catégories par position
  const sortedCategories = [...skillCategories].sort((a, b) => a.position - b.position);

  return (
    <>
      {/* SECTION HEADER - Clair */}
      <section className="bg-background min-h-[50vh] flex flex-col justify-center py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GsapReveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start max-w-7xl mx-auto">
            
            {/* Colonne Gauche : Titre Dramatique */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading italic font-light text-foreground tracking-tight lg:text-right">
                Compétences
              </h1>
            </div>

            {/* Ligne Verticale Accent */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="w-[2px] h-full min-h-[150px] bg-primary mx-auto"></div>
            </div>
            {/* Ligne Horizontale Mobile */}
            <div className="block lg:hidden w-full h-[2px] bg-primary my-4"></div>

            {/* Colonne Droite : Texte de présentation */}
            <div className="lg:col-span-7">
              <p className="font-sans text-[18px] sm:text-[20px] leading-[1.8] text-gray-700 font-light mb-6">
                Cartographie de mon expertise technique sous forme de tableau de bord. Les domaines couverts vont de la sûreté de fonctionnement à l'ingénierie logicielle et matérielle.
              </p>
            </div>
            
          </GsapReveal>
        </div>
      </section>

      {/* SECTION TABLEAU DE BORD - Sombre */}
      <section className="dark-section bg-[#121212] py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24 relative">
            
            {/* Ligne verticale décorative (Dashboard) */}
            <div className="hidden lg:block absolute left-[30%] top-0 bottom-0 w-[1px] bg-white/5"></div>

            {sortedCategories.map((category) => {
              const categorySkills = skills
                .filter(s => s.category_id === category.id)
                .sort((a, b) => a.position - b.position);

              if (categorySkills.length === 0) return null;

              return (
                <GsapReveal key={category.id} stagger={0.05} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative z-10">
                  
                  {/* Côté Gauche : Titre Catégorie */}
                  <div className="lg:col-span-4 lg:text-right pt-2">
                    <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[#F5F5F7]">
                      {category.name_fr}
                    </h2>
                  </div>

                  {/* Côté Droit : Tags / Dashboard */}
                  <div className="lg:col-span-8 flex flex-wrap gap-4">
                    {categorySkills.map((skill) => {
                      return (
                        <div 
                          key={skill.id} 
                          className="inline-flex items-center gap-2 rounded-full transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg cursor-default bg-[#1A1A1A] text-[#F5F5F7] px-5 py-2.5 font-medium text-sm border border-white/10 hover:bg-[#252525]"
                        >
                          {skill.name_fr}
                          {skill.domains.length > 0 && (
                            <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </GsapReveal>
              );
            })}
            
          </div>
        </div>
      </section>
    </>
  );
}
