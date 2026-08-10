"use client";

import { useState, useTransition } from "react";
import { ProjectCard } from "./ProjectCard";
import { updateProjectStageAction } from "@/app/(admin)/projects/actions";
import { Plus } from "lucide-react";
import { AddProjectModal } from "./AddProjectModal";

const KANBAN_STAGES = [
  "Poptávka", 
  "Onboarding & Design", 
  "Vývoj & Kód", 
  "Revize & Test", 
  "Dokončeno"
];

export function KanbanBoard({ initialProjects, clients }: { initialProjects: any[], clients: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.setData("projectId", projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData("projectId");
    
    if (!projectId) return;

    // Optimistic UI Update
    setProjects(prev => 
      prev.map(p => p.id === projectId ? { ...p, stage: targetStage } : p)
    );

    startTransition(async () => {
      await updateProjectStageAction(projectId, targetStage);
    });
  };

  return (
    <>
      <div className="mb-8 flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Přidat projekt
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 h-[calc(100vh-220px)] items-start">
        {KANBAN_STAGES.map((stage) => {
          const columnProjects = projects.filter(p => p.stage === stage || (!p.stage && stage === "Poptávka"));

          return (
            <div 
              key={stage}
              className="flex-shrink-0 w-80 bg-[#F7F9FC] rounded-2xl flex flex-col max-h-full border border-gray-100"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-100/50">
                <h3 className="text-sm font-semibold text-gray-900">{stage}</h3>
                <span className="bg-gray-200/60 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  {columnProjects.length}
                </span>
              </div>

              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {columnProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onDragStart={handleDragStart} 
                  />
                ))}
                
                {columnProjects.length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-400 font-medium">Přetáhněte sem</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        clients={clients} 
      />
    </>
  );
}
