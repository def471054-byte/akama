import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const employeeCount = await prisma.employee.count();
    
    const recentEmployees = await prisma.employee.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        idNumber: true,
        createdAt: true,
        photo: true,
      }
    });

    return NextResponse.json({
      stats: [
        { label: "Verified Employees", value: employeeCount },
        { label: "System Status", value: "Green" },
        { label: "Current Cycle", value: "Hajj 1447H" },
      ],
      recentRegistrations: recentEmployees,
    });
  } catch (error) {
    console.error("DASHBOARD_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
