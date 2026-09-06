const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const seedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seed_data_full.json'), 'utf8'));

const prisma = new PrismaClient();

const SLIDES = [
  {
    gradient: 'from-[#1a2e6e] via-[#2563eb] to-[#1a2e6e]',
    tag: '🔧 Genuine Spare Parts',
    badge: 'OEM QUALITY GUARANTEED',
    title: 'POWER YOUR RIDE',
    subtitle: 'Hero, Bajaj, TVS, Royal Enfield, Yamaha, Honda & More — Genuine Parts at Best Prices',
    cta: 'SHOP NOW',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=800&fit=crop',
  },
  {
    gradient: 'from-[#111827] via-[#1f2937] to-[#374151]',
    tag: '⚙️ Engine & Transmission',
    badge: 'CERTIFIED GENUINE PARTS',
    title: 'KEEP YOUR ENGINE ROARING',
    subtitle: 'Piston Kits, Crankshafts, Gearbox Parts — All Major Bike Brands',
    cta: 'EXPLORE ENGINE PARTS',
    heroImage: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&h=800&fit=crop',
  },
  {
    gradient: 'from-[#0f172a] via-[#1e3a5f] to-[#1a2e6e]',
    tag: '🛞 Body & Frame Parts',
    badge: 'ALL WEATHER GUARANTEE',
    title: 'STYLE MEETS STRENGTH',
    subtitle: 'Fairings, Fenders, Mirrors, Footrests — Perfect Fit for Your Bike',
    cta: 'SHOP BODY PARTS',
    heroImage: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1600&h=800&fit=crop',
  },
  {
    gradient: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    tag: '💡 Electrical & Lights',
    badge: 'PLUG & PLAY COMPATIBLE',
    title: 'LIGHT UP THE ROAD',
    subtitle: 'Headlights, Indicators, CDI Units, Wiring Harness — Top Brands',
    cta: 'BROWSE ELECTRICALS',
    heroImage: 'https://images.unsplash.com/photo-1558618047-f4be6b2f1c0c?w=1600&h=800&fit=crop',
  },
  {
    gradient: 'from-[#064e3b] via-[#065f46] to-[#047857]',
    tag: '🔩 Brakes & Suspension',
    badge: 'SAFETY CERTIFIED',
    title: 'STOP ON A DIME',
    subtitle: 'Brake Shoes, Disc Pads, Shock Absorbers, Fork Oil — Ride Safe',
    cta: 'SHOP SAFETY PARTS',
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=800&fit=crop',
  }
];

const BANNERS = [
  {
    mediaUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop',
    link: '/category',
    title: 'Genuine Hero Bike Parts',
    subtitle: 'Splendor, HF Deluxe, Passion — OEM Parts Available',
    badge: '🏍️ HERO PARTS'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=400&fit=crop',
    link: '/category',
    title: 'Royal Enfield Accessories',
    subtitle: 'Classic, Bullet, Himalayan — Authentic Spare Parts',
    badge: '🛵 ROYAL ENFIELD'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1200&h=400&fit=crop',
    link: '/category',
    title: 'Bajaj & TVS Parts',
    subtitle: 'Pulsar, Apache, Jupiter — Fast Delivery Across India',
    badge: '⚡ BAJAJ & TVS'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=400&fit=crop',
    link: '/offers',
    title: 'Flat 15% Off on Bulk Orders',
    subtitle: 'Order 5+ parts and save big — Workshop Owners Discount',
    badge: '💰 BULK DISCOUNT'
  }
];

const DEALS = [
  {
    title: 'UP TO 20% OFF',
    sub: 'ENGINE OIL FILTERS',
    badge: '🔧 Filters',
    tag: 'Genuine Parts',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    grad: 'from-[#1a2e6e] to-[#2563eb]',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    save: 'Save ₹200'
  },
  {
    title: 'UP TO 25% OFF',
    sub: 'BRAKE SHOES & PADS',
    badge: '🛑 Brakes',
    tag: 'Safety First',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
    grad: 'from-[#b91c1c] to-[#7f1d1d]',
    bg: '#FEF2F2',
    border: '#FECACA',
    save: 'Save ₹350'
  },
  {
    title: 'BUY 1 GET 1',
    sub: 'SPARK PLUGS',
    badge: '⚡ Electrical',
    tag: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
    grad: 'from-[#d97706] to-[#92400e]',
    bg: '#FFFBEB',
    border: '#FDE68A',
    save: 'Save ₹180'
  },
  {
    title: 'FLAT 15% OFF',
    sub: 'CHAIN SPROCKET KITS',
    badge: '⚙️ Drivetrain',
    tag: 'Popular',
    img: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400&h=300&fit=crop',
    grad: 'from-[#065f46] to-[#064e3b]',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    save: 'Save ₹280'
  }
];

const FRONTEND_SETTINGS = {
  storeName: 'Katariya Auto Parts',
  tagline: 'Your Trusted Spare Parts Partner',
  logoChar: 'K',
  footerDescription: 'Katariya Auto Parts — Genuine OEM spare parts for Hero, Bajaj, TVS, Royal Enfield, Yamaha, Honda, KTM and more. Serving riders since 2010.',
  facebookUrl: 'https://facebook.com/katariyaautoparts',
  instagramUrl: 'https://instagram.com/katariyaautoparts',
  youtubeUrl: 'https://youtube.com/@katariyaautoparts',
  whatsappNumber: '+919876543210',
  contactEmail: 'support@katariyaautoparts.com',
  contactPhone: '+91 98765 43210',
  whatsappOrderNumber: '919876543210',
};

async function main() {
  console.log('🌱 Seeding Katariya Auto Parts database...');

  // Clear existing data
  await prisma.slide.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.frontendSetting.deleteMany({});
  console.log('✅ Cleared existing data');

  // Create slides
  for (const slide of SLIDES) {
    await prisma.slide.create({ data: slide });
  }
  console.log(`✅ Created ${SLIDES.length} slides`);

  // Create banners
  for (const banner of BANNERS) {
    await prisma.banner.create({ data: banner });
  }
  console.log(`✅ Created ${BANNERS.length} banners`);

  // Create deals
  for (const deal of DEALS) {
    await prisma.deal.create({ data: deal });
  }
  console.log(`✅ Created ${DEALS.length} deals`);

  // Create specific categories based on partonwheels structure
  const categories = seedData.categories.map(c => ({
    label: c.label,
    emoji: '🔧',
    bg: '#EFF6FF',
    img: c.img || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop'
  }));

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create products from seed_data_full.json (from partonwheels.com)
  const products = seedData.products || [];
  
  // Use createMany in chunks for performance
  const CHUNK_SIZE = 500;
  let count = 0;
  
  for (let i = 0; i < products.length; i += CHUNK_SIZE) {
    const chunk = products.slice(i, i + CHUNK_SIZE);
    
    const productsToInsert = chunk.map(product => ({
      name: product.name,
      brand: product.brand || 'Katariya Auto Parts',
      price: product.price || 199,
      mrp: product.mrp || product.price || 199,
      rating: product.rating || 4.5,
      reviews: product.reviews || 12,
      img: product.img || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
      tag: product.tag || 'Genuine',
      badge: product.badge || 'In Stock',
      category: product.category || 'Accessories',
      description: product.description || product.name,
    }));
    
    const result = await prisma.product.createMany({
      data: productsToInsert,
    });
    
    count += result.count;
    console.log(`✅ Seeded ${count}/${products.length} products...`);
  }
  console.log(`✅ Created ${count} products from partonwheels.com`);

  // Create frontend settings
  await prisma.frontendSetting.create({ data: FRONTEND_SETTINGS });
  console.log('✅ Created frontend settings');

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@katariya.com' },
    update: {},
    create: {
      firebaseId: 'local-dev-uid',
      email: 'admin@katariya.com',
      name: 'Admin',
      role: 'admin'
    }
  });
  console.log('✅ Created admin user (admin@katariya.com)');

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
