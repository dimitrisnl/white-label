import axios from 'axios';

const API_URL = 'http://0.0.0.0:3333/api'; // todo: move to config or ENV

export const ENDPOINTS = {
  logout: `/v1/auth/logout`,
  user: `/v1/me`,
} as const;

export const client = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

// export function getAuthClient(token: string) {
//   return axios.create({
//     withCredentials: true,
//     baseURL: API_URL,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }

export async function logout(token: string): Promise<void> {
  return client.post(ENDPOINTS.logout, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function me(token: string) {
  return client.get<{
    user: {
      email: string;
      name: string;
      orgs: Array<{name: string; id: string}>;
    };
  }>(ENDPOINTS.user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
