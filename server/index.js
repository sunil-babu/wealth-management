require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

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
  
  try {
    // Validate input
    const validationError = validateAiRequest(req.body);
    if (validationError) {
      log.warn('Invalid AI request', { requestId, error: validationError });
      return res.status(400).json({ error: validationError });
    }

    const vertexUrl = process.env.VERTEX_API_URL;
    const vertexProject = process.env.GOOGLE_CLOUD_PROJECT;
    
    if (!vertexUrl && !vertexProject) {
      log.error('Vertex AI not configured', { requestId });
      return res.status(501).json({ error: 'Vertex AI not configured' });
    }

    log.info('AI request received', { requestId, promptLength: req.body.prompt.length });

    // Use GCP Application Default Credentials (Cloud Run Workload Identity)
    // For local dev: set GOOGLE_APPLICATION_CREDENTIALS
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const resp = await fetch(vertexUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: controller.signal
    });
    
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
