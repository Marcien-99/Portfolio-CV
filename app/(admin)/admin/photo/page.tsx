'use client'

import { useState, useEffect } from 'react'
import { getPhotos, uploadPhoto, setActivePhoto, deletePhoto } from '@/lib/actions/cv'
import { Camera, Check, Trash2, Loader2, Upload } from 'lucide-react'

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
    if (!confirm('Voulez-vous vraiment supprimer cette photo ?')) return
    const result = await deletePhoto(id, url)
    if (result.error) {
      setError(result.error)
    } else {
      await loadPhotos()
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Photo de profil CV</h1>
        <p className="text-muted-foreground mt-1">Gérez la photo qui apparaîtra sur votre CV généré en PDF.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-6">
        <h2 className="text-xl font-heading font-semibold mb-4">Ajouter une nouvelle photo</h2>
        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Sélectionner une image (1:1 recommandé)</label>
            <input 
              type="file" 
              name="photo" 
              accept="image/*"
              required
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Uploader
          </button>
        </form>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 rounded-2xl border border-border/10 border-dashed">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune photo uploadée pour le moment.</p>
          </div>
        ) : (
          photos.map(photo => (
            <div key={photo.id} className={`flex flex-col rounded-2xl overflow-hidden border-2 bg-card transition-all ${photo.is_active ? 'border-primary shadow-sm' : 'border-border/10'}`}>
              <div className="aspect-square relative bg-secondary/50">
                <img src={photo.file_path} alt="Profil" className="w-full h-full object-cover" />
              </div>
              
              <div className="p-4 flex flex-col gap-3">
                {photo.is_active ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm border border-primary/20">
                    <Check className="w-4 h-4" />
                    Active sur le CV
                  </div>
                ) : (
                  <button 
                    onClick={() => handleSetActive(photo.id)}
                    className="w-full px-4 py-2 bg-secondary text-foreground rounded-full font-medium text-sm hover:bg-secondary/80 transition-colors"
                  >
                    Rendre active
                  </button>
                )}

                <button 
                  onClick={() => handleDelete(photo.id, photo.file_path)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-500/10 text-red-500 rounded-full font-medium text-sm hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
