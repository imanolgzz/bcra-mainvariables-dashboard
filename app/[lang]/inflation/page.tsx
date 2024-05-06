import InflationRateClient from "./inflationRateClient";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function Inflation({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <InflationRateClient t={dictionary["inflation"]}/>
  );
}