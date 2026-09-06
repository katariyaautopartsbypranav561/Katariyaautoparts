const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  let updated = 0;

  for (const p of products) {
    if (!p.variants || p.variants === '[]' || p.variants === '') {
      const isLiquid = p.category === 'Sharbat & Beverages' || 
                       p.category === 'Pure Ghee & Oils' || 
                       p.name.toLowerCase().includes('syrup') ||
                       p.name.toLowerCase().includes('oil') ||
                       p.name.toLowerCase().includes('water') ||
                       p.name.toLowerCase().includes('ghee') ||
                       p.name.toLowerCase().includes('honey');

      const basePrice = p.price;
      const baseMrp = p.mrp || Math.round(basePrice * 1.3);

      let newVariants = [];
      if (isLiquid) {
        newVariants = [
          { label: '100ml', price: Math.round(basePrice * 0.5), mrp: Math.round(baseMrp * 0.5) },
          { label: '250ml', price: basePrice, mrp: baseMrp },
          { label: '500ml', price: Math.round(basePrice * 1.85), mrp: Math.round(baseMrp * 1.85) },
          { label: '1L', price: Math.round(basePrice * 3.5), mrp: Math.round(baseMrp * 3.5) },
          { label: '5L Can', price: Math.round(basePrice * 16.0), mrp: Math.round(baseMrp * 16.0) },
        ];
      } else {
        newVariants = [
          { label: '100g', price: Math.round(basePrice * 0.5), mrp: Math.round(baseMrp * 0.5) },
          { label: '250g', price: basePrice, mrp: baseMrp },
          { label: '500g', price: Math.round(basePrice * 1.85), mrp: Math.round(baseMrp * 1.85) },
          { label: '1kg', price: Math.round(basePrice * 3.5), mrp: Math.round(baseMrp * 3.5) },
          { label: '5kg Box', price: Math.round(basePrice * 16.0), mrp: Math.round(baseMrp * 16.0) },
        ];
      }

      await prisma.product.update({
        where: { id: p.id },
        data: { variants: JSON.stringify(newVariants) }
      });
      updated++;
      console.log(`Updated ${p.name} with ${isLiquid ? 'liquid' : 'solid'} variants`);
    }
  }

  console.log(`Finished. Updated ${updated} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
