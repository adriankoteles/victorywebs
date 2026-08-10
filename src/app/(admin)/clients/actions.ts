"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import ClientOnboardingEmail from "@/emails/ClientOnboardingEmail";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function addClientAction(formData: FormData) {
  const supabase = await createClient();

  const company_name = formData.get("company_name") as string;
  const email = formData.get("email") as string;

  if (!company_name || !email) {
    return { success: false, error: "Vyplňte název firmy a e-mail." };
  }

  // 1. Sekvenční číslování (VW-XXX)
  const { data: latestClients } = await supabase
    .from("clients")
    .select("system_id")
    .order("created_at", { ascending: false })
    .limit(1);

  let nextNumber = 1;
  if (latestClients && latestClients.length > 0) {
    const latestId = latestClients[0].system_id;
    const match = latestId.match(/VW-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    } else {
      const { count } = await supabase.from("clients").select("*", { count: "exact", head: true });
      nextNumber = (count || 0) + 1;
    }
  }

  const system_id = `VW-${nextNumber.toString().padStart(3, "0")}`;
  
  // 2. Vygenerování 6místného klientského PINu
  const pin_code = Math.floor(100000 + Math.random() * 900000).toString();

  // 3. Vložení do databáze
  const { error } = await supabase.from("clients").insert({
    system_id,
    pin_code,
    company_name,
    contact_name: company_name,
    email,
    status: "Onboarding"
  });

  if (error) {
    console.error("Chyba při přidávání klienta:", error);
    return { success: false, error: error.message };
  }

  // 4. Odeslání Onboarding E-mailu přes Resend API
  if (resend) {
    try {
      await resend.emails.send({
        from: "Victory Webs <noreply@adriankoteles.cz>", // Nahradit vlastní doménou po nastavení DNS v Resend
        to: [email],
        subject: "Vítejte ve Victory Webs Agency OS - Přístupové údaje",
        react: ClientOnboardingEmail({
          companyName: company_name,
          systemId: system_id,
          pinCode: pin_code,
        }),
      });
    } catch (emailError) {
      console.error("Chyba při odesílání onboarding emailu přes Resend:", emailError);
      // Výstraha pouze do logu, vytvoření klienta v DB proběhlo úspěšně
    }
  } else {
    console.warn("RESEND_API_KEY chybí v .env.local - onboarding e-mail nebyl odeslán.");
  }

  revalidatePath("/clients");
  return { success: true };
}

export async function updateClientAction(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const company_name = formData.get("company_name") as string;
  const contact_name = formData.get("contact_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const ico = formData.get("ico") as string;
  const dic = formData.get("dic") as string;
  const address = formData.get("address") as string;
  const status = formData.get("status") as string;

  if (!id || !company_name || !email) {
    return { success: false, error: "Název firmy a e-mail jsou povinné." };
  }

  const { error } = await supabase
    .from("clients")
    .update({
      company_name,
      contact_name,
      email,
      phone,
      ico,
      dic,
      address,
      status
    })
    .eq("id", id);

  if (error) {
    console.error("Chyba při aktualizaci klienta:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/clients");
  return { success: true };
}
