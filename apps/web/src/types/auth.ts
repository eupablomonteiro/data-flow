export interface User {
  id: string;
  name: string | null;
  email: string;
  githubId: string | null;
  googleId: string | null;
  createdAt: Date;
}
