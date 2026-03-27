import { Response } from "express";
import { AnalyticsService } from "./analytics.service";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";

export class AnalyticsController {
  constructor(private service = new AnalyticsService()) {}

  handle = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.sub;
    const data = await this.service.execute(userId);
    return res.json(data);
  };
}
