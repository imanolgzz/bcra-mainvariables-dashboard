import InterestRateClient from "./interestRateClient";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function InterestRate({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <InterestRateClient t={dictionary["interestRates"]}/>
  );
}