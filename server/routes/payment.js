const express = require('express');
const router = express.Router();

// POST create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    res.json({ orderId: 'dummy_order_' + Date.now(), amount: Math.round(amount), currency: 'INR' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST verify Razorpay payment signature
router.post('/verify', async (req, res) => {
  res.json({ success: true, message: 'Payment verified successfully (Mock)' });
});

module.exports = router;
