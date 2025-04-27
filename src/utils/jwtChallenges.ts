
import { JwtChallenge } from "@/types";

// Fonction utilitaire pour créer un token JWT
const createToken = (header: object, payload: object, signature: string = "") => {
  const encodeSegment = (segment: object) => 
    btoa(JSON.stringify(segment)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  return `${encodeSegment(header)}.${encodeSegment(payload)}.${signature}`;
};

export const jwtChallenges: JwtChallenge[] = [
  {
    id: "none-algorithm",
    title: "Challenge #1: Algorithme \"none\"",
    difficulty: "easy",
    description: "Ce serveur utilise un JWT pour vérifier votre identité. Vous êtes connecté en tant qu'utilisateur régulier, mais vous souhaitez accéder aux fonctionnalités réservées aux administrateurs.",
    objective: "Modifiez le token pour obtenir un rôle d'administrateur (role: admin).",
    hint: "L'algorithme 'none' permet de créer un token sans signature. Que se passe-t-il si vous changez l'algorithme à 'none' et supprimez la signature?",
    solution: "Cette vulnérabilité est basée sur l'implémentation incorrecte de la validation de l'algorithme JWT. Certains serveurs acceptent l'algorithme 'none' qui indique qu'aucune signature n'est nécessaire. Pour exploiter cela:\n\n1. Décodez le token initial\n2. Modifiez le header pour utiliser l'algorithme 'none'\n3. Modifiez le payload pour avoir 'role': 'admin'\n4. Supprimez la signature (troisième partie du token)\n\nLes serveurs sécurisés devraient toujours rejeter les tokens utilisant l'algorithme 'none' et vérifier que l'algorithme correspond à celui attendu.",
    initialToken: createToken(
      { alg: "HS256", typ: "JWT" }, 
      { sub: "1234567890", name: "John Doe", role: "user", iat: 1516239022 },
      "signature_factice"
    ),
    targetClaim: "role",
    flagFormat: "admin",
    checkFlag: (token: string) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
        const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        
        const header = JSON.parse(headerStr);
        const payload = JSON.parse(payloadStr);
        
        return header.alg === "none" && payload.role === "admin" && parts[2] === "";
      } catch {
        return false;
      }
    }
  },
  {
    id: "key-confusion",
    title: "Challenge #2: Confusion d'algorithme",
    difficulty: "medium",
    description: "Une API utilise des JWT signés avec RSA (asymétrique) pour authentifier les utilisateurs. Le serveur expose sa clé publique que vous pouvez utiliser comme vecteur d'attaque.",
    objective: "Exploitez la confusion d'algorithme pour forger un token avec le claim 'premium: true'.",
    hint: "Le serveur utilise la clé publique pour vérifier les tokens signés avec RS256. Que se passe-t-il si vous changez l'algorithme à HS256 et utilisez la clé publique comme clé secrète?",
    solution: "Cette attaque exploite une confusion entre les algorithmes asymétriques (RS256) et symétriques (HS256):\n\n1. Le serveur utilise normalement RS256, qui nécessite une clé privée pour signer et une clé publique pour vérifier\n2. Si le serveur ne vérifie pas correctement l'algorithme, on peut changer l'algorithme en HS256\n3. Avec HS256, le serveur utilisera la même clé pour la vérification que pour la signature\n4. Si le serveur utilise directement la clé publique pour vérifier, on peut forger un token en signant avec HS256 et la clé publique\n\nPour corriger cette vulnérabilité, les serveurs doivent toujours vérifier que l'algorithme spécifié correspond à celui attendu avant de valider la signature.",
    initialToken: createToken(
      { alg: "RS256", typ: "JWT" }, 
      { sub: "9876543210", name: "Alice Smith", premium: false, iat: 1616239022 },
      "signature_rs256_factice"
    ),
    targetClaim: "premium",
    flagFormat: "true",
    checkFlag: (token: string) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
        const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        
        const header = JSON.parse(headerStr);
        const payload = JSON.parse(payloadStr);
        
        // Dans un environnement réel, nous vérifierions la signature avec la clé publique
        // Ici, nous simulons une implémentation vulnérable qui ne vérifie pas correctement l'algorithme
        return header.alg === "HS256" && payload.premium === true;
      } catch {
        return false;
      }
    }
  },
  {
    id: "kid-injection",
    title: "Challenge #3: Kid Injection",
    difficulty: "hard",
    description: "Ce serveur utilise un paramètre 'kid' (Key ID) dans l'en-tête JWT pour déterminer quelle clé utiliser lors de la vérification. Le serveur lit le fichier spécifié par le 'kid' pour obtenir la clé.",
    objective: "Exploitez l'injection de 'kid' pour forger un token valide avec le claim 'system_access: true'.",
    hint: "Le paramètre 'kid' est utilisé pour construire un chemin de fichier. Que se passe-t-il si vous utilisez un chemin vers un fichier connu qui contient des valeurs prévisibles?",
    solution: "Cette vulnérabilité est une injection de chemin de fichier via le paramètre 'kid' du JWT:\n\n1. Le serveur utilise le paramètre 'kid' pour déterminer quelle clé utiliser\n2. Si ce paramètre est utilisé directement pour construire un chemin de fichier, on peut l'exploiter\n3. En utilisant un chemin vers '/dev/null' ou un fichier connu pour avoir une valeur constante, le serveur lira ce fichier comme clé\n4. Comme nous connaissons cette valeur (généralement des zéros pour /dev/null), nous pouvons signer notre token avec cette 'clé' connue\n\nPour corriger cette vulnérabilité:\n- Ne jamais utiliser directement le 'kid' comme chemin de fichier\n- Valider et limiter les valeurs possibles pour 'kid'\n- Stocker les clés dans une structure de données sécurisée plutôt que dans le système de fichiers",
    initialToken: createToken(
      { alg: "HS256", typ: "JWT", kid: "keys/secret1.key" }, 
      { sub: "abcdef1234", name: "Bob Johnson", system_access: false, iat: 1716239022 },
      "signature_avec_kid_factice"
    ),
    targetClaim: "system_access",
    flagFormat: "true",
    checkFlag: (token: string) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
        const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        
        const header = JSON.parse(headerStr);
        const payload = JSON.parse(payloadStr);
        
        // Simuler une validation correcte si le kid pointe vers /dev/null ou un fichier similaire
        return (header.kid === "/dev/null" || header.kid.includes("../")) && 
               payload.system_access === true;
      } catch {
        return false;
      }
    }
  }
];
