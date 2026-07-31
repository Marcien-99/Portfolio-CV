import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DomainBadge, DomainType } from "./DomainBadge";
import { ArrowRight } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string;
  status: "en_cours" | "termine";
  domains: DomainType[];
  imageUrl?: string;
  dict?: any;
  startDate?: string;
  endDate?: string;
  showDates?: boolean;
};

export function ProjectCard({ title, description, status, domains, imageUrl, dict, startDate, endDate, showDates }: ProjectCardProps) {
  const statusLabel = status === "termine" 
    ? (dict?.project?.status_completed || "Terminé") 
    : (dict?.project?.status_in_progress || "En cours");

  const lang = dict?.nav?.home === 'Home' ? 'en' : 'fr';
  const formatPeriod = () => {
    if (!startDate) return null;
    const formatStr = (d: string) => {
      const [year, month] = d.substring(0, 7).split('-');
      return `${month}/${year}`;
    };
    const start = formatStr(startDate);
    const end = endDate ? formatStr(endDate) : (lang === 'en' ? "Present" : "Présent");
    return `${start} — ${end}`;
  };

  return (
    <Card className="overflow-hidden bg-secondary/30 border-transparent rounded-[2rem] hover:bg-secondary/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.01] group cursor-pointer flex flex-col h-full">
      <div className="h-48 w-full bg-secondary/50 relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-card">
            <div className="w-32 h-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
            <span className="font-heading text-xl text-primary/40 font-bold tracking-wider absolute">PROJET</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={status === "termine" ? "default" : "secondary"} className="shadow-sm">
            {statusLabel}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
        {showDates && startDate && (
          <div className="flex items-center gap-1.5 text-sm font-sans font-bold text-primary mt-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatPeriod()}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow pb-4">
        <p className="text-muted-foreground [.dark-section_&]:text-gray-100 text-sm line-clamp-3">{description}</p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center border-t border-border/10 mt-auto px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {domains.slice(0, 2).map((domain) => (
            <DomainBadge key={domain} domain={domain} dict={dict} />
          ))}
          {domains.length > 2 && <span className="text-xs text-muted-foreground [.dark-section_&]:text-gray-300 self-center">+{domains.length - 2}</span>}
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <ArrowRight className="w-4 h-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
