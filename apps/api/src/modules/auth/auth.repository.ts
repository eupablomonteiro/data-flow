import { getPrisma } from "@dataflow/database";

export class AuthRepository {
  constructor(private prisma = getPrisma()) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGithubId(githubId: string) {
    return this.prisma.user.findUnique({
      where: { githubId },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        githubId: true,
        googleId: true,
        createdAt: true,
      },
    });
  }

  async createOAuthUser(data: {
    email: string;
    name: string;
    githubId?: string;
    googleId?: string;
  }) {
    return this.prisma.user.upsert({
      where: { email: data.email },
      update: { githubId: data.githubId, googleId: data.googleId },
      create: data,
    });
  }
}
