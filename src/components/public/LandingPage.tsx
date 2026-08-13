"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Target, ShieldCheck, CheckCircle2, UserCircle, XCircle, Clock, LayoutTemplate, MessageCircle, ChevronDown, MonitorSmartphone, Monitor, Smartphone, Gauge, KeySquare } from "lucide-react";
import { ContactModal } from "./ContactModal";

// --- LUXUSNÍ ANIMACE ---

const fadeInVariants: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 } 
  }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const FadeIn = ({ children, className = "", id = "" }: { children: React.ReactNode, className?: string, id?: string }) => (
  <motion.div
    id={id}
    variants={fadeInVariants}
    className={className}
  >
    {children}
  </motion.div>
);

const StaggerSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Hladký Reveal Text po slovech
const TextReveal = ({ text, className = "" }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px" }} 
      variants={{
        visible: { transition: { staggerChildren: 0.05 } }
      }}
      className={className}
    >
      {words.map((word, i) => {
        const isHighlighted = word.startsWith("*") && word.endsWith("*");
        const cleanWord = isHighlighted ? word.slice(1, -1) : word;
        return (
          <motion.span 
            key={i} 
            variants={{
              hidden: { opacity: 0, y: 20, rotateX: -20 },
              visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", damping: 20, stiffness: 100 } }
            }}
            className={`inline-block mr-[0.3em] origin-bottom ${
              isHighlighted 
                ? "bg-[#191919] text-white px-3 py-0.5 rounded-xl md:rounded-2xl -rotate-2 shadow-lg mx-1" 
                : ""
            }`}
          >
            {cleanWord}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-slate-200/60 last:border-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full py-6 text-left focus:outline-none group"
      >
        <span className="text-lg font-bold text-slate-900 transition-colors group-hover:text-[#191919]">{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "rotate-180 bg-[#191919] border-[#191919]" : ""}`}>
          <ChevronDown className={`w-4 h-4 transition-colors duration-500 ${isOpen ? "text-white" : "text-slate-500"}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="pb-6 text-slate-500 leading-relaxed text-lg">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HLAVNÍ STRÁNKA ---

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-slate-200 overflow-x-hidden font-sans">
      
      {/* 1. HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2 text-slate-900">
            Victory Webs
          </div>
          <Link href="/portal" className="px-5 py-2.5 bg-[#191919] text-white hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-black/10 rounded-full text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2">
            <UserCircle className="w-4 h-4" /> Klientský portál
          </Link>
        </div>
      </header>

      {/* 2. HERO SEKCE & LIVE METRIKY */}
      <section className="relative pt-48 pb-20 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Pozadí hero sekce */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full bg-[#fcfcfc]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(#00000033_1px,#fcfcfc_1px)] bg-[size:20px_20px] "></div>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(100%_100%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_90%)]"></div>
          </div>
        </div>

        <StaggerSection className="max-w-4xl mx-auto text-center relative z-10 mb-20">
          
          <FadeIn className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest text-[#191919] mb-8 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#191919] animate-pulse" />
            Přijímáme max. 2 projekty měsíčně
          </FadeIn>
          
          <TextReveal text="Váš web má *prodávat.* Ne jen existovat." className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-[#191919]" />
          
          <FadeIn className="text-lg md:text-xl text-neutral-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stavíme dravé webové prezentace a aplikace. Získejte dominanci na trhu s vlastním klientským portálem pro sledování vývoje v reálném čase.
          </FadeIn>
          
          <FadeIn className="flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="w-full sm:w-auto px-10 py-5 bg-[#191919] text-white rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-xl shadow-black/10"
            >
              Zažádat o spolupráci <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById("reseni");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }} 
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-50 hover:shadow-md transition-all duration-300 text-lg"
            >
              Jak to funguje
            </button>
          </FadeIn>

        </StaggerSection>

        {/* Hero Metriky */}
        <StaggerSection className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-200/50">
          <FadeIn className="flex items-center gap-3 justify-center text-slate-600 font-semibold">
            <Gauge className="w-6 h-6 text-[#191919]" /> Bleskové načtení &lt; 1s
          </FadeIn>
          <FadeIn className="flex items-center gap-3 justify-center text-slate-600 font-semibold md:border-x border-slate-200/50">
            <LayoutTemplate className="w-6 h-6 text-[#191919]" /> 100% Přehled v portálu
          </FadeIn>
          <FadeIn className="flex items-center gap-3 justify-center text-slate-600 font-semibold">
            <ShieldCheck className="w-6 h-6 text-[#191919]" /> Nula starostí s hostingem
          </FadeIn>
        </StaggerSection>

      </section>

      {/* 3. SEKCE "TYPY WEBU A ŘEŠENÍ" (MERGED) */}
      <section id="reseni" className="py-32 px-6 bg-[#191919] text-white border-y border-white/5">
        <StaggerSection className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <FadeIn className="inline-flex items-center justify-center px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 mb-6 border border-white/10">
              Naše služby
            </FadeIn>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">Co pro vás můžeme postavit?</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Každý byznys potřebuje něco jiného. Vyberte si řešení na míru vašim aktuálním obchodním cílům.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. Landing Page */}
            <FadeIn className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors flex flex-col">
              <div className="mb-6">
                <Target className="w-10 h-10 text-white mb-4" />
                <h3 className="text-2xl font-bold mb-2">1. Landing Page</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Jednostránkový web bez složitého menu, který směřuje pozornost k jediné akci. Ideální pro PPC a kampaně na sociálních sítích.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Vysoký konverzní poměr</li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Rychlý sběr leadů a prodej</li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Bleskové spuštění</li>
              </ul>
              <div className="pt-6 border-t border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Dodání</span>
                <p className="font-bold text-white">7 – 10 dnů</p>
              </div>
            </FadeIn>

            {/* 2. Webová Prezentace */}
            <FadeIn className="bg-white/10 border-2 border-white/20 rounded-[2rem] p-8 shadow-2xl shadow-black/50 hover:-translate-y-2 transition-all duration-500 flex flex-col relative transform md:-translate-y-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-[#191919] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                Nejoblíbenější
              </div>
              <div className="mb-6 mt-4">
                <MonitorSmartphone className="w-10 h-10 text-white mb-4" />
                <h3 className="text-2xl font-bold mb-2">2. Webová prezentace</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Plnohodnotný vícestránkový web, který funguje jako vaše dokonalá digitální pobočka. Zvýší důvěryhodnost vaší značky.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm font-medium text-slate-200"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Neomezený počet podstránek</li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-200"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> CMS pro snadnou úpravu obsahu</li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-200"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Extrémní SEO výkon (organika)</li>
              </ul>
              <div className="pt-6 border-t border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Dodání</span>
                <p className="font-bold text-white">14 – 21 dnů</p>
              </div>
            </FadeIn>

            {/* 3. Webová Aplikace */}
            <FadeIn className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors flex flex-col">
              <div className="mb-6">
                <KeySquare className="w-10 h-10 text-white mb-4" />
                <h3 className="text-2xl font-bold mb-2">3. Webová Aplikace</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Pokročilý systém s vlastní databází pro automatizaci procesů, správu klientských dat nebo nabídku softwaru jako služby (SaaS).</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Zabezpečená klientská zóna</li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Napojení na účetnictví / API</li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Vlastní databáze (Supabase)</li>
              </ul>
              <div className="pt-6 border-t border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Dodání</span>
                <p className="font-bold text-white">Individuálně na míru</p>
              </div>
            </FadeIn>

          </div>
        </StaggerSection>
      </section>

      {/* 4. PROBLÉM & ŘEŠENÍ (KONTRAST) */}
      <section className="py-32 px-6 bg-[#FAFAFA]">
        <StaggerSection className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
              Zákazník nehledá váš web. <br/>Hledá řešení svého problému.
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Ukážeme mu, že to řešení máte právě vy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn className="bg-slate-100 border border-slate-200 rounded-[2rem] p-8 md:p-10 opacity-70">
              <div className="flex items-center gap-4 mb-10">
                <XCircle className="w-10 h-10 text-slate-400" />
                <h3 className="text-2xl font-bold text-slate-900">Běžné agentury</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 shrink-0" />
                  <p className="text-slate-600 text-lg"><strong>Pomalý WordPress.</strong> Čekáte na načtení a mezitím ztrácíte klienty.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 shrink-0" />
                  <p className="text-slate-600 text-lg"><strong>Vývoj trvá měsíce.</strong> Neustálé zpožďování a výmluvy.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 shrink-0" />
                  <p className="text-slate-600 text-lg"><strong>Netušíte stav zakázky.</strong> Doprosy e-mailem, žádná transparentnost.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 shrink-0" />
                  <p className="text-slate-600 text-lg"><strong>Nulové konverze.</strong> Web je jen hezký obrázek, který nic neprodá.</p>
                </li>
              </ul>
            </FadeIn>

            <FadeIn className="bg-white border border-slate-200/80 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-[60px] pointer-events-none" />
              <div className="flex items-center gap-4 mb-10 relative z-10">
                <CheckCircle2 className="w-10 h-10 text-[#191919]" />
                <h3 className="text-2xl font-bold text-slate-900">Victory Webs Standard</h3>
              </div>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#191919] mt-2 shrink-0 shadow-[0_0_8px_rgba(25,25,25,0.4)]" />
                  <p className="text-slate-700 text-lg"><strong>Vývoj na Míru (Next.js).</strong> Blesková rychlost načítání pod 1 vteřinu.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#191919] mt-2 shrink-0 shadow-[0_0_8px_rgba(25,25,25,0.4)]" />
                  <p className="text-slate-700 text-lg"><strong>Garance termínů.</strong> Co slíbíme, to dodáme. Rychle a kvalitně.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#191919] mt-2 shrink-0 shadow-[0_0_8px_rgba(25,25,25,0.4)]" />
                  <p className="text-slate-700 text-lg"><strong>Živý Klientský Portál.</strong> Sledujete přesně náš progres s vlastním PINem.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#191919] mt-2 shrink-0 shadow-[0_0_8px_rgba(25,25,25,0.4)]" />
                  <p className="text-slate-700 text-lg"><strong>Psychologie prodeje.</strong> Design a texty stavěné k zisku.</p>
                </li>
              </ul>
            </FadeIn>
          </div>
        </StaggerSection>
      </section>

      {/* 5. UNIKÁTNÍ KLIENTSKÝ PORTÁL (Showcase) */}
      <section className="py-32 px-6 overflow-hidden bg-white border-y border-slate-200/50">
        <StaggerSection className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900">Konec neustálému psaní e-mailů</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Všechny fáze vývoje, stav projektu, faktury a podklady sledujete živě ve své unikátní klientské zóně.</p>
          </FadeIn>

          <FadeIn className="relative max-w-5xl mx-auto">
            <motion.div 
              style={{ y: heroY }}
              className="rounded-[2rem] bg-white border border-slate-200/80 shadow-2xl shadow-slate-300/40 p-3 overflow-hidden group"
            >
              <div className="bg-[#FAFAFA] rounded-xl border border-slate-100 overflow-hidden flex flex-col group-hover:scale-[1.01] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                {/* Lišta okna */}
                <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-2 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                  </div>
                  <div className="mx-auto bg-slate-50 border border-slate-100 rounded-md px-10 md:px-32 py-1 text-xs text-slate-400 font-medium">
                    portal.victorywebs.cz
                  </div>
                </div>
                {/* Obsah Portálu */}
                <div className="flex-1 p-6 md:p-12 flex flex-col">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-2">Můj Projekt</h3>
                      <p className="text-slate-500 font-medium">Průběh vývoje v reálném čase</p>
                    </div>
                    <div className="text-white bg-[#191919] px-5 py-2.5 rounded-xl text-sm font-bold shadow-md">
                      Fáze: Vývoj & Kód
                    </div>
                  </div>
                  
                  {/* Fake UI */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
                    <div className="md:col-span-2 space-y-8">
                      <div className="h-40 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col justify-center transition-all hover:shadow-md">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <div className="h-5 w-40 bg-slate-200 rounded" />
                          </div>
                          <div className="h-5 w-16 bg-slate-200 rounded" />
                        </div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "60%" }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                            className="h-full bg-[#191919] rounded-full" 
                          />
                        </div>
                      </div>
                      <div className="h-40 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex gap-6 transition-all hover:shadow-md">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center">
                           <LayoutTemplate className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="space-y-4 flex-1 pt-2">
                          <div className="h-5 w-1/2 bg-slate-200 rounded" />
                          <div className="h-4 w-3/4 bg-slate-100 rounded" />
                          <div className="h-4 w-2/3 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </div>
                    <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6 hidden md:block">
                      <div className="h-5 w-32 bg-slate-200 rounded mb-8" />
                      <div className="h-16 w-full bg-slate-50 border border-slate-100 rounded-xl" />
                      <div className="h-16 w-full bg-slate-50 border border-slate-100 rounded-xl" />
                      <div className="h-16 w-full bg-slate-50 border border-slate-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </FadeIn>

          {/* Rozšíření: Klientský portál detaily */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <FadeIn className="bg-[#FAFAFA] border border-slate-200/60 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <Clock className="w-6 h-6 text-[#191919]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Reálný čas</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Přesně víte, na čem zrovna pracujeme. Fáze projektu a aktuální progres vidíte přehledně hned po přihlášení.
              </p>
            </FadeIn>
            
            <FadeIn className="bg-[#FAFAFA] border border-slate-200/60 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <LayoutTemplate className="w-6 h-6 text-[#191919]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Vše na jednom místě</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Už žádné hledání smluv, faktur nebo přístupů v e-mailech. Kompletní dokumentaci a podklady máte vždy po ruce.
              </p>
            </FadeIn>

            <FadeIn className="bg-[#FAFAFA] border border-slate-200/60 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <MessageCircle className="w-6 h-6 text-[#191919]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Okamžitá zpětná vazba</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Můžete pohodlně schvalovat design nebo nám rovnou z portálu posílat poznámky a požadavky na úpravy.
              </p>
            </FadeIn>

            <FadeIn className="bg-[#FAFAFA] border border-slate-200/60 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <CheckCircle2 className="w-6 h-6 text-[#191919]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Konec e-mailům</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Veškerá komunikace a důležité notifikace probíhají přímo v portálu. Čistší schránka, rychlejší výsledek.
              </p>
            </FadeIn>
          </div>
        </StaggerSection>
      </section>

      {/* 6. PORTFOLIO / MOCKUP SHOWCASE */}
      <section className="py-32 px-6 bg-[#FAFAFA]">
        <StaggerSection className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900">Vizuální dominance</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Weby navržené tak, aby vyrazily dech vám i vaší konkurenci.</p>
          </FadeIn>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 perspective-1000">
            {/* Desktop Mockup */}
            <FadeIn className="relative w-full max-w-2xl transform md:rotate-y-[10deg] md:rotate-x-[5deg] hover:rotate-0 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]">
              <div className="w-full pt-[60%] bg-slate-50 rounded-t-3xl rounded-b-xl border-[8px] border-[#191919] shadow-2xl relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300">
                  <Monitor className="w-16 h-16" />
                </div>
              </div>
              <div className="w-1/4 h-5 bg-[#191919] mx-auto rounded-b-lg shadow-lg" />
              <div className="w-1/2 h-2 bg-slate-300 mx-auto mt-1 rounded-full shadow-sm" />
            </FadeIn>
            
            {/* Mobile Mockup */}
            <FadeIn className="relative w-56 shrink-0 transform md:-rotate-y-[15deg] md:-rotate-x-[5deg] hover:rotate-0 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] md:-ml-20 md:mt-24 z-10">
              <div className="w-full h-[450px] bg-slate-50 rounded-[2.5rem] border-[10px] border-[#191919] shadow-2xl relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300">
                  <Smartphone className="w-12 h-12" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-[#191919] rounded-b-xl" />
              </div>
            </FadeIn>
          </div>

          {/* Rozšíření: Vizuální dominance detaily */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
            <FadeIn className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-3">První dojem</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Zákazník se rozhoduje během prvních 3 vteřin. Moderní a čistý design okamžitě buduje důvěru a ukazuje vaši profesionalitu.
              </p>
            </FadeIn>
            
            <FadeIn className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mikro-animace</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Plynulé přechody a interaktivní prvky dodávají webu pocit luxusu a prémiovosti. Výrazně zvyšují dobu strávenou na stránce.
              </p>
            </FadeIn>

            <FadeIn className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mobile-first</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Až 80 % návštěv přichází z mobilních telefonů. Naše weby jsou primárně navrženy a odladěny pro menší obrazovky.
              </p>
            </FadeIn>

            <FadeIn className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-3">UX a Psychologie</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Design není jen hezký obrázek. Strategicky vedeme oko uživatele od problému až k finálnímu tlačítku k nákupu.
              </p>
            </FadeIn>
          </div>
        </StaggerSection>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-32 px-6 bg-white border-y border-slate-200/50">
        <StaggerSection className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">Na co se klienti často ptají?</h2>
            <p className="text-slate-500 text-xl">Máme rádi transparentnost. Vše na rovinu.</p>
          </FadeIn>

          <FadeIn className="bg-[#FAFAFA] border border-slate-200/80 rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">
            <FaqItem 
              question="Jak dlouho trvá tvorba nového webu?" 
              answer="Landing Page zvládneme dodat do 7–10 dnů od dodání podkladů. U rozsáhlejších firemních prezentací se pohybujeme v rozmezí 14–21 dnů. Vše vždy závisí na složitosti zadání, ale termíny, které si na začátku slíbíme, u nás platí." 
            />
            <FaqItem 
              question="Co všechno od nás budete na začátku potřebovat?" 
              answer="Po odsouhlasení spolupráce vám pošleme odkaz do našeho Klientského portálu, kde vyplníte velmi jednoduchý Onboarding formulář. Zabere to zhruba 5 minut. Budeme potřebovat znát vaše cíle, fakturační údaje a případně dodat vaše logo či fotky, pokud nějaké máte." 
            />
            <FaqItem 
              question="Jak probíhá platba a fakturace?" 
              answer="Standardně pracujeme s platbou zálohy 50 % před začátkem práce (abychom si rezervovali kapacitu a začali vyvíjet). Zbylých 50 % doplácíte až ve chvíli, kdy je web kompletně hotový a připravený ke spuštění. Všechny faktury najdete přehledně ve svém portálu." 
            />
            <FaqItem 
              question="Budu si moci web po dokončení sám upravovat?" 
              answer="Ano! K rozsáhlejším webům dodáváme jednoduché administrační rozhraní (CMS), díky kterému si zvládnete sami měnit texty, fotky nebo přidávat články. Kódování samotné struktury webu ale zůstává na nás, abychom zaručili jeho rychlost a výkon." 
            />
            <FaqItem 
              question="Co když nemám vlastní texty ani fotky?" 
              answer="Žádný problém. Tvorba konverzních textů (copywriting) je nedílnou součástí naší práce. Stejně tak vám dokážeme zajistit licencované vizuály z prémiových fotobank nebo pomoci s grafickými prvky na míru." 
            />
          </FadeIn>
        </StaggerSection>
      </section>

      {/* 8. FINÁLNÍ PRODEJNÍ CTA BANNER */}
      <section className="py-32 px-6 bg-[#FAFAFA]">
        <StaggerSection className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="bg-[#191919] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-[#191919]/20">
              
              {/* Pozadí glow pro CTA */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[120px] pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 text-white leading-tight">
                  Máte projekt? <br/>Pojďme ho nastartovat.
                </h2>
                <p className="text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed">
                  Nabereme max. 2 nové klienty měsíčně, abychom udrželi absolutní, 100% kvalitu práce. Napište nám a my se vám ozveme do 24 hodin.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="px-10 py-5 bg-white text-[#191919] rounded-full font-bold hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center gap-3 mx-auto text-xl shadow-xl shadow-white/10"
                >
                  Chci nezávaznou konzultaci <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </FadeIn>
          
          <div className="mt-24 text-center text-slate-400 text-sm font-semibold tracking-widest uppercase">
            © {new Date().getFullYear()} Victory Webs. Všechna práva vyhrazena.
          </div>
        </StaggerSection>
      </section>

      {/* 9. MODAL */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}
