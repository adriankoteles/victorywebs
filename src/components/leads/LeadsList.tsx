"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { approveLeadAction, rejectLeadAction } from "@/app/(admin)/leads/actions";
import { Check, X, MapPin, Star, Link as LinkIcon, Briefcase, Phone, Mail, ChevronDown, ChevronUp, BrainCircuit } from "lucide-react";

export function LeadsList({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    const res = await approveLeadAction(id);
    if (res.success) {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    }
    setIsProcessing(null);
  };

  const handleReject = async (id: string) => {
    setIsProcessing(id);
    const res = await rejectLeadAction(id);
    if (res.success) {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    }
    setIsProcessing(null);
  };

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Vše schváleno</h3>
        <p className="text-gray-500 max-w-sm">
          Nemáte žádné nové vygenerované leady ke schválení. Zkuste to znovu později.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence>
        {leads.map((lead) => (
          <motion.div
            key={lead.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col"
          >
            {/* Header info */}
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{lead.company_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{lead.niche}</span>
                  </div>
                </div>
                {lead.rating && (
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-xs font-medium">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {lead.rating} ({lead.reviews_count || 0})
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200/60">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {lead.city || "Lokalita neznámá"}
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {lead.phone}
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                  </div>
                )}
                {lead.website_url && (
                  <a 
                    href={lead.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Web
                  </a>
                )}
              </div>
            </div>

            {/* Content body - AI Strategy & Email */}
            <div className="p-6 flex-1 bg-[#FAFAFA] flex flex-col gap-4">
              
              {/* Sales Strategy Toggle */}
              {(lead.sales_strategy || lead.ai_analysis) && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setExpandedStrategy(expandedStrategy === lead.id ? null : lead.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-gray-700">AI Analýza & Prodejní Strategie</span>
                    </div>
                    {expandedStrategy === lead.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  
                  <AnimatePresence>
                    {expandedStrategy === lead.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border-t border-gray-100 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-purple-50/30">
                          {lead.sales_strategy ? lead.sales_strategy : "Strategie se připravuje..."}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="flex flex-col h-full">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Vygenerovaný E-mail</p>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative text-sm text-gray-700 leading-relaxed whitespace-pre-wrap flex-1 min-h-[12rem] overflow-y-auto custom-scrollbar">
                  {lead.draft_message || "Chybí vygenerovaný text..."}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 flex items-center gap-3 bg-white">
              <button
                onClick={() => handleReject(lead.id)}
                disabled={isProcessing === lead.id}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Zamítnout
              </button>
              <button
                onClick={() => handleApprove(lead.id)}
                disabled={isProcessing === lead.id}
                className="flex-1 px-4 py-3 bg-[#191919] text-white font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing === lead.id ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Schválit a odeslat
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
