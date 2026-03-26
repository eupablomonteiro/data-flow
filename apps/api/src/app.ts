import { errorMiddleware } from "./middleware/error.middleware";
import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { env } from "./env";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
  message: "Too many requests from this IP.",
});

const app = express();

app.use(
  cors({
    origin: env.AUTH_REDIRECT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.use("/api", router);
app.use(errorMiddleware);

export { app };
