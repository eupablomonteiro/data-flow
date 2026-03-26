import { createCsvStream } from "../../../lib/csvParser";
import { saleSchema, type SaleType } from "@dataflow/validation";
import { SaleRepository } from "../repositories/sale.repository";
import { UploadRepository } from "../repositories/upload.repository";
import { createLogger } from "@dataflow/logger";

const logger = createLogger("fileProcessing");

const BATCH_SIZE = 500;
const UPDATE_INTERVAL = 5000;
let lastUpdate = Date.now();

export class FileProcessingService {
  constructor(
    private saleRepository = new SaleRepository(),
    private uploadRepository = new UploadRepository(),
  ) {}

  async execute(filePath: string, uploadId: string) {
    const stream = createCsvStream(filePath);

    let batch: SaleType[] = [];
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
          logger.warn({ row: processedRows }, "Invalid row skipped.");
        }
      }

      processedRows++;

      if (processedRows % BATCH_SIZE === 0) {
        await this.saleRepository.createMany(batch);
        batch = [];
      }

      if (Date.now() - lastUpdate >= UPDATE_INTERVAL) {
        await this.uploadRepository.updateMetrics(uploadId, {
          totalRows: processedRows,
          processedRows,
          successRows,
          errorRows,
        });
        lastUpdate = Date.now();
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
