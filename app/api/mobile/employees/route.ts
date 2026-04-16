import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where = search 
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { idNumber: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, employees] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          idNumber: true,
          photo: true,
          designation: true,
          department: true,
          permitNumber: true,
        }
      }),
    ]);

    // Foolproof origin and photo URL construction
    const host = req.headers.get('host') || 'localhost:3002';
    const origin = `http://${host}`; 

    const formattedEmployees = employees.map(emp => {
      if (!emp.photo) return { ...emp, photo: null };
      
      let photoPath = emp.photo;
      if (photoPath.startsWith('/uploads/')) {
        photoPath = photoPath.replace('/uploads/', '/api/uploads/');
      }
      
      return {
        ...emp,
        photo: photoPath.startsWith('http') ? photoPath : `${origin}${photoPath}`
      };
    });

    console.log("formattedEmployees", formattedEmployees);
    return NextResponse.json({
      employees: formattedEmployees,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("EMPLOYEE_LIST_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
