import { getProjects } from "@/lib/api/content";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Projets - Marcien B. Nzoussi",
  description: "Mes études de cas et réalisations",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient projects={projects} />;
}
