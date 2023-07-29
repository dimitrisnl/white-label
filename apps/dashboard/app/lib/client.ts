import axios from 'axios';

const API_URL = process.env.API_URL!;

export const client = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

const LOGOUT_ENDPOINT = `/v1/auth/logout`;

export async function logout(token: string): Promise<void> {
  return client.post(LOGOUT_ENDPOINT, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const ME_ENDPOINT = `/v1/me`;

export async function me(token: string) {
  return client.get<{
    user: {
      email: string;
      name: string;
      orgs: Array<{name: string; id: string}>;
    };
  }>(ME_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
