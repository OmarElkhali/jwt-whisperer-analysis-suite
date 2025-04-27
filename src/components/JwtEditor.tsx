import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DecodedJwt } from "@/types";
import { toast } from "@/hooks/use-toast";
import { FileJson, RefreshCw, Copy, CheckCircle2 } from "lucide-react";

interface JwtEditorProps {
  decodedJwt: DecodedJwt;
  onUpdateToken: (newToken: string) => void;
}

const JwtEditor = ({ decodedJwt, onUpdateToken }: JwtEditorProps) => {
  const [headerJson, setHeaderJson] = useState("");
  const [payloadJson, setPayloadJson] = useState("");
  const [isHeaderValid, setIsHeaderValid] = useState(true);
  const [isPayloadValid, setIsPayloadValid] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize editor with current token data
  useEffect(() => {
    try {
      setHeaderJson(JSON.stringify(decodedJwt.header, null, 2));
      setPayloadJson(JSON.stringify(decodedJwt.payload, null, 2));
    } catch (error) {
      console.error("Error initializing JWT editor:", error);
    }
  }, [decodedJwt]);

  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const handleHeaderChange = (value: string) => {
    setHeaderJson(value);
    setIsHeaderValid(validateJson(value));
  };

  const handlePayloadChange = (value: string) => {
    setPayloadJson(value);
    setIsPayloadValid(validateJson(value));
  };

  const generateToken = () => {
    try {
      if (!isHeaderValid || !isPayloadValid) {
        toast({
          title: "JSON invalide",
          description: "Veuillez corriger les erreurs JSON avant de générer le token.",
          variant: "destructive",
        });
        return;
      }

      const header = JSON.parse(headerJson);
      const payload = JSON.parse(payloadJson);

      // Base64 encode the header and payload
      const base64Header = btoa(JSON.stringify(header))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      const base64Payload = btoa(JSON.stringify(payload))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      // We'll keep the existing signature for simplicity
      // In a real-world scenario, generating a valid signature would require the secret key
      const newToken = `${base64Header}.${base64Payload}.${decodedJwt.raw.signature}`;
      
      onUpdateToken(newToken);
      toast({
        title: "Token modifié",
        description: "Le token JWT a été mis à jour avec vos modifications.",
      });
    } catch (error) {
      console.error("Error generating token:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du token.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    if (!decodedJwt) return;
    
    const token = `${decodedJwt.raw.header}.${decodedJwt.raw.payload}.${decodedJwt.raw.signature}`;
    navigator.clipboard.writeText(token)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "Copié !",
          description: "Token copié dans le presse-papier",
        });
      })
      .catch(err => {
        console.error("Erreur lors de la copie:", err);
        toast({
          title: "Erreur",
          description: "Impossible de copier le token",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-4 bg-card border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <FileJson className="mr-2 h-5 w-5 text-primary" />
          Éditeur JWT
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="flex items-center"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                Copié
              </>
            ) : (
              <>
                <Copy className="mr-1 h-4 w-4" />
                Copier
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="header" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="payload">Payload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="header" className="space-y-4">
          <Textarea
            value={headerJson}
            onChange={(e) => handleHeaderChange(e.target.value)}
            className={`font-mono h-64 ${!isHeaderValid ? 'border-red-500' : ''}`}
            placeholder="Header JSON..."
          />
          {!isHeaderValid && (
            <p className="text-red-500 text-sm">JSON invalide dans le header</p>
          )}
        </TabsContent>
        
        <TabsContent value="payload" className="space-y-4">
          <Textarea
            value={payloadJson}
            onChange={(e) => handlePayloadChange(e.target.value)}
            className={`font-mono h-64 ${!isPayloadValid ? 'border-red-500' : ''}`}
            placeholder="Payload JSON..."
          />
          {!isPayloadValid && (
            <p className="text-red-500 text-sm">JSON invalide dans le payload</p>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          onClick={generateToken} 
          disabled={!isHeaderValid || !isPayloadValid}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Mettre à jour le token
        </Button>
      </div>
    </div>
  );
};

export default JwtEditor;
