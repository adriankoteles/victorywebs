import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Victory Webs Agency OS",
  description: "Proprietární agenturní systém pro kompletní správu klientů",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${montserrat.variable} antialiased`}>
      <body className="font-sans min-h-screen bg-background text-foreground selection:bg-black/10">
        {children}
      </body>
    </html>
  );
}
