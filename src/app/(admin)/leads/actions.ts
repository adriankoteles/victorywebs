"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveLeadAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("leads")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    console.error("Failed to approve lead:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/leads");
  return { success: true };
}

export async function rejectLeadAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("leads")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    console.error("Failed to reject lead:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/leads");
  return { success: true };
}
