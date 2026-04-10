import { join } from "path";
import { existsSync, mkdirSync } from "fs";

/**
 * Resolves the uploads directory with the following priority:
 * 1. Environment variable UPLOAD_PATH (if set)
 * 2. Default project-relative path: process.cwd()/public/uploads
 * 
 * It also ensures the directory exists.
 */
export function getUploadDir(): string {
  // Use environment variable if provided, otherwise fallback to project root relative path
  const baseDir = process.env.UPLOAD_PATH || join(process.cwd(), "public", "uploads");

  // Ensure the directory exists
  if (!existsSync(baseDir)) {
    try {
      mkdirSync(baseDir, { recursive: true });
    } catch (error) {
      console.error(`STORAGE ERROR: Failed to create directory at ${baseDir}:`, error);
    }
  }

  return baseDir;
}
