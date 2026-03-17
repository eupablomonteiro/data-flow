import {
  redisConnection,
  Worker,
  Job,
  FileProcessingJob,
} from "@dataflow/queue";
import { FileProcessingService } from "./modules/fileProcessing/services/fileProcessing.service";
import { UploadRepository } from "./modules/fileProcessing/repositories/upload.repository";

import { logger } from "@dataflow/logger";

const uploadRepository = new UploadRepository();

const worker = new Worker<FileProcessingJob>(
  "file-processing",
  async (job: Job<FileProcessingJob>) => {
    logger.info(`Processing job ${job.data.uploadId}`);

    await uploadRepository.updateStatus(job.data.uploadId, "PROCESSING");

    try {
      const service = new FileProcessingService();
      const result = await service.execute(job.data.path);

      await uploadRepository.markCompleted(job.data.uploadId);

      logger.info(`Rows processed: ${result.processed}`);
    } catch (error) {
      await uploadRepository.markFailed(job.data.uploadId);
      logger.error(`Processing failed: ${error}`);
      throw error;
    }
  },
  {
    connection: redisConnection,
  },
);

logger.info("Worker started");
