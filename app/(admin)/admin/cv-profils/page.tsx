'use client'

import { useState, useEffect } from 'react'
import { getStandardProfile, updateProfileItems } from '@/lib/actions/cv'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, FileText, CheckSquare, Square } from 'lucide-react'

export default function CvProfilesAdminPage() {
  const [profile, setProfile] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [availableData, setAvailableData] = useState<any>({
    skill: [],
    experience: [],
    education: [],
    project: []
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const supabase = createClient()
    
    // Charger le profil et ses items
    const { profile: p, items: i } = await getStandardProfile()
    setProfile(p)
    setItems(i)

    // Charger toutes les données disponibles (publiées et brouillons)
    const [skillsRes, expRes, eduRes, projRes] = await Promise.all([
      supabase.from('skills').select('id, name_fr').order('position'),
      supabase.from('experiences').select('id, title_fr, company').order('position'),
      supabase.from('educations').select('id, title_fr, institution').order('position'),
      supabase.from('projects').select('id, title_fr').order('position')
    ])

    setAvailableData({
      skill: skillsRes.data || [],
      experience: expRes.data || [],
      education: eduRes.data || [],
      project: projRes.data || []
    })

    setLoading(false)
  }

  function toggleItem(type: string, id: string) {
    setItems(prev => {
      const exists = prev.find(item => item.item_type === type && item.item_id === id)
      if (exists) {
        return prev.filter(item => !(item.item_type === type && item.item_id === id))
      } else {
        return [...prev, { item_type: type, item_id: id }]
      }
    })
  }

  function isSelected(type: string, id: string) {
    return items.some(item => item.item_type === type && item.item_id === id)
  }

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    setError(null)
    
    const cleanItems = items.map(item => ({
      item_type: item.item_type,
      item_id: item.item_id
    }))

    const result = await updateProfileItems(profile.id, cleanItems)
    if (result.error) setError(result.error)
    else alert('Profil sauvegardé avec succès !')
    
    setSaving(false)
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  const renderSection = (title: string, type: 'skill' | 'experience' | 'education' | 'project', dataList: any[], getLabel: (item: any) => string) => (
    <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/10">
        <h2 className="text-xl font-heading font-semibold">{title}</h2>
        <span className="text-sm font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">
          {items.filter(i => i.item_type === type).length} inclus
        </span>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {dataList.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Aucun élément disponible.</p>
        ) : (
          dataList.map(item => {
            const selected = isSelected(type, item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(type, item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${selected ? 'bg-primary/10 text-primary border border-primary/20 font-medium' : 'hover:bg-secondary text-muted-foreground border border-transparent'}`}
              >
                {selected ? <CheckSquare className="w-5 h-5 flex-shrink-0" /> : <Square className="w-5 h-5 flex-shrink-0 opacity-50" />}
                <span className="truncate">{getLabel(item)}</span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Profils de CV</h1>
          <p className="text-muted-foreground">Sélectionnez le contenu à inclure dans le CV PDF (Profil: {profile?.name || 'Standard'}).</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors whitespace-nowrap shadow-sm"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Enregistrer le profil
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSection('Compétences', 'skill', availableData.skill, item => item.name_fr)}
        {renderSection('Expériences', 'experience', availableData.experience, item => `${item.title_fr} chez ${item.company}`)}
        {renderSection('Formations', 'education', availableData.education, item => `${item.title_fr} à ${item.institution}`)}
        {renderSection('Projets', 'project', availableData.project, item => item.title_fr)}
      </div>
    </div>
  )
}
