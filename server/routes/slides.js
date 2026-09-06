const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all slides
router.get('/', async (req, res) => {
  try {
    const slides = await prisma.slide.findMany();
    res.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    res.status(500).json({ error: 'Failed to fetch slides' });
  }
});

// POST new slide
router.post('/', async (req, res) => {
  try {
    const { heroImage, mobileImage } = req.body;

    const slide = await prisma.slide.create({
      data: {
        heroImage: heroImage || '',
        mobileImage: mobileImage || ''
      }
    });

    res.status(201).json(slide);
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({ error: 'Failed to create slide' });
  }
});

// PUT update slide
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { heroImage, mobileImage } = req.body;

    const slide = await prisma.slide.update({
      where: { id: Number(id) },
      data: {
        heroImage: heroImage || '',
        mobileImage: mobileImage !== undefined ? mobileImage : ''
      }
    });

    res.json(slide);
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ error: 'Failed to update slide' });
  }
});

// DELETE slide
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.slide.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({ error: 'Failed to delete slide' });
  }
});

module.exports = router;
