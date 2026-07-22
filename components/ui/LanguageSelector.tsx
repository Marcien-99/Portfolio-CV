"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = pathname?.startsWith('/en') ? 'EN' : 'FR';

  const switchLanguage = (lang: "FR" | "EN") => {
    if (lang === currentLang) return;
    const newLang = lang.toLowerCase();
    
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;

    const oldPrefix = `/${currentLang.toLowerCase()}`;
    if (pathname?.startsWith(oldPrefix)) {
      router.push(pathname.replace(oldPrefix, `/${newLang}`));
    } else {
      router.push(`/${newLang}${pathname}`);
    }
  };

  return (
    <div className="flex bg-secondary/50 rounded-full p-1 border border-border/50">
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-full px-3 py-1 h-7 text-xs font-medium transition-all ${currentLang === "FR" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => switchLanguage("FR")}
      >
        FR
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-full px-3 py-1 h-7 text-xs font-medium transition-all ${currentLang === "EN" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => switchLanguage("EN")}
      >
        EN
      </Button>
    </div>
  );
}
