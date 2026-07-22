import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GsapReveal } from "@/components/animations/GsapReveal";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { getDictionary, Locale } from "@/lib/i18n/dictionaries";
import { getSiteSettings } from "@/lib/actions/settings";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.18-.35 6.5-1.56 6.5-7.16 0-1.5-.5-2.8-1.4-3.8.1-.3.6-1.8-.1-3.8 0 0-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 3.8 5 4.2 5 4.2c-.7 2-.2 3.5-.1 3.8-0.9 1-1.4 2.3-1.4 3.8 0 5.6 3.3 6.8 6.5 7.16a4.8 4.8 0 0 0-1 3.02V22" />
      <path d="M9 20c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export const metadata = {
  title: "Contact - Marcien B. Nzoussi",
  description: "Me contacter",
};

export default async function ContactPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  const settings = await getSiteSettings();
  
  const email = settings.contact_email || "marcienbalouboula@gmail.com";
  const phone = settings.contact_phone || "+33 6 52 14 26 45";
  const address = settings.contact_address || "Paris, France";
  const linkedin = settings.social_linkedin || "https://www.linkedin.com/in/marcien-balouboula-nzoussi-b37970215";
  const github = settings.social_github || "https://github.com/Marcien-99";

  return (
    <>
      {/* SECTION HEADER - Clair */}
      <section className="bg-background min-h-[50vh] flex flex-col justify-center py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GsapReveal className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            {/* Colonne Gauche : Titre Dramatique */}
            <div className="w-full md:w-1/2 md:pr-8 md:border-r-2 md:border-primary/20">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light italic text-foreground leading-tight tracking-tight mb-6">
                {lang === 'en' ? "Let's work " : "Travaillons "}<br/><span className="font-semibold text-primary not-italic">{lang === 'en' ? "Together" : "Ensemble"}</span>
              </h1>
            </div>
            
            {/* Colonne Droite : Intro */}
            <div className="w-full md:w-1/2 text-lg text-muted-foreground leading-relaxed">
              <p>
                {lang === 'en' 
                  ? "Do you have a project in mind, a need in Reliability Engineering or software development? Leave me a message, and let's discuss how we can collaborate."
                  : "Vous avez un projet en tête, un besoin en Sûreté de Fonctionnement ou en développement logiciel ? Laissez-moi un message, et discutons de la façon dont nous pouvons collaborer."}
              </p>
            </div>
          </GsapReveal>
        </div>
      </section>

      {/* SECTION FORMULAIRE & INFOS - Sombre */}
      <section className="dark-section py-24 bg-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GsapReveal delay={0.2} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
            
            {/* Infos de contact */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                <h3 className="font-heading text-2xl text-[#F5F5F7] font-semibold">{lang === 'en' ? 'My Details' : 'Mes coordonnées'}</h3>
                <div className="space-y-4">
                  <a href={`mailto:${email}`} className="flex items-center gap-4 text-gray-300 hover:text-primary transition-colors group">
                    <div className="w-12 h-12 rounded-[1rem] bg-[#1A1A1A] flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5 group-hover:border-primary/50">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span>{email}</span>
                  </a>
                  <div className="flex items-center gap-4 text-gray-300 group">
                    <div className="w-12 h-12 rounded-[1rem] bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span>{phone}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-300 group">
                    <div className="w-12 h-12 rounded-[1rem] bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span>{address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-heading text-2xl text-[#F5F5F7] font-semibold">{lang === 'en' ? 'Socials' : 'Réseaux'}</h3>
                <div className="flex gap-4">
                  <Link href={linkedin} target="_blank" className="w-12 h-12 rounded-[1rem] bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary/50 hover:scale-110 transition-all">
                    <LinkedinIcon className="w-5 h-5" />
                  </Link>
                  <Link href={github} target="_blank" className="w-12 h-12 rounded-[1rem] bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary/50 hover:scale-110 transition-all">
                    <GithubIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Formulaire visuel */}
            <div className="lg:col-span-3">
              <div className="bg-[#1A1A1A] border border-white/5 p-8 sm:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
                {/* Petit éclat de lumière design dans le coin */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
                
                <form className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-gray-200 text-sm tracking-wide uppercase font-mono">{lang === 'en' ? 'First Name' : 'Prénom'}</Label>
                      <Input id="firstName" placeholder="John" className="bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:ring-1" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-gray-200 text-sm tracking-wide uppercase font-mono">{lang === 'en' ? 'Last Name' : 'Nom'}</Label>
                      <Input id="lastName" placeholder="Doe" className="bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:ring-1" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-200 text-sm tracking-wide uppercase font-mono">{lang === 'en' ? 'Email Address' : 'Adresse e-mail'}</Label>
                    <Input id="email" type="email" placeholder="john.doe@exemple.com" className="bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:ring-1" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-gray-200 text-sm tracking-wide uppercase font-mono">{lang === 'en' ? 'Subject' : 'Sujet'}</Label>
                    <Input id="subject" placeholder={lang === 'en' ? "Collaboration proposal..." : "Proposition de collaboration..."} className="bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:ring-1" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-gray-200 text-sm tracking-wide uppercase font-mono">{lang === 'en' ? 'Message' : 'Message'}</Label>
                    <Textarea 
                      id="message" 
                      placeholder={lang === 'en' ? "Tell me more about your needs..." : "Dites-m'en plus sur votre besoin..."} 
                      className="bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 min-h-[160px] rounded-xl focus-visible:ring-primary focus-visible:ring-1 resize-none"
                    />
                  </div>

                  <Button type="button" size="lg" className="w-full sm:w-auto px-10 h-14 rounded-full text-base font-medium shadow-lg hover:-translate-y-1 transition-transform group">
                    {lang === 'en' ? 'Send Message' : 'Envoyer le message'}
                    <div className="ml-2 w-2 h-2 rounded-full bg-white group-hover:animate-ping" />
                  </Button>
                </form>
              </div>
            </div>

          </GsapReveal>
        </div>
      </section>
    </>
  );
}
