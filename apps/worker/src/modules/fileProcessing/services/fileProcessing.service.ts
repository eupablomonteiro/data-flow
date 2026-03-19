import { createCsvStream } from "../../../lib/csvParser";
import { saleSchema } from "@dataflow/types";
import { SaleRepository } from "../repositories/sale.repository";
import { UploadRepository } from "../repositories/upload.repository";

const BATCH_SIZE = 500;
const UPDATE_INTERVAL = 1000;

export class FileProcessingService {
  private saleRepository = new SaleRepository();
  private uploadRepository = new UploadRepository();

  async execute(filePath: string, uploadId: string) {
    const stream = createCsvStream(filePath);

    let batch: any[] = [];
    let processedRows = 0;
    let successRows = 0;
    let errorRows = 0;

    for await (const row of stream) {
      try {
        const validated = saleSchema.parse(row);

        batch.push(validated);
        successRows++;
      } catch (error) {
        errorRows++;
        if (errorRows <= 10) {
          console.error("Invalid row:", error);
        }
      }

      processedRows++;

      if (batch.length >= BATCH_SIZE) {
        await this.saleRepository.createMany(batch);
        batch = [];
      }

      if (processedRows % UPDATE_INTERVAL === 0) {
        await this.uploadRepository.updateMetrics(uploadId, {
          totalRows: processedRows,
          processedRows,
          successRows,
          errorRows,
        });
      }
    }

    if (batch.length > 0) {
      await this.saleRepository.createMany(batch);
    }

    await this.uploadRepository.updateMetrics(uploadId, {
      processedRows,
      successRows,
      errorRows,
      totalRows: processedRows,
    });

    return {
      processedRows,
      successRows,
      errorRows,
      totalRows: processedRows,
    };
  }
}
