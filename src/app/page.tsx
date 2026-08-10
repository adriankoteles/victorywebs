import { LandingPage } from "@/components/public/LandingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Victory Webs | Prémiové weby & SaaS aplikace",
  description: "Stavíme weby, které nekompromisně dominují trhu. Využíváme nejmodernější technologie (Next.js) pro bleskovou rychlost. Čistý kód, naše strategie a váš růst.",
};

export default function Home() {
  return <LandingPage />;
}
