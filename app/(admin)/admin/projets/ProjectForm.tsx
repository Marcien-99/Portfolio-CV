'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createProject, updateProject, deleteProjectImage } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2, Trash2, ImageIcon, Link as LinkIcon, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function ProjectForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any>(null)
  const [isDeletingImage, setIsDeletingImage] = useState<string | null>(null)
  
  const [linkBlocks, setLinkBlocks] = useState<any[]>(initialData?.links || [])
  const [newImageBlocks, setNewImageBlocks] = useState<number[]>([])

  const isEditing = !!initialData

  async function handleSubmit(formData: FormData) {
    setError(null)
    setErrorDetails(null)
    
    startTransition(async () => {
      const result = isEditing 
        ? await updateProject(initialData.id, formData)
        : await createProject(formData)

      if (result?.error) {
        setError(result.error)
        if (result.details) setErrorDetails(result.details)
      } else if (result?.success) {
        router.push('/admin/projets')
      }
    })
  }

  async function handleDeleteImage(imageId: string, url: string) {
    if (!window.confirm("Supprimer cette image définitivement ?")) return
    setIsDeletingImage(imageId)
    await deleteProjectImage(imageId, url)
    setIsDeletingImage(null)
    router.refresh()
  }

  const addLink = () => setLinkBlocks([...linkBlocks, { url: '', label_fr: '', label_en: '' }])
  const removeLink = (index: number) => setLinkBlocks(linkBlocks.filter((_, i) => i !== index))

  const addNewImageBlock = () => setNewImageBlocks([...newImageBlocks, newImageBlocks.length])
  const removeNewImageBlock = (index: number) => setNewImageBlocks(newImageBlocks.filter(i => i !== index))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/admin/projets" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-tight mt-4">
          {isEditing ? "Modifier le projet" : "Nouveau projet"}
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

        <form action={handleSubmit} className="space-y-8">
          
          {/* SECTION: Informations de base */}
          <div>
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Informations principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-border/10 rounded-xl bg-background/50">
              <div className="space-y-3">
                <Label htmlFor="title_fr">Titre du projet (Français) *</Label>
                <Input id="title_fr" name="title_fr" required defaultValue={initialData?.title_fr || ''} className="bg-background" />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="title_en">Titre du projet (Anglais) *</Label>
                <Input id="title_en" name="title_en" required defaultValue={initialData?.title_en || ''} className="bg-background" />
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="en_auto_generated" name="en_auto_generated" defaultChecked={initialData ? initialData.en_auto_generated : true} className="rounded border-border/50 text-primary bg-background" />
                  <Label htmlFor="en_auto_generated" className="text-xs font-normal text-muted-foreground cursor-pointer">Générer descriptions EN auto (DeepL) plus tard</Label>
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="slug">Slug (URL unique, ex: mon-super-projet) *</Label>
                <Input id="slug" name="slug" required defaultValue={initialData?.slug || ''} className="bg-background font-mono text-sm" placeholder="nom-du-projet" />
              </div>
            </div>
          </div>

          {/* SECTION: Liens associés */}
          <div>
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2"><LinkIcon className="w-5 h-5 text-primary" /> Liens associés</h2>
            <div className="space-y-4 p-6 border border-border/10 rounded-xl bg-background/50">
              <input type="hidden" name="links_count" value={linkBlocks.length} />
              
              {linkBlocks.map((link, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 items-start p-4 border border-border/20 rounded-lg bg-card/30">
                  <div className="flex-1 space-y-3 w-full">
                    <Input name={`link_url_${i}`} defaultValue={link.url} placeholder="https://github.com/..." required className="font-mono text-sm" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input name={`link_label_fr_${i}`} defaultValue={link.label_fr} placeholder="Texte FR (ex: Code source)" required />
                      <Input name={`link_label_en_${i}`} defaultValue={link.label_en} placeholder="Texte EN (ex: Source code)" required />
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(i)} className="text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addLink} className="w-full border-dashed">
                <Plus className="w-4 h-4 mr-2" /> Ajouter un lien
              </Button>
            </div>
          </div>

          {/* SECTION: Contenu Enrichi */}
          <div>
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Détails du projet (FR)</h2>
            <div className="space-y-6 p-6 border border-border/10 rounded-xl bg-background/50">
              <div className="space-y-3"><Label htmlFor="context_fr">Contexte & Objectif</Label><Textarea id="context_fr" name="context_fr" rows={3} defaultValue={initialData?.context_fr || ''} className="bg-background" /></div>
              <div className="space-y-3"><Label htmlFor="approach_fr">Démarche & Solution technique</Label><Textarea id="approach_fr" name="approach_fr" rows={4} defaultValue={initialData?.approach_fr || ''} className="bg-background" /></div>
              <div className="space-y-3"><Label htmlFor="result_fr">Résultats & Impact</Label><Textarea id="result_fr" name="result_fr" rows={3} defaultValue={initialData?.result_fr || ''} className="bg-background" /></div>
            </div>
          </div>

          {/* SECTION: Contenu Enrichi EN */}
          <div>
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Détails du projet (EN)</h2>
            <div className="space-y-6 p-6 border border-border/10 rounded-xl bg-background/50 opacity-80 hover:opacity-100 transition-opacity">
              <div className="space-y-3"><Label htmlFor="context_en">Context & Objective</Label><Textarea id="context_en" name="context_en" rows={3} defaultValue={initialData?.context_en || ''} className="bg-background" /></div>
              <div className="space-y-3"><Label htmlFor="approach_en">Approach & Technical Solution</Label><Textarea id="approach_en" name="approach_en" rows={4} defaultValue={initialData?.approach_en || ''} className="bg-background" /></div>
              <div className="space-y-3"><Label htmlFor="result_en">Results & Impact</Label><Textarea id="result_en" name="result_en" rows={3} defaultValue={initialData?.result_en || ''} className="bg-background" /></div>
            </div>
          </div>

          {/* SECTION: Domaines & Statut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-lg font-heading font-bold mb-2 block">Domaines associés</Label>
              <div className="flex flex-col gap-3 p-6 border border-border/10 rounded-xl bg-background/50 h-[200px]">
                {[
                  { id: 'surete_fonctionnement', label: 'Sûreté de fonctionnement' },
                  { id: 'electronique', label: 'Électronique' },
                  { id: 'automatisme', label: 'Automatisme' },
                  { id: 'informatique_ia', label: 'Informatique / IA' },
                ].map((domain) => (
                  <label key={domain.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <input type="checkbox" name="domains" value={domain.id} defaultChecked={initialData?.domains?.includes(domain.id)} className="rounded border-border/50 text-primary bg-background w-4 h-4" />
                    <span className="text-sm font-medium">{domain.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="status" className="text-lg font-heading font-bold mb-2 block">Avancement du projet</Label>
                <select id="status" name="status" defaultValue={initialData?.status || 'en_cours'} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background">
                  <option value="en_cours">En cours de réalisation</option>
                  <option value="termine">Projet terminé</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="visibility" className="text-lg font-heading font-bold mb-2 block">Visibilité publique</Label>
                <select id="visibility" name="visibility" defaultValue={initialData?.visibility || 'draft'} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background">
                  <option value="draft">Brouillon (Masqué)</option>
                  <option value="published">Publié (Visible pour tous)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION: Images */}
          <div>
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-primary" /> Galerie d'images</h2>
            <div className="p-6 border border-border/10 rounded-xl bg-background/50 space-y-8">
              
              {/* Images Existantes */}
              {initialData?.images && initialData.images.length > 0 && (
                <div className="space-y-4">
                  <Label>Images existantes</Label>
                  <input type="hidden" name="existing_images_count" value={initialData.images.length} />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {initialData.images.map((img: any, i: number) => (
                      <div key={img.id} className="relative p-4 bg-card border border-border/20 rounded-xl space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
                          {/* NOTE: Les anciennes images locales peuvent causer des erreurs, on gère avec img HTML si pb Next Image */}
                          <img src={img.url} alt="Project Image" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute top-2 right-2">
                            <Button type="button" variant="destructive" size="icon" className="h-8 w-8 shadow-lg" onClick={() => handleDeleteImage(img.id, img.url)} disabled={isDeletingImage === img.id}>
                              {isDeletingImage === img.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <input type="hidden" name={`existing_image_id_${i}`} value={img.id} />
                        <div className="space-y-2">
                          <Input name={`existing_image_caption_fr_${i}`} defaultValue={img.caption_fr} placeholder="Légende FR" className="h-8 text-sm" />
                          <Input name={`existing_image_caption_en_${i}`} defaultValue={img.caption_en} placeholder="Légende EN" className="h-8 text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Nouvelles Images avec légendes */}
              <div className="space-y-4 pt-4 border-t border-border/10">
                <Label>Ajouter de nouvelles images (PNG, JPG, WebP)</Label>
                <input type="hidden" name="new_images_count" value={newImageBlocks.length} />
                
                <div className="space-y-4">
                  {newImageBlocks.map((blockId, i) => (
                    <div key={blockId} className="flex flex-col sm:flex-row gap-4 items-start p-4 border border-primary/20 bg-primary/5 rounded-lg">
                      <div className="flex-1 space-y-3 w-full">
                        <Input name={`new_image_file_${i}`} type="file" accept="image/*" required className="bg-background file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:cursor-pointer file:hover:bg-primary/90" />
                        <div className="grid grid-cols-2 gap-3">
                          <Input name={`new_image_caption_fr_${i}`} placeholder="Légende FR" required className="bg-background h-9 text-sm" />
                          <Input name={`new_image_caption_en_${i}`} placeholder="Légende EN" required className="bg-background h-9 text-sm" />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeNewImageBlock(blockId)} className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button type="button" variant="outline" onClick={addNewImageBlock} className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:text-primary">
                  <Plus className="w-4 h-4 mr-2" /> Uploader une image
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border/10">
            <Button type="button" variant="ghost" onClick={() => router.push('/admin/projets')} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending} className="px-8">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Enregistrer les modifications' : 'Créer le projet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
  )
}
