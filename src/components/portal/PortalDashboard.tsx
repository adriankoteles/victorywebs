"use client";

import { useState, useTransition } from "react";
import { logoutClientAction, updateClientOnboardingAction, submitClientFeedbackAction } from "@/app/(portal)/portal/actions";
import { LogOut, Download, Mail, CheckCircle2, Star, Send, ExternalLink, User, LayoutTemplate, MessageSquare, CreditCard, Play, Crown, AlertTriangle } from "lucide-react";

const STAGES_ORDER = ["Poptávka", "Onboarding & Design", "Vývoj & Kód", "Revize & Test", "Dokončeno"];

export function PortalDashboard({ client, projects, invoices }: { client: any; projects: any[]; invoices: any[] }) {
  const [isPending, startTransition] = useTransition();

  const isVip = client.social_media?.is_vip === true;
  const savedOnboarding = client.social_media?.onboarding;
  const [goals, setGoals] = useState(savedOnboarding?.goals || "");
  const [audience, setAudience] = useState(savedOnboarding?.audience || "");
  const [colors, setColors] = useState(savedOnboarding?.colors || "");
  const [onboardingSuccess, setOnboardingSuccess] = useState(false);

  // Feedback Form States
  const savedFeedback = client.social_media?.feedback;
  const [nps, setNps] = useState<number>(savedFeedback?.nps || 10);
  const [feedbackText, setFeedbackText] = useState(savedFeedback?.text || "");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const activeProject = projects[0]; // Předpokládáme jeden hlavní projekt
  const currentStageIdx = activeProject ? STAGES_ORDER.indexOf(activeProject.stage || "Poptávka") : 0;
  const isCompleted = currentStageIdx === STAGES_ORDER.length - 1;

  const handleLogout = () => {
    startTransition(async () => {
      await logoutClientAction();
    });
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateClientOnboardingAction(client.id, {}, { goals, audience, colors });
      if (res.success) {
        setOnboardingSuccess(true);
      }
    });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await submitClientFeedbackAction(client.id, nps, feedbackText);
      if (res.success) {
        setFeedbackSuccess(true);
      }
    });
  };

  const formatCZK = (val: number) => {
    return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(val);
  };

  // Výpočet metrik (Nahrazení celkové sumy za stav nezaplacených faktur)
  let unpaidInvoicesCount = invoices.filter(inv => inv.status !== "Zaplaceno").length;

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 pb-20 font-sans selection:bg-black/10">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 sticky top-0 z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-bold text-gray-900 tracking-tight text-lg">VICTORY WEBS</div>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{client.company_name}</span>
          </div>
          <button 
            onClick={handleLogout} 
            disabled={isPending}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors bg-white hover:bg-red-50/50 px-3 py-2 rounded-xl border border-gray-200/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            Odhlásit se
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* HERO SECTION */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
              Vítejte v portálu, {client.company_name}
            </h1>
            {isVip && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-200 to-amber-500 rounded-lg shadow-sm text-gray-900 text-xs font-bold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" /> VIP
              </div>
            )}
          </div>
          <p className="text-gray-500 mt-2 text-lg">
            Přehled vývoje vašeho webu a dokumentace v reálném čase.
          </p>
        </div>

        {/* ONBOARDING WARNING BANNER */}
        {!savedOnboarding && (
          <div className="mb-10 bg-amber-50 border border-amber-200/50 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Krok 1: Čekáme na vaše podklady</h3>
                <p className="text-gray-600 text-sm">Abychom mohli začít naplno pracovat, potřebujeme od vás vyplnit úvodní dotazník.</p>
              </div>
            </div>
            <a 
              href={`/onboarding/${client.id}`}
              className="px-6 py-3 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              Pokračovat v onboardingu
            </a>
          </div>
        )}

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
              <Play className="w-4 h-4" /> Aktuální fáze
            </div>
            <div className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              {activeProject?.stage || "Poptávka"}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
              <CreditCard className="w-4 h-4" /> Stav fakturace
            </div>
            <div className={`text-2xl font-semibold flex items-center gap-2 ${unpaidInvoicesCount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {unpaidInvoicesCount > 0 ? (
                <>{unpaidInvoicesCount} k úhradě</>
              ) : (
                <>
                  Vše uhrazeno <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all flex flex-col justify-center items-start">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
              <ExternalLink className="w-4 h-4" /> Live Náhled
            </div>
            <button className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 text-sm font-semibold rounded-xl transition-colors border border-gray-200/50 flex items-center gap-2">
              Otevřít preview <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-COLUMN GRID (2/3 Main, 1/3 Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LFFT MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* LIVE STEPPER */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Průběh vývoje projektu</h2>
              <p className="text-sm text-gray-500 mb-10">Sledujte, v jaké fázi se přesně nacházíme.</p>

              {activeProject ? (
                <div className="relative">
                  <div className="absolute top-[20px] left-8 right-8 h-[2px] bg-gray-100 -z-0">
                    <div 
                      className="h-[2px] bg-gray-900 transition-all duration-700 ease-in-out" 
                      style={{ width: `${(currentStageIdx / (STAGES_ORDER.length - 1)) * 100}%` }}
                    />
                  </div>

                  <div className="relative z-10 flex justify-between">
                    {STAGES_ORDER.map((stage, idx) => {
                      const isCompletedPhase = idx < currentStageIdx;
                      const isActivePhase = idx === currentStageIdx;

                      return (
                        <div key={stage} className="flex flex-col items-center text-center max-w-[100px]">
                          <div 
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center border-[2.5px] text-sm font-bold transition-all duration-500 ${
                              isCompletedPhase 
                                ? "bg-gray-900 border-gray-900 text-white" 
                                : isActivePhase
                                ? "bg-white border-gray-900 text-gray-900 scale-110 shadow-lg shadow-gray-900/10"
                                : "bg-white border-gray-200 text-gray-300"
                            }`}
                          >
                            {isCompletedPhase ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <span className={`text-xs font-semibold mt-4 transition-colors ${
                            isActivePhase ? "text-gray-900" : isCompletedPhase ? "text-gray-600" : "text-gray-400"
                          }`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100/50">
                  Nemáte žádný aktivní projekt.
                </div>
              )}
            </div>

            {/* INVOICES TABLE */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-8 border-b border-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Dokumenty a fakturace</h2>
                <p className="text-sm text-gray-500">Přehled všech vystavených dokladů a jejich stav.</p>
              </div>
              
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50/50 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  <tr>
                    <th className="px-8 py-4 font-semibold">Doklad</th>
                    <th className="px-8 py-4 font-semibold">Splatnost</th>
                    <th className="px-8 py-4 font-semibold">Stav</th>
                    <th className="px-8 py-4 font-semibold">Částka (s DPH)</th>
                    <th className="px-8 py-4 text-right font-semibold">Akce</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-gray-500 bg-white">Zatím vám nebyly vystaveny žádné dokumenty.</td>
                    </tr>
                  ) : (
                    invoices.map((inv) => {
                      const base = Number(inv.amount || 0);
                      const vat = (base * Number(inv.vat_rate || 21)) / 100;
                      const total = base + vat;
                      const isPaid = inv.status === "Zaplaceno";

                      return (
                        <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                          <td className="px-8 py-5 font-semibold text-gray-900">{inv.invoice_number}</td>
                          <td className="px-8 py-5">{new Date(inv.due_date).toLocaleDateString("cs-CZ")}</td>
                          <td className="px-8 py-5">
                            {isPaid ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Zaplaceno</span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">K úhradě</span>
                            )}
                          </td>
                          <td className="px-8 py-5 font-semibold text-gray-900">{formatCZK(total)}</td>
                          <td className="px-8 py-5 text-right">
                            <a
                              href={`/api/invoices/${inv.id}/pdf`}
                              download={`Faktura_${inv.invoice_number}.pdf`}
                              className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200"
                              title="Stáhnout PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <div className="space-y-8">
            
            {/* SUPPORT CARD */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-gray-900/20">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Star className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Adrian Koteleš</h3>
                <p className="text-gray-400 text-sm font-medium mb-6">Founder & Lead Developer</p>
                
                <p className="text-sm text-gray-300 leading-relaxed mb-8">
                  Potřebujete upravit projekt, konzultovat postup, nebo máte otázku k fakturaci? Jsem tu pro vás.
                </p>

                <a 
                  href="mailto:adrian@victorywebs.cz" 
                  className="w-full py-3.5 bg-white hover:bg-gray-100 text-gray-900 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Napsat zprávu
                </a>
              </div>
            </div>

            {/* ONBOARDING CARD */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <LayoutTemplate className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Onboarding Data</h3>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold">Podklady pro vývoj</p>
                </div>
              </div>

              {savedOnboarding ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl text-xs font-semibold mb-4">
                    <CheckCircle2 className="w-4 h-4" />
                    Úspěšně vyplněno
                  </div>
                  <div className="text-sm space-y-4 text-gray-600">
                    <div><strong className="block text-gray-900 text-xs mb-1">Cíle webu:</strong> {savedOnboarding?.webGoal}</div>
                    <div><strong className="block text-gray-900 text-xs mb-1">Konkurenční výhoda:</strong> {savedOnboarding?.competitiveAdvantage}</div>
                    <div><strong className="block text-gray-900 text-xs mb-1">Design & Barvy:</strong> {savedOnboarding?.brandColors}</div>
                    {savedOnboarding?.driveLink && (
                      <div><strong className="block text-gray-900 text-xs mb-1">Podklady:</strong> <a href={savedOnboarding?.driveLink} target="_blank" className="text-blue-600 hover:underline">Otevřít disk</a></div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-4">Zatím nebyly dodány žádné podklady.</p>
                  <a href={`/onboarding/${client.id}`} className="inline-flex py-2 px-4 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors">
                    Vyplnit dotazník
                  </a>
                </div>
              )}
            </div>

            {/* FEEDBACK CARD (Zobrazí se až v pozdější fázi projektu) */}
            {currentStageIdx >= 3 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Zpětná vazba</h3>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold">Hodnocení projektu</p>
                  </div>
                </div>

                {(savedFeedback || feedbackSuccess) ? (
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{nps}/10</div>
                    <p className="text-xs text-gray-500 font-medium">Děkujeme za hodnocení!</p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-3 text-center">Hodnocení spolupráce (1-10)</p>
                      <div className="flex justify-between gap-1">
                        {[1, 3, 5, 7, 10].map((num) => (
                          <button key={num} type="button" onClick={() => setNps(num)} className={`w-8 h-8 rounded-lg font-bold text-xs transition-all border ${nps === num ? "bg-gray-900 border-gray-900 text-white" : "bg-gray-50 border-gray-200 text-gray-500"}`}>{num}</button>
                        ))}
                      </div>
                    </div>
                    <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all placeholder:text-gray-400" placeholder="Váš komentář..." />
                    <button type="submit" className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors">Odeslat hodnocení</button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
