const express = require('express');
const geminiService = require('../services/geminiService');
const geocodingService = require('../services/geocodingService');
const logger = require('../utils/logger');

const router = express.Router();

// POST /api/geocode
router.post('/', async (req, res) => {
    try {
        const { description, location_name } = req.body;
        let locName = location_name;
        if (!locName && description) {
            locName = await geminiService.extractLocation(description);
        }
        if (!locName) return res.status(400).json({ error: 'No location or description provided' });
        const geo = await geocodingService.geocode(locName);
        res.json({ location_name: locName, geocoding: geo });
    } catch (error) {
        logger.error('Geocoding endpoint error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 