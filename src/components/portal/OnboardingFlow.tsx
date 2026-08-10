"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Sparkles, Crown, Globe, Database, Zap, Clock, Plus, Send, CheckCircle2 } from "lucide-react";

// Komponenta pro animované počítadlo peněz
function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString('cs-CZ') + " Kč");
  
  useEffect(() => {
    const controls = animate(count, value, { duration: 2.5, ease: "easeOut", delay: 1 });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

// Komponenta pro odpočet času (začíná na 8:32)
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(8 * 60 + 32);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <span className="font-mono bg-amber-100 text-amber-700 px-3 py-1 rounded-lg ml-2">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
}

export function OnboardingFlow({ client }: { client: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const setCookie = async () => {
      const { setClientCookieAction } = await import("@/app/(portal)/portal/actions");
      await setClientCookieAction(client.id);
    };
    setCookie();
  }, [client.id]);

  const [step, setStep] = useState(0);

  const [billingData, setBillingData] = useState({
    company_name: client.company_name || "",
    ico: client.ico || "",
    dic: client.dic || "",
    address: client.address || "",
    contact_name: client.contact_name || "",
    billing_email: client.billing_email || "",
    phone: client.phone || "",
    gdpr: false,
  });

  const [onboardingData, setOnboardingData] = useState({
    fonts: "",
    driveLink: "",
    webGoal: "",
    competitiveAdvantage: "",
    requiredSections: "",
    inspirativeWebs: "",
    notes: "",
  });

  // Color picker state
  const [brandColors, setBrandColors] = useState<string[]>(["#000000"]);

  const nextStep = () => setStep(s => s + 1);
  const skipToPortal = () => router.push("/portal");

  const finishAndSave = async (isVip: boolean = false) => {
    const { updateClientOnboardingAction } = await import("@/app/(portal)/portal/actions");
    const finalOnboardingData = { ...onboardingData, brandColors: brandColors.join(" | ") };
    await updateClientOnboardingAction(client.id, billingData, finalOnboardingData, isVip);
  };

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < 11) nextStep();
    else handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    setStep(100);
    await finishAndSave(false);
    
    // Kino sekvence
    setTimeout(() => setStep(101), 3500); // 101: Vítejte
    setTimeout(() => setStep(102), 6500); // 102: Těšíme se
    setTimeout(() => setStep(103), 9500); // 103: Ajo, málem bych zapomněl
    setTimeout(() => setStep(104), 13000); // 104: Speciální nabídka
    setTimeout(() => setStep(105), 17000); // 105: VIP Bento Grid
  };

  const acceptVip = async () => {
    setStep(106); // VIP Success
    await finishAndSave(true);
    setTimeout(() => { window.location.href = "/portal"; }, 4000);
  };

  const rejectVip = () => {
    setStep(107); // Reject
    setTimeout(() => { window.location.href = "/portal"; }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        if (step > 2 && step < 12) {
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, billingData, onboardingData, brandColors]);

  // Pomalejší a čistší animace bez ostrého bluru
  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  const transition: any = { duration: 1.2, ease: [0.22, 1, 0.36, 1] };

  const TOTAL_QUESTIONS = 8;
  const currentQuestionIdx = step > 3 && step <= 11 ? step - 3 : 0;

  return (
    <div className="fixed inset-0 bg-[#F5F5F7] text-gray-900 flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden font-sans selection:bg-gray-200">
      
      {/* Progress Bar */}
      {step > 3 && step <= 11 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-50">
          <motion.div 
            className="h-full bg-gray-900"
            initial={{ width: `${((currentQuestionIdx - 1) / TOTAL_QUESTIONS) * 100}%` }}
            animate={{ width: `${(currentQuestionIdx / TOTAL_QUESTIONS) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      )}

      {step > 3 && step <= 11 && (
         <div className="absolute top-8 left-8 text-xs font-bold tracking-widest text-gray-400 uppercase">
           Victory Webs
         </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* INTRO 1 */}
        {step === 0 && (
          <motion.div key="i1" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="max-w-3xl text-center px-6">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-8">
              Vítejte, {client.company_name || "Vážený kliente"}.
            </h1>
            <div className="flex items-center justify-center gap-4">
              <button onClick={nextStep} className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2 shadow-lg shadow-gray-900/20">
                Pokračovat <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={skipToPortal} className="px-8 py-4 bg-transparent text-gray-500 hover:text-gray-900 rounded-full font-medium transition-colors">
                Přeskočit
              </button>
            </div>
          </motion.div>
        )}

        {/* INTRO 2 */}
        {step === 1 && (
          <motion.div key="i2" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="max-w-3xl text-center px-6">
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight mb-8 leading-tight text-gray-600">
              Pro dokonalý výsledek potřebujeme <br/><span className="text-gray-900 font-semibold">pochopit vaši vizi</span>.
            </h1>
            <button onClick={nextStep} className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2 mx-auto shadow-lg shadow-gray-900/20">
              Rozumím <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* INTRO 3 */}
        {step === 2 && (
          <motion.div key="i3" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="max-w-3xl text-center px-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200 shadow-sm">
              <Sparkles className="w-8 h-8 text-gray-900" />
            </div>
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight mb-12 text-gray-900">
              Vyhraďte si prosím 5 minut. <br/>Jdeme na to.
            </h1>
            <button onClick={nextStep} className="px-10 py-5 bg-gray-900 text-white rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto text-lg shadow-xl shadow-gray-900/30">
              Spustit dotazník
            </button>
          </motion.div>
        )}

        {/* FAKTURAČNÍ ÚDAJE */}
        {step === 3 && (
          <motion.div key="s3" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="w-full max-w-4xl px-6 py-20">
            <form onSubmit={handleNext}>
              <h2 className="text-3xl font-semibold mb-2">Základní & Fakturační údaje</h2>
              <p className="text-gray-500 mb-10">Tato data použijeme na smlouvy a faktury.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Název firmy *</label>
                  <input required value={billingData.company_name} onChange={e => setBillingData({...billingData, company_name: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-lg py-3 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Sídlo *</label>
                  <input required value={billingData.address} onChange={e => setBillingData({...billingData, address: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-lg py-3 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">IČO *</label>
                  <input required value={billingData.ico} onChange={e => setBillingData({...billingData, ico: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-lg py-3 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">DIČ</label>
                  <input value={billingData.dic} onChange={e => setBillingData({...billingData, dic: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-lg py-3 focus:outline-none transition-colors" />
                </div>
                <div className="md:col-span-2 pt-6">
                  <h3 className="text-xl font-semibold mb-6">Kontaktní osoba</h3>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Jméno a příjmení *</label>
                  <input required value={billingData.contact_name} onChange={e => setBillingData({...billingData, contact_name: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-lg py-3 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Telefon *</label>
                  <input required value={billingData.phone} onChange={e => setBillingData({...billingData, phone: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-lg py-3 focus:outline-none transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Fakturační e-mail *</label>
                  <input type="email" required value={billingData.billing_email} onChange={e => setBillingData({...billingData, billing_email: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-lg py-3 focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl mb-10 border border-gray-100 shadow-sm">
                <input type="checkbox" id="gdpr" required checked={billingData.gdpr} onChange={e => setBillingData({...billingData, gdpr: e.target.checked})} className="w-5 h-5 accent-gray-900" />
                <label htmlFor="gdpr" className="text-sm text-gray-600 cursor-pointer">Souhlasím se zpracováním osobních údajů pro účely plnění zakázky. *</label>
              </div>

              <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2">
                Pokračovat <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* OTÁZKA 1: Barvy */}
        {step === 4 && (
          <motion.div key="s4" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="w-full max-w-3xl px-6">
            <form onSubmit={handleNext}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">1. Jaké barvy vystihují vaši značku?</h2>
              <p className="text-gray-500 mb-8 text-lg">Vyberte barvy z palety nebo zadejte vlastní pomocí slideru.</p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                {brandColors.map((color, idx) => (
                  <div key={idx} className="relative group w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <input 
                      type="color" 
                      value={color}
                      onChange={(e) => {
                        const newColors = [...brandColors];
                        newColors[idx] = e.target.value;
                        setBrandColors(newColors);
                      }}
                      className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer"
                    />
                  </div>
                ))}
                {brandColors.length < 5 && (
                  <button 
                    type="button" 
                    onClick={() => setBrandColors([...brandColors, "#ffffff"])}
                    className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2">
                  Další <Check className="w-5 h-5" />
                </button>
                <span className="text-gray-400 text-sm">Cmd+Enter</span>
              </div>
            </form>
          </motion.div>
        )}

        {/* OTÁZKA 2: Fonty */}
        {step === 5 && (
          <motion.div key="s5" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="w-full max-w-3xl px-6">
            <form onSubmit={handleNext}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">2. Máte definované fonty nebo brand manuál?</h2>
              <textarea 
                autoFocus required value={onboardingData.fonts} onChange={(e) => setOnboardingData({...onboardingData, fonts: e.target.value})}
                placeholder="Zadejte název fontu (např. Inter, Playfair) nebo napište 'Nemám'."
                rows={3}
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-2xl md:text-3xl py-4 focus:outline-none resize-none transition-colors placeholder:text-gray-300 mb-8"
              />
              <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2">
                Další <Check className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* OTÁZKA 3: Cloud link */}
        {step === 6 && (
          <motion.div key="s6" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="w-full max-w-3xl px-6">
            <form onSubmit={handleNext}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">3. Odkaz na vaše podklady</h2>
              <p className="text-gray-500 mb-8 text-lg">Prosíme o nahrání loga (SVG/PNG) a fotek na cloud (Google Drive, Dropbox) pro zachování maximální kvality.</p>
              <textarea 
                autoFocus required value={onboardingData.driveLink} onChange={(e) => setOnboardingData({...onboardingData, driveLink: e.target.value})}
                placeholder="https://drive.google.com/..."
                rows={2}
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-2xl md:text-3xl py-4 focus:outline-none resize-none transition-colors placeholder:text-gray-300 mb-8"
              />
              <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2">
                Další <Check className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* OTÁZKA 4: Hlavní cíl */}
        {step === 7 && (
          <motion.div key="s7" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="w-full max-w-3xl px-6">
            <form onSubmit={handleNext}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">4. Co je absolutně hlavním cílem webu?</h2>
              <p className="text-gray-500 mb-8 text-lg">Získávání leadů? Prodej? Prestižní vizitka?</p>
              <textarea 
                autoFocus required value={onboardingData.webGoal} onChange={(e) => setOnboardingData({...onboardingData, webGoal: e.target.value})}
                placeholder="Naším cílem je..."
                rows={3}
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-2xl md:text-3xl py-4 focus:outline-none resize-none transition-colors placeholder:text-gray-300 mb-8"
              />
              <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2">
                Další <Check className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* OTÁZKA 5: Konkurence */}
        {step === 8 && (
          <motion.div key="s8" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="w-full max-w-3xl px-6">
            <form onSubmit={handleNext}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">5. V čem jste lepší než konkurence?</h2>
              <textarea 
                autoFocus required value={onboardingData.competitiveAdvantage} onChange={(e) => setOnboardingData({...onboardingData, competitiveAdvantage: e.target.value})}
                placeholder="Máme 20 let zkušeností a děláme to jinak..."
                rows={4}
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-2xl md:text-3xl py-4 focus:outline-none resize-none transition-colors placeholder:text-gray-300 mb-8"
              />
              <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2">
                Další <Check className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* OTÁZKA 6: Sekce */}
        {step === 9 && (
          <motion.div key="s9" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="w-full max-w-3xl px-6">
            <form onSubmit={handleNext}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">6. Jaké konkrétní sekce web musí obsahovat?</h2>
              <textarea 
                autoFocus required value={onboardingData.requiredSections} onChange={(e) => setOnboardingData({...onboardingData, requiredSections: e.target.value})}
                placeholder="Služby, O nás, Ceník, Kontakt..."
                rows={3}
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-2xl md:text-3xl py-4 focus:outline-none resize-none transition-colors placeholder:text-gray-300 mb-8"
              />
              <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2">
                Další <Check className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* OTÁZKA 7: Inspirace */}
        {step === 10 && (
          <motion.div key="s10" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="w-full max-w-3xl px-6">
            <form onSubmit={handleNext}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">7. Uveďte 2-3 weby, které se vám líbí.</h2>
              <textarea 
                autoFocus required value={onboardingData.inspirativeWebs} onChange={(e) => setOnboardingData({...onboardingData, inspirativeWebs: e.target.value})}
                placeholder="Líbí se mi apple.com kvůli minimalismu..."
                rows={3}
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-2xl md:text-3xl py-4 focus:outline-none resize-none transition-colors placeholder:text-gray-300 mb-8"
              />
              <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2">
                Další <Check className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* OTÁZKA 8: Poznámky */}
        {step === 11 && (
          <motion.div key="s11" variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className="w-full max-w-3xl px-6">
            <form onSubmit={handleNext}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">8. Ještě něco, co bychom měli vědět?</h2>
              <textarea 
                autoFocus value={onboardingData.notes} onChange={(e) => setOnboardingData({...onboardingData, notes: e.target.value})}
                placeholder="Cokoliv vás napadne (volitelné)..."
                rows={4}
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 text-2xl md:text-3xl py-4 focus:outline-none resize-none transition-colors placeholder:text-gray-300 mb-8"
              />
              <button type="submit" disabled={isPending} className="px-10 py-5 bg-gray-900 text-white rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-3">
                Dokončit a odeslat <Check className="w-6 h-6" />
              </button>
            </form>
          </motion.div>
        )}

        {/* PROCESSING ANIMATION (Apple Style Send -> Checkmark) */}
        {step === 100 && (
          <motion.div key="proc" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="flex flex-col items-center justify-center relative">
            
            <motion.div 
              initial={{ scale: 1, y: 0, opacity: 1 }}
              animate={{ scale: 0.5, y: -150, x: 100, opacity: 0 }}
              transition={{ duration: 1, ease: "easeIn", delay: 0.5 }}
              className="absolute"
            >
              <Send className="w-16 h-16 text-gray-900" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "backOut", delay: 1.5 }}
              className="absolute"
            >
              <CheckCircle2 className="w-20 h-20 text-emerald-500" />
            </motion.div>

          </motion.div>
        )}

        {/* OUTRO 1 */}
        {step === 101 && (
          <motion.h2 key="o1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.5 }} className="text-4xl md:text-7xl font-bold tracking-tight text-center px-6">
            Vítejte v rodině <br/>Victory Webs.
          </motion.h2>
        )}

        {/* OUTRO 2 */}
        {step === 102 && (
          <motion.h2 key="o2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.5 }} className="text-4xl md:text-7xl font-bold tracking-tight text-center px-6">
            Těšíme se na <br/>naši spolupráci.
          </motion.h2>
        )}

        {/* FAKEOUT / UPSELL INTRO */}
        {step === 103 && (
          <motion.h2 key="o3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.5 }} className="text-3xl md:text-5xl font-medium tracking-tight text-center px-6 text-gray-400 leading-tight">
            Ajo, málem bych zapomněl...
          </motion.h2>
        )}
        
        {step === 104 && (
          <motion.div key="o4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.5 }} className="text-center px-6">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 leading-tight">
              Mám pro vás speciální nabídku. <br/>Platí ještě <CountdownTimer />
            </h2>
          </motion.div>
        )}

        {/* UPSELL VIP - BENTO GRID WITH STAGGER */}
        {step === 105 && (
          <motion.div key="ups" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.5 }} className="max-w-5xl w-full px-6 py-20 flex flex-col items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/20">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-gray-900">
                Staňte se VIP klientem
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow">
                <Globe className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Hosting & Doména</h3>
                <p className="text-gray-500">Rychlý a zabezpečený hosting včetně vaší domény zdarma. My se postaráme o technické pozadí.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow">
                <Zap className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Přednostní odbavení</h3>
                <p className="text-gray-500">Váš požadavek má absolutní prioritu. Garance vyřešení problémů a úprav do 24 hodin.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="bg-gray-900 text-white rounded-3xl p-8 flex flex-col items-start md:col-span-2 relative overflow-hidden shadow-xl shadow-gray-900/10">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Clock className="w-32 h-32" /></div>
                <Clock className="w-8 h-8 text-amber-400 mb-6 relative z-10" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">1/2 hodiny práce na webu každý měsíc</h3>
                <p className="text-gray-400 relative z-10 mb-6">Pravidelné aktualizace obsahu nebo ladění designu. (Běžná cena práce 899 Kč/hod).</p>
                <div className="px-5 py-3 bg-amber-400 text-gray-900 rounded-xl text-sm font-bold relative z-10">
                  Ušetříte <AnimatedNumber value={5394} /> ročně
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
              <button onClick={acceptVip} className="px-10 py-5 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-3 text-lg shadow-xl shadow-amber-500/20">
                Chci VIP péči za 499 Kč / měs
              </button>
              <button onClick={rejectVip} className="px-8 py-5 bg-transparent text-gray-400 hover:text-gray-600 rounded-full font-medium transition-colors">
                Ne, děkuji, přejít do portálu
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* UPSELL SUCCESS */}
        {step === 106 && (
          <motion.div key="o6" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.5 }} className="text-center px-6">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Crown className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              Vítejte ve VIP kruhu.
            </h2>
            <p className="mt-6 text-xl text-gray-500">Aktivujeme vaše benefity...</p>
          </motion.div>
        )}
        
        {/* REJECT (OPTIONAL) */}
        {step === 107 && (
          <motion.div key="o7" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1 }} className="text-center px-6">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-gray-400">
              Rozumím. Pokračujeme do portálu.
            </h2>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
