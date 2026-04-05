import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany();
    
    // Transform data for export
    const exportData = employees.map(({ id, verificationToken, createdAt, ...rest }) => ({
      ...rest,
      id: id.toString(),
      issueDate: rest.issueDate?.toLocaleDateString(),
      expiryDate: rest.expiryDate?.toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": "attachment; filename=employees_export.xlsx",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
