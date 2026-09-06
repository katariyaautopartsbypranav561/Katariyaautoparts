const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all feeds
router.get('/', async (req, res) => {
  try {
    const feeds = await prisma.instagramFeed.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(feeds);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching instagram feeds' });
  }
});

// POST new feed
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    const feed = await prisma.instagramFeed.create({
      data: { url }
    });
    res.json(feed);
  } catch (error) {
    res.status(500).json({ error: 'Error creating feed' });
  }
});

// DELETE feed
router.delete('/:id', async (req, res) => {
  try {
    await prisma.instagramFeed.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting feed' });
  }
});

module.exports = router;
