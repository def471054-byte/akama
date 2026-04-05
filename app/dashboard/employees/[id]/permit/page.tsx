import { prisma } from "@/lib/prisma";
import PermitView from "@/components/employee/permit-view";
import { notFound } from "next/navigation";

export default async function PermitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    notFound();
  }

  return <PermitView employee={employee} />;
}
