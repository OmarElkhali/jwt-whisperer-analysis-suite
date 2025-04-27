
import { useState } from "react";
import TokenInput from "./TokenInput";
import TokenDisplay from "./TokenDisplay";
import SecurityScore from "./SecurityScore";
import SecurityIssues from "./SecurityIssues";
import SecurityRecommendations from "./SecurityRecommendations";
import { DecodedJwt } from "@/types";
import { decodeJwt } from "@/utils/jwtUtils";
import { useToast } from "@/hooks/use-toast";

const JwtAnalyzer = () => {
  const [decodedJwt, setDecodedJwt] = useState<DecodedJwt | null>(null);
  const { toast } = useToast();

  const handleTokenSubmit = (token: string) => {
    try {
      const decoded = decodeJwt(token);
      if (!decoded) {
        toast({
          title: "Erreur de décodage",
          description: "Impossible de décoder le token JWT. Vérifiez le format.",
          variant: "destructive",
        });
        return;
      }
      
      setDecodedJwt(decoded);
      toast({
        title: "Token décodé avec succès",
        description: "Analyse de sécurité complétée.",
      });
    } catch (error) {
      console.error("Error decoding token:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'analyse du token.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto">
      <TokenInput onTokenSubmit={handleTokenSubmit} />
      
      {decodedJwt && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <TokenDisplay decodedJwt={decodedJwt} />
            </div>
            <div>
              <SecurityScore decodedJwt={decodedJwt} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityIssues decodedJwt={decodedJwt} />
            <SecurityRecommendations decodedJwt={decodedJwt} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JwtAnalyzer;
