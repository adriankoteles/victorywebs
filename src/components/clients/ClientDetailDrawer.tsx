"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Mail, Phone, Building2, MapPin, Receipt, Edit2, Check, HelpCircle, MessageSquare, Download } from "lucide-react";
import { useState, useTransition } from "react";
import { updateClientAction } from "@/app/(admin)/clients/actions";

export function ClientDetailDrawer({ 
  client, 
  isOpen, 
  onClose 
}: { 
  client: any | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "onboarding" | "feedback">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!client) return null;

  const handleCopyPin = () => {
    navigator.clipboard.writeText(client.pin_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("id", client.id);

    startTransition(async () => {
      const res = await updateClientAction(formData);
      if (res.success) {
        setIsEditing(false);
      } else {
        setError(res.error || "Chyba při ukládání");
      }
    });
  };

  const ltv = client.invoices?.reduce((sum: number, inv: any) => {
    const base = Number(inv.amount || 0);
    const vat = (base * Number(inv.vat_rate || 21)) / 100;
    return sum + (base + vat);
  }, 0) || 0;

  const formatCZK = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-[2px] z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l border-gray-100 z-[60] overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{client.company_name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-gray-500">{client.system_id}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        client.status === 'Active Monthly' ? 'bg-emerald-500' :
                        client.status === 'Onboarding' ? 'bg-amber-400' :
                        client.status === 'In Development' ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-xs font-medium text-gray-600">{client.status}</span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Nav */}
              <div className="flex gap-2 p-1 bg-gray-100/60 rounded-xl">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                    activeTab === "overview" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Přehled
                </button>
                <button
                  onClick={() => setActiveTab("onboarding")}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                    activeTab === "onboarding" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Onboarding Data
                </button>
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                    activeTab === "feedback" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Feedback
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="p-6 flex-1 space-y-6">

              {activeTab === "overview" && (
                <>
                  {!isEditing ? (
                    <>
                      {/* Přístupový PIN */}
                      <div className="bg-[#F7F9FC] rounded-2xl p-5 border border-gray-100">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Klientský Portál PIN</h3>
                        <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-gray-100/50">
                          <div>
                            <p className="text-[11px] text-gray-500 font-medium">PIN KÓD</p>
                            <p className="text-lg font-bold text-gray-900 tracking-widest">{client.pin_code}</p>
                          </div>
                          <button 
                            onClick={handleCopyPin}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            {copied ? "Zkopírováno" : "Kopírovat PIN"}
                          </button>
                        </div>
                      </div>

                      {/* Kontaktní údaje */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kontaktní & Fakturační Údaje</h3>
                          <button 
                            onClick={() => setIsEditing(true)} 
                            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Upravit
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                              <Mail className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{client.contact_name || client.company_name}</p>
                              <p className="text-[13px] text-gray-500">{client.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                              <Phone className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{client.phone || "Zatím nezadáno"}</p>
                              <p className="text-[13px] text-gray-500">Telefon</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                              <Building2 className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{client.ico || "Zatím bez IČO"} {client.dic ? `/ ${client.dic}` : ''}</p>
                              <p className="text-[13px] text-gray-500">IČO / DIČ</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                              <MapPin className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{client.address || "Sídlo nezadáno"}</p>
                              <p className="text-[13px] text-gray-500">Adresa</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Finance & Faktury */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Finance & Vystavené Faktury</h3>
                        
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                          <div className="flex items-center gap-3 mb-1">
                            <Receipt className="w-4 h-4 text-gray-400" />
                            <p className="text-sm font-medium text-gray-500">Celkem vyfakturováno (LTV)</p>
                          </div>
                          <p className="text-3xl font-semibold text-gray-900 tracking-tight">{formatCZK(ltv)}</p>
                        </div>

                        {client.invoices && client.invoices.length > 0 ? (
                          <div className="space-y-3">
                            {client.invoices.map((inv: any) => {
                              const base = Number(inv.amount || 0);
                              const vat = (base * Number(inv.vat_rate || 21)) / 100;
                              const total = base + vat;
                              
                              return (
                                <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-gray-900">{inv.invoice_number}</p>
                                      {inv.status === "Zaplaceno" ? (
                                        <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">ZAPLACENO</span>
                                      ) : (
                                        <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">NEZAPLACENO</span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Splatnost: {new Date(inv.due_date).toLocaleDateString("cs-CZ")}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <p className="text-sm font-semibold text-gray-900">{formatCZK(total)}</p>
                                    <a
                                      href={`/api/invoices/${inv.id}/pdf`}
                                      download={`Faktura_${inv.invoice_number}.pdf`}
                                      className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent"
                                      title="Stáhnout PDF"
                                    >
                                      <Download className="w-4 h-4" />
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[13px] text-gray-500 italic bg-gray-50 p-3 rounded-xl border border-gray-100/50">Zatím žádné vystavené faktury.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    /* EDIT FORM */
                    <form onSubmit={handleSaveEdit} className="space-y-4">
                      {error && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                          {error}
                        </div>
                      )}

                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Úprava údajů klienta</h3>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Název firmy</label>
                        <input name="company_name" defaultValue={client.company_name} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Kontaktní osoba</label>
                        <input name="contact_name" defaultValue={client.contact_name} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
                        <input name="email" defaultValue={client.email} required type="email" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Telefon</label>
                          <input name="phone" defaultValue={client.phone || ''} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" placeholder="+420..." />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                          <select name="status" defaultValue={client.status} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                            <option value="Onboarding">Onboarding</option>
                            <option value="In Development">In Development</option>
                            <option value="Active Monthly">Active Monthly</option>
                            <option value="Paused">Paused</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">IČO</label>
                          <input name="ico" defaultValue={client.ico || ''} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">DIČ</label>
                          <input name="dic" defaultValue={client.dic || ''} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Adresa / Sídlo</label>
                        <input name="address" defaultValue={client.address || ''} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
                      </div>

                      <div className="pt-4 flex gap-2 justify-end">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                          Zrušit
                        </button>
                        <button disabled={isPending} type="submit" className="px-4 py-2 text-xs font-medium text-white bg-gray-900 hover:bg-black rounded-lg">
                          {isPending ? "Ukládám..." : "Uložit změny"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {activeTab === "onboarding" && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F7F9FC] rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                      <h4 className="text-sm font-semibold text-gray-900">Stav klientského Onboardingu</h4>
                    </div>
                    <p className="text-xs text-gray-500">
                      Klient přistupuje do portálu pomocí kódu <span className="font-semibold text-gray-900">{client.pin_code}</span> a ID <span className="font-semibold text-gray-900">{client.system_id}</span>.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {client.social_media?.onboarding ? (
                      <>
                        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <p className="text-xs font-semibold text-gray-400 uppercase">Cíl webové prezentace</p>
                          <p className="text-sm text-gray-900 mt-1 font-medium">{client.social_media.onboarding.goals || "-"}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <p className="text-xs font-semibold text-gray-400 uppercase">Cílové publikum</p>
                          <p className="text-sm text-gray-900 mt-1 font-medium">{client.social_media.onboarding.audience || "-"}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <p className="text-xs font-semibold text-gray-400 uppercase">Preferované barvy a styl</p>
                          <p className="text-sm text-gray-900 mt-1 font-medium">{client.social_media.onboarding.colors || "-"}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-[13px] text-gray-500 italic bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                        Klient ještě nevyplnil onboarding dotazník v portálu.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "feedback" && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F7F9FC] rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <h4 className="text-sm font-semibold text-gray-900">Zpětná vazba a Spokojenost</h4>
                    </div>
                    <p className="text-xs text-gray-500">
                      Hodnocení klienta po dokončení projektu nebo během měsíční spolupráce.
                    </p>
                  </div>

                  {client.social_media?.feedback ? (
                    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase">NPS Skóre</span>
                        <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                          {client.social_media.feedback.nps} / 10
                        </span>
                      </div>
                      {client.social_media.feedback.text ? (
                        <p className="text-sm text-gray-800 italic">"{client.social_media.feedback.text}"</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Bez slovního komentáře</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[13px] text-gray-500 italic bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                      Klient ještě neposlal žádné hodnocení.
                    </p>
                  )}
                </div>
              )}

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
