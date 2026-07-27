import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDictionary, Locale } from "@/lib/i18n/dictionaries";
import { getPublicProfiles } from "@/lib/actions/cv";

export default async function PublicLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  const profiles = await getPublicProfiles();
  
  return (
    <>
      <Header lang={lang} dict={dict} profiles={profiles} />
      <main className="flex-1 w-full">
        {props.children}
      </main>
      <Footer lang={lang} profiles={profiles} />
    </>
  );
}
