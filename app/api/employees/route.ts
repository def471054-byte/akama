import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (token) {
      const employee = await prisma.employee.findUnique({
        where: { verificationToken: token },
      });
      return NextResponse.json(employee);
    }

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
        issueDate: data.issueDate || null,
        expiryDate: data.expiryDate || null,
        birthDate: data.birthDate || null,
        bloodType: data.bloodType || null,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
