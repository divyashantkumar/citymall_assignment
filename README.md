# Disaster Response Coordination Platform

A comprehensive MERN stack application for disaster response coordination with real-time data aggregation, geospatial queries, and AI-powered features.

## Features

### Backend Features

- **Disaster Management**: Full CRUD operations with audit trails
- **Location Extraction**: AI-powered location extraction using Google Gemini API
- **Geocoding**: Convert location names to coordinates using Google Maps/OpenStreetMap
- **Social Media Monitoring**: Mock Twitter API with real-time updates
- **Geospatial Resource Mapping**: Find resources near disaster locations
- **Official Updates**: Web scraping from government/relief websites
- **Image Verification**: AI-powered image authenticity verification
- **Caching**: Supabase-based caching for API responses
- **Real-time Updates**: WebSocket integration for live updates
- **Rate Limiting**: API rate limiting and error handling

### Frontend Features

- **User Authentication**: Mock authentication with role-based access
- **Disaster Management**: Create, edit, delete disasters
- **Resource Management**: CRUD operations with geospatial search
- **Social Media Monitor**: Real-time social media feed
- **Report Submission**: Submit reports with image verification
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend

- **Node.js** with Express.js
- **Supabase** (PostgreSQL) with PostGIS for geospatial queries
- **Socket.IO** for real-time updates
- **Google Gemini API** for AI features
- **Google Maps API** / OpenStreetMap for geocoding
- **Cheerio** for web scraping
- **Winston** for structured logging

### Frontend

- **React** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Socket.IO Client** for real-time updates

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Google Gemini API key (optional)
- Google Maps API key (optional)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd disaster-response-platform

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Google Gemini API (optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_TTL_HOURS=1

# Logging
LOG_LEVEL=info
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-setup.sql`
3. Copy your project URL and anon key to `.env`

### 4. API Keys (Optional)

#### Google Gemini API

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key
3. Add to `.env`

#### Google Maps API

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Enable Geocoding API
3. Create an API key
4. Add to `.env`

### 5. Start the Application

```bash
# Start backend (from root directory)
npm run dev

# Start frontend (in another terminal, from frontend directory)
cd frontend
npm run dev
```

The application will be available at:

- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

## API Documentation

### Authentication

All authenticated endpoints require a username header:

```
x-username: netrunnerX
```

### Disaster Management

#### GET /api/disasters

Get all disasters with optional filtering.

**Query Parameters:**

- `tag`: Filter by disaster tag
- `owner_id`: Filter by owner
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

#### POST /api/disasters

Create a new disaster.

**Body:**

```json
{
  "title": "Disaster Title",
  "location_name": "City, State",
  "description": "Disaster description",
  "tags": ["flood", "urgent"]
}
```

#### PUT /api/disasters/:id

Update an existing disaster.

#### DELETE /api/disasters/:id

Delete a disaster.

### Resource Management

#### GET /api/resources

Get resources with geospatial filtering.

**Query Parameters:**

- `lat`: Latitude for proximity search
- `lon`: Longitude for proximity search
- `radius`: Search radius in km (default: 10)
- `disaster_id`: Filter by disaster

#### POST /api/resources

Create a new resource.

**Body:**

```json
{
  "disaster_id": "uuid",
  "name": "Resource Name",
  "location_name": "City, State",
  "type": "shelter"
}
```

### Social Media

#### GET /api/social-media/mock

Get mock social media reports.

**Query Parameters:**

- `disaster_id`: Filter by disaster
- `keywords`: Comma-separated keywords

### Geocoding

#### POST /api/geocode

Extract location and convert to coordinates.

**Body:**

```json
{
  "description": "Text containing location",
  "location_name": "Optional explicit location"
}
```

### Image Verification

#### POST /api/verification/:disasterId/verify-image

Verify image authenticity.

**Body:**

```json
{
  "image_url": "https://example.com/image.jpg"
}
```

### Official Updates

#### GET /api/updates/:disasterId/official-updates

Get official updates from government/relief websites.

## Mock Users

The application includes mock authentication with these users:

- **netrunnerX** (admin) - Full access
- **reliefAdmin** (admin) - Full access
- **citizen1** (contributor) - Limited access
- **citizen2** (contributor) - Limited access

## Testing the Application

1. **Login**: Select a user from the dropdown
2. **Create Disasters**: Use the Disasters tab to create test disasters
3. **Add Resources**: Use the Resources tab to add resources with locations
4. **Monitor Social Media**: Use the Social Media tab to view mock reports
5. **Submit Reports**: Use the Submit Report tab to test image verification

## Deployment

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy as a Node.js service

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm install && npm run build`
3. Set output directory: `frontend/dist`
4. Deploy

## Project Structure

```
disaster-response-platform/
├── config/
│   └── supabase.js          # Supabase configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── disasters.js         # Disaster CRUD routes
│   ├── resources.js         # Resource management routes
│   ├── socialMedia.js       # Social media routes
│   ├── updates.js           # Official updates routes
│   ├── verification.js      # Image verification routes
│   └── geocoding.js         # Geocoding routes
├── services/
│   ├── geminiService.js     # Google Gemini API integration
│   ├── geocodingService.js  # Geocoding service
│   └── socialMediaService.js # Social media service
├── socket/
│   └── socketHandlers.js    # WebSocket event handlers
├── utils/
│   ├── logger.js            # Structured logging
│   └── cache.js             # Caching utility
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # App entry point
│   └── package.json         # Frontend dependencies
├── server.js                # Express server
├── package.json             # Backend dependencies
├── supabase-setup.sql       # Database setup
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please create an issue in the GitHub repository.
