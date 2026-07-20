export type ItemDomain = 'surete_fonctionnement' | 'electronique' | 'automatisme' | 'informatique_ia';
export type ProjectStatus = 'en_cours' | 'termine';
export type ContentStatus = 'draft' | 'published';

export type SkillCategory = {
  id: string;
  name_fr: string;
  name_en: string;
  position: number;
};

export type Skill = {
  id: string;
  category_id: string;
  name_fr: string;
  name_en: string;
  en_auto_generated: boolean;
  level?: number;
  status: ContentStatus;
  position: number;
  domains: ItemDomain[];
};

export type Experience = {
  id: string;
  title_fr: string;
  title_en: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description_fr?: string;
  description_en?: string;
  en_auto_generated: boolean;
  status: ContentStatus;
  position: number;
  domains: ItemDomain[];
};

export type Education = {
  id: string;
  title_fr: string;
  title_en: string;
  institution: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description_fr?: string;
  description_en?: string;
  en_auto_generated: boolean;
  status: ContentStatus;
  position: number;
  domains: ItemDomain[];
};

export type ProjectGalleryImage = {
  url: string;
  position: number;
  caption_fr?: string;
  caption_en?: string;
};

export type ProjectLink = {
  url: string;
  position: number;
  label_fr?: string;
  label_en?: string;
};

export type Project = {
  id: string;
  title_fr: string;
  title_en: string;
  slug: string;
  context_fr?: string;
  context_en?: string;
  approach_fr?: string;
  approach_en?: string;
  result_fr?: string;
  result_en?: string;
  en_auto_generated: boolean;
  status: ProjectStatus;
  visibility: ContentStatus;
  position: number;
  domains: ItemDomain[];
  gallery?: ProjectGalleryImage[];
  links?: ProjectLink[];
};
