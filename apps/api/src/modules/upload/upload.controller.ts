import { Request, Response } from "express";
import { CreateUploadService, GetUploadService } from "./upload.service";
import { UploadPresenter } from "./upload.presenter";

export class UploadController {
  constructor(
    private createService = new CreateUploadService(),
    private getService = new GetUploadService(),
  ) {}

  create = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "file is required" });
    }

    const result = await this.createService.execute(req.file);
    return res.status(201).json(result);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const upload = await this.getService.getById(id as string);
    return res.json(UploadPresenter.toHTTP(upload));
  };

  getAll = async (req: Request, res: Response) => {
    const uploads = await this.getService.getAll();

    return res.json(UploadPresenter.toHTTPList(uploads));
  };
}
