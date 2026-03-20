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

  findAll() {
    return getPrisma().upload.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
