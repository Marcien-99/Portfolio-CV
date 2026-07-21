'use client'

import { useState, useEffect } from 'react'
import { getPhotos, uploadPhoto, setActivePhoto, deletePhoto } from '@/lib/actions/cv'
import { Camera, Check, Trash2, Loader2, Upload } from 'lucide-react'
import { ConfirmActionDialog } from '@/components/ui/confirm-action-dialog'

export default function PhotoAdminPage() {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    setLoading(true)
    const data = await getPhotos()
    setPhotos(data)
    setLoading(false)
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    const result = await uploadPhoto(formData)
    if (result.error) {
      setError(result.error)
    } else {
      await loadPhotos()
      e.currentTarget.reset()
    }
    setUploading(false)
  }

  async function handleSetActive(id: string) {
    const result = await setActivePhoto(id)
    if (result.error) {
      setError(result.error)
    } else {
      await loadPhotos()
    }
  }

  async function handleDelete(id: string, url: string) {
    const result = await deletePhoto(id, url)
    if (result.error) {
      setError(result.error)
    } else {
      await loadPhotos()
    }
  }

  return (
    <div className="flex flex-col min-h-full w-full">
      {/* Light Header */}
      <div className="bg-[#F5F5F7] p-10 md:p-16 flex-shrink-0 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-1.5 h-16 bg-primary rounded-full shrink-0"></div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter italic text-[#111111]">
                Photo de profil CV
              </h1>
              <p className="text-[#111111]/70 mt-3 font-sans text-lg max-w-md leading-relaxed">
                Gérez la photo qui apparaîtra sur votre CV généré en PDF.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Content */}
      <div className="flex-1 bg-[#121212] p-10 md:p-16 text-white w-full">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
              {error}
            </div>
          )}

          {/* Upload Section */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <h2 className="text-2xl font-heading font-semibold text-white mb-6">Ajouter une nouvelle photo</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-6">
              <div className="relative group w-full p-8 md:p-12 rounded-3xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-[#111111] overflow-hidden">
                <input 
                  type="file" 
                  name="photo" 
                  accept="image/*"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-3 text-white/40 group-hover:text-primary transition-colors">
                  <div className="p-4 bg-white/5 rounded-full group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-white/70 mb-1">Touchez ou cliquez pour sélectionner</p>
                    <p className="text-sm">Format 1:1 recommandé</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-primary/20"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  Uploader la photo
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {loading ? (
              <div className="col-span-full py-16 flex justify-center text-white/50">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            ) : photos.length === 0 ? (
              <div className="col-span-full py-16 text-center text-white/50 bg-[#1A1A1A] rounded-[2.5rem] border border-white/5 border-dashed">
                <Camera className="w-16 h-16 mx-auto mb-6 opacity-30" />
                <p className="text-lg">Aucune photo uploadée pour le moment.</p>
              </div>
            ) : (
              photos.map(photo => (
                <div key={photo.id} className={`flex flex-col rounded-[2rem] overflow-hidden border-2 bg-[#1A1A1A] transition-all duration-300 hover:shadow-xl ${photo.is_active ? 'border-primary shadow-primary/10 hover:scale-105' : 'border-white/5 hover:border-white/10 hover:scale-[1.02]'}`}>
                  <div className="aspect-square relative bg-[#111111]">
                    <img src={photo.file_path} alt="Profil" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                    {photo.is_active ? (
                      <div className="flex items-center justify-center gap-2 px-2 sm:px-4 py-2 sm:py-3 bg-primary/10 text-primary rounded-full font-medium text-xs sm:text-sm border border-primary/20 text-center">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="truncate">Active</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleSetActive(photo.id)}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-[#111111] text-white/70 rounded-full font-medium text-xs sm:text-sm hover:bg-[#222222] hover:text-white transition-all border border-white/10 truncate"
                      >
                        Activer
                      </button>
                    )}

                    <ConfirmActionDialog
                      title="Supprimer cette photo ?"
                      description="Cette action est irréversible."
                      action={async () => await handleDelete(photo.id, photo.file_path)}
                      danger={true}
                      trigger={
                        <button 
                          className="flex items-center justify-center gap-2 w-full px-2 sm:px-4 py-2 sm:py-3 bg-red-500/10 text-red-500 rounded-full font-medium text-xs sm:text-sm hover:bg-red-500/20 transition-all border border-red-500/10 truncate"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Supprimer</span>
                        </button>
                      }
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
