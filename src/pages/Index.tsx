
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import JwtAnalyzer from "@/components/JwtAnalyzer";
import { ShieldCheck, AlertTriangle, KeyRound, Flag } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-white/10 p-4 rounded-full">
              <KeyRound size={40} />
            </div>
            <h1 className="text-4xl font-bold">JWT Whisperer</h1>
            <p className="text-xl max-w-2xl">
              Analysez la sécurité de vos JSON Web Tokens, identifiez les vulnérabilités 
              et apprenez à les sécuriser correctement
            </p>
            <div className="mt-4">
              <Link to="/labs">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20">
                  <Flag className="mr-2 h-4 w-4" /> Accéder aux labs d'exploitation JWT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <JwtAnalyzer />
        
        <Separator className="my-16" />
        
        <section className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Comprendre la sécurité JWT</h2>
            <p className="text-muted-foreground">
              Les JSON Web Tokens (JWT) sont une méthode populaire pour l'authentification et 
              l'échange d'informations. Mais ils présentent des risques de sécurité s'ils sont 
              mal implémentés. Apprenez à les sécuriser.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Bonnes Pratiques</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Utilisez des algorithmes de signature forts (RS256, ES256)</li>
                <li>Limitez la durée de vie des tokens</li>
                <li>Incluez uniquement les données nécessaires</li>
                <li>Vérifiez toujours la signature côté serveur</li>
                <li>Utilisez des clés de signature robustes</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Vulnérabilités Communes</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Utilisation de l'algorithme "none"</li>
                <li>Absence d'expiration (exp)</li>
                <li>Clés de signature faibles</li>
                <li>Confusion d'algorithme</li>
                <li>Stockage de données sensibles</li>
                <li>Absence de validation d'émetteur/audience</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <KeyRound className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Vecteurs d'Attaque</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Attaque par algorithme "none"</li>
                <li>Confusion d'algorithme (RS256 à HS256)</li>
                <li>Injection de Key ID (kid)</li>
                <li>Attaque par force brute sur secrets faibles</li>
                <li>Rejeu de tokens volés</li>
                <li>Modification de claims sensibles</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            JWT Whisperer - Un outil d'analyse et d'éducation sur la sécurité des JSON Web Tokens
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Cet outil est fourni à des fins éducatives uniquement.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
