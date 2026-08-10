"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addProjectAction(formData: FormData) {
  const supabase = await createClient();

  const client_id = formData.get("client_id") as string;
  const name = formData.get("name") as string;
  const priceStr = formData.get("price") as string;
  const stage = formData.get("stage") as string || "Poptávka";
  
  if (!client_id || !name) {
    return { success: false, error: "Klient a název projektu jsou povinné." };
  }

  const price = priceStr ? parseFloat(priceStr) : 0;

  const { error } = await supabase.from("projects").insert({
    client_id,
    name,
    price,
    stage
  });

  if (error) {
    console.error("Chyba při vytváření projektu:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath("/clients");
  return { success: true };
}

export async function updateProjectStageAction(projectId: string, newStage: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ stage: newStage })
    .eq("id", projectId);

  if (error) {
    console.error("Chyba při updatu stage projektu:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath("/clients");
  return { success: true };
}
