import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
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

    const host = req.headers.get('host') || 'localhost:3002';
    const origin = `http://${host}`; 

    const formattedRecent = recentEmployees.map(emp => ({
      ...emp,
      photo: emp.photo 
        ? (emp.photo.startsWith('http') ? emp.photo : `${origin}${emp.photo.startsWith('/uploads/') ? emp.photo.replace('/uploads/', '/api/uploads/') : emp.photo}`) 
        : null
    }));

    return NextResponse.json({
      stats: [
        { label: "Verified Employees", value: employeeCount },
        { label: "System Status", value: "Green" },
        { label: "Current Cycle", value: "Hajj 1447H" },
      ],
      recentRegistrations: formattedRecent,
    });
  } catch (error: any) {
    console.error("DASHBOARD_ERROR:", error);
    return NextResponse.json({ error: "Internal server error", message: error.message }, { status: 500 });
  }
}
