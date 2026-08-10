import { createClient } from "@/utils/supabase/server";
import { generateInvoicePdfBuffer } from "@/utils/pdf";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: invoice } = await supabase
      .from("invoices")
      .select(`
        *,
        clients (
          id,
          company_name,
          contact_name,
          email,
          ico,
          dic,
          address
        )
      `)
      .eq("id", id)
      .single();

    if (!invoice) {
      return new NextResponse("Faktura nenalezena", { status: 404 });
    }

    const { data: settings } = await supabase
      .from("agency_settings")
      .select("*")
      .eq("id", 1)
      .single();

    const pdfBuffer = await generateInvoicePdfBuffer(invoice, invoice.clients, settings);

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Faktura_${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new NextResponse("Chyba při generování PDF", { status: 500 });
  }
}
