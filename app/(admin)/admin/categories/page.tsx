'use client'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories'
import { Loader2, Plus, Save, Trash2, Edit2, X } from 'lucide-react'

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name_fr: '', name_en: '', position: 0 })
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    const data = await getCategories()
    setCategories(data)
    setLoading(false)
  }

  function handleEdit(cat: any) {
    setEditingId(cat.id)
    setFormData({ name_fr: cat.name_fr, name_en: cat.name_en, position: cat.position })
    setIsNew(false)
    setError(null)
  }

  function handleAddNew() {
    setEditingId('new')
    setFormData({ name_fr: '', name_en: '', position: categories.length * 10 })
    setIsNew(true)
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setIsNew(false)
    setError(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    let result
    if (isNew) {
      result = await createCategory(formData)
    } else if (editingId) {
      result = await updateCategory(editingId, formData)
    }

    if (result?.error) {
      setError(result.error)
    } else {
      await loadCategories()
      cancelEdit()
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Voulez-vous vraiment supprimer cette catégorie ? Toutes les compétences liées perdront cette catégorie.')) return
    const result = await deleteCategory(id)
    if (result.error) setError(result.error)
    else await loadCategories()
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Catégories de Compétences</h1>
          <p className="text-muted-foreground">Gérez les catégories (ex: Langages, Outils) pour organiser vos compétences.</p>
        </div>
        {!editingId && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Catégorie
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          {error}
        </div>
      )}

      {editingId && (
        <form onSubmit={handleSave} className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-heading font-semibold">{isNew ? 'Créer une catégorie' : 'Modifier la catégorie'}</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nom (FR)</label>
              <input 
                type="text" 
                required
                value={formData.name_fr} 
                onChange={e => setFormData({...formData, name_fr: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nom (EN)</label>
              <input 
                type="text" 
                required
                value={formData.name_en} 
                onChange={e => setFormData({...formData, name_en: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Position (ordre d'affichage)</label>
              <input 
                type="number" 
                required
                value={formData.position} 
                onChange={e => setFormData({...formData, position: parseInt(e.target.value) || 0})}
                className="w-full sm:w-1/3 px-4 py-2 bg-background border border-border/10 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-2 bg-secondary text-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {!editingId && (
        <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Aucune catégorie trouvée.</div>
          ) : (
            <div className="divide-y divide-border/10">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors">
                  <div>
                    <h3 className="font-semibold text-foreground">{cat.name_fr}</h3>
                    <p className="text-sm text-muted-foreground">{cat.name_en} • Position: {cat.position}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
