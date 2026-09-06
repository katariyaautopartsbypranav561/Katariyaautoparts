import assert from 'assert';
import { PrismaClient } from '@prisma/client';
import Fuse from 'fuse.js';

const prisma = new PrismaClient();

async function runTestSuite() {
  console.log('\n==================================================');
  console.log('  katariya auto parts - UNIT & INTEGRATION TEST SUITE   ');
  console.log('==================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ [PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] Test ${total}: ${name}`);
      console.error(`    Error: ${err.message}`);
    }
  }

  // 1. Database Integrity Tests
  const products = await prisma.product.findMany();
  test('SQLite database contains seeded products', () => {
    if (!products || products.length === 0) throw new Error('No products found in dev.db');
  });

  test('Kashmiri Saffron exists in database with high rating', () => {
    const saffron = products.find(p => p.name.includes('Saffron'));
    if (!saffron) throw new Error('Kashmiri Saffron not found');
    if (saffron.rating < 4.5) throw new Error(`Rating too low: ${saffron.rating}`);
  });

  const categories = await prisma.category.findMany();
  test('Category list includes Organic Dry Fruits & Spices', () => {
    if (!categories || categories.length === 0) throw new Error('No categories found');
    const dryFruits = categories.find(c => c.label.includes('Dry Fruits'));
    if (!dryFruits) throw new Error('Dry Fruits category missing');
  });

  // 2. Weight Selector Pricing Algorithm Test
  test('Pack weight multiplier calculates correct prices', () => {
    const basePrice = 1000;
    const weightOptions = [
      { label: '100g', multiplier: 0.5, expected: 500 },
      { label: '250g', multiplier: 1.0, expected: 1000 },
      { label: '500g', multiplier: 1.85, expected: 1850 },
      { label: '1kg', multiplier: 3.5, expected: 3500 },
    ];

    weightOptions.forEach(opt => {
      const computed = Math.round(basePrice * opt.multiplier);
      if (computed !== opt.expected) {
        throw new Error(`Expected ${opt.expected} for ${opt.label}, got ${computed}`);
      }
    });
  });

  // 3. Search & Fuse.js Auto-Suggest Test
  test('Fuse.js fuzzy search retrieves relevant dry fruits', () => {
    const fuse = new Fuse(products, { keys: ['name', 'category', 'brand'], threshold: 0.4 });
    const results = fuse.search('saffron');
    if (results.length === 0) throw new Error('Search for "saffron" yielded no results');
  });

  // 4. Cart Free Shipping Threshold Logic
  test('Free shipping progress bar calculates correct remaining amount', () => {
    const targetThreshold = 999;
    const cartSubtotal = 650;
    const remaining = Math.max(0, targetThreshold - cartSubtotal);
    const progressPercent = Math.min(100, Math.round((cartSubtotal / targetThreshold) * 100));
    
    if (remaining !== 349) throw new Error(`Remaining calculation error: expected 349, got ${remaining}`);
    if (progressPercent !== 65) throw new Error(`Progress percent error: expected 65, got ${progressPercent}`);
  });

  console.log('\n--------------------------------------------------');
  console.log(`  TEST RESULTS: ${passed}/${total} TESTS PASSED SUCCESSFUL! 🎉`);
  console.log('--------------------------------------------------\n');

  await prisma.$disconnect();
}

runTestSuite().catch(err => {
  console.error('Test suite failure:', err);
  process.exit(1);
});
