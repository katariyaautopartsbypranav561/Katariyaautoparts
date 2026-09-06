const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = JSON.parse(fs.readFileSync('seed_data.json', 'utf8'));

async function main() {
  console.log('Replacing products and categories from Excel data...');
  
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  for (const c of data.categories) {
    c.bg = 'bg-amber-100';
    await prisma.category.create({ data: c });
  }

  for (const p of data.products) {
    p.petType = 'Unknown';
    await prisma.product.create({ data: p });
  }

  console.log('Done mapping Excel data to database!');
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
