import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const verificationToken = crypto.randomBytes(32).toString("base64url");

    const employee = await prisma.employee.create({
      data: {
        ...data,
        verificationToken,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
