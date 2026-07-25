import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

const SIDEBAR_BG = '#f1f5f9';
const TEXT_DARK = '#0f172a';
const TEXT_MUTED = '#475569';
const TEXT_LIGHT = '#64748b';
const PRIMARY = '#0ea5e9';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: TEXT_DARK,
    lineHeight: 1.4,
  },
  sidebar: {
    width: '32%',
    backgroundColor: SIDEBAR_BG,
    padding: '24px 16px',
    height: '100%',
    justifyContent: 'space-between',
  },
  main: {
    width: '68%',
    padding: '24px 20px',
    height: '100%',
  },
  
  /* --- Sidebar Styles --- */
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 86,
    height: 86,
    borderRadius: 43,
    objectFit: 'cover',
  },
  sidebarSection: {
    marginBottom: 14,
  },
  sidebarTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY,
    textTransform: 'uppercase',
    marginBottom: 6,
    borderBottom: '1px solid #cbd5e1',
    paddingBottom: 2,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 8.5,
    color: TEXT_DARK,
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: TEXT_DARK,
    marginBottom: 3,
  },
  skillListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillPill: {
    fontSize: 8.5,
    color: TEXT_MUTED,
    marginRight: 4,
    marginBottom: 2,
  },
  interestText: {
    fontSize: 8.5,
    color: TEXT_DARK,
  },

  /* --- Main Styles --- */
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_DARK,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY,
    marginBottom: 4,
  },
  about: {
    fontSize: 9,
    color: TEXT_MUTED,
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  mainContentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainSection: {
    marginBottom: 4,
  },
  mainSectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_DARK,
    textTransform: 'uppercase',
    marginBottom: 6,
    borderBottom: `1px solid ${PRIMARY}`,
    paddingBottom: 2,
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  itemTitleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: TEXT_DARK,
  },
  itemCompany: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: PRIMARY,
  },
  itemDate: {
    fontSize: 8.5,
    color: PRIMARY,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    width: 90,
  },
  itemDesc: {
    fontSize: 8.5,
    color: TEXT_MUTED,
    marginTop: 4,
    lineHeight: 1.4,
  }
});

interface StandardTemplateProps {
  data: any;
}

export const StandardTemplate = ({ data }: StandardTemplateProps) => {
  const { lang, personalInfo, experiences, educations, skillCategories, projects } = data;

  const t = {
    contact: lang === 'en' ? 'Contact' : 'Contact',
    skills: lang === 'en' ? 'Skills' : 'Compétences',
    languages: lang === 'en' ? 'Languages' : 'Langues',
    interests: lang === 'en' ? 'Interests' : 'Centres d\'intérêt',
    experiences: lang === 'en' ? 'Professional Experience' : 'Expériences Professionnelles',
    educations: lang === 'en' ? 'Education' : 'Formations',
    projects: lang === 'en' ? 'Selected Projects' : 'Projets Récents',
    present: lang === 'en' ? 'Present' : 'Présent'
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t.present;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* SIDEBAR */}
        <View style={styles.sidebar}>
          {personalInfo.photoUrl && (
            <View style={styles.photoContainer}>
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            </View>
          )}

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>{t.contact}</Text>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo.address && <Text style={styles.contactItem}>{personalInfo.address}</Text>}
            {personalInfo.linkedin && (
              <View style={styles.contactItem}>
                <Link src={personalInfo.linkedin} style={{ color: TEXT_DARK, textDecoration: 'none' }}>LinkedIn</Link>
              </View>
            )}
            {personalInfo.github && (
              <View style={styles.contactItem}>
                <Link src={personalInfo.github} style={{ color: TEXT_DARK, textDecoration: 'none' }}>GitHub</Link>
              </View>
            )}
            {personalInfo.website && (
              <View style={styles.contactItem}>
                <Link src={personalInfo.website} style={{ color: TEXT_DARK, textDecoration: 'none' }}>{lang === 'en' ? 'Portfolio' : 'Site web'}</Link>
              </View>
            )}
          </View>

          {skillCategories && skillCategories.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>{t.skills}</Text>
              {skillCategories.map((cat: any, i: number) => (
                <View key={i} style={styles.skillCategory} wrap={false}>
                  <Text style={styles.skillTitle}>{cat.name}</Text>
                  <View style={styles.skillListContainer}>
                    {cat.skills.map((s: any, j: number) => (
                      <View key={j} style={styles.skillPill}>
                        <Text>{s.name}{j < cat.skills.length - 1 ? ' •' : ''}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {personalInfo.interests && (
            <View style={styles.sidebarSection} wrap={false}>
              <Text style={styles.sidebarTitle}>{t.interests}</Text>
              <Text style={styles.interestText}>{personalInfo.interests}</Text>
            </View>
          )}
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.name}>{personalInfo.fullName}</Text>
            <Text style={styles.title}>{personalInfo.title}</Text>
            {personalInfo.about && <Text style={styles.about}>{personalInfo.about}</Text>}
          </View>

          <View style={styles.mainContentWrapper}>
            {experiences && experiences.length > 0 && (
              <View style={styles.mainSection}>
                <Text style={styles.mainSectionTitle}>{t.experiences}</Text>
                {experiences.map((exp: any, i: number) => (
                  <View key={i} style={styles.item} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleContainer}>
                        <Text style={styles.itemTitle}>{exp.title}</Text>
                        <Text style={styles.itemCompany}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</Text>
                      </View>
                      <Text style={styles.itemDate}>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</Text>
                    </View>
                    {exp.description && <Text style={styles.itemDesc}>{exp.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {educations && educations.length > 0 && (
              <View style={styles.mainSection}>
                <Text style={styles.mainSectionTitle}>{t.educations}</Text>
                {educations.map((edu: any, i: number) => (
                  <View key={i} style={styles.item} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleContainer}>
                        <Text style={styles.itemTitle}>{edu.degree}</Text>
                        <Text style={styles.itemCompany}>{edu.institution}{edu.location ? ` • ${edu.location}` : ''}</Text>
                      </View>
                      <Text style={styles.itemDate}>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</Text>
                    </View>
                    {edu.description && <Text style={styles.itemDesc}>{edu.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {projects && projects.length > 0 && (
              <View style={styles.mainSection}>
                <Text style={styles.mainSectionTitle}>{t.projects}</Text>
                {projects.map((proj: any, i: number) => (
                  <View key={i} style={styles.item} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleContainer}>
                        <Text style={styles.itemTitle}>{proj.title}</Text>
                      </View>
                    </View>
                    {proj.description && <Text style={styles.itemDesc}>{proj.description}</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
