import { createClient } from "@/utils/supabase/server";
import { LeadsList } from "@/components/leads/LeadsList";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("status", "ready_for_review")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-8">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
          <span>Leady ke schválení</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Vygenerované Leady
            </h1>
            <p className="text-gray-500 mt-2">
              Zde jsou zobrazeny firmy a AI vygenerované cold e-maily. Zkontroluj texty a schval je k odeslání.
            </p>
          </div>
          <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
            Čeká na schválení: {leads?.length || 0}
          </div>
        </div>
      </header>

      <LeadsList initialLeads={leads || []} />
    </div>
  );
}
