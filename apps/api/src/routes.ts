import { Router } from "express";
import { UploadController } from "./modules/upload/upload.controller";
import { AnalyticsController } from "./modules/analytics/analytics.controller";
import { upload } from "./lib/multer";

export const router: Router = Router();

const uploadController = new UploadController();
const analyticsController = new AnalyticsController();

router.post("/uploads", upload.single("file"), uploadController.create);
router.get("/uploads/:id", uploadController.getById);
router.get("/uploads", uploadController.getAll);
router.get("/analytics", analyticsController.handle);
