export interface BaseAccessToken {
  type: 'bearer';
  token: string;
  expires_at?: string;
  expires_in?: number;
}

export interface AccessToken {
  type: 'bearer';
  token: string;
  expiresAt?: string;
  expiresIn?: number;
}

export function toAccessToken(accessToken: BaseAccessToken): AccessToken {
  const {expires_at, expires_in, ...rest} = accessToken;
  return {
    ...rest,
    expiresAt: expires_at,
    expiresIn: expires_in,
  };
}
