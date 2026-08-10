import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { PortalFlow } from "@/components/portal/PortalFlow";

export default async function PortalPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("client_id")?.value;

  let client = null;
  let projects = [];
  let invoices = [];

  if (clientId) {
    const supabase = await createClient();

    // Načtení detailů přihlášeného klienta
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (data) {
      client = data;

      // Načtení projektů klienta
      const { data: pData } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (pData) projects = pData;

      // Načtení faktur klienta
      const { data: iData } = await supabase
        .from("invoices")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (iData) invoices = iData;
    }
  }

  return (
    <PortalFlow 
      initialClient={client} 
      projects={projects} 
      invoices={invoices} 
    />
  );
}
