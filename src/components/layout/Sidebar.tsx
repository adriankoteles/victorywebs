"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FolderKanban, Receipt, Settings, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leady", href: "/leads", icon: Megaphone },
  { name: "Klienti", href: "/clients", icon: Users },
  { name: "Projekty", href: "/projects", icon: FolderKanban },
  { name: "Finance", href: "/finances", icon: Receipt },
  { name: "Nastavení", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen fixed top-0 left-0 border-r border-gray-100/50 bg-[#F7F9FC] flex flex-col p-6 z-50">
      <div className="mb-10 px-3 mt-2">
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">
          Victory Webs
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? "text-gray-900 font-medium" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#F4F5F7] rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="w-[18px] h-[18px] relative z-10" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[13px] relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-1">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F4F5F7] transition-colors cursor-pointer border border-transparent">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-xs">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">Adrian K.</p>
            <p className="text-[12px] text-gray-500 truncate mt-0.5">Majitel</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
