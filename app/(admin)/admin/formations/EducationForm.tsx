'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createEducation, updateEducation } from "@/lib/actions/educations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

export function EducationForm({ initialData }: { initialData?: any }) {
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
        ? await updateEducation(initialData.id, formData)
        : await createEducation(formData)

      if (result?.error) {
        setError(result.error)
        if (result.details) setErrorDetails(result.details)
      } else if (result?.success) {
        router.push('/admin/formations')
      }
    })
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link 
          href="/admin/formations" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-tight mt-4">
          {isEditing ? "Modifier la formation" : "Nouvelle formation"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="title_fr">Diplôme / Titre (Français) *</Label>
              <Input 
                id="title_fr" 
                name="title_fr" 
                required 
                defaultValue={initialData?.title_fr || ''}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="title_en">Diplôme / Titre (Anglais) *</Label>
              <Input 
                id="title_en" 
                name="title_en" 
                required 
                defaultValue={initialData?.title_en || ''}
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
                  Générer descriptions EN auto (DeepL) plus tard
                </Label>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="institution">Établissement *</Label>
              <Input 
                id="institution" 
                name="institution" 
                required 
                defaultValue={initialData?.institution || ''}
                className="bg-background"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="location">Lieu</Label>
              <Input 
                id="location" 
                name="location" 
                defaultValue={initialData?.location || ''}
                className="bg-background"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="start_date">Date de début *</Label>
              <Input 
                id="start_date" 
                name="start_date" 
                type="date"
                required 
                defaultValue={initialData?.start_date || ''}
                className="bg-background"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="end_date">Date de fin (laisser vide si en cours)</Label>
              <Input 
                id="end_date" 
                name="end_date" 
                type="date"
                defaultValue={initialData?.end_date || ''}
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Label htmlFor="description_fr">Description (Français)</Label>
            <Textarea 
              id="description_fr" 
              name="description_fr" 
              rows={4}
              defaultValue={initialData?.description_fr || ''}
              className="bg-background"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description_en">Description (Anglais)</Label>
            <Textarea 
              id="description_en" 
              name="description_en" 
              rows={4}
              defaultValue={initialData?.description_en || ''}
              className="bg-background"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-border/10">
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
            <Button type="button" variant="ghost" onClick={() => router.push('/admin/formations')} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Enregistrer' : 'Créer la formation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
