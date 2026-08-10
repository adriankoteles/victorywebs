"use client";

import { useState, useTransition } from "react";
import { addInvoiceAction } from "@/app/(admin)/finances/actions";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator } from "lucide-react";

export function AddInvoiceModal({ 
  isOpen, 
  onClose, 
  clients 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  clients: any[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [amount, setAmount] = useState<string>("");
  const [vatRate, setVatRate] = useState<string>("21");

  const baseAmount = parseFloat(amount) || 0;
  const vatRateNum = parseFloat(vatRate) || 0;
  const vatAmount = (baseAmount * vatRateNum) / 100;
  const totalAmount = baseAmount + vatAmount;

  const formatCZK = (val: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await addInvoiceAction(formData);
      if (res.success) {
        onClose();
        window.location.reload();
      } else {
        setError(res.error || "Došlo k chybě při vystavování faktury.");
      }
    });
  };

  // Výchozí datum splatnosti: +14 dní
  const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/80 z-[60] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Nová faktura</h2>
                <p className="text-xs text-gray-400 mt-0.5">Číslo faktury bude vygenerováno automaticky.</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Odběratel (Klient) *</label>
                <div className="relative">
                  <select required name="client_id" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all appearance-none sm:text-sm">
                    <option value="">Vyberte klienta...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.company_name} ({client.system_id})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Částka bez DPH (Kč) *</label>
                  <input 
                    required 
                    name="amount" 
                    type="number" 
                    min="0" 
                    step="100" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" 
                    placeholder="0" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Sazba DPH (%)</label>
                  <input 
                    name="vat_rate" 
                    type="number" 
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Datum splatnosti *</label>
                <input 
                  required 
                  name="due_date" 
                  type="date" 
                  defaultValue={defaultDueDate}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" 
                />
              </div>

              {/* Kalkulace DPH rozpis */}
              {baseAmount > 0 && (
                <div className="bg-[#F7F9FC] p-4 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Rekapitulace platby</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Základ daně:</span>
                    <span className="font-medium text-gray-900">{formatCZK(baseAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>DPH ({vatRateNum}%):</span>
                    <span className="font-medium text-gray-900">{formatCZK(vatAmount)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200/60 flex justify-between text-sm font-semibold text-gray-900">
                    <span>Celkem s DPH:</span>
                    <span>{formatCZK(totalAmount)}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100/50 pt-5">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                  Zrušit
                </button>
                <button disabled={isPending} type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-xl transition-colors shadow-sm disabled:opacity-50">
                  {isPending ? "Vystavuji..." : "Vystavit fakturu"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
