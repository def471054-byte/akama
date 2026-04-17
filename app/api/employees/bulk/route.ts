import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import moment from "moment-hijri";

// Ensure Arabic dates are handled and normalized
// Sanitization helper is enough now that we store dates as strings
const parseDateString = (val: string) => {
  if (!val || typeof val !== 'string') return null;
  return val.trim();
};

// Strip BOM, zero-width spaces, and other invisible unicode garbage that
// survives CSV parsing and corrupts Arabic text in MongoDB.
const sanitizeString = (val: unknown): string | null => {
  if (val === null || val === undefined || val === "") return null;
  const s = String(val)
    .replace(/^\uFEFF/, "")           // BOM
    .replace(/\u200B/g, "")           // zero-width space
    .replace(/\u00A0/g, " ")          // non-breaking space → regular space
    .replace(/[\u200C\u200D\u200E\u200F]/g, "") // invisible RTL/LTR marks
    .trim();
  return s === "" ? null : s;
};

export async function POST(req: Request) {
  try {
    const { employees, dateMode = "GREGORIAN" } = await req.json();

    if (!Array.isArray(employees)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const results = await Promise.all(
      employees.map(async (emp: any) => {
        try {
          // Generate unique tokens
          const verificationToken = crypto.randomBytes(32).toString("base64url");

          // Auto-generate ajeerId if missing or empty — prevents MongoDB unique index collision
          // when multiple rows have no ajeerId (all would resolve to null, causing P2002)
          const ajeerId = (emp.ajeerId && String(emp.ajeerId).trim())
            ? String(emp.ajeerId).trim()
            : `AJ-${crypto.randomBytes(8).toString("hex")}`;
          
          // Normalise 'workLocation' (CSV header) → 'workLocations' (schema field)
          const workLocations = emp.workLocations || emp.workLocation || null;

          const data: Prisma.EmployeeUncheckedCreateInput = {
            // name is required in the schema — fall back to empty string if CSV is blank
            name:                  sanitizeString(emp.name) ?? "",
            arabicName:            sanitizeString(emp.arabicName),
            photo:                 sanitizeString(emp.photo),
            idNumber:              sanitizeString(emp.idNumber),
            nationality:           sanitizeString(emp.nationality),
            gender:                sanitizeString(emp.gender),
            designation:           sanitizeString(emp.designation),
            description:           sanitizeString(emp.description),
            company:               sanitizeString(emp.company),
            authority:             sanitizeString(emp.authority),
            department:            sanitizeString(emp.department),
            purpose:               sanitizeString(emp.purpose),
            bloodType:             sanitizeString(emp.bloodType),
            email:                 sanitizeString(emp.email),
            phone:                 sanitizeString(emp.phone),
            providerEstNumber:     sanitizeString(emp.providerEstNumber),
            beneficiaryEstName:    sanitizeString(emp.beneficiaryEstName),
            beneficiaryEstNumber:  sanitizeString(emp.beneficiaryEstNumber),
            permitNumber:          sanitizeString(emp.permitNumber),
            workLocations:         sanitizeString(workLocations),
            ajeerId,
            verificationToken,
            issueDate:  parseDateString(emp.issueDate),
            expiryDate: parseDateString(emp.expiryDate),
            birthDate:  parseDateString(emp.birthDate),
          };

          const created = await prisma.employee.create({ data });
          return { success: true, name: created.name, idNumber: created.idNumber };
        } catch (e: any) {
          console.error("ROW IMPORT ERROR:", e);
          return { 
            success: false, 
            name: emp.name || "Unknown", 
            error: e.code === 'P2002' ? "Duplicate identifier (Ajeer ID or Token)" : (e.message || "Failed to create")
          };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    return NextResponse.json({ 
      success: true, 
      successCount, 
      failCount, 
      results 
    });
  } catch (error) {
    console.error("BULK IMPORT API ERROR:", error);
    return NextResponse.json({ error: "Internal server error during import" }, { status: 500 });
  }
}
