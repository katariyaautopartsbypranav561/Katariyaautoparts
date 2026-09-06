const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.production') });
const prisma = require('./db');

// High-quality Unsplash food images (stable, no API key needed)
const SLIDES = [
  {
    heroImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=85&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=720&h=900&q=85&fit=crop',
    gradient: 'from-amber-900/70 to-stone-900/50',
    tag: 'PREMIUM SPICES',
    badge: '🌶️ NEW HARVEST',
    title: 'Pure Kashmiri Saffron',
    subtitle: 'Handpicked from Pampore, Kashmir',
    cta: 'Shop Now',
  },
  {
    heroImage: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=1920&q=85&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=720&h=900&q=85&fit=crop',
    gradient: 'from-emerald-900/70 to-stone-900/50',
    tag: 'DRY FRUITS',
    badge: '🌰 CALIFORNIA',
    title: 'Jumbo Premium Almonds',
    subtitle: 'Crunchy, Fresh & Nutritious',
    cta: 'Shop Now',
  },
  {
    heroImage: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=1920&q=85&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=720&h=900&q=85&fit=crop',
    gradient: 'from-yellow-900/70 to-amber-900/50',
    tag: 'HEALTHY SEEDS',
    badge: '✨ ORGANIC',
    title: 'Chia & Flax Seeds',
    subtitle: 'Superfood Seeds for a Healthy Life',
    cta: 'Shop Now',
  },
];

async function main() {
  console.log('🌱 Seeding hero slides...');
  
  const existing = await prisma.slide.findMany();
  
  if (existing.length === 0) {
    // Create fresh slides
    for (const slide of SLIDES) {
      await prisma.slide.create({ data: slide });
    }
    console.log(`✅ Created ${SLIDES.length} new slides`);
  } else {
    // Update existing slides with images
    for (let i = 0; i < existing.length; i++) {
      const imageData = SLIDES[i % SLIDES.length];
      await prisma.slide.update({
        where: { id: existing[i].id },
        data: {
          heroImage: existing[i].heroImage || imageData.heroImage,
          mobileImage: existing[i].mobileImage || imageData.mobileImage,
        }
      });
    }
    console.log(`✅ Updated ${existing.length} existing slides with images`);
  }
  
  console.log('🎉 Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
