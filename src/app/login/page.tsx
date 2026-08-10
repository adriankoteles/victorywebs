"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { loginAdminAction } from "./actions";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await loginAdminAction(password);
    
    if (res.success) {
      window.location.href = "/dashboard";
    } else {
      setError("Nesprávné heslo");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white selection:bg-white/20">
      <div className="w-full max-w-md bg-[#111111] p-10 rounded-[2rem] border border-white/10 shadow-2xl">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 mx-auto">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Interní systém</h1>
        <p className="text-gray-500 text-center mb-8">Victory Webs Agency OS</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Zadejte bezpečnostní heslo..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-white focus:outline-none transition-colors text-center text-lg tracking-widest placeholder:tracking-normal placeholder:text-gray-600"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center mb-6 font-medium">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "Ověřování..." : (
              <>Odemknout <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
