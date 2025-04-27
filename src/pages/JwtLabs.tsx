
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flag, KeyRound, ShieldCheck, AlertTriangle, Book, Lock, Trophy, Check } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

const JwtLabs = () => {
  const [activeChallenge, setActiveChallenge] = useState<JwtChallenge | null>(null);
  const [inputToken, setInputToken] = useState("");
  const [submittedToken, setSubmittedToken] = useState("");
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
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
        if (!completedChallenges.includes(activeChallenge.id)) {
          setCompletedChallenges([...completedChallenges, activeChallenge.id]);
        }
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

  const getProgressPercentage = () => {
    return (completedChallenges.length / jwtChallenges.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="bg-gradient-to-r from-blue-600 to-violet-600 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <KeyRound size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold">JWT Hacking Labs</h1>
            <p className="text-xl max-w-2xl text-white/80">
              Apprenez à exploiter et sécuriser les JSON Web Tokens avec ces challenges pratiques
            </p>
            
            <div className="w-full max-w-lg mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progression</span>
                <span>{completedChallenges.length}/{jwtChallenges.length} challenges complétés</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
            
            <Link to="/">
              <Button variant="outline" className="mt-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'analyseur
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Challenges
                </CardTitle>
                <CardDescription className="text-white/70">
                  Sélectionnez un challenge pour commencer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jwtChallenges.map((challenge) => (
                  <div 
                    key={challenge.id} 
                    className={`p-4 rounded-md cursor-pointer transition-all ${
                      activeChallenge?.id === challenge.id 
                        ? "bg-white/10 border-l-4 border-primary" 
                        : "bg-white/5 hover:bg-white/10 border-l-4 border-transparent"
                    }`}
                    onClick={() => handleSelectChallenge(challenge)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium flex items-center">
                        {completedChallenges.includes(challenge.id) && (
                          <Check className="mr-2 h-4 w-4 text-green-400" />
                        )}
                        <span>{challenge.title}</span>
                      </h3>
                      <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
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
                <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{activeChallenge.title}</CardTitle>
                        <CardDescription className="text-white/70">
                          Difficulté: {activeChallenge.difficulty.charAt(0).toUpperCase() + activeChallenge.difficulty.slice(1)}
                        </CardDescription>
                      </div>
                      {isSuccess && (
                        <Badge className="bg-green-500 text-white">
                          <Check className="mr-1 h-4 w-4" /> Challenge réussi
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80">{activeChallenge.description}</p>
                    <Alert className="bg-blue-500/20 border-blue-500/50 text-white">
                      <Flag className="h-4 w-4 text-blue-300" />
                      <AlertTitle className="text-white">Objectif</AlertTitle>
                      <AlertDescription className="text-white/80">{activeChallenge.objective}</AlertDescription>
                    </Alert>

                    <div className="mt-4">
                      <label htmlFor="token" className="block text-sm font-medium text-white/80 mb-2">Token JWT</label>
                      <div className="flex space-x-2">
                        <Input 
                          id="token" 
                          value={inputToken} 
                          onChange={handleTokenChange} 
                          className="font-mono bg-white/10 border-white/20 text-white"
                        />
                        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                          <Lock className="mr-2 h-4 w-4" />
                          Soumettre
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {submittedToken && (
                  <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        Résultat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {decodedToken && (
                        <div className="space-y-4">
                          <Tabs defaultValue="payload" className="w-full">
                            <TabsList className="bg-white/10">
                              <TabsTrigger value="payload" className="data-[state=active]:bg-blue-600">Payload</TabsTrigger>
                              <TabsTrigger value="header" className="data-[state=active]:bg-blue-600">Header</TabsTrigger>
                            </TabsList>
                            <TabsContent value="payload" className="p-4 bg-black/30 rounded-md mt-2">
                              <pre className="whitespace-pre-wrap font-mono text-sm text-white/90">
                                {JSON.stringify(decodedToken.payload, null, 2)}
                              </pre>
                            </TabsContent>
                            <TabsContent value="header" className="p-4 bg-black/30 rounded-md mt-2">
                              <pre className="whitespace-pre-wrap font-mono text-sm text-white/90">
                                {JSON.stringify(decodedToken.header, null, 2)}
                              </pre>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Accordion type="single" collapsible className="backdrop-blur-sm bg-white/5 rounded-md border border-white/10">
                  <AccordionItem value="hint" className="border-white/10">
                    <AccordionTrigger className="px-4 py-2 text-white hover:no-underline">
                      <div className="flex items-center">
                        <Book className="mr-2 h-4 w-4 text-yellow-400" />
                        Afficher un indice
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2 bg-black/20 text-white/80">
                      {activeChallenge.hint}
                    </AccordionContent>
                  </AccordionItem>
                  
                  {isSuccess && (
                    <AccordionItem value="solution" className="border-white/10">
                      <AccordionTrigger className="px-4 py-2 text-white hover:no-underline">
                        <div className="flex items-center">
                          <ShieldCheck className="mr-2 h-4 w-4 text-green-400" />
                          Explication de la solution
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-2 bg-black/20 text-white/80">
                        {activeChallenge.solution}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center p-8 text-center backdrop-blur-sm bg-white/5 border-white/10">
                <div>
                  <AlertTriangle className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
                  <CardTitle className="mb-2 text-white">Aucun challenge sélectionné</CardTitle>
                  <CardDescription className="text-white/70">
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
