
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
    title: "Challenge #1: Authentification Admin",
    difficulty: "easy",
    description: "Ce serveur authentifie les utilisateurs avec un JWT. Vous êtes connecté en tant qu'utilisateur standard, mais vous souhaitez accéder au panneau d'administration.",
    objective: "Modifiez le token pour obtenir un rôle d'administrateur (role: admin) et contourner la sécurité.",
    hint: "L'algorithme 'none' permet de créer un token sans signature. Le serveur accepte-t-il les tokens non signés?",
    solution: "Cette vulnérabilité exploite une implémentation incorrecte de la validation de l'algorithme JWT:\n\n1. Changez l'algorithme dans le header à 'none'\n2. Modifiez le champ 'role' à 'admin' dans le payload\n3. Supprimez complètement la signature (laissez la 3ème partie vide)\n\nLe serveur aurait dû rejeter explicitement l'algorithme 'none' et vérifier que l'algorithme déclaré correspond à celui configuré sur le serveur.",
    initialToken: createToken(
      { alg: "HS256", typ: "JWT" }, 
      { sub: "1234567890", name: "Jean Dupont", role: "user", iat: 1516239022 },
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
    title: "Challenge #2: Accès Premium",
    difficulty: "medium",
    description: "Cette API utilise des JWT signés avec RSA (asymétrique) pour authentifier les utilisateurs. Vous avez accès à la clé publique via la documentation de l'API.",
    objective: "Exploitez la confusion d'algorithme pour forger un token avec l'accès premium (premium: true).",
    hint: "Le serveur utilise la clé publique pour vérifier les tokens signés avec RS256. Que se passe-t-il si vous changez l'algorithme à HS256 et utilisez la clé publique comme clé secrète?",
    solution: "Cette attaque exploite une confusion entre les algorithmes asymétriques (RS256) et symétriques (HS256):\n\n1. Le serveur utilise RS256, qui nécessite une clé privée pour signer et une clé publique pour vérifier\n2. Si le serveur ne vérifie pas correctement l'algorithme, on peut le tromper en utilisant HS256\n3. Avec HS256, le serveur utilise directement la clé reçue pour vérification\n4. Si le serveur utilise la clé publique pour vérifier, on peut forger un token en signant avec HS256 et cette même clé publique\n\nLa correction consiste à vérifier strictement l'algorithme avant de procéder à la validation de signature.",
    initialToken: createToken(
      { alg: "RS256", typ: "JWT" }, 
      { sub: "9876543210", name: "Sophie Martin", premium: false, iat: 1616239022 },
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
        
        return header.alg === "HS256" && payload.premium === true;
      } catch {
        return false;
      }
    }
  },
  {
    id: "kid-injection",
    title: "Challenge #3: Accès Système",
    difficulty: "hard",
    description: "Ce serveur bancaire utilise un paramètre 'kid' (Key ID) dans l'en-tête JWT pour déterminer quelle clé utiliser lors de la vérification. Vous avez découvert que le serveur construit un chemin de fichier à partir du 'kid'.",
    objective: "Exploitez l'injection de 'kid' pour forger un token valide donnant accès aux fonctions système (system_access: true).",
    hint: "Le paramètre 'kid' est utilisé pour construire un chemin de fichier. Pouvez-vous trouver un fichier système avec un contenu prévisible?",
    solution: "Cette vulnérabilité est une injection de chemin de fichier via le paramètre 'kid' du JWT:\n\n1. Le serveur utilise le 'kid' pour déterminer quelle clé utiliser, en lisant un fichier\n2. On peut exploiter cela en pointant vers '/dev/null' ou un autre fichier au contenu connu\n3. Ces fichiers contiennent souvent des octets nuls ou d'autres valeurs prévisibles\n4. En connaissant la clé (le contenu du fichier), on peut signer correctement notre token\n\nPour corriger cette vulnérabilité:\n- Ne jamais utiliser directement un paramètre externe pour construire un chemin\n- Utiliser une liste blanche de valeurs acceptables pour le 'kid'\n- Stocker les clés dans une structure de données sécurisée plutôt que dans des fichiers",
    initialToken: createToken(
      { alg: "HS256", typ: "JWT", kid: "keys/secret1.key" }, 
      { sub: "abcdef1234", name: "Thomas Bernard", system_access: false, iat: 1716239022 },
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
        
        return (header.kid === "/dev/null" || header.kid.includes("../")) && 
               payload.system_access === true;
      } catch {
        return false;
      }
    }
  },
  {
    id: "jwk-injection",
    title: "Challenge #4: Vol de Données Bancaires",
    difficulty: "hard",
    description: "Une application bancaire utilise JWT avec un paramètre 'jwk' dans l'en-tête pour spécifier la clé de vérification. Vous souhaitez accéder aux données bancaires d'autres utilisateurs.",
    objective: "Exploitez l'injection de 'jwk' pour forger un token valide avec le claim 'data_access: all' et le rôle 'bank_manager'.",
    hint: "Le paramètre 'jwk' permet d'inclure directement la clé publique dans le token. Que se passe-t-il si vous fournissez votre propre jwk?",
    solution: "Cette vulnérabilité exploite la fonctionnalité 'jwk' (JSON Web Key):\n\n1. Certains parseurs JWT acceptent une clé publique directement incluse dans l'en-tête via 'jwk'\n2. Si le serveur utilise cette clé sans vérification, un attaquant peut fournir sa propre paire de clés\n3. L'attaquant signe le token avec sa propre clé privée et inclut la clé publique correspondante dans le jwk\n4. Le serveur valide la signature avec la clé fournie par l'attaquant lui-même\n\nPour corriger cette vulnérabilité:\n- Ne jamais accepter les clés fournies dans le token lui-même\n- Utiliser uniquement des clés préconfigurées et sécurisées\n- Valider que le 'kid' ou autre identifiant de clé fait référence à une clé légitime",
    initialToken: createToken(
      { 
        alg: "RS256", 
        typ: "JWT" 
      }, 
      { 
        sub: "user_12345", 
        name: "Client Standard", 
        role: "client",
        data_access: "own", 
        iat: 1716239022 
      },
      "signature_jwk_factice"
    ),
    targetClaim: "role",
    flagFormat: "bank_manager",
    checkFlag: (token: string) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
        const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        
        const header = JSON.parse(headerStr);
        const payload = JSON.parse(payloadStr);
        
        return header.jwk && 
               payload.role === "bank_manager" && 
               payload.data_access === "all";
      } catch {
        return false;
      }
    }
  },
  {
    id: "weak-secret",
    title: "Challenge #5: Brute Force du Secret",
    difficulty: "medium",
    description: "Un site e-commerce utilise JWT avec un secret faible pour gérer les sessions. Vous souhaitez accéder à la section réservée aux vendeurs.",
    objective: "Découvrez le secret utilisé pour signer le JWT et forgez un nouveau token avec le claim 'role: vendor'.",
    hint: "Le secret utilisé est un mot commun qu'on peut trouver dans un dictionnaire. Essayez quelques mots courants comme clé HMAC.",
    solution: "Cette vulnérabilité exploite l'utilisation d'un secret faible pour HS256:\n\n1. Les JWT signés avec HS256 sont vulnérables si le secret est faible\n2. Dans ce cas, le secret est simplement le mot 'password'\n3. En essayant quelques mots courants comme secret, on peut vérifier si la signature est valide\n4. Une fois le secret trouvé, on peut générer un nouveau token avec les claims souhaités\n\nPour corriger cette vulnérabilité:\n- Utiliser des secrets aléatoires et forts (au moins 32 octets d'entropie)\n- Éviter les mots du dictionnaire et les phrases connues\n- Considérer l'utilisation d'algorithmes asymétriques comme RS256",
    initialToken: createToken(
      { alg: "HS256", typ: "JWT" }, 
      { sub: "user_789", name: "Client", role: "customer", iat: 1616239022 },
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    ),
    targetClaim: "role",
    flagFormat: "vendor",
    checkFlag: (token: string) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadStr);
        
        // Dans un lab réel, on vérifierait la signature avec le secret attendu
        // Ici, on simule simplement une vérification réussie si le rôle est correct
        return payload.role === "vendor";
      } catch {
        return false;
      }
    }
  }
];
