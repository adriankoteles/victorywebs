"use client";

import { useState, useMemo } from "react";
import { AddClientModal } from "./AddClientModal";
import { ClientDetailDrawer } from "./ClientDetailDrawer";
import { Plus, Search, Filter, ArrowUpDown, Banknote } from "lucide-react";

export function ClientsList({ initialClients }: { initialClients: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  
  // Filtry a Řazení
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "alphabet" | "ltv_desc">("newest");
  const [minLtv, setMinLtv] = useState<string>(""); // Custom Min. LTV hodnota

  const formatCZK = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const processedClients = useMemo(() => {
    let list = [...initialClients];

    // 1. Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.company_name.toLowerCase().includes(lowerQuery) ||
          c.system_id.toLowerCase().includes(lowerQuery) ||
          (c.ico && c.ico.includes(lowerQuery)) ||
          c.contact_name?.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Status Filter
    if (statusFilter !== "ALL") {
      list = list.filter((c) => c.status === statusFilter);
    }

    // 3. Custom Min LTV Filter
    if (minLtv) {
      const minVal = parseFloat(minLtv);
      if (!isNaN(minVal) && minVal > 0) {
        list = list.filter((c) => {
          const ltv = c.invoices?.reduce((sum: number, inv: any) => {
          const base = Number(inv.amount || 0);
          const vat = (base * Number(inv.vat_rate || 21)) / 100;
          return sum + (base + vat);
        }, 0) || 0;
          return ltv >= minVal;
        });
      }
    }

    // 4. Sorting
    list.sort((a, b) => {
      if (sortBy === "alphabet") {
        return a.company_name.localeCompare(b.company_name);
      }
      if (sortBy === "ltv_desc") {
        const ltvA = a.invoices?.reduce((sum: number, inv: any) => {
          const base = Number(inv.amount || 0);
          const vat = (base * Number(inv.vat_rate || 21)) / 100;
          return sum + (base + vat);
        }, 0) || 0;
        const ltvB = b.invoices?.reduce((sum: number, inv: any) => {
          const base = Number(inv.amount || 0);
          const vat = (base * Number(inv.vat_rate || 21)) / 100;
          return sum + (base + vat);
        }, 0) || 0;
        return ltvB - ltvA;
      }
      // newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [initialClients, searchQuery, statusFilter, sortBy, minLtv]);

  return (
    <>
      {/* Ovládací lišta: Hledání + Filtry + Akce */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Vyhledávací pole */}
          <div className="relative w-full lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all shadow-sm"
              placeholder="Hledat jméno, IČO, ID..."
            />
          </div>

          {/* Filtry & Řazení Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-gray-700 font-medium py-1.5 pr-3 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Všechny statusy</option>
                <option value="Onboarding">Onboarding</option>
                <option value="In Development">In Development</option>
                <option value="Active Monthly">Active Monthly</option>
                <option value="Paused">Paused</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 ml-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-gray-700 font-medium py-1.5 pr-3 focus:outline-none cursor-pointer"
              >
                <option value="newest">Nejnovější</option>
                <option value="alphabet">Podle abecedy</option>
                <option value="ltv_desc">Nejvyšší výdělek (LTV)</option>
              </select>
            </div>

            {/* Custom Min LTV Input */}
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-sm text-xs w-36">
              <Banknote className="w-3.5 h-3.5 text-gray-400 ml-3 shrink-0" />
              <input
                type="number"
                value={minLtv}
                onChange={(e) => setMinLtv(e.target.value)}
                placeholder="Min. LTV (Kč)..."
                className="w-full py-2 px-2 bg-transparent text-gray-900 focus:outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Přidat klienta */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm ml-auto"
            >
              <Plus className="w-4 h-4" />
              Přidat klienta
            </button>
          </div>

        </div>
      </div>

      {/* Tabulka Klientů */}
      <div className="bg-white rounded-2xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-[#F7F9FC]/50 text-[11px] uppercase text-gray-400 font-semibold tracking-wider border-b border-gray-100/50">
              <tr>
                <th className="px-6 py-4">System ID</th>
                <th className="px-6 py-4">Firma & Kontakt</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Celkem Vyfakturováno</th>
                <th className="px-6 py-4 text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {processedClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-900 font-medium mb-1">Žádní klienti nenalezeni</p>
                    <p className="text-gray-500 text-sm">Zkus upravit vyhledávání nebo filtry.</p>
                  </td>
                </tr>
              ) : (
                processedClients.map((client) => {
                  const ltv = client.invoices?.reduce((sum: number, inv: any) => {
                    const base = Number(inv.amount || 0);
                    const vat = (base * Number(inv.vat_rate || 21)) / 100;
                    return sum + (base + vat);
                  }, 0) || 0;
                  
                  return (
                    <tr 
                      key={client.id} 
                      onClick={() => setSelectedClient(client)}
                      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900 tracking-tight">{client.system_id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{client.company_name}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[13px] text-gray-500">
                          <span>{client.contact_name || client.email}</span>
                          {client.ico && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span>IČO: {client.ico}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            client.status === 'Active Monthly' ? 'bg-emerald-500' :
                            client.status === 'Onboarding' ? 'bg-amber-400' :
                            client.status === 'In Development' ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <span className="text-gray-700 font-medium">{client.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">{formatCZK(ltv)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-gray-400 font-medium text-sm transition-colors group-hover:text-gray-900 opacity-0 group-hover:opacity-100">
                          Detail →
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ClientDetailDrawer client={selectedClient} isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} />
    </>
  );
}
