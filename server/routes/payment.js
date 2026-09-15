const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../db');

// POST create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Server-Side Secret Management combined with API Proxy Pattern
    const settings = await prisma.frontendSetting.findFirst();
    const key_id = settings?.razorpayKeyId;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return res.status(400).json({ error: 'Razorpay is not fully configured on the server.' });
    }

    const instance = new Razorpay({ key_id, key_secret });
    const options = {
      amount: Math.round(amount), // in paise
      currency: 'INR',
      receipt: 'order_rcptid_' + Date.now()
    };
    
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST verify Razorpay payment signature
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!key_secret) {
      return res.status(500).json({ error: 'Server misconfiguration: missing RAZORPAY_KEY_SECRET' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', key_secret)
                                    .update(body.toString())
                                    .digest('hex');
                                    
    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Razorpay verify error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;
