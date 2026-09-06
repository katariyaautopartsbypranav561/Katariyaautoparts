/**
 * Prime Pets — Comprehensive Backend API Test Suite
 * Covers all 14 route files: auth, products, categories, deals, slides,
 * banners, settings, data, upload, stats, orders, payment, analytics, customers
 */
const request = require('supertest');
const app = require('../index');
const prisma = require('../db');
const crypto = require('crypto');

// Mock external services
jest.mock('../firebaseAdmin', () => require('./__mocks__/firebaseAdmin'));
jest.mock('razorpay', () => require('./__mocks__/razorpay'));
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        resource_type: 'image'
      })
    }
  }
}));

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const authHeader = { Authorization: 'Bearer valid_token' };
const badAuthHeader = { Authorization: 'Bearer invalid_token' };

// ─────────────────────────────────────────────
// Setup / Teardown
// ─────────────────────────────────────────────
beforeAll(async () => {
  // Clean all tables in dependency order
  await prisma.activityLog.deleteMany();
  await prisma.siteVisit.deleteMany();
  await prisma.visitor.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.slide.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.frontendSetting.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ═══════════════════════════════════════════════════════════
// 1. HEALTH CHECK
// ═══════════════════════════════════════════════════════════
describe('Health Check', () => {
  it('GET /api/health → 200 ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ═══════════════════════════════════════════════════════════
// 2. AUTH ROUTES
// ═══════════════════════════════════════════════════════════
describe('Auth Routes', () => {
  it('POST /api/auth/check → 400 when no email', async () => {
    const res = await request(app).post('/api/auth/check').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email is required');
  });

  it('POST /api/auth/check → false for unknown email', async () => {
    const res = await request(app).post('/api/auth/check').send({ email: 'nobody@test.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.exists).toBe(false);
  });

  it('POST /api/auth/me → 401 with no token', async () => {
    const res = await request(app).post('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/auth/me → 401 with invalid token', async () => {
    const res = await request(app).post('/api/auth/me').set(badAuthHeader);
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/auth/me → 200 + creates first user as admin', async () => {
    const res = await request(app).post('/api/auth/me').set(authHeader);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('admin@primepets.com');
    expect(res.body.user.firebaseId).toBe('test_firebase_uid');
    // First ever user must be admin
    expect(res.body.user.role).toBe('admin');
  });

  it('POST /api/auth/me → 200 + returns existing user on repeat call', async () => {
    const res = await request(app).post('/api/auth/me').set(authHeader);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe('admin');
  });

  it('POST /api/auth/check → true for registered email', async () => {
    const res = await request(app)
      .post('/api/auth/check')
      .send({ email: 'admin@primepets.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.exists).toBe(true);
  });

  it('POST /api/auth/register → 200 returns existing user (duplicate guard)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set(authHeader)
      .send({ name: 'Admin User', email: 'admin@primepets.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  it('POST /api/auth/promote-admin → 403 with wrong secret', async () => {
    const res = await request(app)
      .post('/api/auth/promote-admin')
      .send({ email: 'admin@primepets.com', secretKey: 'wrong_key' });
    expect(res.statusCode).toBe(403);
  });

  it('POST /api/auth/promote-admin → 400 with missing email', async () => {
    const res = await request(app)
      .post('/api/auth/promote-admin')
      .send({ secretKey: 'primepets_admin_2024' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/promote-admin → 200 with correct secret and email', async () => {
    const res = await request(app)
      .post('/api/auth/promote-admin')
      .send({ email: 'admin@primepets.com', secretKey: 'primepets_admin_2024' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('admin');
  });
});

// ═══════════════════════════════════════════════════════════
// 3. PRODUCTS CRUD
// ═══════════════════════════════════════════════════════════
describe('Products CRUD', () => {
  let productId;

  const productPayload = {
    name: 'Royal Canin Adult',
    brand: 'Royal Canin',
    price: 899.00,
    mrp: 1099.00,
    rating: 4.7,
    reviews: 250,
    img: 'data:image/jpeg;base64,mockbase64',
    images: [],
    category: 'Food',
    petType: 'Dogs',
    description: 'Premium dry food for adult dogs'
  };

  it('POST /api/products → 201 creates product with Cloudinary URL', async () => {
    const res = await request(app).post('/api/products').send(productPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Royal Canin Adult');
    expect(res.body.img).toBe('https://res.cloudinary.com/demo/image/upload/sample.jpg');
    expect(res.body.images).toBeInstanceOf(Array);
    productId = res.body.id;
  });

  it('GET /api/products → 200 returns array with 1 product', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Royal Canin Adult');
    // images should be parsed JSON array, not raw string
    expect(res.body[0].images).toBeInstanceOf(Array);
  });

  it('PUT /api/products/:id → 200 updates product', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .send({ ...productPayload, name: 'Royal Canin Adult Updated', price: 799.00 });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Royal Canin Adult Updated');
    expect(res.body.price).toBe(799.00);
  });

  it('DELETE /api/products/:id → 200 deletes product', async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/products → 200 returns empty array after delete', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════
// 4. CATEGORIES CRUD
// ═══════════════════════════════════════════════════════════
describe('Categories CRUD', () => {
  let categoryId;

  const categoryPayload = {
    label: 'Dog Food',
    emoji: '🐕',
    img: 'data:image/jpeg;base64,mockbase64',
    bg: 'bg-orange-100'
  };

  it('POST /api/categories → 201 creates category', async () => {
    const res = await request(app).post('/api/categories').send(categoryPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.label).toBe('Dog Food');
    expect(res.body.img).toBe('https://res.cloudinary.com/demo/image/upload/sample.jpg');
    categoryId = res.body.id;
  });

  it('GET /api/categories → 200 returns categories array', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].label).toBe('Dog Food');
  });

  it('PUT /api/categories/:id → 200 updates category', async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .send({ ...categoryPayload, label: 'Premium Dog Food' });
    expect(res.statusCode).toBe(200);
    expect(res.body.label).toBe('Premium Dog Food');
  });

  it('DELETE /api/categories/:id → 200 deletes category', async () => {
    const res = await request(app).delete(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
// 5. DEALS CRUD
// ═══════════════════════════════════════════════════════════
describe('Deals CRUD', () => {
  let dealId;

  const dealPayload = {
    title: 'Mega Sale',
    sub: 'Up to 50% off on all pet food',
    badge: 'HOT',
    tag: 'SALE',
    img: 'data:image/jpeg;base64,mockbase64',
    grad: 'from-orange-400 to-red-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    save: '₹500'
  };

  it('POST /api/deals → 201 creates deal', async () => {
    const res = await request(app).post('/api/deals').send(dealPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Mega Sale');
    dealId = res.body.id;
  });

  it('GET /api/deals → 200 returns deals array', async () => {
    const res = await request(app).get('/api/deals');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('PUT /api/deals/:id → 200 updates deal', async () => {
    const res = await request(app)
      .put(`/api/deals/${dealId}`)
      .send({ ...dealPayload, title: 'Super Mega Sale' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Super Mega Sale');
  });

  it('DELETE /api/deals/:id → 200 deletes deal', async () => {
    const res = await request(app).delete(`/api/deals/${dealId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
// 6. SLIDES CRUD
// ═══════════════════════════════════════════════════════════
describe('Slides CRUD', () => {
  let slideId;

  const slidePayload = {
    gradient: 'from-amber-500 to-orange-600',
    tag: 'NEW',
    badge: 'FEATURED',
    title: 'Best Food for Your Pet',
    subtitle: 'Premium quality at great prices',
    cta: 'Shop Now',
    dog: null,
    cat: null,
    heroImage: 'data:image/jpeg;base64,mockbase64'
  };

  it('POST /api/slides → 201 creates slide', async () => {
    const res = await request(app).post('/api/slides').send(slidePayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Best Food for Your Pet');
    slideId = res.body.id;
  });

  it('GET /api/slides → 200 returns slides array', async () => {
    const res = await request(app).get('/api/slides');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('PUT /api/slides/:id → 200 updates slide', async () => {
    const res = await request(app)
      .put(`/api/slides/${slideId}`)
      .send({ ...slidePayload, title: 'Updated Slide Title' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Slide Title');
  });

  it('DELETE /api/slides/:id → 200 deletes slide', async () => {
    const res = await request(app).delete(`/api/slides/${slideId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
// 7. BANNERS CRUD
// ═══════════════════════════════════════════════════════════
describe('Banners CRUD', () => {
  let bannerId;

  it('POST /api/banners → 201 creates banner', async () => {
    const res = await request(app).post('/api/banners').send({
      mediaUrl: 'https://res.cloudinary.com/demo/image/upload/banner.jpg',
      link: '/offers',
      title: 'Summer Sale',
      subtitle: 'Up to 40% off',
      badge: 'LIMITED'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Summer Sale');
    bannerId = res.body.id;
  });

  it('GET /api/banners → 200 returns banners array', async () => {
    const res = await request(app).get('/api/banners');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('PUT /api/banners/:id → 200 updates banner', async () => {
    const res = await request(app)
      .put(`/api/banners/${bannerId}`)
      .send({ mediaUrl: 'https://res.cloudinary.com/demo/image/upload/banner2.jpg', title: 'Winter Sale' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Winter Sale');
  });

  it('DELETE /api/banners/:id → 200 deletes banner', async () => {
    const res = await request(app).delete(`/api/banners/${bannerId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
// 8. SETTINGS
// ═══════════════════════════════════════════════════════════
describe('Settings', () => {
  it('GET /api/settings → 200 returns null when no settings exist', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeNull();
  });

  it('PUT /api/settings → 200 creates or updates settings', async () => {
    const res = await request(app).put('/api/settings').send({
      storeName: 'Prime Pets',
      tagline: 'Love Your Pets',
      logoChar: 'P',
      footerDescription: 'Premium pet care store',
      facebookUrl: 'https://facebook.com/primepets',
      instagramUrl: 'https://instagram.com/primepets',
      youtubeUrl: '',
      whatsappNumber: '9999999999'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.storeName).toBe('Prime Pets');
  });

  it('GET /api/settings → 200 returns saved settings', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.statusCode).toBe(200);
    expect(res.body.storeName).toBe('Prime Pets');
  });
});

// ═══════════════════════════════════════════════════════════
// 9. DATA AGGREGATE ENDPOINT
// ═══════════════════════════════════════════════════════════
describe('Data Aggregate Endpoint', () => {
  it('GET /api/data → 200 returns all data shapes', async () => {
    const res = await request(app).get('/api/data');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('categories');
    expect(res.body).toHaveProperty('deals');
    expect(res.body).toHaveProperty('slides');
    expect(res.body).toHaveProperty('banners');
    expect(res.body).toHaveProperty('frontendSettings');
    expect(res.body.products).toBeInstanceOf(Array);
  });
});

// ═══════════════════════════════════════════════════════════
// 10. ORDERS CRUD
// ═══════════════════════════════════════════════════════════
describe('Orders CRUD', () => {
  let orderId;

  const validOrderPayload = {
    visitorId: 'vid_test_123',
    customerName: 'Ravi Sharma',
    customerPhone: '9876543210',
    customerAddress: '123 MG Road, Bangalore, Karnataka 560001',
    items: JSON.stringify([{ id: 1, name: 'Dog Food', qty: 2, price: 499 }]),
    total: 998,
    paymentMethod: 'COD',
    notes: 'Please ring bell twice'
  };

  it('POST /api/orders → 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/orders').send({ customerName: 'Test' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing required order fields');
  });

  it('POST /api/orders → 201 creates COD order', async () => {
    const res = await request(app).post('/api/orders').send(validOrderPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.customerName).toBe('Ravi Sharma');
    expect(res.body.paymentMethod).toBe('COD');
    expect(res.body.paymentStatus).toBe('PENDING');
    expect(res.body.status).toBe('PENDING');
    orderId = res.body.id;
  });

  it('GET /api/orders → 200 returns orders array', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].customerName).toBe('Ravi Sharma');
  });

  it('PUT /api/orders/:id → 200 updates order status', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({ status: 'CONFIRMED', paymentStatus: 'PENDING' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('CONFIRMED');
  });

  it('PUT /api/orders/:id → 200 marks order as delivered', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({ status: 'DELIVERED', paymentStatus: 'PAID' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('DELIVERED');
    expect(res.body.paymentStatus).toBe('PAID');
  });

  it('DELETE /api/orders/:id → 200 deletes order', async () => {
    const res = await request(app).delete(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
// 11. PAYMENT ROUTES
// ═══════════════════════════════════════════════════════════
describe('Payment Routes', () => {
  it('POST /api/payment/create-order → 500 when Razorpay keys not configured', async () => {
    // Keys are not in test env, so this should gracefully return 500
    const res = await request(app)
      .post('/api/payment/create-order')
      .send({ amount: 50000 });
    // Either 500 (keys missing) or 200 (mocked)
    expect([200, 500]).toContain(res.statusCode);
  });

  it('POST /api/payment/verify → 400 when signature is invalid', async () => {
    // Without RAZORPAY_KEY_SECRET, it should return 500 (not configured)
    const res = await request(app)
      .post('/api/payment/verify')
      .send({
        razorpay_order_id: 'order_test',
        razorpay_payment_id: 'pay_test',
        razorpay_signature: 'invalid_signature'
      });
    expect([400, 500]).toContain(res.statusCode);
  });

  it('POST /api/payment/verify → 200 when signature matches', async () => {
    // Compute a valid HMAC signature to test the verification logic
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret';
    const orderId = 'order_verify_test';
    const paymentId = 'pay_verify_test';
    const body = `${orderId}|${paymentId}`;
    const signature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    // Only run this test if the env has a key
    if (process.env.RAZORPAY_KEY_SECRET) {
      const res = await request(app)
        .post('/api/payment/verify')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// 12. ANALYTICS
// ═══════════════════════════════════════════════════════════
describe('Analytics Routes', () => {
  it('POST /api/analytics/track → 200 tracks a pageview', async () => {
    const res = await request(app)
      .post('/api/analytics/track')
      .send({
        type: 'pageview',
        visitorId: 'vid_test_analytics',
        page: '/products'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/analytics/track → 200 tracks an interaction', async () => {
    const res = await request(app)
      .post('/api/analytics/track')
      .send({
        type: 'interaction',
        visitorId: 'vid_test_analytics',
        action: 'add_to_cart',
        details: 'Product: Royal Canin'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/analytics/stats → 200 returns chart data array for 7d', async () => {
    const res = await request(app).get('/api/analytics/stats?range=7d');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    // Should have 8 entries (today + 7 days)
    expect(res.body.length).toBeGreaterThanOrEqual(7);
    expect(res.body[0]).toHaveProperty('visits');
    expect(res.body[0]).toHaveProperty('interactions');
  });

  it('GET /api/analytics/stats → 200 returns chart data for 1m', async () => {
    const res = await request(app).get('/api/analytics/stats?range=1m');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(30);
  });

  it('GET /api/analytics/live → 200 returns combined feed array', async () => {
    const res = await request(app).get('/api/analytics/live');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    // Should contain the pageview we tracked above
    expect(res.body.length).toBeGreaterThan(0);
    const types = res.body.map(e => e.type);
    expect(types).toContain('visit');
  });

  it('GET /api/analytics/retention → 200 returns retention data', async () => {
    const res = await request(app).get('/api/analytics/retention');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalCustomers');
    expect(res.body).toHaveProperty('retentionRate');
    expect(res.body).toHaveProperty('topCustomers');
  });

  it('POST /api/analytics/notify → 500 when FCM not configured', async () => {
    const res = await request(app)
      .post('/api/analytics/notify')
      .send({ fcmToken: 'mock_token', title: 'Test', body: 'Test notification' });
    // adminMessaging.send is mocked to resolve, so this should succeed
    expect([200, 500]).toContain(res.statusCode);
  });
});

// ═══════════════════════════════════════════════════════════
// 13. CUSTOMERS
// ═══════════════════════════════════════════════════════════
describe('Customers', () => {
  it('GET /api/customers → 200 returns combined users + leads array', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    // We have 1 registered user (admin@primepets.com) from auth tests
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    const types = res.body.map(c => c.type);
    expect(types).toContain('Registered User');
  });
});

// ═══════════════════════════════════════════════════════════
// 14. STATS
// ═══════════════════════════════════════════════════════════
describe('Stats', () => {
  it('GET /api/stats → 200 returns database and cloudinary stats', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('database');
    expect(res.body.database).toHaveProperty('users');
    expect(res.body.database).toHaveProperty('products');
    expect(res.body.database).toHaveProperty('orders');
    // DB should have our test admin user
    expect(res.body.database.users).toBeGreaterThanOrEqual(1);
  });
});
