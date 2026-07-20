import { getSkillCategories } from "@/lib/api/content"
import { SkillForm } from "../SkillForm"

export default async function NewSkillPage() {
  const categories = await getSkillCategories()

  return <SkillForm categories={categories} />
}
