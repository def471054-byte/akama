import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    // Remove ID and other immutable fields if they exist in data
    const { id: _, createdAt, ...updateData } = data;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        ...updateData,
        issueDate: updateData.issueDate ? new Date(updateData.issueDate) : null,
        expiryDate: updateData.expiryDate ? new Date(updateData.expiryDate) : null,
        birthDate: updateData.birthDate ? new Date(updateData.birthDate) : null,
        bloodType: updateData.bloodType || null,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if the employee exists first to avoid P2025 errors
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to delete employee",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
