import { createClient } from "@/utils/supabase/server";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Načtení reálných faktur z databáze
  const { data: invoices } = await supabase
    .from("invoices")
    .select("amount, vat_rate, status, created_at");

  let totalRevenue = 0;
  let monthlyRevenue = 0;
  let totalVat = 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  invoices?.forEach((inv) => {
    const base = Number(inv.amount || 0);
    const vatRate = Number(inv.vat_rate || 21);
    const vat = (base * vatRate) / 100;
    const totalWithVat = base + vat;

    // Celkový výdělek (pouze zaplacené faktury nebo všechny vystavené)
    if (inv.status === "Zaplaceno") {
      totalRevenue += totalWithVat;

      // Měsíční obrat z aktuálního měsíce
      const d = new Date(inv.created_at);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        monthlyRevenue += totalWithVat;
      }
    }

    // DPH k úhradě ze všech vystavených faktur
    totalVat += vat;
  });

  const formatCZK = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-8">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span>Dashboard</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Vítej zpět, Adriane!
        </h1>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* KPI 1 */}
        <div className="rounded-2xl border border-gray-100/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <p className="text-gray-500 text-sm font-medium">Celkový výdělek (Zaplaceno)</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-4xl font-semibold text-gray-900 tracking-tight">{formatCZK(totalRevenue)}</p>
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </div>
        
        {/* KPI 2 */}
        <div className="rounded-2xl border border-gray-100/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <p className="text-gray-500 text-sm font-medium">Měsíční obrat</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-4xl font-semibold text-gray-900 tracking-tight">{formatCZK(monthlyRevenue)}</p>
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-gray-100/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <p className="text-gray-500 text-sm font-medium">DPH k úhradě</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-4xl font-semibold text-gray-900 tracking-tight">{formatCZK(totalVat)}</p>
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <RevenueChart />
    </div>
  );
}
