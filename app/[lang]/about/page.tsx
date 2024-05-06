'use server';
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function About({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const t = dictionary["about"];

  return (
    <>
      <h1>{t.title}</h1>
      <div style={{width: "90%", display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"start", gap: "1rem", textAlign:"justify"}}>
        <p>
          {t.description} <br />
          <a style={{color:"blue"}} href="https://www.bcra.gob.ar/Catalogo/apis.asp?fileName=principales-variables-v1" target="_blank">{t.apiText}</a> <br />
          <a style={{color:"blue"}} href="https://www.bcra.gob.ar/" target="_blank">{t.bcraPage}</a>
        </p>
        <p>
          <b>{t.repoText}</b> <br />
          <a style={{color:"blue"}} href="https://github.com/imanolgzz/bcra-mainvariables-dashboard" target="_blank">https://github.com/imanolgzz/bcra-mainvariables-dashboard</a><br/>
        </p>
        <p>
          <b>{t.contactText}</b> <br />
          {t.webPage}:  <a style={{color:"blue"}} href="https://imanolgzz.com" target="_blank">https://imanolgzz.com</a><br/>
          {t.X}:  <a style={{color:"blue"}} href="https://twitter.com/imanolgzzDev" target="_blank">@imanolgzzDev</a> <br />
          {t.LinkedIn}:  <a style={{color:"blue"}} href="https://www.linkedin.com/in/imanolgzz/" target="_blank">imanolgzz</a>
        </p>
        
        <p>
        <b>{t.Version} 1.1.1</b> <br />
          {t.LastUpdate}: 2024-05-06 <br /> 
        </p>
      </div>
      
      
    </>
  )
}