import { Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";

export class AnalyticsController {
  constructor(private service = new AnalyticsService()) {}

  handle = async (_: Request, res: Response) => {
    try {
      const data = await this.service.execute();
      return res.json(data);
    } catch (error) {
      console.error("[AnalyticsController]", error);

      return res.status(500).json({
        error: "INTERNAL SERVER ERROR",
      });
    }
  };
}
