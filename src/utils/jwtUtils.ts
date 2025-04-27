
import { DecodedJwt, SecurityIssue, AttackVector } from "@/types";

/**
 * Decode JWT token
 */
export function decodeJwt(token: string): DecodedJwt | null {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode header and payload
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    const signature = parts[2];

    return {
      header,
      payload,
      signature,
      raw: {
        header: parts[0],
        payload: parts[1],
        signature: parts[2]
      }
    };
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Get security score (0-100) for a JWT token
 */
export function getSecurityScore(decodedJwt: DecodedJwt): number {
  let score = 100;
  const issues = getSecurityIssues(decodedJwt);
  
  // Deduct points based on severity
  issues.forEach(issue => {
    if (issue.severity === 'high') {
      score -= 25;
    } else if (issue.severity === 'medium') {
      score -= 15;
    } else if (issue.severity === 'low') {
      score -= 5;
    }
  });

  // Ensure score stays within 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Check for security issues in JWT token
 */
export function getSecurityIssues(decodedJwt: DecodedJwt): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  const { header, payload } = decodedJwt;

  // Check algorithm
  if (header.alg === 'none') {
    issues.push({
      severity: 'high',
      title: 'Algorithm "none"',
      description: 'The token uses the "none" algorithm, which means no signature verification is performed.',
      impact: 'Anyone can forge tokens and the signature is not verified.',
      remediation: 'Use a secure algorithm like HS256, RS256, or ES256.'
    });
  }

  if (header.alg === 'HS256') {
    issues.push({
      severity: 'medium',
      title: 'Symmetric algorithm (HS256)',
      description: 'The token uses HS256, which relies on a shared secret.',
      impact: 'If the secret is weak or compromised, tokens can be forged.',
      remediation: 'Use a strong secret (at least 32 bytes of entropy) or consider asymmetric algorithms like RS256.'
    });
  }

  // Check expiration
  if (!payload.exp) {
    issues.push({
      severity: 'high',
      title: 'No expiration',
      description: 'The token does not have an expiration date (exp claim).',
      impact: 'The token remains valid indefinitely, increasing the risk of misuse if stolen.',
      remediation: 'Add an expiration time (exp) claim and keep token lifetimes short.'
    });
  } else {
    const expirationDate = new Date(payload.exp * 1000);
    const now = new Date();
    
    if (expirationDate < now) {
      issues.push({
        severity: 'low',
        title: 'Expired token',
        description: `The token expired on ${expirationDate.toLocaleString()}.`,
        impact: 'This token should be rejected by servers.',
        remediation: 'Generate a new token with a future expiration date.'
      });
    }
    
    // Check if token lifetime is too long (30 days)
    if (payload.iat) {
      const issuedAt = new Date(payload.iat * 1000);
      const lifetimeMs = expirationDate.getTime() - issuedAt.getTime();
      const lifetimeDays = lifetimeMs / (1000 * 60 * 60 * 24);
      
      if (lifetimeDays > 30) {
        issues.push({
          severity: 'medium',
          title: 'Long token lifetime',
          description: `The token lifetime is approximately ${lifetimeDays.toFixed(1)} days.`,
          impact: 'Long-lived tokens increase the window of opportunity for attackers if the token is stolen.',
          remediation: 'Reduce token lifetime to minutes or hours (max 24 hours) for access tokens.'
        });
      }
    }
  }

  // Check for issuer
  if (!payload.iss) {
    issues.push({
      severity: 'medium',
      title: 'Missing issuer',
      description: 'The token does not specify an issuer (iss claim).',
      impact: 'Servers cannot verify which system issued the token.',
      remediation: 'Add an issuer (iss) claim to identify the token issuer.'
    });
  }

  // Check for audience
  if (!payload.aud) {
    issues.push({
      severity: 'medium',
      title: 'Missing audience',
      description: 'The token does not specify an audience (aud claim).',
      impact: 'The token does not restrict which services should accept it.',
      remediation: 'Add an audience (aud) claim to identify the intended recipient.'
    });
  }

  // Check for sensitive information
  const sensitiveFields = ['password', 'secret', 'ssn', 'credit_card', 'address', 'phone'];
  for (const field of sensitiveFields) {
    if (payload[field]) {
      issues.push({
        severity: 'high',
        title: 'Sensitive information in payload',
        description: `The token contains potentially sensitive information: ${field}`,
        impact: 'JWT payloads are only encoded (not encrypted) and can be easily read by anyone.',
        remediation: 'Remove sensitive data from the token payload.'
      });
    }
  }

  return issues;
}

/**
 * Get potential attack vectors based on token analysis
 */
export function getAttackVectors(decodedJwt: DecodedJwt): AttackVector[] {
  const attackVectors: AttackVector[] = [];
  const { header } = decodedJwt;
  
  // Algorithm None Attack
  attackVectors.push({
    name: 'Algorithm None Attack',
    description: 'Change the algorithm to "none" and remove the signature to bypass verification.',
    applicability: header.alg === 'none' || header.alg === 'HS256',
    explanation: header.alg === 'none' 
      ? 'This token already uses algorithm "none" and is critically vulnerable.'
      : header.alg === 'HS256'
      ? 'This token uses HS256 and could be vulnerable if the server does not properly validate algorithms.'
      : 'Not likely applicable to this token due to its algorithm.'
  });
  
  // Algorithm Confusion Attack
  attackVectors.push({
    name: 'Algorithm Confusion Attack',
    description: 'Change the algorithm (e.g., from RS256 to HS256) to trick the server into using the public key as an HMAC secret.',
    applicability: header.alg === 'RS256' || header.alg === 'ES256',
    explanation: header.alg === 'RS256' || header.alg === 'ES256'
      ? 'This token uses an asymmetric algorithm and could be vulnerable if the server does not validate the algorithm.'
      : 'Not applicable to this token due to its algorithm.'
  });
  
  // Key ID (kid) Injection
  attackVectors.push({
    name: 'Key ID (kid) Injection',
    description: 'Manipulate the key ID to point to a file or key the attacker controls.',
    applicability: header.kid !== undefined,
    explanation: header.kid !== undefined
      ? 'This token uses a key ID (kid) and could be vulnerable if the server blindly trusts the kid parameter.'
      : 'Not applicable to this token as it does not use a key ID (kid).'
  });
  
  // Token Forgery (weak secret)
  attackVectors.push({
    name: 'Token Forgery (weak secret)',
    description: 'Brute-force or dictionary attack to guess the HMAC secret key.',
    applicability: header.alg === 'HS256',
    explanation: header.alg === 'HS256'
      ? 'This token uses HS256 and could be vulnerable if a weak secret is used.'
      : 'Not applicable to this token due to its algorithm.'
  });
  
  return attackVectors;
}

/**
 * Format timestamp (in seconds) to human readable date
 */
export function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return 'Not specified';
  return new Date(timestamp * 1000).toLocaleString();
}

/**
 * Get security recommendations
 */
export function getSecurityRecommendations(): string[] {
  return [
    'Use strong algorithms (RS256, ES256) for production systems',
    'Keep token lifetimes short (minutes to hours, not days)',
    'Include expiration (exp), issued at (iat), and not before (nbf) claims',
    'Always specify issuer (iss) and audience (aud) claims',
    'Never store sensitive data in JWT payloads',
    'Use strong, properly managed secrets/keys',
    'Always validate the token signature before trusting the contents',
    'Implement proper token revocation mechanisms (e.g., Redis blacklist)',
    'Use HTTPS exclusively for token transmission',
    'Consider using refresh tokens with shorter-lived access tokens'
  ];
}
