import { join, resolve } from "path";
import { existsSync, mkdirSync } from "fs";

/**
 * Resolves the uploads directory with high robustness for Production/Docker.
 * 
 * Logic:
 * 1. Priority: process.env.UPLOAD_PATH (Source of truth for Volumes)
 * 2. Fallback: Automatic detection of public/uploads folder.
 *    - In Dev: process.cwd()/public/uploads
 *    - In Production (Standalone): Detects if public/uploads is one level up or at root.
 */
export function getUploadDir(): string {
  // 1. Highest Priority: Explicit environment variable (Perfect for Dokploy Volumes)
  if (process.env.UPLOAD_PATH) {
    const envDir = process.env.UPLOAD_PATH;
    if (!existsSync(envDir)) {
      mkdirSync(envDir, { recursive: true });
    }
    return envDir;
  }

  // 2. Fallback: Detect public/uploads relative to app root
  // We check the current working directory first
  let baseDir = resolve(process.cwd(), "public", "uploads");

  /**
   * Next.js Standalone Fix:
   * When running in Docker/standalone mode, process.cwd() might be inside '.next/standalone'.
   * We check if the expected path exists. If not, we try looking 'up' to find the project root.
   */
  if (!existsSync(resolve(process.cwd(), "public"))) {
    // If 'public' isn't in CWD, we might be in .next/standalone/
    const parentDir = resolve(process.cwd(), "..", "public", "uploads");
    if (existsSync(resolve(process.cwd(), "..", "public"))) {
      baseDir = parentDir;
    }
  }

  // Ensure the directory exists
  if (!existsSync(baseDir)) {
    try {
      mkdirSync(baseDir, { recursive: true });
    } catch (error) {
      console.error(`STORAGE ERROR: Failed to create/verify directory at ${baseDir}:`, error);
    }
  }

  return baseDir;
}
