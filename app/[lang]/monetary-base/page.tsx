import MonetaryBaseClient from "./monetaryBaseClient";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function MonetaryBase({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <MonetaryBaseClient t={dictionary["monetaryBase"]}/>
  );
}