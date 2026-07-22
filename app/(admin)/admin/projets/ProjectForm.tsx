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
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"

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
    <div className="flex flex-col min-h-full w-full">
      {/* Light Header */}
      <div className="bg-[#F5F5F7] p-10 md:p-16 flex-shrink-0 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-1.5 h-16 bg-primary rounded-full shrink-0"></div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  href="/admin/projets" 
                  className="inline-flex items-center text-sm font-medium text-[#111111]/50 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour
                </Link>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter italic text-[#111111]">
                {isEditing ? "Modifier le projet" : "Nouveau projet"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Content */}
      <div className="flex-1 bg-[#121212] p-10 md:p-16 text-white w-full">
        <div className="max-w-5xl mx-auto space-y-8">
          
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

          <form action={handleSubmit} className="space-y-10">
            
            {/* SECTION: Informations de base */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white pb-6 border-b border-white/5 mb-8 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" /> 
                Informations principales
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="title_fr" className="text-sm font-medium text-white/70">Titre du projet (Français) *</Label>
                  <Input id="title_fr" name="title_fr" required defaultValue={initialData?.title_fr || ''} className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto" />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="title_en" className="text-sm font-medium text-white/70">Titre du projet (Anglais)</Label>
                  <Input id="title_en" name="title_en" defaultValue={initialData?.title_en || ''} className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto" />
                  <div className="flex items-center gap-3 mt-3">
                    <input type="checkbox" id="en_auto_generated" name="en_auto_generated" defaultChecked={initialData ? initialData.en_auto_generated : true} className="w-4 h-4 rounded border-white/20 text-primary bg-[#111111] focus:ring-primary/50" />
                    <Label htmlFor="en_auto_generated" className="text-xs font-normal text-white/50 cursor-pointer">Générer descriptions EN auto (DeepL) plus tard</Label>
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="slug" className="text-sm font-medium text-white/70">Slug (URL unique, ex: mon-super-projet) *</Label>
                  <Input id="slug" name="slug" required defaultValue={initialData?.slug || ''} className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto font-mono" placeholder="nom-du-projet" />
                </div>
              </div>
            </div>

            {/* SECTION: Liens associés */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white pb-6 border-b border-white/5 mb-8 flex items-center gap-3">
                <LinkIcon className="w-6 h-6 text-primary" /> 
                Liens associés
              </h2>
              
              <div className="space-y-6">
                <input type="hidden" name="links_count" value={linkBlocks.length} />
                
                {linkBlocks.map((link, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-6 items-start p-6 border border-white/5 rounded-2xl bg-[#111111]">
                    <div className="flex-1 space-y-4 w-full">
                      <Input name={`link_url_${i}`} defaultValue={link.url} placeholder="https://github.com/..." required className="w-full px-5 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto font-mono" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input name={`link_label_fr_${i}`} defaultValue={link.label_fr} placeholder="Texte FR (ex: Code source)" required className="w-full px-5 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto" />
                        <Input name={`link_label_en_${i}`} defaultValue={link.label_en} placeholder="Texte EN (ex: Source code)" required className="w-full px-5 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all h-auto" />
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(i)} className="text-white/30 hover:text-red-400 hover:bg-red-500/10 shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addLink} className="w-full py-6 bg-transparent border-dashed border-white/20 text-white hover:bg-white/5 hover:text-white rounded-2xl">
                  <Plus className="w-5 h-5 mr-2" /> Ajouter un lien
                </Button>
              </div>
            </div>

            {/* SECTION: Contenu Enrichi */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white pb-6 border-b border-white/5 mb-8 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" /> 
                Détails du projet (FR)
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-3"><Label htmlFor="context_fr" className="text-sm font-medium text-white/70">Contexte & Objectif</Label><Textarea id="context_fr" name="context_fr" rows={3} defaultValue={initialData?.context_fr || ''} className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all" /></div>
                <div className="space-y-3"><Label htmlFor="approach_fr" className="text-sm font-medium text-white/70">Démarche & Solution technique</Label><Textarea id="approach_fr" name="approach_fr" rows={4} defaultValue={initialData?.approach_fr || ''} className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all" /></div>
                <div className="space-y-3"><Label htmlFor="result_fr" className="text-sm font-medium text-white/70">Résultats & Impact</Label><Textarea id="result_fr" name="result_fr" rows={3} defaultValue={initialData?.result_fr || ''} className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all" /></div>
              </div>
            </div>

            {/* SECTION: Contenu Enrichi EN */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl opacity-90 hover:opacity-100 transition-opacity">
              <h2 className="text-2xl font-heading font-semibold text-white pb-6 border-b border-white/5 mb-8 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" /> 
                Détails du projet (EN)
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-3"><Label htmlFor="context_en" className="text-sm font-medium text-white/70">Context & Objective</Label><Textarea id="context_en" name="context_en" rows={3} defaultValue={initialData?.context_en || ''} className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all" /></div>
                <div className="space-y-3"><Label htmlFor="approach_en" className="text-sm font-medium text-white/70">Approach & Technical Solution</Label><Textarea id="approach_en" name="approach_en" rows={4} defaultValue={initialData?.approach_en || ''} className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all" /></div>
                <div className="space-y-3"><Label htmlFor="result_en" className="text-sm font-medium text-white/70">Results & Impact</Label><Textarea id="result_en" name="result_en" rows={3} defaultValue={initialData?.result_en || ''} className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all" /></div>
              </div>
            </div>

            {/* SECTION: Domaines & Statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6">
                <Label className="text-lg font-heading font-semibold text-white block pb-4 border-b border-white/5">Domaines associés</Label>
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'surete_fonctionnement', label: 'Sûreté de fonctionnement' },
                    { id: 'electronique', label: 'Électronique' },
                    { id: 'automatisme', label: 'Automatisme' },
                    { id: 'informatique_ia', label: 'Informatique / IA' },
                  ].map((domain) => (
                    <label key={domain.id} className="flex items-center gap-3 cursor-pointer p-4 border border-white/10 rounded-xl bg-[#111111] hover:bg-white/5 hover:border-white/20 transition-all duration-300">
                      <input type="checkbox" name="domains" value={domain.id} defaultChecked={initialData?.domains?.includes(domain.id)} className="w-4 h-4 rounded border-white/20 text-primary bg-transparent focus:ring-primary/50" />
                      <span className="text-sm font-medium text-white/90">{domain.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="status" className="text-lg font-heading font-semibold text-white block pb-2">Avancement du projet</Label>
                  <select id="status" name="status" defaultValue={initialData?.status || 'en_cours'} className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all">
                    <option value="en_cours">En cours de réalisation</option>
                    <option value="termine">Projet terminé</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="visibility" className="text-lg font-heading font-semibold text-white block pb-2">Visibilité publique</Label>
                  <select id="visibility" name="visibility" defaultValue={initialData?.visibility || 'draft'} className="w-full px-5 py-4 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all">
                    <option value="draft">Brouillon (Masqué)</option>
                    <option value="published">Publié (Visible pour tous)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION: Images */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white pb-6 border-b border-white/5 mb-8 flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-primary" /> 
                Galerie d'images
              </h2>
              
              <div className="space-y-10">
                {/* Images Existantes */}
                {initialData?.images && initialData.images.length > 0 && (
                  <div className="space-y-6">
                    <Label className="text-lg text-white/80">Images existantes</Label>
                    <input type="hidden" name="existing_images_count" value={initialData.images.length} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {initialData.images.map((img: any, i: number) => (
                        <div key={img.id} className="relative p-5 bg-[#111111] border border-white/5 rounded-2xl space-y-5">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0A0A0A]">
                            <img src={img.url} alt="Project Image" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute top-3 right-3">
                              <ConfirmActionDialog
                                title="Supprimer cette image ?"
                                description="Cette action est irréversible. L'image sera supprimée de la galerie."
                                action={async () => await handleDeleteImage(img.id, img.url)}
                                danger={true}
                                trigger={
                                  <Button type="button" variant="destructive" size="icon" className="h-10 w-10 rounded-full shadow-2xl shadow-red-500/20" disabled={isDeletingImage === img.id}>
                                    {isDeletingImage === img.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                  </Button>
                                }
                              />
                            </div>
                          </div>
                          <input type="hidden" name={`existing_image_id_${i}`} value={img.id} />
                          <div className="space-y-3">
                            <Input name={`existing_image_caption_fr_${i}`} defaultValue={img.caption_fr} placeholder="Légende FR" className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                            <Input name={`existing_image_caption_en_${i}`} defaultValue={img.caption_en} placeholder="Légende EN" className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Nouvelles Images */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                  <Label className="text-lg text-white/80">Ajouter de nouvelles images (PNG, JPG, WebP)</Label>
                  <input type="hidden" name="new_images_count" value={newImageBlocks.length} />
                  
                  <div className="space-y-6">
                    {newImageBlocks.map((blockId, i) => (
                      <div key={blockId} className="flex flex-col sm:flex-row gap-6 items-start p-6 border border-primary/20 bg-primary/5 rounded-2xl">
                        <div className="flex-1 space-y-4 w-full">
                          <Input name={`new_image_file_${i}`} type="file" accept="image/*" required className="w-full bg-[#111111] border border-white/10 rounded-xl text-white file:bg-primary file:text-primary-foreground file:border-0 file:rounded-lg file:px-5 file:py-2 file:mr-4 file:cursor-pointer file:hover:bg-primary/90 h-auto p-2" />
                          <div className="grid grid-cols-2 gap-4">
                            <Input name={`new_image_caption_fr_${i}`} placeholder="Légende FR" required className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                            <Input name={`new_image_caption_en_${i}`} placeholder="Légende EN" required className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeNewImageBlock(blockId)} className="text-white/30 hover:text-red-400 hover:bg-red-500/10 shrink-0 h-12 w-12 rounded-xl">
                          <Trash2 className="w-6 h-6" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button type="button" variant="outline" onClick={addNewImageBlock} className="w-full py-8 bg-transparent border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:text-primary rounded-2xl text-lg font-medium">
                    <Plus className="w-6 h-6 mr-2" /> Uploader une image
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-8 sticky bottom-6 z-10">
              <Button type="button" variant="ghost" onClick={() => router.push('/admin/projets')} disabled={isPending} className="w-full sm:w-auto px-6 py-4 rounded-full text-white/70 hover:text-white hover:bg-[#222222] bg-[#111111] border border-white/5 shadow-xl">
                Annuler
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                <Save className="mr-2 h-5 w-5" />
                {isEditing ? 'Enregistrer les modifications' : 'Créer le projet'}
              </Button>
            </div>
          </form>
        </div>
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
