import { Router } from "express";
import { upload } from "./lib/multer";
import { authMiddleware } from "./middleware/auth.middleware";
// Modules
import { UploadController } from "./modules/upload/upload.controller";
import { AnalyticsController } from "./modules/analytics/analytics.controller";
import { AuthController } from "./modules/auth/auth.controller";

export const router: Router = Router();

const uploadController = new UploadController();
const analyticsController = new AnalyticsController();
const authController = new AuthController();

// Rotas Privadas (Protegidas pelo Middleware)
router.get("/auth/me", authMiddleware, (req, res) =>
  authController.getMe(req, res),
);
router.post(
  "/uploads",
  authMiddleware,
  upload.single("file"),
  uploadController.create,
);
router.get("/uploads/:id", authMiddleware, uploadController.getById);
router.get("/uploads/:id/errors", authMiddleware, uploadController.getErrors);
router.get("/uploads", authMiddleware, uploadController.getAll);
router.get("/analytics", authMiddleware, analyticsController.handle);

// Rotas Públicas de Autenticação
router.get("/auth/github/callback", (req, res) =>
  authController.githubCallback(req, res),
);
router.get("/auth/google/callback", (req, res) =>
  authController.googleCallback(req, res),
);
router.post("/auth/logout", (req, res) => authController.logout(req, res));
