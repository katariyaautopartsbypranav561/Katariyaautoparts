const express = require('express');
const router = express.Router();
const prisma = require('../db');


router.get('/', async (req, res) => {
  try {
    const [userCount, productCount, categoryCount, dealCount, bannerCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.deal.count(),
      prisma.banner.count(),
      prisma.order.count()
    ]);

    let cloudinaryStats = {
      storageUsage: 0,
      bandwidthUsage: 0,
      mediaCount: 0,
      plan: 'Local Dev'
    };

    res.json({
      database: {
        users: userCount,
        products: productCount,
        categories: categoryCount,
        deals: dealCount,
        banners: bannerCount,
        orders: orderCount
      },
      cloudinary: cloudinaryStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
