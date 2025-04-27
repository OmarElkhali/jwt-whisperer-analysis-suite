
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flag, KeyRound, ShieldCheck, AlertTriangle, Book, Lock, Trophy } from "lucide-react";
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

  const renderChallengeInterface = () => {
    if (!activeChallenge) return null;

    return (
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
                  Challenge réussi !
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-white/80">{activeChallenge.description}</p>
              
              <Alert className="bg-blue-500/20 border-blue-500/50">
                <Flag className="h-4 w-4" />
                <AlertTitle>Objectif</AlertTitle>
                <AlertDescription className="text-white/80">
                  {activeChallenge.objective}
                </AlertDescription>
              </Alert>

              <div className="rounded-lg bg-black/30 p-4">
                <h3 className="text-sm font-medium mb-2">Interface de test</h3>
                <div className="space-y-4">
                  {activeChallenge.id === "none-algorithm" && (
                    <div className="flex space-x-4">
                      <Button 
                        variant="outline" 
                        className="bg-white/10"
                        onClick={() => {/* Simulate interaction */}}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Se connecter
                      </Button>
                    </div>
                  )}

                  {activeChallenge.id === "key-confusion" && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Badge>Plan actuel: Basic</Badge>
                        <Badge variant="outline">API Key disponible</Badge>
                      </div>
                      <Button variant="outline" className="bg-white/10">
                        Voir documentation API
                      </Button>
                    </div>
                  )}

                  {activeChallenge.id === "kid-injection" && (
                    <div className="space-y-4">
                      <div className="p-3 bg-black/40 rounded border border-white/10">
                        <code className="text-sm text-white/70">
                          GET /admin/system?kid=keys/default.key
                        </code>
                      </div>
                      <Button variant="outline" className="bg-white/10">
                        Tester l'endpoint
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Token JWT
                </label>
                <div className="flex space-x-2">
                  <Input 
                    value={inputToken} 
                    onChange={handleTokenChange} 
                    className="font-mono bg-white/10 border-white/20 text-white"
                  />
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                    <Lock className="mr-2 h-4 w-4" />
                    Tester
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {submittedToken && (
          <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Résultat de l'analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payload">
                <TabsList className="bg-white/10">
                  <TabsTrigger value="payload" className="data-[state=active]:bg-blue-600">
                    Payload
                  </TabsTrigger>
                  <TabsTrigger value="header" className="data-[state=active]:bg-blue-600">
                    Header
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="payload" className="mt-2">
                  <pre className="bg-black/30 p-4 rounded-md overflow-auto">
                    {JSON.stringify(decodedToken?.payload, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="header" className="mt-2">
                  <pre className="bg-black/30 p-4 rounded-md overflow-auto">
                    {JSON.stringify(decodedToken?.header, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Accordion type="single" collapsible className="backdrop-blur-sm bg-white/5 rounded-md border border-white/10">
          <AccordionItem value="hint">
            <AccordionTrigger className="px-4 text-white">
              <div className="flex items-center">
                <Book className="mr-2 h-4 w-4 text-yellow-400" />
                Afficher un indice
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 bg-black/20">
              {activeChallenge.hint}
            </AccordionContent>
          </AccordionItem>
          
          {isSuccess && (
            <AccordionItem value="solution">
              <AccordionTrigger className="px-4 text-white">
                <div className="flex items-center">
                  <ShieldCheck className="mr-2 h-4 w-4 text-green-400" />
                  Solution & Sécurisation
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 bg-black/20">
                {activeChallenge.solution}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="bg-gradient-to-r from-blue-600 to-violet-600 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <KeyRound size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold">JWT Hacking Labs</h1>
            <p className="text-xl max-w-2xl text-white/80">
              Pratiquez vos compétences en sécurité JWT avec des challenges interactifs
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
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
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
                  Challenges disponibles
                </CardTitle>
                <CardDescription className="text-white/70">
                  Sélectionnez un challenge pour commencer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jwtChallenges.map((challenge) => (
                  <div 
                    key={challenge.id}
                    onClick={() => handleSelectChallenge(challenge)}
                    className={`p-4 rounded-md cursor-pointer transition-all ${
                      activeChallenge?.id === challenge.id 
                        ? "bg-white/10 border-l-4 border-primary" 
                        : "bg-white/5 hover:bg-white/10 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {completedChallenges.includes(challenge.id) && (
                          <ShieldCheck className="inline-block mr-2 h-4 w-4 text-green-400" />
                        )}
                        {challenge.title}
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
              renderChallengeInterface()
            ) : (
              <Card className="h-full flex items-center justify-center p-8 text-center backdrop-blur-sm bg-white/5 border-white/10">
                <div>
                  <AlertTriangle className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
                  <CardTitle className="mb-2">Sélectionnez un challenge</CardTitle>
                  <CardDescription className="text-white/70">
                    Choisissez un challenge dans la liste pour commencer à pratiquer
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
