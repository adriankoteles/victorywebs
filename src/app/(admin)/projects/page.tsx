import { createClient } from "@/utils/supabase/server";
import { KanbanBoard } from "@/components/projects/KanbanBoard";

export default async function ProjectsPage() {
  const supabase = await createClient();
  
  // Načtení projektů s připojenými daty o klientovi
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      clients (
        id,
        system_id,
        company_name
      )
    `)
    .order("created_at", { ascending: false });

  // Načtení klientů pro dropdown v "Přidat projekt" modalu
  const { data: clients } = await supabase
    .from("clients")
    .select("id, system_id, company_name")
    .order("company_name", { ascending: true });

  const activeProjectsCount = projects?.filter(p => p.stage !== "Dokončeno").length || 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 pt-8 flex flex-col h-full">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span>Projekty</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Kanban Board
          </h1>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full w-fit">
            {activeProjectsCount} AKTIVNÍCH PROJEKTŮ
          </span>
        </div>
      </header>

      {/* Samotný Kanban board se postará o zobrazení dat a Modalu */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard 
          initialProjects={projects || []} 
          clients={clients || []} 
        />
      </div>
    </div>
  );
}
