import { getStandardProfile } from '@/lib/actions/cv'
import { getExperiences, getSkillCategories, getSkills, getEducations, getProjects, getActivePhoto } from '@/lib/api/content'
import { getSiteSettings } from '@/lib/actions/settings'

export async function getCvPdfData(lang: 'fr' | 'en', profileId: string = 'standard', origin: string = 'https://marcien-bn.vercel.app') {
  const { items } = await getStandardProfile()
  const settings = await getSiteSettings()
  
  const [experiences, skills, educations, projects, categories, photoUrl] = await Promise.all([
    getExperiences(undefined, true),
    getSkills(undefined, true),
    getEducations(true),
    getProjects(undefined, undefined, true),
    getSkillCategories(),
    getActivePhoto()
  ])
  
  const getPosition = (type: string, id: string) => items.find(i => i.item_type === type && i.item_id === id)?.position ?? 999

  const selectedExperiences = experiences.filter(e => items.some(i => i.item_type === 'experience' && i.item_id === e.id))
  const orderedExperiences = selectedExperiences.sort((a, b) => {
    const dateA = new Date(a.start_date || '1970-01-01').getTime();
    const dateB = new Date(b.start_date || '1970-01-01').getTime();
    return dateB - dateA;
  }).map(e => ({
    title: lang === 'en' && e.title_en ? e.title_en : e.title_fr,
    company: e.company,
    location: e.location,
    startDate: e.start_date,
    endDate: e.end_date,
    description: lang === 'en' && e.description_en ? e.description_en : e.description_fr,
  }))

  const selectedSkills = skills.filter(s => items.some(i => i.item_type === 'skill' && i.item_id === s.id))
  const orderedSkills = selectedSkills.sort((a, b) => getPosition('skill', a.id) - getPosition('skill', b.id)).map(s => ({
    name: lang === 'en' && s.name_en ? s.name_en : s.name_fr,
    level: s.level,
    category_id: s.category_id,
  }))

  const groupedSkills = categories.map(cat => ({
    name: lang === 'en' && cat.name_en ? cat.name_en : cat.name_fr,
    skills: orderedSkills.filter(s => s.category_id === cat.id)
  })).filter(c => c.skills.length > 0)

  const selectedEducations = educations.filter(e => items.some(i => i.item_type === 'education' && i.item_id === e.id))
  const orderedEducations = selectedEducations.sort((a, b) => {
    const dateA = new Date(a.start_date || '1970-01-01').getTime();
    const dateB = new Date(b.start_date || '1970-01-01').getTime();
    return dateB - dateA;
  }).map(e => ({
    degree: lang === 'en' && e.title_en ? e.title_en : e.title_fr,
    institution: e.institution,
    location: e.location,
    startDate: e.start_date,
    endDate: e.end_date,
    description: lang === 'en' && e.description_en ? e.description_en : e.description_fr,
  }))

  const selectedProjects = projects.filter(p => items.some(i => i.item_type === 'project' && i.item_id === p.id))
  const orderedProjects = selectedProjects.sort((a, b) => getPosition('project', a.id) - getPosition('project', b.id)).map(p => ({
    title: lang === 'en' && p.title_en ? p.title_en : p.title_fr,
    description: lang === 'en' && p.context_en ? p.context_en : p.context_fr,
  }))

  const fullName = "Marcien BALOUBOULA NZOUSSI"
  const title = lang === 'en' && settings.hero_title_en ? settings.hero_title_en : (settings.hero_title_fr || "Ingénieur Sûreté de Fonctionnement & Développement")
  const cleanTitle = title.replace(/\*\*/g, '')
  const interests = lang === 'en' && settings.interests_en ? settings.interests_en : (settings.interests_fr || "")

  return {
    lang,
    personalInfo: {
      fullName,
      title: cleanTitle,
      email: settings.contact_email || "marcienbalouboula@gmail.com",
      phone: settings.contact_phone || "+33 6 52 14 26 45",
      address: settings.contact_address || "Paris, France",
      linkedin: settings.social_linkedin || "https://www.linkedin.com/in/marcien-balouboula-nzoussi-b37970215",
      github: settings.social_github || "https://github.com/Marcien-99",
      website: `${origin}/${lang}`,
      about: lang === 'en' ? "Versatile RAMS & Software Engineer specialized in system reliability and full-stack development." : "Ingénieur polyvalent avec une double compétence en Sûreté de Fonctionnement et en Ingénierie Logicielle, spécialisé dans l'optimisation et la fiabilisation des systèmes complexes.",
      photoUrl,
      interests
    },
    experiences: orderedExperiences,
    skillCategories: groupedSkills,
    educations: orderedEducations,
    projects: orderedProjects,
  }
}
