const express = require('express');
const socialMediaService = require('../services/socialMediaService');
const router = express.Router();

// GET /api/social-media/mock
router.get('/mock', async (req, res) => {
    const { disaster_id, keywords } = req.query;
    const reports = await socialMediaService.getMockSocialMediaReports(disaster_id || 'demo', keywords ? keywords.split(',') : []);
    res.json({ reports });
});

module.exports = router; 