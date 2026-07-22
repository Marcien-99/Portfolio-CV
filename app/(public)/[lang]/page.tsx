import { Button, buttonVariants } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSkillCategories, getExperiences, getActivePhoto, getProjects } from "@/lib/api/content";
import { getSiteSettings } from "@/lib/actions/settings";
import { GsapReveal } from "@/components/animations/GsapReveal";
import { getDictionary, Locale } from "@/lib/i18n/dictionaries";

export default async function Home(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  
  const experiences = await getExperiences();
  const skillCategories = await getSkillCategories();
  const projects = await getProjects();
  const currentExperience = experiences.find(e => e.end_date === null || e.end_date === undefined) || experiences[0] || { company: '...' };
  const profilePhoto = await getActivePhoto() || "/Profil.jpg";
  const settings = await getSiteSettings();

  const heroExperience = settings.hero_experience || "3+";
  const heroLocation = settings.hero_location || "Paris, FR";
  const projectsMode = settings.hero_projects_mode || "auto";
  const projectsManual = settings.hero_projects_manual || "12";
  const projectsCount = projectsMode === "auto" ? projects.length : projectsManual;

  const heroTitle = lang === 'en' && settings.hero_title_en 
    ? settings.hero_title_en 
    : (settings.hero_title_fr || "Ingénieur **Sûreté de Fonctionnement** & Développement");

  const renderHeroTitle = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="font-semibold not-italic text-primary">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section - Dual Tone Light Background */}
      <section className="relative min-h-[90dvh] flex items-center pt-20 pb-12 overflow-hidden bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Informations principales (Gauche) */}
            <GsapReveal stagger={0.1} delay={0.2} className="w-full md:w-3/5 text-center md:text-left">
              <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-heading font-extrabold text-foreground leading-[1.05] tracking-tighter mb-4">
                Marcien B.<br/>Nzoussi
              </h1>
              {/* Titre pro façon éditorial */}
              <div className="text-2xl sm:text-3xl lg:text-4xl text-gray-700 font-light italic mb-6">
                {renderHeroTitle(heroTitle)}
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link href={`/${lang}/projets`} className={buttonVariants({ size: "lg", className: "rounded-none px-8 text-base shadow-lg hover:-translate-y-1 hover:scale-[1.03] transition-all" })}>
                  {dict.hero.view_projects}
                </Link>
                <Link href={`/${lang}/a-propos`} className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-none px-8 text-base bg-transparent hover:-translate-y-1 hover:scale-[1.03] transition-all" })}>
                  {dict.hero.learn_more}
                </Link>
                {/* Le bouton télécharger est visible partout */}
                <Button variant="secondary" size="lg" className="rounded-none px-8 text-base flex w-full sm:w-auto mt-2 sm:mt-0 gap-2 hover:-translate-y-1 hover:scale-[1.03] transition-all">
                  <Download className="w-4 h-4" />
                  {dict.hero.download_cv}
                </Button>
              </div>
            </GsapReveal>

            {/* Emplacement Photo de profil Circulaire (Droite) */}
            <GsapReveal direction="left" className="w-full md:w-2/5 flex justify-center md:justify-end relative group">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[450px] rounded-full bg-secondary/60 flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden shadow-2xl group-hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] transition-all duration-500">
                <Image 
                  src={profilePhoto}
                  alt="Marcien B. Nzoussi"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Overlay décoratif type plan d'architecte */}
                <div className="absolute inset-0 border-[2px] border-primary/20 m-4 rounded-full pointer-events-none z-10" />
              </div>
            </GsapReveal>
            
          </div>
        </div>
      </section>

      {/* Raccourcis vers les sections - Dark Section */}
      <section className="dark-section py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4 text-[#F5F5F7]">{lang === 'en' ? 'Overview' : "Vue d'ensemble"}</h2>
            <div className="w-16 h-1 bg-primary mx-auto md:mx-0"></div>
          </div>
          <GsapReveal stagger={0.15} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Link href={`/${lang}/competences`} className="group block bg-[#1A1A1A] rounded-[2rem] p-8 hover:bg-[#222] transition-all hover:-translate-y-2">
              <h3 className="font-heading font-semibold text-2xl mb-3 text-[#F5F5F7]">{dict.nav.skills}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{lang === 'en' ? 'Discover my skills in ' : 'Découvrez mes compétences en '}{skillCategories.map(c => lang === 'en' && c.name_en ? c.name_en : c.name_fr).join(", ").substring(0, 50)}...</p>
            </Link>
            <Link href={`/${lang}/experiences`} className="group block bg-[#1A1A1A] rounded-[2rem] p-8 hover:bg-[#222] transition-all hover:-translate-y-2">
              <h3 className="font-heading font-semibold text-2xl mb-3 text-[#F5F5F7]">{lang === 'en' ? 'Background' : 'Parcours'}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{lang === 'en' ? 'Glimpse of my latest experiences, especially at ' : 'Aperçu de mes dernières expériences, notamment chez '}{currentExperience.company}.</p>
            </Link>
            <Link href={`/${lang}/projets`} className="group block bg-[#1A1A1A] rounded-[2rem] p-8 hover:bg-[#222] transition-all hover:-translate-y-2">
              <h3 className="font-heading font-semibold text-2xl mb-3 text-[#F5F5F7]">{lang === 'en' ? 'Accomplishments' : 'Réalisations'}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{lang === 'en' ? 'Check out my case studies and cross-functional technical projects.' : 'Consultez mes études de cas et projets techniques transversaux.'}</p>
            </Link>
          </GsapReveal>
        </div>
      </section>
    </div>
  );
}
