const axios = require('axios');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

class GeocodingService {
    constructor() {
        this.openStreetMapURL = 'https://nominatim.openstreetmap.org/search';
    }

    async geocode(locationName) {
        if (!locationName || locationName === 'Unknown location') {
            return { lat: null, lng: null, formatted_address: 'Unknown location' };
        }

        const cacheKey = cache.generateKey('geocoding', locationName);
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            // Use OpenStreetMap Nominatim for geocoding
            const result = await this.openStreetMapGeocode(locationName);
            if (result) {
                await cache.set(cacheKey, result);
                return result;
            }
            // Final fallback
            return { lat: null, lng: null, formatted_address: locationName };
        } catch (error) {
            logger.error('Geocoding error:', error.message);
            return { lat: null, lng: null, formatted_address: locationName };
        }
    }

    async openStreetMapGeocode(locationName) {
        try {
            const response = await axios.get(this.openStreetMapURL, {
                params: {
                    q: locationName,
                    format: 'json',
                    limit: 1
                },
                headers: {
                    'User-Agent': 'DisasterResponsePlatform/1.0'
                }
            });

            if (response.data && response.data.length > 0) {
                const result = response.data[0];
                logger.apiCall('OpenStreetMap', 'geocoding', 'success');
                return {
                    lat: parseFloat(result.lat),
                    lng: parseFloat(result.lon),
                    formatted_address: result.display_name,
                    provider: 'openstreetmap'
                };
            }
            logger.apiCall('OpenStreetMap', 'geocoding', 'no_results');
            return null;
        } catch (error) {
            logger.error('OpenStreetMap geocoding error:', error.message);
            logger.apiCall('OpenStreetMap', 'geocoding', 'error');
            return null;
        }
    }

    // Helper method to calculate distance between two points
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLng = this.deg2rad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Helper method to create PostGIS point
    createPostGISPoint(lat, lng) {
        if (lat && lng) {
            return `POINT(${lng} ${lat})`;
        }
        return null;
    }
}

module.exports = new GeocodingService(); 