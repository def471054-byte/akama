import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Unwrapping params (Required in Next.js 15+)
    const { id } = await params;
    
    // 2. Safety check for ID
    if (!id || id === 'undefined') {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        idNumber: true,
        permitNumber: true,
        photo: true,
        nationality: true,
        gender: true,
        company: true,
        issueDate: true,
        expiryDate: true,
        designation: true,
        department: true,
        verificationToken: true,
      }
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // 3. Robust origin detection
    const host = req.headers.get('host') || 'localhost:3002';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const origin = `${protocol}://${host}`; 

    const formattedEmployee = {
      ...employee,
      photo: employee.photo 
        ? (employee.photo.startsWith('http') ? employee.photo : `${origin}${employee.photo.startsWith('/uploads/') ? employee.photo.replace('/uploads/', '/api/uploads/') : employee.photo}`) 
        : null
    };

    return NextResponse.json(formattedEmployee);
  } catch (error: any) {
    console.error("EMPLOYEE_DETAILS_ERROR:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message 
    }, { status: 500 });
  }
}
