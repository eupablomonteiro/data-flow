import { createCsvStream } from "../../../lib/csvParser";
import { saleSchema, type SaleType } from "@dataflow/validation";
import { SaleRepository } from "../repositories/sale.repository";
import { UploadRepository } from "../repositories/upload.repository";
import { createLogger } from "@dataflow/logger";

const logger = createLogger("fileProcessing");

const BATCH_SIZE = 500;
const UPDATE_INTERVAL = 5000;

function isZodError(
  err: unknown,
): err is { issues: { path: (string | number)[]; message: string }[] } {
  return (
    typeof err === "object" &&
    err !== null &&
    "issues" in err &&
    Array.isArray((err as { issues: unknown }).issues)
  );
}

export class FileProcessingService {
  private lastUpdate = Date.now();

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
          if (isZodError(error)) {
            const issues = error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join(", ");
            logger.warn(
              { row: processedRows + 1, issues },
              "Invalid row skipped.",
            );
          } else {
            logger.warn({ row: processedRows + 1 }, "Invalid row skipped.");
          }
        }
      }

      processedRows++;

      if (processedRows % BATCH_SIZE === 0) {
        await this.saleRepository.createMany(batch, uploadId);
        batch = [];
      }

      if (Date.now() - this.lastUpdate >= UPDATE_INTERVAL) {
        await this.uploadRepository.updateMetrics(uploadId, {
          totalRows: processedRows,
          processedRows,
          successRows,
          errorRows,
        });
        this.lastUpdate = Date.now();
      }
    }

    if (batch.length > 0) {
      await this.saleRepository.createMany(batch, uploadId);
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
