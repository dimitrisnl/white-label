export interface Token {
  type: string;
  token: string;
  expiresAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

export interface Org {
  id: string;
  name: string;
  slug: string;
}
