import ReservesClient from './reservesClient';
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function Reserves({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return(
    <>
      <ReservesClient t={dictionary["reserves"]}/>
    </>
  )
}