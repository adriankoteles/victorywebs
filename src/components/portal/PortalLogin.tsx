"use client";

import { useState, useTransition } from "react";
import { loginClientAction } from "@/app/(portal)/portal/actions";
import { ShieldCheck, Loader2 } from "lucide-react";

export function PortalLogin() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const systemId = formData.get("system_id") as string;
    const pinCode = formData.get("pin_code") as string;

    startTransition(async () => {
      const res = await loginClientAction(systemId, pinCode);
      if (!res.success) {
        setError(res.error || "Chyba při přihlašování.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Victory Webs</h1>
          <p className="text-xs text-gray-400 mt-1">Vstup do klientského portálu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Klientské ID (např. VW-001)</label>
            <input
              required
              name="system_id"
              type="text"
              placeholder="VW-XXX"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm uppercase"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">6-místný PIN kód</label>
            <input
              required
              name="pin_code"
              type="password"
              maxLength={6}
              placeholder="••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all sm:text-sm tracking-widest text-center font-bold"
            />
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="w-full py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ověřuji přístup...
              </>
            ) : (
              "Vstoupit do Portálu"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
