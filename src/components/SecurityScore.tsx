
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DecodedJwt } from "@/types";
import { getSecurityScore } from "@/utils/jwtUtils";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

interface SecurityScoreProps {
  decodedJwt: DecodedJwt;
}

const SecurityScore = ({ decodedJwt }: SecurityScoreProps) => {
  const score = getSecurityScore(decodedJwt);
  
  const getScoreLevel = () => {
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
  };
  
  const scoreLevel = getScoreLevel();
  
  const getScoreColor = () => {
    if (scoreLevel === "high") return "bg-green-500";
    if (scoreLevel === "medium") return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getScoreIcon = () => {
    if (scoreLevel === "high") return <ShieldCheck className="w-12 h-12 text-green-500" />;
    if (scoreLevel === "medium") return <ShieldAlert className="w-12 h-12 text-yellow-500" />;
    return <ShieldX className="w-12 h-12 text-red-500" />;
  };
  
  const getScoreLabel = () => {
    if (scoreLevel === "high") return "Haute sécurité";
    if (scoreLevel === "medium") return "Sécurité moyenne";
    return "Sécurité faible";
  };
  
  const getScoreDescription = () => {
    if (scoreLevel === "high") {
      return "Ce token utilise de bonnes pratiques de sécurité. Vérifiez les recommandations pour d'éventuelles améliorations.";
    }
    if (scoreLevel === "medium") {
      return "Ce token a un niveau de sécurité acceptable mais pourrait être amélioré. Consultez les problèmes détectés.";
    }
    return "Ce token présente des problèmes de sécurité importants qui devraient être corrigés immédiatement.";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Score de Sécurité</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center">
            {getScoreIcon()}
            <h3 className="text-2xl font-bold mt-2">{score}%</h3>
            <p className="text-lg font-medium">{getScoreLabel()}</p>
          </div>
          
          <Progress value={score} className={`w-full h-3 ${getScoreColor()}`} />
          
          <p className="text-sm text-muted-foreground text-center mt-2">
            {getScoreDescription()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityScore;
