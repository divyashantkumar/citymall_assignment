const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/updates/:disasterId/official-updates
router.get('/:disasterId/official-updates', async (req, res) => {
    try {
        const { disasterId } = req.params;
        const cacheKey = cache.generateKey('official_updates', disasterId);
        const cached = await cache.get(cacheKey);
        if (cached) return res.json({ updates: cached, cached: true });

        // Example: Fetch from FEMA and Red Cross (can add more sources)
        const sources = [
            {
                name: 'FEMA',
                url: 'https://www.fema.gov/disaster-feed',
                selector: 'item title',
            },
            {
                name: 'Red Cross',
                url: 'https://www.redcross.org/about-us/news-and-events/news.html',
                selector: '.m-card__title',
            }
        ];
        const updates = [];
        for (const source of sources) {
            try {
                const { data } = await axios.get(source.url);
                const $ = cheerio.load(data);
                $(source.selector).each((i, el) => {
                    updates.push({
                        source: source.name,
                        title: $(el).text().trim(),
                    });
                });
            } catch (err) {
                logger.warn(`Failed to fetch from ${source.name}: ${err.message}`);
            }
        }
        await cache.set(cacheKey, updates);
        res.json({ updates, cached: false });
    } catch (error) {
        logger.error('Official updates error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 