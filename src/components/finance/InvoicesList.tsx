"use client";

import { useState, useTransition, useMemo } from "react";
import { toggleInvoiceStatusAction } from "@/app/(admin)/finances/actions";
import { AddInvoiceModal } from "./AddInvoiceModal";
import { Plus, Search, Filter, CheckCircle2, Clock, Download } from "lucide-react";

export function InvoicesList({ initialInvoices, clients }: { initialInvoices: any[], clients: any[] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const formatCZK = (val: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("cs-CZ");
  };

  const handleToggleStatus = (invoiceId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Zaplaceno" ? "Nezaplaceno" : "Zaplaceno";
    
    // Optimistic UI update
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv));

    startTransition(async () => {
      await toggleInvoiceStatusAction(invoiceId, currentStatus);
    });
  };

  const filteredInvoices = useMemo(() => {
    let list = [...invoices];

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.invoice_number.toLowerCase().includes(lower) ||
          inv.clients?.company_name.toLowerCase().includes(lower) ||
          inv.clients?.system_id.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== "ALL") {
      list = list.filter((inv) => inv.status === statusFilter);
    }

    return list;
  }, [invoices, searchQuery, statusFilter]);

  return (
    <>
      {/* Control bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all shadow-sm"
              placeholder="Hledat číslo faktury, klienta..."
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-gray-700 font-medium py-1.5 pr-3 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Všechny faktury</option>
              <option value="Zaplaceno">Zaplacené</option>
              <option value="Nezaplaceno">Nezaplacené</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Vystavit fakturu
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-[#F7F9FC]/50 text-[11px] uppercase text-gray-400 font-semibold tracking-wider border-b border-gray-100/50">
              <tr>
                <th className="px-6 py-4">Číslo faktury</th>
                <th className="px-6 py-4">Odběratel</th>
                <th className="px-6 py-4">Částka (s DPH)</th>
                <th className="px-6 py-4">Splatnost</th>
                <th className="px-6 py-4">Stav platby</th>
                <th className="px-6 py-4 text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-900 font-medium mb-1">Žádné faktury nenalezeny</p>
                    <p className="text-gray-500 text-sm">Vystav novou fakturu tlačítkem výše.</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const base = Number(inv.amount || 0);
                  const vat = (base * Number(inv.vat_rate || 21)) / 100;
                  const total = base + vat;
                  const isPaid = inv.status === "Zaplaceno";

                  return (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900 tracking-tight">{inv.invoice_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{inv.clients?.company_name || "Neznámý klient"}</p>
                        <p className="text-[12px] text-gray-400 mt-0.5">{inv.clients?.system_id}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-gray-900">{formatCZK(total)}</p>
                        <p className="text-[11px] text-gray-400 font-medium">Základ: {formatCZK(base)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                        {formatDate(inv.due_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Zaplaceno
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                              <Clock className="w-3.5 h-3.5" />
                              Nezaplaceno
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right flex items-center justify-end gap-2">
                        <a
                          href={`/api/invoices/${inv.id}/pdf`}
                          download={`Faktura_${inv.invoice_number}.pdf`}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent"
                          title="Stáhnout PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleToggleStatus(inv.id, inv.status)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                            isPaid
                              ? "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                              : "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                          }`}
                        >
                          {isPaid ? "Označit jako nezaplaceno" : "Označit zaplaceno"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        clients={clients} 
      />
    </>
  );
}
