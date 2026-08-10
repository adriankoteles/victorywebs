import { createClient } from "@/utils/supabase/server";
import { InvoicesList } from "@/components/finance/InvoicesList";
import { Wallet, Clock, Landmark } from "lucide-react";

export default async function FinancePage() {
  const supabase = await createClient();

  // 1. Načtení faktur s klientem
  const { data: invoices } = await supabase
    .from("invoices")
    .select(`
      *,
      clients (
        id,
        system_id,
        company_name
      )
    `)
    .order("created_at", { ascending: false });

  // 2. Načtení klientů pro modal
  const { data: clients } = await supabase
    .from("clients")
    .select("id, system_id, company_name")
    .order("company_name", { ascending: true });

  const allInvoices = invoices || [];

  // Výpočty finančních metrik
  let totalTurnover = 0;
  let unpaidAmount = 0;
  let totalVat = 0;

  allInvoices.forEach((inv) => {
    const base = Number(inv.amount || 0);
    const vatRate = Number(inv.vat_rate || 21);
    const vat = (base * vatRate) / 100;
    const total = base + vat;

    totalTurnover += total;
    totalVat += vat;

    if (inv.status === "Nezaplaceno") {
      unpaidAmount += total;
    }
  });

  const formatCZK = (val: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-8">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Finance & Fakturace</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Finanční přehled
        </h1>
      </header>

      {/* KPI Karty */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Celkový Obrat */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Celkový Obrat</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#191919]" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tighter text-[#141414]">{formatCZK(totalTurnover)}</p>
          <p className="text-xs text-gray-500 mt-2">Včetně vystavených faktur s DPH</p>
        </div>

        {/* Nezaplaceno */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Nezaplacené Faktury</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tighter text-[#141414]">{formatCZK(unpaidAmount)}</p>
          <p className="text-xs text-amber-600 font-medium mt-2">K úhradě od klientů</p>
        </div>

        {/* DPH k Úhradě */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">DPH k Úhradě</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-[#191919]" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tighter text-[#141414]">{formatCZK(totalVat)}</p>
          <p className="text-xs text-gray-500 mt-2">Předpokládané DPH ke dni splatnosti</p>
        </div>
      </div>

      {/* Tabulka faktur */}
      <InvoicesList initialInvoices={allInvoices} clients={clients || []} />
    </div>
  );
}
