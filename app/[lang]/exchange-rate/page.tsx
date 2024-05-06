import ExchangeRateClient from "./exchangeRateClient"
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function ExchangeRate({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return(
    <>
      <ExchangeRateClient t ={dictionary["exchangeRate"]}/>
    </>
  )
}