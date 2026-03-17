import { prisma } from "@dataflow/database";

export class UploadRepository {
  create(data: { filename: string; filepath: string }) {
    return prisma.upload.create({
      data,
    });
  }

  findById(id: string) {
    return prisma.upload.findUnique({
      where: { id },
    });
  }

  findAll() {
    return prisma.upload.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
