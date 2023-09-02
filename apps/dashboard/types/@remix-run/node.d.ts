import '@remix-run/node';

declare module '@remix-run/node' {
  interface SessionData {
    userId: string;
  }
}
