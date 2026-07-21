'use client'

import { useState, useEffect } from 'react'
import { getSiteSettings, updateSiteSettings } from '@/lib/actions/settings'
import { Loader2, Save } from 'lucide-react'

export default function ReglagesAdminPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    hero_experience: '3+',
    hero_projects_mode: 'auto',
    hero_projects_manual: '12',
    hero_location: 'PARIS, FR',
    contact_email: 'contact@marcien-bn.dev',
    contact_phone: '+33 6 00 00 00 00',
    contact_address: 'Paris, France',
    social_linkedin: 'https://linkedin.com/in/',
    social_github: 'https://github.com/',
    seo_title: 'Marcien B. Nzoussi - Portfolio',
    seo_description: 'Ingénieur Sûreté de Fonctionnement & Développement'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    const data = await getSiteSettings()
    
    setSettings(prev => ({
      ...prev,
      ...data
    }))
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const result = await updateSiteSettings(settings)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Réglages sauvegardés avec succès !' })
    }
    setSaving(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Réglages</h1>
        <p className="text-muted-foreground">Personnalisez les informations globales affichées sur votre portfolio.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-600'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section Hero */}
        <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-heading font-semibold pb-4 border-b border-border/10">Informations de la page d'accueil (Hero)</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Années d'expérience</label>
              <input 
                type="text" 
                name="hero_experience" 
                value={settings.hero_experience} 
                onChange={handleChange}
                placeholder="Ex: 3+"
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <p className="text-xs text-muted-foreground">Sera affiché suivi de " ANS D'EXPÉRIENCE"</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Localisation</label>
              <input 
                type="text" 
                name="hero_location" 
                value={settings.hero_location} 
                onChange={handleChange}
                placeholder="Ex: PARIS, FR"
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Affichage du nombre de projets</label>
              <select 
                name="hero_projects_mode"
                value={settings.hero_projects_mode}
                onChange={handleChange}
                className="w-full sm:w-1/2 px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="auto">Automatique (basé sur les projets publiés)</option>
                <option value="manual">Manuel (valeur définie ci-dessous)</option>
              </select>
            </div>

            {settings.hero_projects_mode === 'manual' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre manuel de projets</label>
                <input 
                  type="number" 
                  name="hero_projects_manual" 
                  value={settings.hero_projects_manual} 
                  onChange={handleChange}
                  placeholder="Ex: 12"
                  className="w-full sm:w-1/2 px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section Contact & Réseaux */}
        <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-heading font-semibold pb-4 border-b border-border/10">Contact & Réseaux Sociaux</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email de contact</label>
              <input 
                type="email" 
                name="contact_email" 
                value={settings.contact_email} 
                onChange={handleChange}
                placeholder="Ex: hello@domaine.com"
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Téléphone</label>
              <input 
                type="text" 
                name="contact_phone" 
                value={settings.contact_phone} 
                onChange={handleChange}
                placeholder="Ex: +33 6 00 00 00 00"
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Adresse complète</label>
              <input 
                type="text" 
                name="contact_address" 
                value={settings.contact_address} 
                onChange={handleChange}
                placeholder="Ex: 75000 Paris, France"
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL LinkedIn</label>
              <input 
                type="url" 
                name="social_linkedin" 
                value={settings.social_linkedin} 
                onChange={handleChange}
                placeholder="Ex: https://linkedin.com/in/..."
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL GitHub</label>
              <input 
                type="url" 
                name="social_github" 
                value={settings.social_github} 
                onChange={handleChange}
                placeholder="Ex: https://github.com/..."
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section SEO */}
        <div className="bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-heading font-semibold pb-4 border-b border-border/10">Référencement (SEO)</h2>
          
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Titre du site (Meta Title)</label>
              <input 
                type="text" 
                name="seo_title" 
                value={settings.seo_title} 
                onChange={handleChange}
                placeholder="Ex: Marcien B. Nzoussi - Portfolio"
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description du site (Meta Description)</label>
              <input 
                type="text" 
                name="seo_description" 
                value={settings.seo_description} 
                onChange={handleChange}
                placeholder="Ex: Ingénieur Sûreté de Fonctionnement..."
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end sticky bottom-6 z-10">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-primary/90 disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Enregistrer les réglages
          </button>
        </div>

      </form>
    </div>
  )
}
