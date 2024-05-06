'use server';
import HomeClient from "@/components/home/homeClient";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <>
      <HomeClient t={dictionary["home"]}/>
    </>
  );
}
