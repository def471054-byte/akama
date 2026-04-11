const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateAjeerId() {
  const digits = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
  return `TQ${digits}`;
}

async function migrate() {
  const employees = await prisma.employee.findMany();

  console.log(`Checking ${employees.length} employees...`);

  for (const employee of employees) {
    if (!employee.ajeerId) {
      console.log(`Generating ID for ${employee.name}...`);
      
      let uniqueId = generateAjeerId();
      let exists = await prisma.employee.findUnique({ where: { ajeerId: uniqueId } });
      
      while (exists) {
        uniqueId = generateAjeerId();
        exists = await prisma.employee.findUnique({ where: { ajeerId: uniqueId } });
      }

      await prisma.employee.update({
        where: { id: employee.id },
        data: { ajeerId: uniqueId }
      });
      console.log(`Updated ${employee.name}: ${uniqueId}`);
    } else {
      console.log(`${employee.name} already has ajeerId: ${employee.ajeerId}`);
    }
  }

  console.log('Migration complete.');
  await prisma.$disconnect();
}

migrate().catch(e => {
  console.error(e);
  process.exit(1);
});
