import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";

type ExperienceCardProps = {
  title: string;
  company: string;
  location?: string;
  period: string;
  description: string;
};

export function ExperienceCard({ title, company, location, period, description }: ExperienceCardProps) {
  return (
    <Card className="bg-secondary/30 border-transparent rounded-[2rem] hover:bg-secondary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.01] overflow-hidden">
      <CardHeader className="pb-3 pt-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-heading text-foreground">{title}</CardTitle>
            <div className="text-primary font-medium mt-1">{company}</div>
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground whitespace-nowrap">
            <div className="flex items-center gap-1.5 justify-start sm:justify-end">
              <Calendar className="w-4 h-4" />
              {period}
            </div>
            {location && (
              <div className="flex items-center gap-1.5 justify-start sm:justify-end">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">{description}</p>
      </CardContent>
    </Card>
  );
}
