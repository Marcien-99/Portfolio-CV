"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LanguageSelector() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");

  return (
    <div className="flex bg-secondary/50 rounded-full p-1 border border-border/50">
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-full px-3 py-1 h-7 text-xs font-medium transition-all ${lang === "FR" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => setLang("FR")}
      >
        FR
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-full px-3 py-1 h-7 text-xs font-medium transition-all ${lang === "EN" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => setLang("EN")}
      >
        EN
      </Button>
    </div>
  );
}
