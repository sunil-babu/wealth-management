# Wealth Management — AI SPA Scaffold

Production-ready single-page app for AI-powered wealth analysis, optimized for **GCP Cloud Run**.

## Architecture

- **Backend**: Express.js + Node.js (Cloud Run compatible)
- **Frontend**: React + Vite + Tailwind CSS
- **AI Integration**: Vertex AI proxy with request validation & rate limiting
- **Security**: Helmet, CORS, request timeouts, structured logging

## Quick Start

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Run locally
# Terminal 1: Backend (port 8080)
cd server && npm start

# Terminal 2: Frontend dev (port 5173)
cd client && npm run dev
```

Open http://localhost:5173

## Configuration

### Local Development

Copy environment templates and configure:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:
```
PORT=8080
NODE_ENV=development
GOOGLE_CLOUD_PROJECT=your-gcp-project
VERTEX_API_URL=https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT/locations/us-central1/publishers/google/models/text-bison:predict
```

### Production (Cloud Run)

1. **Authenticate with GCP**:
   ```bash
   gcloud auth login
   gcloud config set project your-gcp-project
   ```

2. **Build & push container**:
   ```bash
   docker build -f Dockerfile.prod -t gcr.io/your-gcp-project/wealth-mgmt:latest .
   docker push gcr.io/your-gcp-project/wealth-mgmt:latest
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy wealth-mgmt \
     --image gcr.io/your-gcp-project/wealth-mgmt:latest \
     --platform managed \
     --region us-central1 \
     --memory 512Mi \
     --cpu 1 \
     --set-env-vars GOOGLE_CLOUD_PROJECT=your-gcp-project,VERTEX_API_URL=... \
     --allow-unauthenticated
   ```

## Features for Scalability

✅ **Health checks** - Cloud Run liveness probes (`/health`, `/healthz`)
✅ **Rate limiting** - Prevents AI API cost overruns (100 req/15min)
✅ **Request validation** - Input sanitization for AI prompts
✅ **Timeout handling** - 30s max per request
✅ **Structured logging** - JSON logs for Cloud Logging
✅ **Graceful shutdown** - SIGTERM handling for zero-downtime deployments
✅ **Security headers** - Helmet.js middleware
✅ **Multi-stage Docker** - Optimized image size

## Key Files

- `server/index.js` - Express backend with AI proxy
- `client/src/App.jsx` - React SPA with error handling
- `Dockerfile.prod` - Production build for Cloud Run
- `server/.env.example` - Configuration template

## Vertex AI Integration

Uses **GCP Application Default Credentials** (Workload Identity recommended for Cloud Run).

For local dev, set:
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

## Monitoring

Cloud Run automatically provides:
- Request metrics & traces (Cloud Trace)
- Logs aggregation (Cloud Logging)
- Uptime monitoring (Cloud Monitoring)

View logs:
```bash
gcloud run services logs read wealth-mgmt
```

## Cost Optimization

- **Auto-scaling**: Cloud Run scales from 0 to N instances
- **Rate limiting**: Reduces unnecessary AI API calls
- **Caching**: Static assets cached (1 day)
- **Memory**: Start with 512Mi, scale as needed

---

**Ready for production AI workloads.**
