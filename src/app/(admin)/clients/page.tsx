import { createClient } from "@/utils/supabase/server";
import { ClientsList } from "@/components/clients/ClientsList";

export default async function ClientsPage() {
  const supabase = await createClient();
  
  // Přímý server fetch klientů z DB, včetně jejich faktur pro výpočet LTV
  const { data: clients } = await supabase
    .from("clients")
    .select(`
      *,
      invoices (
        id,
        invoice_number,
        amount,
        vat_rate,
        status,
        due_date
      )
    `)
    .order("created_at", { ascending: false });

  const clientCount = clients?.length || 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-8">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <span>Klienti</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Klientská databáze
          </h1>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full w-fit">
            {clientCount} {clientCount === 1 ? 'KLIENT' : (clientCount >= 2 && clientCount <= 4) ? 'KLIENTI' : 'KLIENTŮ'} V DATABÁZI
          </span>
        </div>
      </header>

      <ClientsList initialClients={clients || []} />
    </div>
  );
}
