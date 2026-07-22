import { getEducations } from "@/lib/api/content";
import { Badge } from "@/components/ui/badge";
import { GsapReveal } from "@/components/animations/GsapReveal";
import { getDictionary, Locale } from "@/lib/i18n/dictionaries";

export const metadata = {
  title: "À propos - Marcien B. Nzoussi",
  description: "Mon parcours et mes diplômes",
};

export default async function AboutPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  const educations = await getEducations();
  return (
    <>
      {/* SECTION A PROPOS - Le Manifeste Personnel */}
      <section className="bg-background min-h-screen flex flex-col justify-center py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GsapReveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start max-w-7xl mx-auto">
            
            {/* Colonne Gauche : Titre Dramatique */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading italic font-light text-foreground tracking-tight lg:text-right">
                {dict.nav.about}
              </h1>
            </div>

            {/* Ligne Verticale Accent */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="w-[2px] h-full min-h-[200px] bg-primary mx-auto"></div>
            </div>
            {/* Ligne Horizontale Mobile */}
            <div className="block lg:hidden w-full h-[2px] bg-primary my-4"></div>

            {/* Colonne Droite : Texte de présentation */}
            <div className="lg:col-span-7 prose prose-lg dark:prose-invert max-w-none">
              <p className="font-sans text-[18px] sm:text-[20px] leading-[1.8] text-gray-700 font-light mb-6">
                {lang === 'en' 
                  ? "I am an Engineer specializing in system reliability, software development, and electronic design. My interdisciplinary background allows me to approach complex technical problem-solving with a comprehensive perspective, ranging from hardware design (IoT, embedded systems) to software application development (Python, Next.js)."
                  : "Je suis un Ingénieur spécialisé en fiabilité des systèmes, développement logiciel et conception électronique. Ma formation interdisciplinaire me permet d'aborder la résolution de problèmes techniques complexes avec une vision globale, allant de la conception matérielle (IoT, systèmes embarqués) jusqu'au développement d'applications logicielles (Python, Next.js)."}
              </p>
              <p className="font-sans text-[18px] sm:text-[20px] leading-[1.8] text-gray-700 font-light">
                {lang === 'en' ? (
                  <>
                    I have a strong inclination towards <strong className="text-foreground font-semibold">Reliability, Availability, Maintainability, and Safety (RAMS)</strong>, aiming to ensure the dependability of industrial systems. Through my various experiences, I have developed innovative methods combining classical engineering with modern digital technologies.
                  </>
                ) : (
                  <>
                    J'ai un fort attrait pour la <strong className="text-foreground font-semibold">sûreté de fonctionnement</strong>, visant à garantir la fiabilité, la disponibilité, la maintenabilité et la sécurité (RAMS) des systèmes industriels. À travers mes diverses expériences, j'ai développé des méthodes innovantes combinant l'ingénierie classique et les technologies numériques modernes.
                  </>
                )}
              </p>
            </div>
            
          </GsapReveal>
        </div>
      </section>

      {/* SECTION FORMATION - Les Fondations */}
      <section className="dark-section bg-[#121212] py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            <GsapReveal className="mb-16">
              <h2 className="text-4xl font-heading font-bold text-[#F5F5F7] tracking-tight">{lang === 'en' ? 'My Education' : 'Mes Formations'}</h2>
            </GsapReveal>
            
            <GsapReveal delay={0.2} stagger={0.15} className="space-y-6">
              {educations.map((edu) => (
                <div key={edu.id} className="group bg-[#1A1A1A] p-8 sm:p-10 rounded-[2rem] flex flex-col sm:flex-row items-start gap-6 hover:-translate-y-1 transition-all duration-300">
                  <div className="sm:w-1/3 flex-shrink-0">
                    <span className="font-mono text-primary text-sm tracking-wider uppercase">
                      {edu.start_date.substring(0,4)} {edu.end_date ? `— ${edu.end_date.substring(0,4)}` : ""}
                    </span>
                  </div>
                  <div className="sm:w-2/3">
                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#F5F5F7] mb-2">
                      {lang === 'en' && edu.title_en ? edu.title_en : edu.title_fr}
                    </h3>
                    <p className="font-sans text-gray-400 text-lg mb-4">{edu.institution}{edu.location ? ` • ${edu.location}` : ""}</p>
                    {(lang === 'en' && edu.description_en ? edu.description_en : edu.description_fr) && (
                      <p className="font-sans text-gray-300 leading-relaxed font-light">
                        {lang === 'en' && edu.description_en ? edu.description_en : edu.description_fr}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </GsapReveal>

          </div>
        </div>
      </section>
    </>
  );
}
