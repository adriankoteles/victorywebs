"use client";

import { useState, useTransition } from "react";
import { addProjectAction } from "@/app/(admin)/projects/actions";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function AddProjectModal({ 
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await addProjectAction(formData);
      if (res.success) {
        onClose();
        window.location.reload(); // Pro rychlé překreslení server component po insertu
      } else {
        setError(res.error || "Došlo k chybě při vytváření projektu.");
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
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-[2px] z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/80 z-[60] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Přidat nový projekt</h2>
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
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Přiřadit ke klientovi *</label>
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

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Název projektu *</label>
                <input required name="name" type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" placeholder="Např. Tvorba firemního webu" />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Cena (Kč) *</label>
                <input required name="price" type="number" min="0" step="1000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" placeholder="0" />
              </div>

              <div className="pt-2 mt-2 flex justify-end gap-3 border-t border-gray-100/50 pt-5">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                  Zrušit
                </button>
                <button disabled={isPending} type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-xl transition-colors shadow-sm disabled:opacity-50">
                  {isPending ? "Vytvářím..." : "Vytvořit projekt"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
