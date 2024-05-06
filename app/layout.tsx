import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Outfit } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], weight: ['400','500','600', '700','800','900'] });

export const metadata: Metadata = {
  title: "BCRA Dashboard",
  description: "BCRA Dashboard by Imanol González",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Navbar/>
        <div className = "pageContainer">
          {children}
        </div>
      </body>
    </html>
  );
}
