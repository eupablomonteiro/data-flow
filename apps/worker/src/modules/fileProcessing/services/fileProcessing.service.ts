import { createCsvStream } from "../../../lib/csvParser";
import { saleSchema, type SaleType } from "@dataflow/validation";
import { SaleRepository } from "../repositories/sale.repository";
import { UploadRepository } from "../repositories/upload.repository";
import { createLogger } from "@dataflow/logger";

const logger = createLogger("fileProcessing");

const BATCH_SIZE = 500;
const MAX_ERRORS_TO_STORE = 100;

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

interface ValidationError {
  row: number;
  errors: string[];
}

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
    const errors: ValidationError[] = [];

    for await (const row of stream) {
      try {
        const validated = saleSchema.parse(row);

        batch.push(validated);
        successRows++;
      } catch (error) {
        errorRows++;

        const rowNumber = processedRows + 1;
        let errorMessages: string[] = [];

        if (isZodError(error)) {
          errorMessages = error.issues.map(
            (i) => `${i.path.join(".")}: ${i.message}`,
          );
        }

        if (errors.length < MAX_ERRORS_TO_STORE) {
          errors.push({
            row: rowNumber,
            errors: errorMessages,
          });
        }

        if (errorRows <= 10) {
          logger.warn(
            { row: rowNumber, issues: errorMessages.join(", ") },
            "Invalid row skipped.",
          );
        }
      }

      processedRows++;

      if (processedRows % BATCH_SIZE === 0) {
        await this.saleRepository.createMany(batch, uploadId);
        batch = [];

        await this.uploadRepository.updateMetrics(uploadId, {
          totalRows: processedRows,
          processedRows,
          successRows,
          errorRows,
        });
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

    if (errors.length > 0) {
      await this.uploadRepository.addErrors(uploadId, errors);
    }

    return {
      processedRows,
      successRows,
      errorRows,
      totalRows: processedRows,
      errors,
    };
  }
}
