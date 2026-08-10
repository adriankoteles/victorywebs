"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Mail } from "lucide-react";

export function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white border border-slate-200/60 p-8 md:p-12 rounded-[2rem] z-[101] shadow-2xl shadow-slate-300/50"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
              <span className="text-3xl">🤝</span>
            </div>
            
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4">
              Nabereme max. 2 nové projekty měsíčně.
            </h2>
            
            <p className="text-slate-500 mb-10 leading-relaxed text-lg">
              Abychom zaručili tu nejvyšší možnou kvalitu a rychlost. Napište nám o svém projektu a my se vám ozveme do 24 hodin.
            </p>
            
            <a href="mailto:hello@victorywebs.cz" className="group flex items-center justify-between w-full p-4 md:p-6 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-2xl transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-white rounded-xl group-hover:scale-110 transition-transform shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Napsat e-mail</p>
                  <p className="text-slate-900 font-semibold">hello@victorywebs.cz</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors group-hover:translate-x-1" />
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
