const express = require('express');
const router = express.Router();
const { adminAuth } = require('../firebaseAdmin');
const prisma = require('../db');

const jwt = require('jsonwebtoken');

// Middleware to verify Firebase/Google ID token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    if (adminAuth) {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
      return next();
    }
    
    // Fallback: If no Firebase admin is set up, just decode the Google JWT
    const decoded = jwt.decode(token);
    if (decoded && decoded.email) {
      req.user = { 
        uid: decoded.sub || 'google-' + Date.now(), 
        email: decoded.email,
        name: decoded.name
      };
      return next();
    }
    
    // Total fallback
    req.user = { uid: 'local-dev-uid', email: 'admin@katariya.com', name: 'Local Admin' };
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// POST /api/auth/check — check if an email is already registered in the DB
router.post('/check', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/me — get or auto-create user from Firebase token
// CRITICAL FIX: The first user to ever log in via Google/any method gets auto-promoted to admin
router.post('/me', verifyToken, async (req, res) => {
  try {
    let user = await prisma.user.findUnique({
      where: { firebaseId: req.user.uid }
    });

    if (!user) {
      // Auto-promote the very first user in the DB to admin
      const count = await prisma.user.count();
      const role = count === 0 ? 'admin' : 'user';

      user = await prisma.user.create({
        data: {
          firebaseId: req.user.uid,
          email: req.user.email,
          name: req.user.name || (req.user.email ? req.user.email.split('@')[0] : 'User'),
          role
        }
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/register — register a new user with name (email/password flow)
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Prevent duplicate registrations (e.g. if /me was called first)
    const existing = await prisma.user.findUnique({ where: { firebaseId: req.user.uid } });
    if (existing) {
      return res.json({ user: existing });
    }

    // Auto-promote the first user to admin
    const count = await prisma.user.count();
    const role = count === 0 ? 'admin' : 'user';

    const user = await prisma.user.create({
      data: {
        firebaseId: req.user.uid,
        email: email || req.user.email,
        name: name || req.user.name || 'User',
        role
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user in DB' });
  }
});

// POST /api/auth/promote-admin — emergency endpoint to promote any user to admin
// Requires a secret key set in server/.env as ADMIN_PROMOTE_SECRET
// Usage: curl -X POST http://localhost:3001/api/auth/promote-admin \
//        -H "Content-Type: application/json" \
//        -d '{"email":"you@example.com","secretKey":"primepets_admin_2024"}'
router.post('/promote-admin', async (req, res) => {
  try {
    const { email, secretKey } = req.body;

    const adminSecret = process.env.ADMIN_PROMOTE_SECRET || 'primepets_admin_2024';
    if (!secretKey || secretKey !== adminSecret) {
      return res.status(403).json({ error: 'Invalid secret key' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { role: 'admin' }
    });

    res.json({ success: true, message: `${email} has been promoted to admin`, user });
  } catch (error) {
    console.error('Error promoting user:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found. Please log in first so your account is created, then try again.' });
    }
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

// Attach verifyToken so other route files can import it from here if needed
router.verifyToken = verifyToken;
module.exports = router;
