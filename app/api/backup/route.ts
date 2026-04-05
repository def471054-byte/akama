import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import AdmZip from "adm-zip";
import { join } from "path";
import { existsSync, readdirSync } from "fs";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany();
    const users = await prisma.user.findMany();
    
    const zip = new AdmZip();
    
    // 1. Add DB contents as JSON
    const dbData = {
      employees,
      users,
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    };
    zip.addFile("database.json", Buffer.from(JSON.stringify(dbData, null, 2)), "System database export");
    
    // 2. Add uploads folder
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (existsSync(uploadDir)) {
      zip.addLocalFolder(uploadDir, "uploads");
    }

    const buffer = zip.toBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": "attachment; filename=akama_backup_" + Date.now() + ".zip",
        "Content-Type": "application/zip",
      },
    });
  } catch (error) {
    console.error("BACKUP ERROR:", error);
    return NextResponse.json({ error: "Backup failed" }, { status: 500 });
  }
}
