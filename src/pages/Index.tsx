import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import JwtAnalyzer from "@/components/JwtAnalyzer";
import { ShieldCheck, AlertTriangle, KeyRound, Flag, Lock, Database, Check } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-white/10 p-5 rounded-full backdrop-blur-sm">
              <KeyRound size={50} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold">JWT Whisperer</h1>
            <p className="text-xl max-w-2xl">
              Analysez la sécurité de vos JSON Web Tokens, identifiez les vulnérabilités 
              et apprenez à les sécuriser correctement
            </p>
            <div className="flex gap-4 mt-6">
              <Link to="/labs">
                <Button variant="default" size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                  <Flag className="mr-2 h-5 w-5" /> Accéder aux labs
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 border-white/30">
                <Lock className="mr-2 h-5 w-5" /> Guide de sécurité
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <JwtAnalyzer />
        
        <Separator className="my-20" />
        
        <section className="space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Comprendre la sécurité JWT</h2>
            <p className="text-muted-foreground">
              Les JSON Web Tokens (JWT) sont une méthode populaire pour l'authentification et 
              l'échange d'informations. Mais ils présentent des risques de sécurité s'ils sont 
              mal implémentés. Apprenez à les sécuriser.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-green-100 p-3 rounded-full">
                  <ShieldCheck className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Bonnes Pratiques</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  Utilisez des algorithmes de signature forts (RS256, ES256)
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  Limitez la durée de vie des tokens
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  Incluez uniquement les données nécessaires
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  Vérifiez toujours la signature côté serveur
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  Utilisez des clés de signature robustes
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Vulnérabilités Communes</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full p-1 mt-0.5">
                    <AlertTriangle className="h-3 w-3" />
                  </span>
                  Utilisation de l'algorithme "none"
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full p-1 mt-0.5">
                    <AlertTriangle className="h-3 w-3" />
                  </span>
                  Absence d'expiration (exp)
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full p-1 mt-0.5">
                    <AlertTriangle className="h-3 w-3" />
                  </span>
                  Clés de signature faibles
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full p-1 mt-0.5">
                    <AlertTriangle className="h-3 w-3" />
                  </span>
                  Confusion d'algorithme
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full p-1 mt-0.5">
                    <AlertTriangle className="h-3 w-3" />
                  </span>
                  Stockage de données sensibles
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Database className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Labs & Exploits</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                    <KeyRound className="h-3 w-3" />
                  </span>
                  Attaque par algorithme "none"
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                    <KeyRound className="h-3 w-3" />
                  </span>
                  Confusion d'algorithme (RS256 à HS256)
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                    <KeyRound className="h-3 w-3" />
                  </span>
                  Injection de Key ID (kid)
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                    <KeyRound className="h-3 w-3" />
                  </span>
                  Attaque par injections de JWK
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                    <KeyRound className="h-3 w-3" />
                  </span>
                  Brute force sur secrets faibles
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/labs">
                  <Button className="w-full">Accéder aux labs pratiques</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-900 text-white py-10">
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
