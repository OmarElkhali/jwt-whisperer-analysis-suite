
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const TokenInput = ({ onTokenSubmit }: TokenInputProps) => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Basic validation
    if (!token.trim()) {
      setError("Veuillez entrer un token JWT");
      return;
    }

    // Check if it looks like a JWT token (3 parts separated by dots)
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError("Format de token JWT invalide. Le format attendu est: xxxxx.yyyyy.zzzzz");
      return;
    }

    setError("");
    onTokenSubmit(token.trim());
  };

  // Sample tokens for demonstration
  const sampleTokens = {
    weak: "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.",
    medium: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    strong: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMyJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTk5OTk5OTk5OSwiYXVkIjoiZXhhbXBsZS5jb20iLCJpc3MiOiJhdXRoLmV4YW1wbGUuY29tIn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ"
  };

  const handleUseSampleToken = (tokenType: keyof typeof sampleTokens) => {
    setToken(sampleTokens[tokenType]);
    setError("");
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Analyser un JWT Token</h2>
        <p className="text-muted-foreground mb-4">
          Collez votre token JWT pour l'analyser ou utilisez un exemple
        </p>
      </div>

      <Textarea
        placeholder="Entrez votre JWT token ici (format: xxxxx.yyyyy.zzzzz)"
        className={cn("font-mono text-sm h-24", error && "border-red-500")}
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      {error && (
        <div className="flex items-center text-red-500 text-sm gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          Analyser
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleUseSampleToken("weak")}
          className="text-red-500 border-red-200 hover:bg-red-50"
        >
          Exemple: Faible Sécurité
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleUseSampleToken("medium")}
          className="text-yellow-500 border-yellow-200 hover:bg-yellow-50"
        >
          Exemple: Sécurité Moyenne
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleUseSampleToken("strong")}
          className="text-green-500 border-green-200 hover:bg-green-50"
        >
          Exemple: Haute Sécurité
        </Button>
      </div>
    </div>
  );
};

export default TokenInput;
