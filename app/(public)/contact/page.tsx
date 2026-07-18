import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const metadata = {
  title: "Contact - Marcien B. Nzoussi",
  description: "Me contacter",
};

export default function ContactPage() {
  return (
    <div className="dark-section min-h-screen py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-16">
          
          <section className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl font-heading font-extrabold text-[#F5F5F7] tracking-tight">Contact</h1>
            <p className="text-[#F5F5F7]/70 text-xl font-light leading-relaxed">
              Vous avez un projet ou une opportunité professionnelle ? N'hésitez pas à me laisser un message.
            </p>
          </section>

          <div className="bg-[#1A1A1A] border-transparent p-10 sm:p-14 rounded-[2rem] shadow-2xl">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Votre prénom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Votre nom" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" type="email" placeholder="vous@exemple.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input id="subject" placeholder="Sujet de votre message" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Votre message ici..." 
                className="min-h-[150px]"
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto px-8 rounded-full">
              Envoyer le message
            </Button>
          </form>
        </div>

        </div>
      </div>
    </div>
  );
}
