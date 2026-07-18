import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Cpu, Settings, Code } from "lucide-react";

export type DomainType = "surete_fonctionnement" | "electronique" | "automatisme" | "informatique_ia";

type DomainBadgeProps = {
  domain: DomainType;
};

const domainConfig = {
  surete_fonctionnement: { label: "Sûreté de fonctionnement", icon: ShieldAlert, color: "bg-red-500/10 text-red-500 border-red-500/20" },
  electronique: { label: "Électronique", icon: Cpu, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  automatisme: { label: "Automatisme", icon: Settings, color: "bg-green-500/10 text-green-500 border-green-500/20" },
  informatique_ia: { label: "Informatique & IA", icon: Code, color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
};

export function DomainBadge({ domain }: DomainBadgeProps) {
  const config = domainConfig[domain];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} gap-1.5 py-0.5 px-2 rounded-full font-medium transition-colors`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
