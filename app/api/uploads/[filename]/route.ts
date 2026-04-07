import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    // 1. Resolve the path to the uploads directory
    // In production, we assume it's in public/uploads relative to project root
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, filename);

    // 2. Check if file exists
    if (!existsSync(filePath)) {
      console.error(`IMAGE API 404: File not found at ${filePath}`);
      return new NextResponse("Image Not Found", { status: 404 });
    }

    // 3. Determine the content type (mime type)
    const ext = filename.split(".").pop()?.toLowerCase();
    let contentType = "image/jpeg";
    if (ext === "png") contentType = "image/png";
    if (ext === "webp") contentType = "image/webp";
    if (ext === "gif") contentType = "image/gif";
    if (ext === "svg") contentType = "image/svg+xml";

    // 4. Read and return the file buffer
    const fileBuffer = await readFile(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("IMAGE API ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
