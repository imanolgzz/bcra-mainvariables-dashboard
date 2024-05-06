import ReverseReposClient from "./reverseReposClient";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function ReverseRepos({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <ReverseReposClient t={dictionary["reverseRepos"]}/>
  );
}