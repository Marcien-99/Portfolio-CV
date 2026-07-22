'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createExperience, updateExperience } from "@/lib/actions/experiences"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

export function ExperienceForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any>(null)
  
  const isEditing = !!initialData

  async function handleSubmit(formData: FormData) {
    setError(null)
    setErrorDetails(null)
    
    startTransition(async () => {
      const result = isEditing 
        ? await updateExperience(initialData.id, formData)
        : await createExperience(formData)

      if (result?.error) {
        setError(result.error)
        if (result.details) setErrorDetails(result.details)
      } else if (result?.success) {
        router.push('/admin/experiences')
      }
    })
  }

  return (
    <div className="flex flex-col min-h-full w-full">
      {/* Light Header */}
      <div className="bg-[#F5F5F7] p-10 md:p-16 flex-shrink-0 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-1.5 h-16 bg-primary rounded-full shrink-0"></div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  href="/admin/experiences" 
                  className="inline-flex items-center text-sm font-medium text-[#111111]/50 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour
                </Link>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter italic text-[#111111]">
                {isEditing ? "Modifier l'expérience" : "Nouvelle expérience"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Content */}
      <div className="flex-1 bg-[#121212] p-10 md:p-16 text-white w-full">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {error && (
            <div className="mb-6 p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm space-y-2 shadow-lg">
              <p className="font-semibold">{error}</p>
              {errorDetails && (
                <ul className="list-disc pl-5">
                  {Object.entries(errorDetails).map(([key, errors]) => (
                    <li key={key}><strong>{key}</strong>: {(errors as string[]).join(', ')}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form action={handleSubmit} className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="title_fr" className="text-sm font-medium text-white/70">Titre du poste (Français) *</Label>
                <Input 
                  id="title_fr" 
                  name="title_fr" 
                  required 
                  defaultValue={initialData?.title_fr || ''}
                  className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="title_en" className="text-sm font-medium text-white/70">Titre du poste (Anglais)</Label>
                <Input 
                  id="title_en" 
                  name="title_en" 
                  defaultValue={initialData?.title_en || ''}
                  className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto"
                />
                <div className="flex items-center gap-3 mt-3">
                  <input 
                    type="checkbox" 
                    id="en_auto_generated" 
                    name="en_auto_generated"
                    defaultChecked={initialData ? initialData.en_auto_generated : true}
                    className="w-4 h-4 rounded border-white/20 text-primary bg-[#111111] focus:ring-primary/50"
                  />
                  <Label htmlFor="en_auto_generated" className="text-xs font-normal text-white/50 cursor-pointer">
                    Générer descriptions EN auto (DeepL) plus tard
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="company" className="text-sm font-medium text-white/70">Entreprise *</Label>
                <Input 
                  id="company" 
                  name="company" 
                  required 
                  defaultValue={initialData?.company || ''}
                  className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="location" className="text-sm font-medium text-white/70">Lieu</Label>
                <Input 
                  id="location" 
                  name="location" 
                  defaultValue={initialData?.location || ''}
                  className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="start_date" className="text-sm font-medium text-white/70">Date de début *</Label>
                <Input 
                  id="start_date" 
                  name="start_date" 
                  type="date"
                  required 
                  defaultValue={initialData?.start_date || ''}
                  className="dark-theme-date w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="end_date" className="text-sm font-medium text-white/70">Date de fin (laisser vide si en cours)</Label>
                <Input 
                  id="end_date" 
                  name="end_date" 
                  type="date"
                  defaultValue={initialData?.end_date || ''}
                  className="dark-theme-date w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <Label htmlFor="description_fr" className="text-sm font-medium text-white/70">Description (Français)</Label>
              <Textarea 
                id="description_fr" 
                name="description_fr" 
                rows={4}
                defaultValue={initialData?.description_fr || ''}
                className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description_en" className="text-sm font-medium text-white/70">Description (Anglais)</Label>
              <Textarea 
                id="description_en" 
                name="description_en" 
                rows={4}
                defaultValue={initialData?.description_en || ''}
                className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <Label className="text-sm font-medium text-white/70">Domaines d'expertise sollicités</Label>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'surete_fonctionnement', label: 'Sûreté de fonctionnement' },
                  { id: 'electronique', label: 'Électronique' },
                  { id: 'automatisme', label: 'Automatisme' },
                  { id: 'informatique_ia', label: 'Informatique / IA' },
                ].map((domain) => (
                  <label key={domain.id} className="flex items-center gap-3 cursor-pointer p-4 border border-white/10 rounded-xl bg-[#111111] hover:bg-white/5 hover:border-white/20 transition-all duration-300">
                    <input 
                      type="checkbox" 
                      name="domains" 
                      value={domain.id}
                      defaultChecked={initialData?.domains?.includes(domain.id)}
                      className="w-4 h-4 rounded border-white/20 text-primary bg-transparent focus:ring-primary/50"
                    />
                    <span className="text-sm font-medium text-white/90">{domain.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <Label htmlFor="status" className="text-sm font-medium text-white/70">Statut de publication</Label>
              <select 
                id="status" 
                name="status" 
                defaultValue={initialData?.status || 'draft'}
                className="w-full sm:w-64 px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              >
                <option value="draft">Brouillon (Masqué)</option>
                <option value="published">Publié (Visible)</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-white/5">
              <Button type="button" variant="ghost" onClick={() => router.push('/admin/experiences')} disabled={isPending} className="px-6 py-3 rounded-full text-white/70 hover:text-white hover:bg-[#222222]">
                Annuler
              </Button>
              <Button type="submit" disabled={isPending} className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                <Save className="mr-2 h-5 w-5" />
                {isEditing ? 'Enregistrer' : 'Créer l\'expérience'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
