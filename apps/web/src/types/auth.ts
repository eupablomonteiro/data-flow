export interface User {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  githubId: string | null;
  googleId: string | null;
  createdAt: Date;
}
