import { DecodedJwt } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTimestamp } from "@/utils/jwtUtils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Key, Calendar, User, Shield, Target, Code } from "lucide-react";

interface TokenDisplayProps {
  decodedJwt: DecodedJwt;
}

const TokenDisplay = ({ decodedJwt }: TokenDisplayProps) => {
  const { header, payload, raw } = decodedJwt;

  // Function to highlight security-related fields
  const highlightField = (key: string, value: any) => {
    if (key === "alg") {
      const algColors = {
        "none": "text-red-500 font-bold",
        "HS256": "text-yellow-500 font-bold",
        "RS256": "text-green-500 font-bold",
        "ES256": "text-green-500 font-bold"
      };
      return algColors[value as keyof typeof algColors] || "";
    }
    
    if (["exp", "nbf", "iat"].includes(key)) {
      return "text-blue-600";
    }
    
    if (["iss", "aud", "sub"].includes(key)) {
      return "text-purple-600";
    }
    
    return "";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Structure du Token</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="decoded" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="decoded">Structure Décodée</TabsTrigger>
            <TabsTrigger value="raw">Format Brut</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="decoded" className="space-y-6">
            {/* Header Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-blue-500" />
                <h3 className="text-lg font-semibold">Header</h3>
              </div>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                {Object.entries(header).map(([key, value]) => (
                  <div key={key} className="py-1">
                    <span className="text-muted-foreground mr-2">{key}:</span>
                    <span className={highlightField(key, value)}>
                      {key === "alg" && (
                        <Badge 
                          variant={
                            value === "none" ? "destructive" :
                            value === "HS256" ? "outline" : "default"
                          }
                          className="mr-2"
                        >
                          {value}
                        </Badge>
                      )}
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Payload Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key size={20} className="text-green-500" />
                <h3 className="text-lg font-semibold">Payload (Claims)</h3>
              </div>
              
              {/* Registered Claims */}
              {(payload.iss || payload.sub || payload.aud || payload.exp || payload.nbf || payload.iat || payload.jti) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Claims enregistrés</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {payload.iss && (
                      <div className="flex items-start gap-2 bg-muted p-2 rounded">
                        <User size={16} className="text-purple-500 mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Émetteur (iss)</div>
                          <div className="font-mono text-sm break-all">{payload.iss}</div>
                        </div>
                      </div>
                    )}
                    
                    {payload.sub && (
                      <div className="flex items-start gap-2 bg-muted p-2 rounded">
                        <User size={16} className="text-purple-500 mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Sujet (sub)</div>
                          <div className="font-mono text-sm break-all">{payload.sub}</div>
                        </div>
                      </div>
                    )}
                    
                    {payload.aud && (
                      <div className="flex items-start gap-2 bg-muted p-2 rounded">
                        <Target size={16} className="text-purple-500 mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Audience (aud)</div>
                          <div className="font-mono text-sm break-all">
                            {Array.isArray(payload.aud) 
                              ? payload.aud.join(", ")
                              : payload.aud}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {payload.exp && (
                      <div className="flex items-start gap-2 bg-muted p-2 rounded">
                        <Calendar size={16} className="text-blue-500 mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Expiration (exp)</div>
                          <div className="font-mono text-sm">{formatTimestamp(payload.exp)}</div>
                        </div>
                      </div>
                    )}
                    
                    {payload.nbf && (
                      <div className="flex items-start gap-2 bg-muted p-2 rounded">
                        <Calendar size={16} className="text-blue-500 mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Pas avant (nbf)</div>
                          <div className="font-mono text-sm">{formatTimestamp(payload.nbf)}</div>
                        </div>
                      </div>
                    )}
                    
                    {payload.iat && (
                      <div className="flex items-start gap-2 bg-muted p-2 rounded">
                        <Calendar size={16} className="text-blue-500 mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Émis à (iat)</div>
                          <div className="font-mono text-sm">{formatTimestamp(payload.iat)}</div>
                        </div>
                      </div>
                    )}
                    
                    {payload.jti && (
                      <div className="flex items-start gap-2 bg-muted p-2 rounded">
                        <Key size={16} className="text-purple-500 mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">ID du token (jti)</div>
                          <div className="font-mono text-sm break-all">{payload.jti}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Custom Claims */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Claims personnalisés</h4>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  {Object.entries(payload)
                    .filter(([key]) => !["iss", "sub", "aud", "exp", "nbf", "iat", "jti"].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="py-1">
                        <span className="text-muted-foreground mr-2">{key}:</span>
                        <span>
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Signature Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key size={20} className="text-red-500" />
                <h3 className="text-lg font-semibold">Signature</h3>
              </div>
              <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                {decodedJwt.signature || "(aucune signature)"}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="raw">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Header (Base64url)</h3>
                <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                  {raw.header}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Payload (Base64url)</h3>
                <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                  {raw.payload}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Signature (Base64url)</h3>
                <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                  {raw.signature || "(aucune signature)"}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="json">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code size={20} className="text-blue-500" />
                  <h3 className="text-lg font-semibold">Header</h3>
                </div>
                <pre className="bg-muted p-4 rounded-md font-mono text-sm overflow-auto whitespace-pre">
                  {JSON.stringify(header, null, 2)}
                </pre>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code size={20} className="text-green-500" />
                  <h3 className="text-lg font-semibold">Payload</h3>
                </div>
                <pre className="bg-muted p-4 rounded-md font-mono text-sm overflow-auto whitespace-pre">
                  {JSON.stringify(payload, null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TokenDisplay;
