import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillCard } from "@/components/profile/SkillCard";
import { ExperienceCard } from "@/components/profile/ExperienceCard";
import { ProjectCard } from "@/components/profile/ProjectCard";
import { DomainBadge } from "@/components/profile/DomainBadge";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        <section>
          <h1 className="text-4xl font-heading font-bold mb-4 text-foreground">Design System</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Ce design system implémente l'identité visuelle de <code>marcien-bn.dev</code>. 
            Thème clair exclusif, typographie premium (Space Grotesk & Inter) et accents technologiques (cyan).
          </p>
        </section>

        {/* Section Hero / Photo de profil */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold border-b border-border/50 pb-2">Héros & Photo de profil</h2>
          <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
            {/* Accent décoratif (rappel du cercle rouge de l'image de ref, mais en cyan) */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Emplacement Photo de profil */}
            <div className="flex-shrink-0 relative group cursor-pointer">
              <div className="w-40 h-40 rounded-full border-4 border-background shadow-lg overflow-hidden bg-secondary flex flex-col items-center justify-center text-muted-foreground group-hover:border-primary/50 transition-colors">
                <svg className="w-12 h-12 mb-2 text-primary/40" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                <span className="text-xs font-medium uppercase tracking-wider">Photo 160x160</span>
              </div>
              {/* Badge "En ligne" optionnel mentionné dans le prompt global */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-card shadow-sm animate-pulse" />
            </div>

            {/* Titre et sous-titre */}
            <div className="text-center md:text-left z-10">
              <span className="text-primary font-medium tracking-wider text-sm uppercase mb-2 block">Ingénieur Système & Développeur</span>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground leading-tight mb-4">
                Marcien B. Nzoussi
              </h2>
              <p className="text-muted-foreground max-w-lg text-lg mb-6">
                L'emplacement à gauche accueillera votre portrait professionnel. Ce composant servira d'introduction principale sur le site (Hero Section).
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Button className="rounded-full px-6">Voir les projets</Button>
                <Button variant="outline" className="rounded-full px-6">Me contacter</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Couleurs et Typographie */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold border-b border-border/50 pb-2">Couleurs & Typographie</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-24 h-24 rounded-2xl bg-background border border-border flex items-center justify-center flex-col shadow-sm">
              <span className="text-xs font-medium">Background</span>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-card border border-border flex items-center justify-center flex-col shadow-sm">
              <span className="text-xs font-medium">Card</span>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-col shadow-sm">
              <span className="text-xs font-medium">Primary</span>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center flex-col shadow-sm">
              <span className="text-xs font-medium">Secondary</span>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center flex-col shadow-sm">
              <span className="text-xs font-medium">Muted</span>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div>
              <h1 className="font-heading text-4xl font-bold">Heading 1 (Space Grotesk)</h1>
              <p className="text-muted-foreground text-sm mt-1">Utilisé pour les grands titres de sections.</p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold">Heading 2 (Space Grotesk)</h2>
              <p className="text-muted-foreground text-sm mt-1">Utilisé pour les sous-titres et cartes importantes.</p>
            </div>
            <div>
              <p className="font-sans text-base leading-relaxed text-foreground">
                Corps de texte standard (Inter). Ce texte est utilisé pour les descriptions longues, les paragraphes,
                et globalement pour s'assurer que la lisibilité reste optimale même avec beaucoup de contenu.
              </p>
            </div>
          </div>
        </section>

        {/* Composants de base (Boutons, Inputs) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold border-b border-border/50 pb-2">Composants de base</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Boutons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button>Bouton Primaire</Button>
                <Button variant="secondary">Bouton Secondaire</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Badges Domaines</h3>
              <div className="flex flex-wrap gap-3">
                <DomainBadge domain="surete_fonctionnement" />
                <DomainBadge domain="electronique" />
                <DomainBadge domain="automatisme" />
                <DomainBadge domain="informatique_ia" />
              </div>
            </div>
          </div>
          
          <div className="max-w-md space-y-4 pt-4">
            <h3 className="text-lg font-medium">Formulaire</h3>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="prenom.nom@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Votre message..." rows={4} />
            </div>
            <Button className="w-full">Envoyer le message</Button>
          </div>
        </section>

        {/* Cartes Métier */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold border-b border-border/50 pb-2">Cartes Métier</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-muted-foreground">Skill Card</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkillCard name="Analyse des risques (AMDEC, APR)" domain="surete_fonctionnement" />
              <SkillCard name="Systèmes embarqués (FPGA)" domain="electronique" />
              <SkillCard name="Next.js, Supabase, Tailwind" domain="informatique_ia" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium text-muted-foreground">Experience Card</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExperienceCard 
                title="Ingénieur RAMS"
                company="Faiveley Transport"
                location="Ville-aux-Dames"
                period="Mars - Août 2024"
                description="Amélioration des études de fiabilité prévisionnelle sur des équipements électroniques en tenant compte du retour d'expérience."
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium text-muted-foreground">Project Card</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProjectCard 
                title="Détection de contour pour câblage automobile"
                description="Développement d'une application desktop en Python avec détection de contour sur image de connecteur pour fiabiliser le processus."
                status="termine"
                domains={["informatique_ia", "surete_fonctionnement", "electronique"]}
              />
              <ProjectCard 
                title="marcien-bn.dev"
                description="Portfolio professionnel et générateur de CV intelligent. Architecture Next.js / Supabase."
                status="en_cours"
                domains={["informatique_ia"]}
              />
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
