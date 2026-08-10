"use client";

import { Building2, Banknote } from "lucide-react";

export function ProjectCard({ 
  project, 
  onDragStart 
}: { 
  project: any;
  onDragStart: (e: React.DragEvent, projectId: string) => void;
}) {
  const formatCZK = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, project.id)}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">{project.name}</h4>
      </div>

      <div className="space-y-2 mb-4">
        {project.clients && (
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <Building2 className="w-3.5 h-3.5" />
            <span className="font-medium">{project.clients.company_name}</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-400 font-semibold">{project.clients.system_id}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-900 font-semibold text-sm">
          <Banknote className="w-4 h-4 text-gray-400" />
          {formatCZK(project.price)}
        </div>
      </div>
    </div>
  );
}
