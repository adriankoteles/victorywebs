"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSettingsAction() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agency_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Chyba při načítání nastavení:", error);
    // Vracíme výchozí hodnoty, pokud tabulka neexistuje nebo je prázdná
    return {
      company_name: "Victory Webs",
      owner_name: "Adrian Koteleš",
      ico: "00000000",
      dic: "",
      address: "Petřvald, 735 41",
      country: "Česká republika",
      is_vat_payer: false,
      bank_account: "1234567890/0300",
      invoice_due_days: 14,
      sender_email: "noreply@adriankoteles.cz"
    };
  }

  return data;
}

export async function updateSettingsAction(formData: FormData) {
  const supabase = await createClient();

  const company_name = formData.get("company_name") as string;
  const owner_name = formData.get("owner_name") as string;
  const ico = formData.get("ico") as string;
  const dic = formData.get("dic") as string;
  const address = formData.get("address") as string;
  const country = formData.get("country") as string;
  const is_vat_payer = formData.get("is_vat_payer") === "true";
  const bank_account = formData.get("bank_account") as string;
  const invoice_due_days = parseInt(formData.get("invoice_due_days") as string || "14", 10);
  const sender_email = formData.get("sender_email") as string;

  const { error } = await supabase
    .from("agency_settings")
    .upsert({
      id: 1,
      company_name,
      owner_name,
      ico,
      dic,
      address,
      country,
      is_vat_payer,
      bank_account,
      invoice_due_days,
      sender_email,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error("Chyba při ukládání nastavení:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/finances");
  return { success: true };
}
