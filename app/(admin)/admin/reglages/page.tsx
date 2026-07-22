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
    hero_title_fr: 'Ingénieur **Sûreté de Fonctionnement** & Développement',
    hero_title_en: '**RAMS** & Software Engineer',
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
    <div className="flex flex-col min-h-full w-full">
      {/* Light Header */}
      <div className="bg-[#F5F5F7] p-10 md:p-16 flex-shrink-0 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-1.5 h-16 bg-primary rounded-full shrink-0"></div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter italic text-[#111111]">
                Réglages
              </h1>
              <p className="text-[#111111]/70 mt-3 font-sans text-lg max-w-md leading-relaxed">
                Personnalisez les informations globales affichées sur votre portfolio.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Content */}
      <div className="flex-1 bg-[#121212] p-10 md:p-16 text-white w-full">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {message && (
            <div className={`p-4 rounded-xl border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Section Hero */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white pb-6 border-b border-white/5 mb-8">Informations de la page d'accueil (Hero)</h2>
              
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">Années d'expérience</label>
                  <input 
                    type="text" 
                    name="hero_experience" 
                    value={settings.hero_experience} 
                    onChange={handleChange}
                    placeholder="Ex: 3+"
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                  <p className="text-xs text-white/40">Sera affiché suivi de " ANS D'EXPÉRIENCE"</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">Localisation</label>
                  <input 
                    type="text" 
                    name="hero_location" 
                    value={settings.hero_location} 
                    onChange={handleChange}
                    placeholder="Ex: PARIS, FR"
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-medium text-white/70">Titre Professionnel (FR)</label>
                  <input 
                    type="text" 
                    name="hero_title_fr" 
                    value={settings.hero_title_fr} 
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                  <p className="text-xs text-white/40">Entourez la partie à mettre en valeur (bleu et gras) par deux astérisques `**`. Ex: `Ingénieur **Sûreté de Fonctionnement** & Développement`</p>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-medium text-white/70">Titre Professionnel (EN)</label>
                  <input 
                    type="text" 
                    name="hero_title_en" 
                    value={settings.hero_title_en} 
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                  <p className="text-xs text-white/40">Entourez la partie à mettre en valeur (bleu et gras) par deux astérisques `**`.</p>
                </div>
              </div>

              <div className="space-y-6 pt-8 mt-8 border-t border-white/5">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">Affichage du nombre de projets</label>
                  <select 
                    name="hero_projects_mode"
                    value={settings.hero_projects_mode}
                    onChange={handleChange}
                    className="w-full sm:w-1/2 px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  >
                    <option value="auto">Automatique (basé sur les projets publiés)</option>
                    <option value="manual">Manuel (valeur définie ci-dessous)</option>
                  </select>
                </div>

                {settings.hero_projects_mode === 'manual' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/70">Nombre manuel de projets</label>
                    <input 
                      type="number" 
                      name="hero_projects_manual" 
                      value={settings.hero_projects_manual} 
                      onChange={handleChange}
                      placeholder="Ex: 12"
                      className="w-full sm:w-1/2 px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section Contact & Réseaux */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white pb-6 border-b border-white/5 mb-8">Contact & Réseaux Sociaux</h2>
              
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">Email de contact</label>
                  <input 
                    type="email" 
                    name="contact_email" 
                    value={settings.contact_email} 
                    onChange={handleChange}
                    placeholder="Ex: hello@domaine.com"
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">Téléphone</label>
                  <input 
                    type="text" 
                    name="contact_phone" 
                    value={settings.contact_phone} 
                    onChange={handleChange}
                    placeholder="Ex: +33 6 00 00 00 00"
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-3 sm:col-span-2">
                  <label className="text-sm font-medium text-white/70">Adresse complète</label>
                  <input 
                    type="text" 
                    name="contact_address" 
                    value={settings.contact_address} 
                    onChange={handleChange}
                    placeholder="Ex: 75000 Paris, France"
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">URL LinkedIn</label>
                  <input 
                    type="url" 
                    name="social_linkedin" 
                    value={settings.social_linkedin} 
                    onChange={handleChange}
                    placeholder="Ex: https://linkedin.com/in/..."
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">URL GitHub</label>
                  <input 
                    type="url" 
                    name="social_github" 
                    value={settings.social_github} 
                    onChange={handleChange}
                    placeholder="Ex: https://github.com/..."
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section SEO */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl font-heading font-semibold text-white pb-6 border-b border-white/5 mb-8">Référencement (SEO)</h2>
              
              <div className="grid gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">Titre du site (Meta Title)</label>
                  <input 
                    type="text" 
                    name="seo_title" 
                    value={settings.seo_title} 
                    onChange={handleChange}
                    placeholder="Ex: Marcien B. Nzoussi - Portfolio"
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/70">Description du site (Meta Description)</label>
                  <input 
                    type="text" 
                    name="seo_description" 
                    value={settings.seo_description} 
                    onChange={handleChange}
                    placeholder="Ex: Ingénieur Sûreté de Fonctionnement..."
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end sticky bottom-6 z-10">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Enregistrer les réglages
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
