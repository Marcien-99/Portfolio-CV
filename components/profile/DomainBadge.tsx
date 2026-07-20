import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Cpu, Settings, Code } from "lucide-react";

export type DomainType = "surete_fonctionnement" | "electronique" | "automatisme" | "informatique_ia";

type DomainBadgeProps = {
  domain: DomainType;
};

const domainConfig = {
  surete_fonctionnement: { label: "Sûreté de fonctionnement", icon: ShieldAlert, color: "bg-black text-white border-transparent [.dark-section_&]:bg-white [.dark-section_&]:text-black" },
  electronique: { label: "Électronique", icon: Cpu, color: "bg-black text-white border-transparent [.dark-section_&]:bg-white [.dark-section_&]:text-black" },
  automatisme: { label: "Automatisme", icon: Settings, color: "bg-black text-white border-transparent [.dark-section_&]:bg-white [.dark-section_&]:text-black" },
  informatique_ia: { label: "Informatique & IA", icon: Code, color: "bg-black text-white border-transparent [.dark-section_&]:bg-white [.dark-section_&]:text-black" },
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
