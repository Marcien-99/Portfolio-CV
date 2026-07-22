"use client";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Download, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

interface HeaderProps {
  lang: string;
  dict: any;
}

export function Header({ lang, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <header 
        className={`pointer-events-auto w-full max-w-5xl rounded-full transition-all duration-500 border ${
          scrolled 
            ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-lg py-2" 
            : "bg-background/20 backdrop-blur-sm border-transparent py-4"
        }`}
      >
        <div className="px-4 sm:px-6 flex items-center justify-between">
          
          {/* === GAUCHE : Logo === */}
          <div className="flex justify-start">
            <Link href="/" className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
              MB<span className="text-primary">.N</span>
            </Link>
          </div>
          
          {/* === CENTRE : Navigation (Desktop uniquement) === */}
          <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium text-foreground/80">
            <Link href={`/${lang}/a-propos`} className="hover:text-primary hover:-translate-y-px transition-all">{dict.nav.about}</Link>
            <Link href={`/${lang}/competences`} className="hover:text-primary hover:-translate-y-px transition-all">{dict.nav.skills}</Link>
            <Link href={`/${lang}/experiences`} className="hover:text-primary hover:-translate-y-px transition-all">{dict.nav.experiences}</Link>
            <Link href={`/${lang}/projets`} className="hover:text-primary hover:-translate-y-px transition-all">{dict.nav.projects}</Link>
            <Link href={`/${lang}/contact`} className="hover:text-primary hover:-translate-y-px transition-all">{dict.nav.contact}</Link>
          </nav>

          {/* === DROITE : Outils et Mobile Menu === */}
          <div className="flex justify-end items-center gap-3">
            <LanguageSelector />
            
            <Button size="sm" className="rounded-full gap-2 font-medium">
              <Download className="w-4 h-4 hidden sm:block" />
              <span className="hidden sm:inline">CV</span>
              <Download className="w-4 h-4 sm:hidden" />
            </Button>

            {/* Menu Hamburger (Mobile) */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger render={
                  <Button variant="ghost" size="icon" className="rounded-full text-foreground hover:bg-background/50">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                } />
                <SheetContent side="right" className="w-[300px] p-6 bg-background/95 backdrop-blur-xl border-border/10">
                  <SheetHeader className="text-left mb-8 mt-4">
                    <SheetTitle className="font-heading text-2xl font-bold tracking-tight text-foreground">
                      {dict.nav.navigation}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-6 text-lg font-medium text-foreground/80 px-2">
                    <SheetClose nativeButton={false} render={<Link href={`/${lang}`} className="hover:text-primary transition-colors">{dict.nav.home}</Link>} />
                    <SheetClose nativeButton={false} render={<Link href={`/${lang}/a-propos`} className="hover:text-primary transition-colors">{dict.nav.about}</Link>} />
                    <SheetClose nativeButton={false} render={<Link href={`/${lang}/experiences`} className="hover:text-primary transition-colors">{dict.nav.experience}</Link>} />
                    <SheetClose nativeButton={false} render={<Link href={`/${lang}/competences`} className="hover:text-primary transition-colors">{dict.nav.skills}</Link>} />
                    <SheetClose nativeButton={false} render={<Link href={`/${lang}/projets`} className="hover:text-primary transition-colors">{dict.nav.projects}</Link>} />
                    <SheetClose nativeButton={false} render={<Link href={`/${lang}/contact`} className="text-primary hover:opacity-80 transition-opacity font-semibold">{dict.nav.contact}</Link>} />
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </header>
    </div>
  );
}
