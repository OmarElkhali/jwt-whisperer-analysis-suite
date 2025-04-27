
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flag, KeyRound, ShieldCheck, AlertTriangle, Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { JwtChallenge } from "@/types";
import { decodeJwt } from "@/utils/jwtUtils";
import { jwtChallenges } from "@/utils/jwtChallenges";

const JwtLabs = () => {
  const [activeChallenge, setActiveChallenge] = useState<JwtChallenge | null>(null);
  const [inputToken, setInputToken] = useState("");
  const [submittedToken, setSubmittedToken] = useState("");
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSelectChallenge = (challenge: JwtChallenge) => {
    setActiveChallenge(challenge);
    setInputToken(challenge.initialToken);
    setSubmittedToken("");
    setDecodedToken(null);
    setIsSuccess(false);
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(event.target.value);
  };

  const handleSubmit = () => {
    if (!activeChallenge) return;

    try {
      const decoded = decodeJwt(inputToken);
      setDecodedToken(decoded);
      setSubmittedToken(inputToken);

      if (activeChallenge.checkFlag(inputToken)) {
        setIsSuccess(true);
        toast({
          title: "Challenge réussi ! 🎉",
          description: "Bravo, vous avez trouvé le flag !",
        });
      } else {
        toast({
          title: "Essai incorrect",
          description: "Ce n'est pas le bon token. Continuez à essayer !",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Token JWT invalide. Vérifiez le format.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-white/10 p-4 rounded-full">
              <KeyRound size={40} />
            </div>
            <h1 className="text-4xl font-bold">JWT Hacking Labs</h1>
            <p className="text-xl max-w-2xl">
              Apprenez à exploiter et sécuriser les JSON Web Tokens avec ces challenges pratiques
            </p>
            <Link to="/">
              <Button variant="outline" className="mt-4 bg-white/10 hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'analyseur
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Challenges</CardTitle>
                <CardDescription>
                  Sélectionnez un challenge pour commencer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jwtChallenges.map((challenge) => (
                  <div 
                    key={challenge.id} 
                    className={`p-4 rounded-md cursor-pointer transition-colors ${
                      activeChallenge?.id === challenge.id 
                        ? "bg-primary/10 border-l-4 border-primary" 
                        : "bg-card hover:bg-muted"
                    }`}
                    onClick={() => handleSelectChallenge(challenge)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{challenge.title}</h3>
                      <Badge variant={
                        challenge.difficulty === "easy" ? "outline" : 
                        challenge.difficulty === "medium" ? "secondary" : 
                        "destructive"
                      }>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {activeChallenge ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{activeChallenge.title}</CardTitle>
                    <CardDescription>
                      Difficulté: {activeChallenge.difficulty.charAt(0).toUpperCase() + activeChallenge.difficulty.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{activeChallenge.description}</p>
                    <Alert>
                      <Flag className="h-4 w-4" />
                      <AlertTitle>Objectif</AlertTitle>
                      <AlertDescription>{activeChallenge.objective}</AlertDescription>
                    </Alert>

                    <div className="mt-4">
                      <label htmlFor="token" className="block text-sm font-medium text-muted-foreground mb-2">Token JWT</label>
                      <div className="flex space-x-2">
                        <Input 
                          id="token" 
                          value={inputToken} 
                          onChange={handleTokenChange} 
                          className="font-mono"
                        />
                        <Button onClick={handleSubmit}>Soumettre</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {submittedToken && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Résultat
                        {isSuccess && <Badge className="ml-2 bg-green-500">Challenge réussi</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {decodedToken && (
                        <div className="space-y-4">
                          <Tabs defaultValue="payload">
                            <TabsList>
                              <TabsTrigger value="payload">Payload</TabsTrigger>
                              <TabsTrigger value="header">Header</TabsTrigger>
                            </TabsList>
                            <TabsContent value="payload" className="p-4 bg-muted rounded-md mt-2">
                              <pre className="whitespace-pre-wrap font-mono text-sm">
                                {JSON.stringify(decodedToken.payload, null, 2)}
                              </pre>
                            </TabsContent>
                            <TabsContent value="header" className="p-4 bg-muted rounded-md mt-2">
                              <pre className="whitespace-pre-wrap font-mono text-sm">
                                {JSON.stringify(decodedToken.header, null, 2)}
                              </pre>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Accordion type="single" collapsible className="bg-card rounded-md">
                  <AccordionItem value="hint">
                    <AccordionTrigger className="px-4 py-2">
                      <div className="flex items-center">
                        <Book className="mr-2 h-4 w-4" />
                        Afficher un indice
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2 bg-muted/50">
                      {activeChallenge.hint}
                    </AccordionContent>
                  </AccordionItem>
                  
                  {isSuccess && (
                    <AccordionItem value="solution">
                      <AccordionTrigger className="px-4 py-2">
                        <div className="flex items-center">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Explication de la solution
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-2 bg-muted/50">
                        {activeChallenge.solution}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center p-8 text-center">
                <div>
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <CardTitle className="mb-2">Aucun challenge sélectionné</CardTitle>
                  <CardDescription>
                    Veuillez sélectionner un challenge dans la liste à gauche pour commencer
                  </CardDescription>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JwtLabs;
