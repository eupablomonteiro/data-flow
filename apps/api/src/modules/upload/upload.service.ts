import path from "path";
import { getFileProcessingQueue } from "@dataflow/queue";
import { UploadRepository } from "./upload.repository";
import { AppError } from "../../errors/AppError";

export class CreateUploadService {
  constructor(private repository = new UploadRepository()) {}

  async execute(file: Express.Multer.File) {
    const absolutePath = path.resolve(file.path);

    const upload = await this.repository.create({
      filename: file.filename,
      filepath: absolutePath,
    });

    const job = await getFileProcessingQueue().add("fileProcessingJob", {
      uploadId: upload.id,
      filename: file.filename,
      path: absolutePath,
    });

    return {
      uploadId: upload.id,
      jobId: job.id,
    };
  }
}

export class GetUploadService {
  private uploadRepository = new UploadRepository();

  async getById(id: string) {
    const upload = await this.uploadRepository.findById(id);

    if (!upload) {
      throw new AppError("Upload not found.", 404);
    }

    return upload;
  }

  async getAll() {
    const uploads = await this.uploadRepository.findAll();
    return uploads;
  }
}
