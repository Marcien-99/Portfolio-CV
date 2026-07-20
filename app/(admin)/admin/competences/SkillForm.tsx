'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createSkill, updateSkill } from "@/lib/actions/skills"
import { SkillCategory } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

type SkillFormProps = {
  categories: SkillCategory[]
  initialData?: any
}

export function SkillForm({ categories, initialData }: SkillFormProps) {
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
        ? await updateSkill(initialData.id, formData)
        : await createSkill(formData)

      if (result?.error) {
        setError(result.error)
        if (result.details) setErrorDetails(result.details)
      } else if (result?.success) {
        router.push('/admin/competences')
      }
    })
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link 
          href="/admin/competences" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-tight mt-4">
          {isEditing ? "Modifier la compétence" : "Nouvelle compétence"}
        </h1>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm space-y-2">
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

        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name_fr">Nom (Français) *</Label>
              <Input 
                id="name_fr" 
                name="name_fr" 
                required 
                defaultValue={initialData?.name_fr || ''}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="name_en">Nom (Anglais) *</Label>
              <Input 
                id="name_en" 
                name="name_en" 
                required 
                defaultValue={initialData?.name_en || ''}
                className="bg-background"
              />
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="en_auto_generated" 
                  name="en_auto_generated"
                  defaultChecked={initialData ? initialData.en_auto_generated : true}
                  className="rounded border-border/50 text-primary bg-background"
                />
                <Label htmlFor="en_auto_generated" className="text-xs font-normal text-muted-foreground cursor-pointer">
                  Traduction automatique
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="category_id">Catégorie *</Label>
              <select 
                id="category_id" 
                name="category_id" 
                required
                defaultValue={initialData?.category_id || ''}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Sélectionner une catégorie</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name_fr}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="level">Niveau (0-100) - Optionnel</Label>
              <Input 
                id="level" 
                name="level" 
                type="number" 
                min="0" 
                max="100"
                defaultValue={initialData?.level || ''}
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Label>Domaines associés</Label>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'surete_fonctionnement', label: 'Sûreté de fonctionnement' },
                { id: 'electronique', label: 'Électronique' },
                { id: 'automatisme', label: 'Automatisme' },
                { id: 'informatique_ia', label: 'Informatique / IA' },
              ].map((domain) => (
                <label key={domain.id} className="flex items-center gap-2 cursor-pointer p-2 border border-border/10 rounded-lg hover:bg-secondary/50 transition-colors">
                  <input 
                    type="checkbox" 
                    name="domains" 
                    value={domain.id}
                    defaultChecked={initialData?.domains?.includes(domain.id)}
                    className="rounded border-border/50 text-primary bg-background"
                  />
                  <span className="text-sm font-medium">{domain.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border/10">
            <Label htmlFor="status">Statut de publication</Label>
            <select 
              id="status" 
              name="status" 
              defaultValue={initialData?.status || 'draft'}
              className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="draft">Brouillon (Masqué)</option>
              <option value="published">Publié (Visible)</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" variant="ghost" onClick={() => router.push('/admin/competences')} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Enregistrer' : 'Créer la compétence'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
