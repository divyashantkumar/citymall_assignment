const express = require('express');
const geminiService = require('../services/geminiService');
const logger = require('../utils/logger');

const router = express.Router();

// POST /api/verification/:disasterId/verify-image
router.post('/:disasterId/verify-image', async (req, res) => {
    try {
        const { image_url } = req.body;
        if (!image_url) return res.status(400).json({ error: 'Image URL required' });
        const result = await geminiService.verifyImage(image_url);
        res.json({ verification: result });
    } catch (error) {
        logger.error('Image verification error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 