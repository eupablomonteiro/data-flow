import { getPrisma } from "@dataflow/database";

export class UploadRepository {
  create(data: { filename: string; filepath: string }) {
    return getPrisma().upload.create({
      data,
    });
  }

  findById(id: string) {
    return getPrisma().upload.findUnique({
      where: { id },
    });
  }

  findAll(page = 1, limit = 10) {
    return getPrisma().upload.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }
}
