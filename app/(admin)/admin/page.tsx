import { logout } from './login/actions'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-md border border-border/10 p-8 rounded-[2rem]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm">Bienvenue dans l'espace d'administration de marcien-bn.dev.</p>
          </div>
          <form>
            <button 
              formAction={logout}
              className="px-6 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-full transition-all text-sm"
            >
              Déconnexion
            </button>
          </form>
        </div>
        
        <div className="p-8 border border-border/10 border-dashed rounded-[1.5rem] flex items-center justify-center text-muted-foreground">
          L'interface d'administration complète sera développée dans la Fiche 8.
        </div>
      </div>
    </div>
  )
}
