'use client'

import { useState } from 'react'
import { login } from './actions'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4 relative overflow-hidden dark-section">
      {/* Background technique */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.08)_0%,transparent_100%)] pointer-events-none" />
      
      <div className="w-full max-w-md bg-[#1A1A1A] border border-white/5 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative z-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-2 text-[#F5F5F7]">Accès restreint</h1>
          <p className="text-[#F5F5F7]/50 font-mono text-xs uppercase tracking-widest">Zone d'administration</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold text-[#F5F5F7]/70 uppercase tracking-wider">Email administrateur</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#F5F5F7] placeholder-[#F5F5F7]/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              placeholder="admin@domaine.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-bold text-[#F5F5F7]/70 uppercase tracking-wider">Mot de passe</label>
            <div className="relative">
              <input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm text-[#F5F5F7] placeholder-[#F5F5F7]/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F5F5F7]/50 hover:text-[#F5F5F7] transition-colors flex items-center justify-center"
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            formAction={login}
            className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}
