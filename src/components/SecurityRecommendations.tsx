
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSecurityRecommendations, getAttackVectors } from "@/utils/jwtUtils";
import { DecodedJwt, AttackVector } from "@/types";
import { Shield, AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";

interface SecurityRecommendationsProps {
  decodedJwt: DecodedJwt;
}

const SecurityRecommendations = ({ decodedJwt }: SecurityRecommendationsProps) => {
  const recommendations = getSecurityRecommendations();
  const attackVectors = getAttackVectors(decodedJwt);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Sécurité & Bonnes Pratiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recommendations">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            <TabsTrigger value="attacks">Vecteurs d'Attaque</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Voici les meilleures pratiques à suivre pour sécuriser vos tokens JWT:
              </p>
              
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                <div className="flex gap-2 items-center mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-700">Pour aller plus loin</h4>
                </div>
                <p className="text-sm text-blue-600">
                  Consultez la documentation officielle sur les JWT et la sécurité OWASP:
                </p>
                <ul className="list-disc ml-5 mt-2 text-sm text-blue-600">
                  <li><a href="https://jwt.io/introduction" target="_blank" rel="noopener noreferrer" className="underline">jwt.io - Introduction aux JSON Web Tokens</a></li>
                  <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="underline">OWASP JWT Cheat Sheet</a></li>
                  <li><a href="https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/" target="_blank" rel="noopener noreferrer" className="underline">Vulnérabilités critiques dans les bibliothèques JWT</a></li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attacks">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selon la configuration de votre token et du serveur, voici les vecteurs d'attaque potentiels:
              </p>
              
              <div className="space-y-4">
                {attackVectors.map((attack, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-md p-4 ${
                      attack.applicability 
                        ? "border-red-200 bg-red-50" 
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        attack.applicability ? "text-red-500" : "text-gray-400"
                      }`} />
                      <h4 className={`font-medium ${
                        attack.applicability ? "text-red-700" : "text-gray-700"
                      }`}>
                        {attack.name}
                      </h4>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {attack.description}
                    </p>
                    
                    <div className={`text-sm mt-2 p-2 rounded ${
                      attack.applicability 
                        ? "bg-red-100 text-red-800" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      <span className="font-medium">Applicabilité: </span>
                      {attack.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SecurityRecommendations;
