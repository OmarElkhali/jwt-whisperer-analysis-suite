
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DecodedJwt, SecurityIssue } from "@/types";
import { getSecurityIssues } from "@/utils/jwtUtils";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SecurityIssuesProps {
  decodedJwt: DecodedJwt;
}

const SecurityIssues = ({ decodedJwt }: SecurityIssuesProps) => {
  const issues = getSecurityIssues(decodedJwt);
  
  if (issues.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Analyse des Vulnérabilités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Aucun problème majeur détecté</h3>
            <p className="text-muted-foreground">
              Bon travail ! Aucune vulnérabilité n'a été détectée dans ce token JWT.
              Consultez quand même les recommandations pour assurer une sécurisation optimale.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityBadge = (severity: string) => {
    if (severity === "high") {
      return <Badge variant="destructive">Critique</Badge>;
    }
    if (severity === "medium") {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Moyenne</Badge>;
    }
    return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Faible</Badge>;
  };

  const highIssues = issues.filter(issue => issue.severity === "high");
  const mediumIssues = issues.filter(issue => issue.severity === "medium");
  const lowIssues = issues.filter(issue => issue.severity === "low");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Analyse des Vulnérabilités
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {highIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center gap-2 text-red-700 font-medium mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{highIssues.length} problème{highIssues.length > 1 ? 's' : ''} critique{highIssues.length > 1 ? 's' : ''}</span>
              </div>
              <p className="text-sm text-red-600">
                Ces problèmes représentent des vulnérabilités graves qui doivent être corrigées immédiatement.
              </p>
            </div>
          )}

          <Accordion type="multiple" className="w-full">
            {issues.map((issue, index) => (
              <AccordionItem key={index} value={`issue-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-left">
                    {getSeverityBadge(issue.severity)}
                    <span>{issue.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <div>
                      <h4 className="text-sm font-medium">Description</h4>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Impact</h4>
                      <p className="text-sm text-muted-foreground">{issue.impact}</p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex gap-2">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-700">Recommandation</h4>
                        <p className="text-sm text-blue-600">{issue.remediation}</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityIssues;
