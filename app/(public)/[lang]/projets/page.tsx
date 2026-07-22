import { getProjects } from "@/lib/api/content";
import ProjectsClient from "./ProjectsClient";
import { getDictionary, Locale } from "@/lib/i18n/dictionaries";

export const metadata = {
  title: "Projets - Marcien B. Nzoussi",
  description: "Mes études de cas et réalisations",
};

export default async function ProjectsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  const projects = await getProjects();
  return <ProjectsClient projects={projects} lang={lang} dict={dict} />;
}
