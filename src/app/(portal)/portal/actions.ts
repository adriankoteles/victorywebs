"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function loginClientAction(systemId: string, pinCode: string) {
  if (!systemId || !pinCode) {
    return { success: false, error: "Vyplňte obě pole." };
  }

  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select("id, system_id, pin_code")
    .eq("system_id", systemId.toUpperCase().trim())
    .eq("pin_code", pinCode.trim())
    .single();

  if (error || !client) {
    return { success: false, error: "Neplatné klientské ID nebo PIN kód." };
  }

  // Uložení sezení do cookies
  const cookieStore = await cookies();
  cookieStore.set("client_id", client.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 týden
    path: "/",
  });

  revalidatePath("/portal");
  return { success: true };
}

export async function logoutClientAction() {
  const cookieStore = await cookies();
  cookieStore.delete("client_id");
  revalidatePath("/portal");
  return { success: true };
}

export async function setClientCookieAction(clientId: string) {
  const cookieStore = await cookies();
  cookieStore.set("client_id", clientId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 týden
    path: "/",
  });
  return { success: true };
}

export async function updateClientOnboardingAction(
  clientId: string, 
  billingData: any, 
  onboardingData: any, 
  isVip: boolean = false
) {
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("social_media")
    .eq("id", clientId)
    .single();

  const currentSocialMedia = client?.social_media || {};

  // 1. Aktualizace klienta (Fakturační údaje + JSONB Onboarding)
  const { error: clientError } = await supabase
    .from("clients")
    .update({
      company_name: billingData.company_name,
      ico: billingData.ico,
      dic: billingData.dic,
      address: billingData.address,
      contact_name: billingData.contact_name,
      billing_email: billingData.billing_email,
      phone: billingData.phone,
      social_media: {
        ...currentSocialMedia,
        onboarding: onboardingData,
        is_vip: isVip,
      }
    })
    .eq("id", clientId);

  if (clientError) {
    console.error("Chyba při ukládání onboardingu:", clientError);
    return { success: false, error: clientError.message };
  }

  // 2. Posunutí projektu do fáze "Onboarding & Design", pokud je v první fázi
  const { data: projects } = await supabase
    .from("projects")
    .select("id, stage")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (projects && projects.length > 0) {
    const activeProject = projects[0];
    if (activeProject.stage === "Poptávka") {
      await supabase
        .from("projects")
        .update({ stage: "Onboarding & Design" })
        .eq("id", activeProject.id);
    }
  }

  revalidatePath("/portal");
  revalidatePath("/clients");
  return { success: true };
}

export async function submitClientFeedbackAction(clientId: string, nps: number, text: string) {
  const supabase = await createClient();

  // Uložíme feedback do social_media JSONB pod klíčem "feedback"
  // Abychom zachovali onboarding, načteme stávající social_media a merge-neme to
  const { data: client } = await supabase
    .from("clients")
    .select("social_media")
    .eq("id", clientId)
    .single();

  const currentSocialMedia = client?.social_media || {};

  const { error } = await supabase
    .from("clients")
    .update({
      social_media: {
        ...currentSocialMedia,
        feedback: { nps, text, date: new Date().toISOString() }
      }
    })
    .eq("id", clientId);

  if (error) {
    console.error("Chyba při ukládání feedbacku:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/portal");
  revalidatePath("/clients");
  return { success: true };
}
