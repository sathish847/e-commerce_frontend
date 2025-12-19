const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to the slider data file
const SLIDER_DATA_PATH = path.join(__dirname, '../../src/data/hero-sliders/hero-slider-fourteen.json');

// GET /api/sliders - Get all sliders
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(SLIDER_DATA_PATH, 'utf8');
    const sliders = JSON.parse(data);
    res.json(sliders);
  } catch (error) {
    console.error('Error reading sliders:', error);
    res.status(500).json({ error: 'Failed to read sliders' });
  }
});

// PUT /api/sliders/:id - Update a specific slider
router.put('/:id', async (req, res) => {
  try {
    const sliderId = parseInt(req.params.id);
    const updatedSlider = req.body;

    // Read current data
    const data = await fs.readFile(SLIDER_DATA_PATH, 'utf8');
    const sliders = JSON.parse(data);

    // Find and update the slider
    const sliderIndex = sliders.findIndex(s => s.id === sliderId);
    if (sliderIndex === -1) {
      return res.status(404).json({ error: 'Slider not found' });
    }

    sliders[sliderIndex] = { ...sliders[sliderIndex], ...updatedSlider };

    // Write back to file
    await fs.writeFile(SLIDER_DATA_PATH, JSON.stringify(sliders, null, 2));

    res.json({ success: true, slider: sliders[sliderIndex] });
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({ error: 'Failed to update slider' });
  }
});

// POST /api/sliders - Add a new slider
router.post('/', async (req, res) => {
  try {
    const newSlider = req.body;

    // Read current data
    const data = await fs.readFile(SLIDER_DATA_PATH, 'utf8');
    const sliders = JSON.parse(data);

    // Generate new ID
    const newId = Math.max(...sliders.map(s => s.id), 0) + 1;
    newSlider.id = newId;

    sliders.push(newSlider);

    // Write back to file
    await fs.writeFile(SLIDER_DATA_PATH, JSON.stringify(sliders, null, 2));

    res.status(201).json({ success: true, slider: newSlider });
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({ error: 'Failed to create slider' });
  }
});

// DELETE /api/sliders/:id - Delete a slider
router.delete('/:id', async (req, res) => {
  try {
    const sliderId = parseInt(req.params.id);

    // Read current data
    const data = await fs.readFile(SLIDER_DATA_PATH, 'utf8');
    const sliders = JSON.parse(data);

    // Find and remove the slider
    const sliderIndex = sliders.findIndex(s => s.id === sliderId);
    if (sliderIndex === -1) {
      return res.status(404).json({ error: 'Slider not found' });
    }

    const deletedSlider = sliders.splice(sliderIndex, 1)[0];

    // Write back to file
    await fs.writeFile(SLIDER_DATA_PATH, JSON.stringify(sliders, null, 2));

    res.json({ success: true, slider: deletedSlider });
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({ error: 'Failed to delete slider' });
  }
});

module.exports = router;
