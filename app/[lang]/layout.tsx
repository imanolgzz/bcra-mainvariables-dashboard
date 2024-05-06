import { i18n, type Locale } from "@/i18n-config";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Outfit } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { getDictionary } from "@/get-dictionary";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], weight: ['400','500','600', '700','800','900'] });

export const metadata: Metadata = {
  title: "BCRA Dashboard",
  description: "BCRA Dashboard by Imanol González",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children, params: { lang }
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const dictionary = await getDictionary(lang);
  return (
    <html lang={lang}>
      <body className={outfit.className}>
        <Navbar t={dictionary["navbar"]}/>
        <div className = "pageContainer">
          {children}
        </div>
      </body>
    </html>
  );
}
