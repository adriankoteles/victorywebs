"use client";

import { useState, useTransition } from "react";
import { updateSettingsAction } from "@/app/(admin)/settings/actions";
import { Building2, Landmark, Mail, ShieldAlert, Check } from "lucide-react";

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateSettingsAction(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.error || "Chyba při ukládání nastavení.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <Check className="w-5 h-5 text-emerald-600" />
          Nastavení bylo úspěšně uloženo a aplikováno.
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-800 text-sm font-semibold flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          {error}
        </div>
      )}

      {/* 1. Profil & Fakturace */}
      <div className="bg-white rounded-2xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Profil & Fakturační údaje</h2>
            <p className="text-xs text-gray-500 mt-0.5">Tyto údaje se automaticky propíší jako "Dodavatel" na všechny faktury.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Název firmy / Brand</label>
            <input required name="company_name" type="text" defaultValue={initialSettings.company_name} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Jméno majitele</label>
            <input required name="owner_name" type="text" defaultValue={initialSettings.owner_name} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">IČO</label>
              <input required name="ico" type="text" defaultValue={initialSettings.ico} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">DIČ (nepovinné)</label>
              <input name="dic" type="text" defaultValue={initialSettings.dic} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" placeholder="CZ..." />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Plátce DPH</label>
            <div className="relative">
              <select name="is_vat_payer" defaultValue={initialSettings.is_vat_payer ? "true" : "false"} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all appearance-none sm:text-sm">
                <option value="false">Neplátce DPH</option>
                <option value="true">Plátce DPH (21%)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Ulice a č.p.</label>
            <input required name="address" type="text" defaultValue={initialSettings.address} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Země</label>
            <input required name="country" type="text" defaultValue={initialSettings.country} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" />
          </div>
        </div>
      </div>

      {/* 2. Bankovní detaily */}
      <div className="bg-white rounded-2xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Bankovní spojení & Splatnost</h2>
            <p className="text-xs text-gray-500 mt-0.5">Údaje pro provádění plateb ze strany klientů.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Číslo bankovního účtu</label>
            <input required name="bank_account" type="text" defaultValue={initialSettings.bank_account} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Výchozí splatnost faktur (dny)</label>
            <input required name="invoice_due_days" type="number" min="1" defaultValue={initialSettings.invoice_due_days} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" />
          </div>
        </div>
      </div>

      {/* 3. Mailing nastavení */}
      <div className="bg-white rounded-2xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">E-mailová komunikace</h2>
            <p className="text-xs text-gray-500 mt-0.5">Adresa, ze které se odesílají faktury a onboarding maily.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Odesílatel (Resend Verified Email)</label>
            <input required name="sender_email" type="email" defaultValue={initialSettings.sender_email} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm" />
            <p className="text-[11px] text-gray-400 mt-1.5">Ujistěte se, že je tato adresa ověřená v nastavení vašeho Resend účtu.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button disabled={isPending} type="submit" className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50">
          {isPending ? "Ukládám..." : "Uložit nastavení"}
        </button>
      </div>
    </form>
  );
}
