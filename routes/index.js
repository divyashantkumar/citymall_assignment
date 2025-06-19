const express = require('express');
const disasters = require('./disasters');
const resources = require('./resources');
const updates = require('./updates');
const verification = require('./verification');
const geocoding = require('./geocoding');
const socialMedia = require('./socialMedia');

const router = express.Router();

router.use('/disasters', disasters);
router.use('/resources', resources);
router.use('/updates', updates);
router.use('/verification', verification);
router.use('/geocode', geocoding);
router.use('/social-media', socialMedia);

module.exports = router; 