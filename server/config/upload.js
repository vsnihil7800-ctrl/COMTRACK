import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export const localUpload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
  }),
  limits: { fileSize: 15 * 1024 * 1024 }
});

const mimeSets = {
  complaint: ["image/jpeg", "image/png", "image/webp"],
  sos: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime"]
};

function buildUploader(allowedMimes, maxSizeMb) {
  return multer({
    storage: multer.diskStorage({
      destination: (_, __, cb) => cb(null, uploadDir),
      filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
    }),
    limits: { fileSize: maxSizeMb * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
      if (!allowedMimes.includes(file.mimetype)) {
        return cb(new Error(`Invalid file type: ${file.mimetype}`));
      }
      cb(null, true);
    }
  });
}

export const complaintUpload = buildUploader(mimeSets.complaint, 8);
export const sosUpload = buildUploader(mimeSets.sos, 20);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(localPath, resourceType = "auto") {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return null;
  const result = await cloudinary.uploader.upload(path.resolve(localPath), { resource_type: resourceType });
  return result.secure_url;
}

export async function virusScanHook(filePath) {
  // Placeholder for enterprise scanner integrations (ClamAV/S3 malware scan webhooks).
  // Return true to allow upload, false to block.
  return !!filePath;
}
