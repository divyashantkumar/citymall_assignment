const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getSupabase } = require('../config/supabase');
const geocodingService = require('../services/geocodingService');
const logger = require('../utils/logger');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// GET /api/resources?lat=...&lon=...&radius=... - Geospatial query for resources
router.get('/', async (req, res) => {
    try {
        const { lat, lon, radius = 10, disaster_id } = req.query;
        const supabase = getSupabase();
        let query = supabase.from('resources').select('*');
        if (disaster_id) query = query.eq('disaster_id', disaster_id);
        if (lat && lon) {
            // Use PostGIS ST_DWithin for geospatial query (radius in km)
            query = query.filter('location', 'st_dwithin', `SRID=4326;POINT(${lon} ${lat}),${radius * 1000}`);
        }
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: 'Failed to fetch resources' });
        res.json({ resources: data });
    } catch (error) {
        logger.error('Resources GET error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/resources - Create a resource
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { disaster_id, name, location_name, type } = req.body;
        if (!disaster_id || !name || !location_name || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const geo = await geocodingService.geocode(location_name);
        const supabase = getSupabase();
        const { data, error } = await supabase.from('resources').insert({
            id: uuidv4(),
            disaster_id,
            name,
            location_name,
            location: geocodingService.createPostGISPoint(geo.lat, geo.lng),
            type
        }).select().single();
        if (error) return res.status(500).json({ error: 'Failed to create resource' });
        logger.resourceMapped(name, location_name);
        req.app.get('io').emit('resources_updated', { resource: data });
        res.status(201).json({ resource: data });
    } catch (error) {
        logger.error('Resource POST error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/resources/:id - Update a resource
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location_name, type } = req.body;
        const supabase = getSupabase();
        const { data: current, error: fetchError } = await supabase.from('resources').select('*').eq('id', id).single();
        if (fetchError || !current) return res.status(404).json({ error: 'Resource not found' });
        const updateData = {};
        if (name) updateData.name = name;
        if (type) updateData.type = type;
        if (location_name && location_name !== current.location_name) {
            const geo = await geocodingService.geocode(location_name);
            updateData.location_name = location_name;
            updateData.location = geocodingService.createPostGISPoint(geo.lat, geo.lng);
        }
        const { data, error } = await supabase.from('resources').update(updateData).eq('id', id).select().single();
        if (error) return res.status(500).json({ error: 'Failed to update resource' });
        req.app.get('io').emit('resources_updated', { resource: data });
        res.json({ resource: data });
    } catch (error) {
        logger.error('Resource PUT error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/resources/:id - Delete a resource
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const supabase = getSupabase();
        const { error } = await supabase.from('resources').delete().eq('id', id);
        if (error) return res.status(500).json({ error: 'Failed to delete resource' });
        req.app.get('io').emit('resources_updated', { resource_id: id, deleted: true });
        res.json({ message: 'Resource deleted' });
    } catch (error) {
        logger.error('Resource DELETE error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 