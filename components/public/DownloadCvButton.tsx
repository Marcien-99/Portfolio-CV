"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, FileText, X, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getPublicProfiles } from "@/lib/actions/cv";

interface Profile {
  id: string;
  name: string;
  is_default?: boolean;
  is_public?: boolean;
}

interface DownloadCvButtonProps {
  lang: string;
  label?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  initialProfiles?: Profile[];
  showIconOnlyOnSmall?: boolean;
}

export function DownloadCvButton({
  lang,
  label,
  variant = "secondary",
  size = "sm",
  className = "",
  initialProfiles = [],
  showIconOnlyOnSmall = false,
}: DownloadCvButtonProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(initialProfiles.length === 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      try {
        const data = await getPublicProfiles();
        if (data && data.length > 0) {
          setProfiles(data);
        }
      } catch (e) {
        console.error("Erreur chargement profils publics:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const defaultLabel = lang === "en" ? "Download CV" : "Télécharger CV";
  const buttonText = label || defaultLabel;

  // S'il n'y a qu'un seul profil (ou pendant le chargement initial vide), téléchargement direct
  if (profiles.length <= 1) {
    const targetId = profiles[0]?.id || "standard";
    const targetName = profiles[0]?.name ? `_${profiles[0].name.replace(/\s+/g, "_")}` : "";
    const filename = `CV_Marcien_BALOUBOULA${targetName}_${lang.toUpperCase()}.pdf`;

    return (
      <a
        href={`/api/cv/${targetId}/${lang}`}
        download={filename}
        className={`${buttonVariants({ variant, size })} ${className} gap-2 font-medium transition-all`}
      >
        {showIconOnlyOnSmall ? (
          <>
            <Download className="w-4 h-4 hidden sm:block shrink-0" />
            <span className="hidden sm:inline">{buttonText}</span>
            <Download className="w-4 h-4 sm:hidden shrink-0" />
          </>
        ) : (
          <>
            <Download className="w-4 h-4 shrink-0" />
            <span>{buttonText}</span>
          </>
        )}
      </a>
    );
  }

  // S'il y a 2 profils publics ou plus : ouverture de la modale de sélection
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${buttonVariants({ variant, size })} ${className} gap-2 font-medium transition-all cursor-pointer`}
      >
        {showIconOnlyOnSmall ? (
          <>
            <Download className="w-4 h-4 hidden sm:block shrink-0" />
            <span className="hidden sm:inline">{buttonText}</span>
            <Download className="w-4 h-4 sm:hidden shrink-0" />
          </>
        ) : (
          <>
            <Download className="w-4 h-4 shrink-0" />
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {/* Modale de sélection des profils */}
      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[#18181B] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 text-foreground relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Décoration en arrière-plan */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* En-tête de la modale */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 relative z-10">
              <div>
                <h3 className="font-heading text-xl font-bold text-white tracking-tight">
                  {lang === "en" ? "Download CV" : "Télécharger mon CV"}
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  {lang === "en" 
                    ? "Select the professional profile of your choice:" 
                    : "Sélectionnez le profil professionnel de votre choix :"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                title={lang === "en" ? "Close" : "Fermer"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Liste des profils disponibles */}
            <div className="flex flex-col gap-3 relative z-10 max-h-[60vh] overflow-y-auto pr-1">
              {profiles.map((profile) => {
                const targetName = profile.name ? `_${profile.name.replace(/\s+/g, "_")}` : "";
                const filename = `CV_Marcien_BALOUBOULA${targetName}_${lang.toUpperCase()}.pdf`;
                const displayName = profile.is_default && profile.name === "Standard" 
                  ? (lang === "en" ? "General Profile" : "Profil Général")
                  : profile.name;

                return (
                  <a
                    key={profile.id}
                    href={`/api/cv/${profile.id}/${lang}`}
                    download={filename}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between w-full p-4 rounded-[1.5rem] bg-[#222222] border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white group-hover:text-primary transition-colors text-sm sm:text-base truncate font-heading">
                          CV — {displayName}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {lang === "en" ? "PDF Document • Instant download" : "Document PDF • Téléchargement direct"}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center text-white/50 transition-all ml-2 shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Pied de modale */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 relative z-10 font-mono">
              <span>marcien-bn.dev</span>
              <span>{lang === "en" ? "Generated on demand" : "Généré à la volée"}</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
