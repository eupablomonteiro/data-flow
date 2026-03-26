import { Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";

export class AnalyticsController {
  constructor(private service = new AnalyticsService()) {}

  handle = async (_: Request, res: Response) => {
    const data = await this.service.execute();
    return res.json(data);
  };
}
