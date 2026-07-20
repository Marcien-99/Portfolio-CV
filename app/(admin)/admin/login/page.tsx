import { redirect } from 'next/navigation'
import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background technique */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_100%)] pointer-events-none" />
      
      <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-border/10 p-8 rounded-[2rem] shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-2">Accès restreint</h1>
          <p className="text-muted-foreground font-mono text-sm">Zone d'administration marcien-bn.dev</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground/80">Email administrateur</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="admin@domaine.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground/80">Mot de passe</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            formAction={login}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}
