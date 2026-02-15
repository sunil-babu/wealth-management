require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const fetch = require('node-fetch');
const fs = require('fs');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Get absolute path to credentials
let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credentialsPath && !path.isAbsolute(credentialsPath)) {
  credentialsPath = path.join(__dirname, credentialsPath);
}

console.log('Credentials path:', credentialsPath);
console.log('Credentials exist:', credentialsPath ? fs.existsSync(credentialsPath) : false);

// Initialize Google Auth
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  keyFilename: credentialsPath
});

// DEBUG: Log environment variables
console.log('=== Environment Variables ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GOOGLE_CLOUD_PROJECT:', process.env.GOOGLE_CLOUD_PROJECT);
console.log('VERTEX_API_URL:', process.env.VERTEX_API_URL);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('==============================');

// Logger utility
const log = {
  info: (msg, data = {}) => console.log(JSON.stringify({ level: 'INFO', msg, ...data, ts: new Date().toISOString() })),
  error: (msg, err = {}) => console.error(JSON.stringify({ level: 'ERROR', msg, ...err, ts: new Date().toISOString() })),
  warn: (msg, data = {}) => console.warn(JSON.stringify({ level: 'WARN', msg, ...data, ts: new Date().toISOString() }))
};

// Security & middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// CORS for AI service integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Health check for Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/healthz', (req, res) => res.sendStatus(200)); // GCP liveness probe

// Input validation for AI requests
const validateAiRequest = (body) => {
  if (!body || typeof body !== 'object') return 'Invalid request body';
  if (typeof body.prompt !== 'string' || body.prompt.length === 0) return 'Missing or invalid prompt';
  if (body.prompt.length > 5000) return 'Prompt exceeds max length (5000)';
  return null;
};

// Vertex AI proxy with GCP-native auth
app.post('/api/vertex', async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log('\n=== VERTEX ENDPOINT CALLED ===');
  console.log('Request ID:', requestId);
  
  try {
    console.log('Request body:', JSON.stringify(req.body));
    
    // Validate input
    const validationError = validateAiRequest(req.body);
    if (validationError) {
      log.warn('Invalid AI request', { requestId, error: validationError });
      return res.status(400).json({ error: validationError });
    }

    const vertexUrl = process.env.VERTEX_API_URL;
    const vertexProject = process.env.GOOGLE_CLOUD_PROJECT;
    
    // DEBUG - Very explicit
    console.log('vertexUrl:', vertexUrl);
    console.log('vertexProject:', vertexProject);
    console.log('vertexUrl is truthy:', !!vertexUrl);
    console.log('vertexProject is truthy:', !!vertexProject);
    console.log('Check result - !vertexUrl:', !vertexUrl, '!vertexProject:', !vertexProject);
    console.log('Full condition - (!vertexUrl || !vertexProject):', (!vertexUrl || !vertexProject));
    
    if (!vertexUrl || !vertexProject) {
      console.log('FAILING - Missing config');
      log.error('Vertex AI not configured', { requestId, hasUrl: !!vertexUrl, hasProject: !!vertexProject });
      return res.status(501).json({ error: 'Vertex AI not configured' });
    }
    
    console.log('Config check PASSED');

    log.info('AI request received', { requestId, promptLength: req.body.prompt.length });

    // Get access token for authentication
    let token = '';
    try {
      token = await auth.getAccessToken();
    } catch (authErr) {
      log.error('Auth error', { requestId, message: authErr.message });
      return res.status(401).json({ error: 'Failed to authenticate with Vertex AI' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    // Check if using Gemini model (requires different API format)
    const isGeminiModel = vertexUrl.includes('gemini');
    
    let resp;
    if (isGeminiModel) {
      // Gemini API uses generateContent endpoint
      // Format: https://{region}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/google/models/{model}:generateContent
      const geminiUrl = vertexUrl.replace(':predict', ':generateContent');
      
      const geminiBody = {
        contents: [{
          role: 'user',
          parts: [{ text: req.body.prompt }]
        }]
      };

      console.log('Calling Gemini API with URL:', geminiUrl);
      console.log('Gemini body:', JSON.stringify(geminiBody));

      resp = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(geminiBody),
        signal: controller.signal
      });
    } else {
      // Standard Vertex Predict API (for text-bison, etc.)
      const vertexBody = {
        instances: [{
          prompt: req.body.prompt
        }]
      };

      console.log('Calling Vertex Predict with body:', JSON.stringify(vertexBody));

      resp = await fetch(vertexUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vertexBody),
        signal: controller.signal
      });
    }
    
    clearTimeout(timeout);

    if (!resp.ok) {
      const errText = await resp.text();
      log.error('Vertex API error', { requestId, status: resp.status, error: errText });
      return res.status(resp.status).json({ error: 'AI service error' });
    }

    const data = await resp.json();
    log.info('AI response sent', { requestId, responseSize: JSON.stringify(data).length });
    res.status(200).json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      log.warn('Request timeout', { requestId });
      return res.status(504).json({ error: 'AI request timeout' });
    }
    log.error('Unexpected error', { requestId, message: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      log.error('File send error', { file: 'index.html', message: err.message });
      res.status(500).json({ error: 'Could not load application' });
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  log.error('Unhandled error', { message: err.message, stack: err.stack });
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  log.info('Server started', { port: PORT, env: NODE_ENV });
});

// Graceful shutdown for Cloud Run
process.on('SIGTERM', () => {
  log.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    log.info('Server closed');
    process.exit(0);
  });
});
