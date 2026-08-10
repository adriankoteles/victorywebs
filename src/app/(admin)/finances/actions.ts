"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { generateInvoicePdfBuffer } from "@/utils/pdf";
import { InvoiceEmail } from "@/emails/InvoiceEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function addInvoiceAction(formData: FormData) {
  const supabase = await createClient();

  const client_id = formData.get("client_id") as string;
  const amountStr = formData.get("amount") as string;
  const vat_rateStr = formData.get("vat_rate") as string || "21";
  const due_date = formData.get("due_date") as string;

  if (!client_id || !amountStr || !due_date) {
    return { success: false, error: "Vyplňte klienta, částku a datum splatnosti." };
  }

  const amount = parseFloat(amountStr);
  const vat_rate = parseFloat(vat_rateStr);

  // 1. Automatické generování čísla faktury (např. INV-2026-001)
  const currentYear = new Date().getFullYear();
  const { data: latestInvoices } = await supabase
    .from("invoices")
    .select("invoice_number")
    .order("created_at", { ascending: false })
    .limit(1);

  let nextSeq = 1;
  if (latestInvoices && latestInvoices.length > 0) {
    const match = latestInvoices[0].invoice_number.match(/INV-\d+-(\d+)/);
    if (match) {
      nextSeq = parseInt(match[1], 10) + 1;
    } else {
      const { count } = await supabase.from("invoices").select("*", { count: "exact", head: true });
      nextSeq = (count || 0) + 1;
    }
  }

  const invoice_number = `INV-${currentYear}-${nextSeq.toString().padStart(3, "0")}`;

  // 2. Vložení faktury do DB
  const { data: newInvoice, error } = await supabase.from("invoices").insert({
    client_id,
    invoice_number,
    amount,
    vat_rate,
    status: "Nezaplaceno",
    due_date
  }).select().single();

  if (error) {
    console.error("Chyba při vytváření faktury:", error);
    return { success: false, error: error.message };
  }

  // 3. Načtení klienta a nastavení pro PDF a e-mail
  const { data: clientData } = await supabase
    .from("clients")
    .select("*")
    .eq("id", client_id)
    .single();

  const { data: settings } = await supabase
    .from("agency_settings")
    .select("*")
    .eq("id", 1)
    .single();

  // 4. Vygenerování PDF a odeslání e-mailu
  if (clientData && process.env.RESEND_API_KEY) {
    try {
      const pdfBuffer = await generateInvoicePdfBuffer(newInvoice, clientData, settings);
      
      const totalAmount = amount + (amount * vat_rate) / 100;

      await resend.emails.send({
        from: "Victory Webs <noreply@adriankoteles.cz>", // Odesílá se z produkční adresy
        to: clientData.email,
        subject: `Nová faktura [${invoice_number}] od Victory Webs`,
        react: InvoiceEmail({
          invoiceNumber: invoice_number,
          totalAmount,
          companyName: clientData.company_name
        }),
        attachments: [
          {
            filename: `Faktura_${invoice_number}.pdf`,
            content: pdfBuffer,
          }
        ]
      });
    } catch (emailError) {
      console.error("Chyba při odesílání e-mailu s fakturou:", emailError);
      // Nechceme zablokovat aplikaci, pokud selže e-mail
    }
  }

  revalidatePath("/finances");
  revalidatePath("/");
  revalidatePath("/clients");
  return { success: true };
}

export async function toggleInvoiceStatusAction(invoiceId: string, currentStatus: string) {
  const supabase = await createClient();
  const newStatus = currentStatus === "Zaplaceno" ? "Nezaplaceno" : "Zaplaceno";

  const { error } = await supabase
    .from("invoices")
    .update({ status: newStatus })
    .eq("id", invoiceId);

  if (error) {
    console.error("Chyba při změně stavu faktury:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/finances");
  revalidatePath("/");
  revalidatePath("/clients");
  return { success: true };
}
