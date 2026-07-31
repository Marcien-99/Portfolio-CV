'use client'

import { useState, useEffect } from 'react'
import { getAllProfiles, createProfile, updateProfileMetadata, updateProfileItems, deleteProfile } from '@/lib/actions/cv'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, FileText, CheckSquare, Square, Plus, Trash2, Eye, X, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react'
import { TranslateFieldButton } from '@/components/admin/TranslateFieldButton'

export default function CvProfilesAdminPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [activeProfileIndex, setActiveProfileIndex] = useState<number>(0)
  const [items, setItems] = useState<any[]>([])
  const [availableData, setAvailableData] = useState<{
    skill: any[], experience: any[], education: any[], project: any[]
  }>({ skill: [], experience: [], education: [], project: [] })
  
  // Active profile local fields
  const [name, setName] = useState('')
  const [titleFr, setTitleFr] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [bioFr, setBioFr] = useState('')
  const [bioEn, setBioEn] = useState('')
  const [showGithub, setShowGithub] = useState(true)
  const [isPublic, setIsPublic] = useState(true)
  const [projectsBeforeExperiences, setProjectsBeforeExperiences] = useState(false)
  const [skillsOrder, setSkillsOrder] = useState<string[]>([])
  const [skillCategories, setSkillCategories] = useState<any[]>([])

  // Modals & loading states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isPrioritySectionOpen, setIsPrioritySectionOpen] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewLang, setPreviewLang] = useState<'fr' | 'en'>('fr')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const activeProfile = profiles[activeProfileIndex]?.profile

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (activeProfile) {
      setName(activeProfile.name || '')
      setTitleFr(activeProfile.title_fr || '')
      setTitleEn(activeProfile.title_en || '')
      setBioFr(activeProfile.bio_fr || '')
      setBioEn(activeProfile.bio_en || '')
      setShowGithub(activeProfile.show_github ?? true)
      setIsPublic(activeProfile.is_public ?? true)
      setProjectsBeforeExperiences(activeProfile.projects_before_experiences || false)
      setSkillsOrder(activeProfile.skills_order || [])
      
      const currentProfileObj = profiles[activeProfileIndex]
      setItems(currentProfileObj?.items || [])
    }
  }, [activeProfileIndex, profiles])

  async function loadData() {
    setLoading(true)
    const supabase = createClient()
    
    // Charger tous les profils et leurs items
    const allProfilesData = await getAllProfiles()
    setProfiles(allProfilesData)
    if (allProfilesData.length > 0 && activeProfileIndex >= allProfilesData.length) {
      setActiveProfileIndex(0)
    }

    // Charger toutes les données disponibles (publiées et brouillons)
    const [skillsRes, expRes, eduRes, projRes, catsRes] = await Promise.all([
      supabase.from('skills').select('id, name_fr, status').order('position'),
      supabase.from('experiences').select('id, title_fr, company, status').order('position'),
      supabase.from('educations').select('id, title_fr, institution, status').order('position'),
      supabase.from('projects').select('id, title_fr, visibility').order('position'),
      supabase.from('skill_categories').select('*').order('position')
    ])

    setAvailableData({
      skill: skillsRes.data || [],
      experience: expRes.data || [],
      education: eduRes.data || [],
      project: projRes.data || []
    })
    setSkillCategories(catsRes.data || [])

    setLoading(false)
  }

  const getOrderedCategories = () => {
    if (!skillCategories || skillCategories.length === 0) return []
    if (!skillsOrder || !Array.isArray(skillsOrder) || skillsOrder.length === 0) return [...skillCategories]
    return [...skillCategories].sort((a, b) => {
      const indexA = skillsOrder.indexOf(a.id)
      const indexB = skillsOrder.indexOf(b.id)
      if (indexA !== -1 && indexB !== -1) return indexA - indexB
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      return (a.position || 0) - (b.position || 0)
    })
  }

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const currentOrdered = getOrderedCategories()
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === currentOrdered.length - 1) return
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const newOrder = [...currentOrdered]
    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIndex]
    newOrder[targetIndex] = temp
    
    setSkillsOrder(newOrder.map(cat => cat.id))
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
    if (message) setMessage(null)
  }

  function isSelected(type: string, id: string) {
    return items.some(item => item.item_type === type && item.item_id === id)
  }

  async function handleSave() {
    if (!activeProfile) return
    setSaving(true)
    setError(null)
    
    const cleanItems = items.map(item => ({
      item_type: item.item_type,
      item_id: item.item_id
    }))

    const [itemsRes, metaRes] = await Promise.all([
      updateProfileItems(activeProfile.id, cleanItems, {
        projects_before_experiences: projectsBeforeExperiences
      }),
      updateProfileMetadata(activeProfile.id, {
        name,
        title_fr: titleFr,
        title_en: titleEn,
        bio_fr: bioFr,
        bio_en: bioEn,
        show_github: showGithub,
        is_public: isPublic,
        skills_order: skillsOrder
      })
    ])

    if (itemsRes.error || metaRes.error) {
      setError(itemsRes.error || metaRes.error || 'Erreur lors de la sauvegarde')
      setMessage(null)
    } else {
      setError(null)
      setMessage({ type: 'success', text: 'Profil sauvegardé avec succès !' })
      const updatedProfiles = await getAllProfiles()
      setProfiles(updatedProfiles)
    }
    
    setSaving(false)
  }

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!newProfileName.trim()) return
    setSaving(true)
    const res = await createProfile(newProfileName.trim())
    if (res.error) {
      setError(res.error)
    } else {
      setNewProfileName('')
      setShowCreateModal(false)
      const updatedProfiles = await getAllProfiles()
      setProfiles(updatedProfiles)
      setActiveProfileIndex(updatedProfiles.length - 1)
      setMessage({ type: 'success', text: 'Nouveau profil créé !' })
    }
    setSaving(false)
  }

  async function handleDeleteProfile() {
    if (!activeProfile) return
    setSaving(true)
    const res = await deleteProfile(activeProfile.id)
    if (res.error) {
      setError(res.error)
      setShowDeleteModal(false)
    } else {
      setShowDeleteModal(false)
      const updatedProfiles = await getAllProfiles()
      setProfiles(updatedProfiles)
      setActiveProfileIndex(0)
      setMessage({ type: 'success', text: 'Profil supprimé !' })
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  const renderSection = (title: string, type: 'skill' | 'experience' | 'education' | 'project', dataList: any[], renderItem: (item: any) => React.ReactNode) => (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        <h2 className="text-xl font-heading font-semibold text-white">{title}</h2>
        <span className="text-xs font-medium text-white/50 px-3 py-1 bg-[#111111] rounded-full border border-white/10">
          {items.filter(i => i.item_type === type).length} inclus
        </span>
      </div>
      <div className={`mt-2 flex-1 max-h-[22rem] overflow-y-auto pr-2 custom-scrollbar ${type === 'skill' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2 content-start' : 'space-y-2'}`}>
        {dataList.length === 0 ? (
          <p className="text-sm text-white/40 italic">Aucun élément disponible.</p>
        ) : (
          dataList.map(item => {
            const selected = isSelected(type, item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(type, item.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-300 text-left ${selected ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-[#222222] text-white/70 border border-transparent hover:border-white/5'}`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {selected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 opacity-40" />}
                </div>
                <div className="flex-1 min-w-0">
                  {renderItem(item)}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-full w-full">
      {/* Light Header */}
      <div className="bg-[#F5F5F7] p-10 md:p-16 flex-shrink-0 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-1.5 h-16 bg-primary rounded-full shrink-0"></div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter italic text-[#111111]">
                Profils de CV
              </h1>
              <p className="text-[#111111]/70 mt-3 font-sans text-lg max-w-md leading-relaxed">
                Gérez vos différents profils et personnalisez le contenu de chaque CV.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {activeProfile && (
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#222222] text-white border border-black/10 font-medium rounded-full transition-all duration-300 text-sm hover:scale-105 active:scale-95 whitespace-nowrap shadow-xl"
              >
                <Eye className="w-5 h-5 text-primary" />
                Aperçu PDF
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full transition-all duration-300 text-sm hover:scale-105 active:scale-95 disabled:opacity-50 whitespace-nowrap shadow-xl shadow-primary/20"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Enregistrer le profil
            </button>
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
          {message && (
            <div className={`p-4 rounded-xl border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
              {message.text}
            </div>
          )}

          {/* Profile Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1A1A1A] p-4 rounded-3xl border border-white/5 shadow-xl">
            <div className="flex flex-wrap items-center gap-3">
              {profiles.map((pObj, idx) => {
                const p = pObj.profile
                const isActive = idx === activeProfileIndex
                return (
                  <button
                    key={p.id}
                    onClick={() => { setActiveProfileIndex(idx); setMessage(null); setError(null); }}
                    className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 flex items-center gap-2.5 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
                        : 'text-white/70 hover:bg-[#222222] hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{p.name}</span>
                    {p.is_default && <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Défaut</span>}
                    {!p.is_public && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">Privé</span>}
                  </button>
                )
              })}
              <button
                onClick={() => { setError(null); setMessage(null); setShowCreateModal(true); }}
                className="px-5 py-3 rounded-2xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau profil</span>
              </button>
            </div>

            {activeProfile && !activeProfile.is_default && (
              <button
                onClick={() => { setError(null); setMessage(null); setShowDeleteModal(true); }}
                className="px-5 py-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 flex items-center gap-2 text-sm font-medium ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer ce profil</span>
              </button>
            )}
          </div>

          {/* Profile Customization Panel */}
          {activeProfile && (
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-white">Paramètres du profil : {activeProfile.name}</h2>
                  <p className="text-sm text-white/50 mt-1">Personnalisez le nom, la biographie spécifique et les options de ce CV.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white/70">Nom du profil</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ingénieur Logiciel"
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="title_fr" className="text-sm font-medium text-white/70">Titre professionnel sur le CV (FR) - Optionnel</label>
                  <input
                    id="title_fr"
                    type="text"
                    value={titleFr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    placeholder="Ex: Ingénieur en Sûreté de Fonctionnement & Électronique"
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                  <p className="text-xs text-white/40">Si vide, le titre général du site sera utilisé sur le PDF.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="title_en" className="text-sm font-medium text-white/70">Titre professionnel sur le CV (EN) - Optionnel</label>
                    <TranslateFieldButton sourceId="title_fr" targetId="title_en" onTranslate={(text) => setTitleEn(text)} />
                  </div>
                  <input
                    id="title_en"
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Ex: RAMS & Electronics Engineer"
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio_fr" className="text-sm font-medium text-white/70">Résumé du profil (Bio FR) - Optionnel</label>
                  <textarea
                    id="bio_fr"
                    value={bioFr}
                    onChange={(e) => setBioFr(e.target.value)}
                    placeholder="Si vide, la bio générale du site sera utilisée."
                    rows={4}
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all custom-scrollbar"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="bio_en" className="text-sm font-medium text-white/70">Résumé du profil (Bio EN) - Optionnel</label>
                    <TranslateFieldButton sourceId="bio_fr" targetId="bio_en" onTranslate={(text) => setBioEn(text)} />
                  </div>
                  <textarea
                    id="bio_en"
                    value={bioEn}
                    onChange={(e) => setBioEn(e.target.value)}
                    placeholder="If empty, the default site bio will be used."
                    rows={4}
                    className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all custom-scrollbar"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#111111] rounded-2xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-medium text-white">Afficher le lien GitHub sur le CV</h4>
                    <p className="text-xs text-white/50 mt-0.5">Désactivez pour masquer GitHub (ex: profil 100% RAMS).</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGithub(!showGithub)}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 ${showGithub ? 'bg-primary' : 'bg-white/10'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${showGithub ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#111111] rounded-2xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-medium text-white">Proposer en téléchargement public</h4>
                    <p className="text-xs text-white/50 mt-0.5">Permet aux visiteurs de télécharger ce CV depuis le site.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 ${isPublic ? 'bg-primary' : 'bg-white/10'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section Order Toggle */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div>
              <h3 className="text-lg font-heading font-semibold text-white">Ordre des sections sur le CV</h3>
              <p className="text-sm text-white/50 mt-1">
                Choisissez quelle section principale afficher en premier sur la version imprimable du CV.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setProjectsBeforeExperiences(!projectsBeforeExperiences)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 text-sm font-medium ${
                projectsBeforeExperiences 
                  ? 'bg-primary/20 text-primary border-primary/30' 
                  : 'bg-[#222222] text-white/70 border-white/10 hover:bg-[#282828]'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${projectsBeforeExperiences ? 'bg-primary animate-pulse' : 'bg-white/30'}`} />
              {projectsBeforeExperiences ? 'Projets affichés avant Expériences' : 'Expériences affichées avant Projets'}
            </button>
          </div>

          {/* Skill Categories Order Toggle */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-xl transition-all duration-300">
            <div 
              className={`flex items-start justify-between gap-4 ${!isPrioritySectionOpen ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
              onClick={() => !isPrioritySectionOpen && setIsPrioritySectionOpen(true)}
            >
              <div>
                <h3 className="text-lg font-heading font-semibold text-white">Ordre de priorité des catégories de compétences sur le CV</h3>
                {!isPrioritySectionOpen ? (
                  <div className="mt-2 text-sm text-white/60 flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white/80">Ordre actuel :</span>
                    {getOrderedCategories().map((c, i) => (
                      <span key={c.id}>
                        {i > 0 && <span className="mx-1 text-white/30">➔</span>}
                        {c.name_fr}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/50 mt-1">
                    Utilisez les flèches ⬆️ ⬇️ pour définir l&apos;ordre d&apos;affichage des catégories dans la barre latérale du PDF pour ce profil.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsPrioritySectionOpen(!isPrioritySectionOpen); }}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                {isPrioritySectionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            
            {isPrioritySectionOpen && (
              <div className="flex flex-wrap gap-3 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                {getOrderedCategories().map((cat, index, arr) => (
                  <div 
                    key={cat.id} 
                    className="flex items-center gap-2 bg-[#222222] border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 transition-all hover:border-white/20"
                  >
                    <span className="text-xs font-mono text-primary font-bold">#{index + 1}</span>
                    <span className="font-medium">{cat.name_fr}</span>
                    <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
                      <button
                        type="button"
                        onClick={() => moveCategory(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                        title="Monter"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCategory(index, 'down')}
                        disabled={index === arr.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                        title="Descendre"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderSection('Compétences', 'skill', availableData.skill, item => (
              <span className="font-medium text-sm block truncate">{item.name_fr}</span>
            ))}
            {renderSection('Expériences', 'experience', availableData.experience, item => (
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-medium text-sm leading-tight text-white/90 flex-1">{item.title_fr}</span>
                  {item.status === 'draft' ? (
                    <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[9px] uppercase font-bold tracking-wider shrink-0 border border-orange-500/20">Brouillon (CV)</span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[9px] uppercase font-bold tracking-wider shrink-0 border border-green-500/20">Site web</span>
                  )}
                </div>
                <span className="text-xs text-white/50 truncate">chez {item.company}</span>
              </div>
            ))}
            {renderSection('Formations', 'education', availableData.education, item => (
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm leading-tight text-white/90">{item.title_fr}</span>
                <span className="text-xs text-white/50 truncate">à {item.institution}</span>
              </div>
            ))}
            {renderSection('Projets', 'project', availableData.project, item => (
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-medium text-sm leading-tight text-white/90 flex-1">{item.title_fr}</span>
                  {item.visibility === 'draft' ? (
                    <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[9px] uppercase font-bold tracking-wider shrink-0 border border-orange-500/20">Brouillon (CV)</span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[9px] uppercase font-bold tracking-wider shrink-0 border border-green-500/20">Site web</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live PDF Preview Modal */}
      {showPreviewModal && activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-[2.5rem] w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-[#111111]">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-heading font-semibold text-white">Aperçu du CV : {activeProfile.name}</h3>
                <div className="flex bg-[#222222] p-1 rounded-full border border-white/5">
                  <button
                    onClick={() => setPreviewLang('fr')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${previewLang === 'fr' ? 'bg-primary text-primary-foreground shadow-md' : 'text-white/60 hover:text-white'}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => setPreviewLang('en')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${previewLang === 'en' ? 'bg-primary text-primary-foreground shadow-md' : 'text-white/60 hover:text-white'}`}
                  >
                    English
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 w-full bg-[#222222] relative">
              <iframe
                src={`/api/cv/${activeProfile.id}/${previewLang}?inline=true`}
                className="w-full h-full border-none"
                title="Aperçu CV PDF"
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Profile Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-heading font-semibold text-white mb-2">Créer un nouveau profil</h3>
            <p className="text-sm text-white/50 mb-6">Donnez un nom explicite à ce CV (ex: Ingénieur Logiciel).</p>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateProfile} className="space-y-6">
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Nom du profil"
                required
                className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setError(null); setShowCreateModal(false); }}
                  className="px-6 py-2.5 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !newProfileName.trim()}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-heading font-semibold text-white mb-2">Supprimer le profil ?</h3>
            <p className="text-sm text-white/50 mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement le profil <span className="text-white font-medium">"{activeProfile.name}"</span> ? Cette action est irréversible.
            </p>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm mb-4">
                {error}
              </div>
            )}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setError(null); setShowDeleteModal(false); }}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteProfile}
                disabled={saving}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
