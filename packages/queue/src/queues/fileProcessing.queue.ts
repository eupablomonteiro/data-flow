import { Queue } from "bullmq";
import { getRedis } from "../connection";
import { FileProcessingJob } from "../jobs/fileProcessing.job";

let queue: Queue<FileProcessingJob> | null = null;

export function getFileProcessingQueue() {
  if (!queue) {
    queue = new Queue<FileProcessingJob>("file-processing", {
      connection: getRedis(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 3000,
        },
        removeOnComplete: true,
      },
    });
  }

  return queue;
}
