import { Card, CardContent } from "@/components/ui/card";
import { DomainBadge, DomainType } from "./DomainBadge";

type SkillCardProps = {
  name: string;
  domain?: DomainType;
};

export function SkillCard({ name, domain }: SkillCardProps) {
  return (
    <Card className="bg-secondary/40 border-transparent rounded-[2rem] hover:bg-secondary/80 transition-all duration-300 group hover:-translate-y-1 hover:shadow-md hover:scale-[1.01] cursor-default overflow-hidden">
      <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-medium text-foreground group-hover:text-primary transition-colors">{name}</span>
        {domain && <DomainBadge domain={domain} />}
      </CardContent>
    </Card>
  );
}
