
export interface JwtHeader {
  alg: string;
  typ: string;
  kid?: string;
  [key: string]: any;
}

export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: any;
}

export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

export interface SecurityIssue {
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  remediation: string;
}

export interface AttackVector {
  name: string;
  description: string;
  applicability: boolean;
  explanation: string;
}
