import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generateInvoicePdfBuffer(invoice: any, client: any, settings?: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 format
  const { width, height } = page.getSize();
  
  const primaryColor = rgb(15/255, 23/255, 42/255); // #0F172A
  const secondaryColor = rgb(100/255, 116/255, 139/255); // #64748B
  const tableBgColor = rgb(248/255, 250/255, 252/255); // #F8FAFC
  const borderColor = rgb(226/255, 232/255, 240/255); // #E2E8F0

  const margin = 50;
  let y = height - margin;

  // Pomocná fce pro odstanění diakritiky (základní font nemusí umět háčky)
  const stripAccents = (str: string) => {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const formatCZK = (val: number) => {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })
      .format(val)
      .replace(/,/g, " ") + " CZK";
  };

  // --- 1. HEADER (VICTORY WEBS & FAKTURA) ---
  const companyName = stripAccents(settings?.company_name || 'VICTORY WEBS').toUpperCase();
  const ownerName = stripAccents(settings?.owner_name || 'Adrian Koteles');
  const ico = settings?.ico || '00000000';
  const dic = settings?.dic || '';
  const address = stripAccents(settings?.address || 'Petrvald, 735 41');
  const country = stripAccents(settings?.country || 'Ceska republika');
  const isVatPayer = settings?.is_vat_payer || false;
  const bankAccount = settings?.bank_account || '1234567890/0300';

  page.drawText(companyName, { x: margin, y: y - 15, size: 18, font: fontBold, color: primaryColor });
  page.drawText(ownerName, { x: margin, y: y - 30, size: 10, font, color: secondaryColor });

  page.drawText('FAKTURA', { x: width - margin - 110, y: y - 15, size: 22, font: fontBold, color: primaryColor });
  page.drawText(invoice.invoice_number, { x: width - margin - 85, y: y - 30, size: 10, font: fontBold, color: secondaryColor });
  
  y -= 80;

  // Čára pod hlavičkou
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: borderColor });
  
  y -= 30;

  // --- 2. DODAVATEL & ODBĚRATEL ---
  const topPos = y;

  // Dodavatel
  page.drawText('DODAVATEL', { x: margin, y: topPos, size: 9, font: fontBold, color: secondaryColor });
  page.drawText(ownerName, { x: margin, y: topPos - 20, size: 12, font: fontBold, color: primaryColor });
  page.drawText(companyName, { x: margin, y: topPos - 35, size: 10, font, color: primaryColor });
  page.drawText(`ICO: ${ico}`, { x: margin, y: topPos - 50, size: 10, font, color: primaryColor });
  page.drawText(address, { x: margin, y: topPos - 65, size: 10, font, color: primaryColor });
  page.drawText(country, { x: margin, y: topPos - 80, size: 10, font, color: primaryColor });
  page.drawText(isVatPayer ? 'Platce DPH' : 'Neplatce DPH', { x: margin, y: topPos - 95, size: 10, font: fontBold, color: secondaryColor });

  // Odběratel
  page.drawText('ODBERATEL', { x: 300, y: topPos, size: 9, font: fontBold, color: secondaryColor });
  page.drawText(stripAccents(client.company_name) || 'Neznamy klient', { x: 300, y: topPos - 20, size: 12, font: fontBold, color: primaryColor });
  if (client.contact_name) {
    page.drawText(stripAccents(client.contact_name), { x: 300, y: topPos - 35, size: 10, font, color: primaryColor });
  }
  page.drawText(`ICO: ${client.ico || '-'}`, { x: 300, y: topPos - 50, size: 10, font, color: primaryColor });
  if (client.dic) {
    page.drawText(`DIC: ${client.dic}`, { x: 300, y: topPos - 65, size: 10, font, color: primaryColor });
  }
  page.drawText(stripAccents(client.address) || '-', { x: 300, y: topPos - 80, size: 10, font, color: primaryColor });

  y -= 130;

  // --- 3. META ÚDAJE (Mřížka) ---
  page.drawRectangle({ x: margin, y: y - 50, width: width - (margin * 2), height: 50, color: tableBgColor, borderColor, borderWidth: 1 });
  
  const metaY = y - 20;
  const metaValY = y - 35;

  page.drawText('DATUM VYSTAVENI', { x: margin + 15, y: metaY, size: 8, font: fontBold, color: secondaryColor });
  page.drawText(new Date(invoice.created_at).toLocaleDateString('cs-CZ'), { x: margin + 15, y: metaValY, size: 10, font, color: primaryColor });

  page.drawText('DATUM SPLATNOSTI', { x: margin + 130, y: metaY, size: 8, font: fontBold, color: secondaryColor });
  page.drawText(new Date(invoice.due_date).toLocaleDateString('cs-CZ'), { x: margin + 130, y: metaValY, size: 10, font: fontBold, color: primaryColor });

  page.drawText('ZPUSOB UHRADY', { x: margin + 250, y: metaY, size: 8, font: fontBold, color: secondaryColor });
  page.drawText('Bankovni prevod', { x: margin + 250, y: metaValY, size: 10, font, color: primaryColor });

  page.drawText('CISLO UCTU', { x: margin + 370, y: metaY, size: 8, font: fontBold, color: secondaryColor });
  page.drawText(bankAccount, { x: margin + 370, y: metaValY, size: 10, font: fontBold, color: primaryColor });

  y -= 80;

  // --- 4. TABULKA POLOŽEK ---
  // Hlavička tabulky
  page.drawRectangle({ x: margin, y: y - 25, width: width - (margin * 2), height: 25, color: tableBgColor, borderColor, borderWidth: 1 });
  
  const thY = y - 17;
  page.drawText('POPIS POLOZKY', { x: margin + 15, y: thY, size: 9, font: fontBold, color: secondaryColor });
  page.drawText('MNOZSTVI', { x: width - margin - 220, y: thY, size: 9, font: fontBold, color: secondaryColor });
  page.drawText('CENA / MJ', { x: width - margin - 150, y: thY, size: 9, font: fontBold, color: secondaryColor });
  page.drawText('CELKEM', { x: width - margin - 60, y: thY, size: 9, font: fontBold, color: secondaryColor });

  y -= 50;

  // Položka
  const baseAmount = Number(invoice.amount || 0); // Bez DPH jako neplátce = celkem

  page.drawText('Tvorba webove prezentace / Sluzby', { x: margin + 15, y, size: 10, font, color: primaryColor });
  page.drawText('1x', { x: width - margin - 200, y, size: 10, font, color: primaryColor });
  page.drawText(formatCZK(baseAmount), { x: width - margin - 150, y, size: 10, font, color: primaryColor });
  page.drawText(formatCZK(baseAmount), { x: width - margin - 60, y, size: 10, font: fontBold, color: primaryColor });

  y -= 20;

  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: borderColor });

  y -= 40;

  // --- 5. FINÁLNÍ SOUČET ---
  const totalBoxWidth = 240;
  const totalBoxHeight = 50;
  const totalBoxX = width - margin - totalBoxWidth;
  const totalBoxY = y - totalBoxHeight;

  page.drawRectangle({
    x: totalBoxX,
    y: totalBoxY,
    width: totalBoxWidth,
    height: totalBoxHeight,
    color: primaryColor, // Černý/Tmavý box (#0F172A)
    borderColor: primaryColor,
    borderWidth: 1,
  });

  page.drawText('CELKEM K UHRADE', { x: totalBoxX + 20, y: totalBoxY + 30, size: 9, font: fontBold, color: rgb(1,1,1) }); // Bílý text
  page.drawText(formatCZK(baseAmount), { x: totalBoxX + 20, y: totalBoxY + 12, size: 16, font: fontBold, color: rgb(1,1,1) }); // Bílý text

  // Děkujeme text
  page.drawText('Dekujeme za spolupraci.', { x: margin, y: totalBoxY + 30, size: 10, font, color: primaryColor });

  // --- 6. FOOTER ---
  page.drawText('Faktura slouzi jako danovy doklad. Fyzicka osoba zapsana v zivnostenskem rejstriku.', { 
    x: margin, 
    y: 30, 
    size: 8, 
    font, 
    color: secondaryColor 
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
