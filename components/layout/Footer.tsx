import { Mail } from "lucide-react";
import Link from "next/link";

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

import { getSiteSettings } from "@/lib/actions/settings";
import { AdminSecretLink } from "./AdminSecretLink";

export async function Footer() {
  const settings = await getSiteSettings();
  
  const email = settings.contact_email || "marcienbalouboula@gmail.com";
  const linkedin = settings.social_linkedin || "https://www.linkedin.com/in/marcien-balouboula-nzoussi-b37970215";
  const github = settings.social_github || "https://github.com/Marcien-99";

  return (
    <footer className="w-full border-t border-border/40 bg-background py-8 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-heading text-lg font-bold">
            <AdminSecretLink>marcien-bn.dev</AdminSecretLink>
          </p>
          <p className="text-sm text-muted-foreground mt-1">© {new Date().getFullYear()} Marcien BALOUBOULA NZOUSSI. Tous droits réservés.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={linkedin} target="_blank" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors">
            <LinkedinIcon className="w-5 h-5" />
          </Link>
          <Link href={github} target="_blank" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors">
            <GithubIcon className="w-5 h-5" />
          </Link>
          <Link href={`mailto:${email}`} className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors">
            <Mail className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
