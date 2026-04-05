import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import AdmZip from "adm-zip";
import { join } from "path";
import { writeFile, mkdir, rm } from "fs/promises";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No ZIP file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    // 1. Process Database
    const dbEntry = zipEntries.find(e => e.entryName === "database.json");
    if (dbEntry) {
      const dbContent = JSON.parse(dbEntry.getData().toString("utf8"));
      
      // TRUNCATE current collections
      await prisma.employee.deleteMany();
      // Only keep admins for safety or allow replacement?
      // For full restore, we replace.
      await prisma.employee.createMany({ data: dbContent.employees });
    }

    // 2. Process Uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (existsSync(uploadDir)) {
      await rm(uploadDir, { recursive: true, force: true });
    }
    await mkdir(uploadDir, { recursive: true });
    
    // Extract everything in 'uploads/' folder from zip to local uploadDir
    zipEntries.filter(e => e.entryName.startsWith("uploads/")).forEach(entry => {
      if (!entry.isDirectory) {
        const filePath = join(process.cwd(), "public", entry.entryName);
        const fileDir = join(process.cwd(), "public", entry.entryName.substring(0, entry.entryName.lastIndexOf("/")));
        
        // Manual copy to ensure directory exists for each file
        mkdir(fileDir, { recursive: true }).then(() => {
           writeFile(filePath, entry.getData());
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RESTORE ERROR:", error);
    return NextResponse.json({ error: "Restore failed" }, { status: 500 });
  }
}
