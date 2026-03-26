import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "apps", "api", "uploads");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.random();
    cb(null, unique + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed."));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});
