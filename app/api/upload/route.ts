import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { getUploadDir } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("UPLOAD ERROR: No file in form data");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Basic type validation
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }

    // Increase limit slightly for initial upload before processing
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Max upload file size is 10MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Process Image with Sharp
    // - Resize to max 600px width (maintaining aspect ratio)
    // - Convert to WebP with 80% quality
    // - Remove EXIF metadata
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // 2. Determine file path (Always save as .webp)
    const filename = `${uuidv4()}.webp`;
    const uploadDir = getUploadDir();
    const filePath = join(uploadDir, filename);

    // 3. Save optimized file
    await writeFile(filePath, optimizedBuffer);

    return NextResponse.json({ 
      url: `/api/uploads/${filename}`,
      success: true,
      originalSize: file.size,
      optimizedSize: optimizedBuffer.length
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
