import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AjeerCertificate from '@/components/ajeer/ajeer-certificate';

/**
 * AJEER VERIFICATION PAGE (SERVER COMPONENT)
 * Fetches data and passes it to the Client Certificate component.
 */
export default async function AjeerPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    notFound();
  }

  return <AjeerCertificate employee={employee as any} />;
}
