'use client'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories'
import { Loader2, Plus, Save, Trash2, Edit2, X } from 'lucide-react'
import { ConfirmActionDialog } from '@/components/ui/confirm-action-dialog'

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name_fr: '', name_en: '', position: 0, auto_translate: true })
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
    setFormData({ name_fr: cat.name_fr, name_en: cat.name_en, position: cat.position, auto_translate: false })
    setIsNew(false)
    setError(null)
  }

  function handleAddNew() {
    setEditingId('new')
    setFormData({ name_fr: '', name_en: '', position: categories.length * 10, auto_translate: true })
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
    const result = await deleteCategory(id)
    if (result.error) setError(result.error)
    else await loadCategories()
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
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
                Catégories
              </h1>
              <p className="text-[#111111]/70 mt-3 font-sans text-lg max-w-md leading-relaxed">
                Gérez les catégories pour organiser vos compétences.
              </p>
            </div>
          </div>
          {!editingId && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full transition-all duration-300 text-sm hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
            >
              <Plus size={18} />
              Nouvelle Catégorie
            </button>
          )}
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

          {editingId && (
            <form onSubmit={handleSave} className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white">{isNew ? 'Créer une catégorie' : 'Modifier la catégorie'}</h2>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">Nom (FR)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name_fr} 
                    onChange={e => setFormData({...formData, name_fr: e.target.value})}
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">Nom (EN)</label>
                  <input 
                    type="text" 
                    value={formData.name_en} 
                    onChange={e => setFormData({...formData, name_en: e.target.value})}
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                  <div className="flex items-center gap-3 mt-3">
                    <input 
                      type="checkbox" 
                      id="auto_translate" 
                      checked={formData.auto_translate}
                      onChange={e => setFormData({...formData, auto_translate: e.target.checked})}
                      className="w-4 h-4 rounded border-white/20 text-primary bg-[#111111] focus:ring-primary/50"
                    />
                    <label htmlFor="auto_translate" className="text-xs font-normal text-white/50 cursor-pointer">
                      Traduction automatique
                    </label>
                  </div>
                </div>
                <div className="space-y-3 sm:col-span-2">
                  <label className="text-sm font-medium text-white/70">Position (ordre d'affichage)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.position} 
                    onChange={e => setFormData({...formData, position: parseInt(e.target.value) || 0})}
                    className="w-full sm:w-1/3 px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="w-full sm:w-auto px-8 py-3 bg-[#111111] text-white/70 rounded-full font-medium hover:text-white hover:bg-[#222222] transition-colors text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Enregistrer
                </button>
              </div>
            </form>
          )}

          {!editingId && (
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              {categories.length === 0 ? (
                <div className="p-12 text-center text-white/50">Aucune catégorie trouvée.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-6 md:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{cat.name_fr}</h3>
                        <p className="text-sm text-white/50 mt-1">{cat.name_en} • Position: {cat.position}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="p-3 text-white/50 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <ConfirmActionDialog
                          title="Supprimer cette catégorie ?"
                          description="Cette action est irréversible. Toutes les compétences liées perdront cette catégorie."
                          action={async () => await handleDelete(cat.id)}
                          danger={true}
                          trigger={
                            <button 
                              className="p-3 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
