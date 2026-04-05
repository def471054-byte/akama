import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const text = await file.text();
    const result = Papa.parse(text, { header: true, skipEmptyLines: true });

    if (result.errors.length > 0) {
      return NextResponse.json({ error: "CSV error", details: result.errors }, { status: 400 });
    }

    const dataRows = result.data as any[];

    // Bulk create with new tokens
    const employees = await Promise.all(dataRows.map(async (row) => {
      const verificationToken = crypto.randomBytes(32).toString("base64url");
      return {
        ...row,
        verificationToken,
        issueDate: row.issueDate ? new Date(row.issueDate) : null,
        expiryDate: row.expiryDate ? new Date(row.expiryDate) : null,
      };
    }));

    await prisma.employee.createMany({
      data: employees,
    });

    return NextResponse.json({ success: true, count: employees.length });
  } catch (error) {
    console.error("IMPORT ERROR:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
