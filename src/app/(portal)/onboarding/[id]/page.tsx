import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { OnboardingFlow } from "@/components/portal/OnboardingFlow";

export default async function MagicLinkOnboardingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !client) {
    notFound();
  }

  return (
    <OnboardingFlow client={client} />
  );
}
