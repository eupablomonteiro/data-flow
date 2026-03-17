import { env } from "@dataflow/config";
import { errorMiddleware } from "./middleware/error.middleware";

import express from "express";
import cors from "cors";

import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use(errorMiddleware);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
