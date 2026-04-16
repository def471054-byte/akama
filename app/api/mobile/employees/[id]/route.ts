import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const origin = new URL(req.url).origin;
    const formattedEmployee = {
      ...employee,
      photo: employee.photo 
        ? `${origin}${employee.photo.startsWith('/uploads/') ? employee.photo.replace('/uploads/', '/api/uploads/') : employee.photo}` 
        : null
    };

    return NextResponse.json(formattedEmployee);
  } catch (error) {
    console.error("EMPLOYEE_DETAILS_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
