"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PortalLogin } from "./PortalLogin";
import { PortalDashboard } from "./PortalDashboard";

type FlowState = "splash" | "login" | "welcome" | "dashboard";

interface PortalFlowProps {
  initialClient: any | null;
  projects: any[];
  invoices: any[];
}

export function PortalFlow({ initialClient, projects, invoices }: PortalFlowProps) {
  // Pokud klient přijde již přihlášený (má cookie z dřívějška), jdeme rovnou do dashboardu.
  // Pokud ne, spustíme úvodní splash screen animaci.
  const [state, setState] = useState<FlowState>(initialClient ? "dashboard" : "splash");
  
  // Držíme stav klienta v klientském stavu pro zobrazení jeho jména po loginu
  const [clientData, setClientData] = useState<any | null>(initialClient);

  useEffect(() => {
    if (state === "splash") {
      // Zobrazí nápis Victory Webs a po 1.5s přejde na login
      const timer = setTimeout(() => {
        setState("login");
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (state === "welcome") {
      // Zobrazí "Dobrý den, Firma" a po 2s přejde do dashboardu
      const timer = setTimeout(() => {
        setState("dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Handler pro úspěšný login z PortalLogin.tsx (aby se spustil welcome screen bez reloadu)
  // PortalLogin volá Server Action, ale my potřebujeme po úspěchu nejdřív udělat animaci
  // a pak reloadnout / stáhnout data. Proto login přesuneme do PortalFlow nebo upravíme PortalLogin
  // aby přijímal callback na úspěch. Ale v Next.js server actions revalidují cestu.
  // Místo toho můžeme udělat trik - pokud se po loginu (revalidaci) `initialClient` změní
  // z null na data, ukážeme "welcome".

  useEffect(() => {
    // Pokud jsme byli ve stavu "login" a najednou přišel initialClient ze serveru (po úspěšném loginu a revalidaci),
    // přejdeme do stavu "welcome".
    if (state === "login" && initialClient) {
      setClientData(initialClient);
      setState("welcome");
    }
    // Pokud jsme v dashboardu a initialClient se stane null (logout), jdeme zpět na login
    if (state === "dashboard" && !initialClient) {
      setClientData(null);
      setState("login"); // Přeskočíme splash
    }
  }, [initialClient, state]);


  return (
    <div className="relative min-h-screen bg-[#F5F5F7] overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* 1. Úvodní Splash Screen */}
        {state === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#F5F5F7] z-50"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Victory Webs
            </h1>
            <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mt-4">
              Client Portal
            </p>
          </motion.div>
        )}

        {/* 2. Přihlašovací formulář */}
        {state === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-40"
          >
            <PortalLogin />
          </motion.div>
        )}

        {/* 3. Uvítací obrazovka */}
        {state === "welcome" && clientData && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center bg-[#F5F5F7] z-50"
          >
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900">
              Dobrý den, <span className="font-bold">{clientData.company_name}</span>!
            </h2>
          </motion.div>
        )}

        {/* 4. Samotný Dashboard */}
        {state === "dashboard" && clientData && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-30"
          >
            <PortalDashboard client={clientData} projects={projects} invoices={invoices} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
