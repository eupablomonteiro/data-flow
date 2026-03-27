import { Response } from "express";
import { CreateUploadService, GetUploadService } from "./upload.service";
import { UploadPresenter } from "./upload.presenter";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { z } from "@dataflow/config";

const uuidSchema = z.string().uuid();

export class UploadController {
  constructor(
    private createService = new CreateUploadService(),
    private getService = new GetUploadService(),
  ) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "file is required" });
    }

    const userId = req.user.sub;
    const result = await this.createService.execute(req.file, userId);
    return res.status(201).json(result);
  };

  getById = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const parsed = uuidSchema.safeParse(id);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const userId = req.user.sub;
    const upload = await this.getService.getById(parsed.data, userId);
    return res.json(UploadPresenter.toHTTP(upload));
  };

  getAll = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.sub;
    const uploads = await this.getService.getAll(userId);

    return res.json(UploadPresenter.toHTTPList(uploads));
  };
}
