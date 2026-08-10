"use client";

import { useState, useTransition } from "react";
import { addClientAction } from "@/app/(admin)/clients/actions";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function AddClientModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await addClientAction(formData);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || "Došlo k chybě při vytváření klienta.");
      }
    });
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
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-[2px] z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/80 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Přidat nového klienta</h2>
                <p className="text-xs text-gray-400 mt-0.5">Všechny zbylé údaje klient vyplní sám v onboardingu.</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Název firmy *</label>
                <input required name="company_name" type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" placeholder="Např. Victory Webs s.r.o." />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Kontaktní E-mail *</label>
                <input required name="email" type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" placeholder="klient@firma.cz" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                  Zrušit
                </button>
                <button disabled={isPending} type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-xl transition-colors shadow-sm disabled:opacity-50">
                  {isPending ? "Vytvářím..." : "Vytvořit klienta"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
