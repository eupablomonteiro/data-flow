import { getPrisma } from "@dataflow/database";

export class UploadRepository {
  create(data: { filename: string; filepath: string; userId: string }) {
    return getPrisma().upload.create({
      data,
    });
  }

  findById(id: string) {
    return getPrisma().upload.findUnique({
      where: { id },
    });
  }

  findByIdAndUserId(id: string, userId: string) {
    return getPrisma().upload.findFirst({
      where: { id, userId },
    });
  }

  findAllByUserId(userId: string, page = 1, limit = 10) {
    return getPrisma().upload.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  countByUserId(userId: string) {
    return getPrisma().upload.count({
      where: { userId },
    });
  }
}
