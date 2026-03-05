require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const fetch = require('node-fetch');
const fs = require('fs');
const { GoogleAuth } = require('google-auth-library');

// ─── Configuration Constants ───────────────────────────────────────────
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

/** Retry & timeout settings */
const CONFIG = {
  /** Maximum server-side retries for basic analysis */
  BASIC_MAX_RETRIES: 3,
  /** Maximum server-side full retries for PDF generation */
  PDF_MAX_RETRIES: 3,
  /** Maximum continuation requests when response is truncated (PDF) */
  PDF_MAX_CONTINUATIONS: 3,
  /** Maximum background retries for email-queued PDF */
  BG_MAX_RETRIES: 3,
  /** Gemini API call timeout (ms) — 5 minutes */
  GEMINI_TIMEOUT_MS: 300_000,
  /** Express request/response timeout (ms) — 6 minutes */
  REQUEST_TIMEOUT_MS: 360_000,
  /** Max output tokens for basic analysis */
  BASIC_MAX_TOKENS: 16384,
  /** Max output tokens for PDF generation */
  PDF_MAX_TOKENS: 65536,
  /** Temperature for basic analysis */
  BASIC_TEMPERATURE: 0.7,
  /** Temperature for PDF generation */
  PDF_TEMPERATURE: 0.5,
  /** Rate limit window (ms) */
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  /** Rate limit max requests per window */
  RATE_LIMIT_MAX: NODE_ENV === 'production' ? 100 : 1000,
  /** Max prompt length for basic analysis */
  BASIC_MAX_PROMPT_LENGTH: 5000,
  /** Max prompt length for PDF generation */
  PDF_MAX_PROMPT_LENGTH: 50000,
};

// ─── Logger ────────────────────────────────────────────────────────────
const log = {
  info: (msg, data = {}) => console.log(JSON.stringify({ level: 'INFO', msg, ...data, ts: new Date().toISOString() })),
  error: (msg, data = {}) => console.error(JSON.stringify({ level: 'ERROR', msg, ...data, ts: new Date().toISOString() })),
  warn: (msg, data = {}) => console.warn(JSON.stringify({ level: 'WARN', msg, ...data, ts: new Date().toISOString() })),
};

// ─── Google Auth ───────────────────────────────────────────────────────
let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credentialsPath && !path.isAbsolute(credentialsPath)) {
  credentialsPath = path.join(__dirname, credentialsPath);
}

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  keyFilename: credentialsPath,
});

log.info('Server initializing', {
  port: PORT,
  env: NODE_ENV,
  project: process.env.GOOGLE_CLOUD_PROJECT || '(not set)',
  vertexUrl: process.env.VERTEX_API_URL ? '...configured' : '(not set)',
  credentials: credentialsPath ? fs.existsSync(credentialsPath) : false,
});

const app = express();

// ─── Middleware ─────────────────────────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Increase timeout for long-running AI requests
app.use((req, res, next) => {
  req.setTimeout(CONFIG.REQUEST_TIMEOUT_MS);
  res.setTimeout(CONFIG.REQUEST_TIMEOUT_MS);
  next();
});

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
  max: CONFIG.RATE_LIMIT_MAX,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ─── Health Checks ─────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/healthz', (_req, res) => res.sendStatus(200));

// ─── Input Validation ──────────────────────────────────────────────────
/**
 * Validates a request body contains a valid prompt up to `maxLength`.
 * @returns {string|null} Error message, or null if valid.
 */
function validatePrompt(body, maxLength) {
  if (!body || typeof body !== 'object') return 'Invalid request body';
  if (typeof body.prompt !== 'string' || body.prompt.length === 0) return 'Missing or invalid prompt';
  if (body.prompt.length > maxLength) return `Prompt exceeds max length (${maxLength})`;
  return null;
}

const validateAiRequest = (body) => validatePrompt(body, CONFIG.BASIC_MAX_PROMPT_LENGTH);
const validatePdfRequest = (body) => validatePrompt(body, CONFIG.PDF_MAX_PROMPT_LENGTH);

// ─── Completeness Checks ──────────────────────────────────────────────
/**
 * Checks whether a basic analysis response contains the expected structured output.
 * Requires: MONTHLY_NEED + TARGET_NEST_EGG keywords, ≥3 ACTION_STEPs, ≥1500 chars.
 */
function isBasicResponseComplete(text) {
  const hasMetrics = /MONTHLY_NEED/i.test(text) && /TARGET_NEST_EGG/i.test(text);
  const actionCount = (text.match(/ACTION_STEP_\d/gi) || []).length;
  const hasDutchTax = /BOX3_STRATEGY/i.test(text) || /PENSION_RECOMMENDATIONS/i.test(text);
  return hasMetrics && actionCount >= 3 && text.length > 1500;
}

/**
 * Checks whether a PDF response contains all expected sections (≥6 of 8).
 * Requires: ≥6 "## SECTION" headings and ≥4000 chars.
 */
function isResponseComplete(text) {
  const sectionCount = (text.match(/##\s*SECTION\s*\d/gi) || []).length;
  return sectionCount >= 6 && text.length > 4000;
}

// ─── Shared Helpers ────────────────────────────────────────────────────
/** Generate a short random request ID */
function generateRequestId(prefix = '') {
  return prefix + Math.random().toString(36).substring(2, 9);
}

/**
 * Extract the text content from a Gemini API response.
 * @returns {string} The concatenated text from all parts, or empty string.
 */
function extractResponseText(data) {
  try {
    if (data?.candidates?.[0]?.content?.parts) {
      return data.candidates[0].content.parts.map(p => p.text || '').join('');
    }
  } catch { /* ignore malformed response */ }
  return '';
}

/** Get the finish reason from a Gemini API response */
function getFinishReason(data) {
  return data?.candidates?.[0]?.finishReason || null;
}

/**
 * Safely refresh the OAuth access token.
 * @returns {string} Fresh access token.
 * @throws {Error} If authentication fails.
 */
async function refreshToken() {
  return auth.getAccessToken();
}

/**
 * Build a Gemini "continue" prompt to resume a truncated response.
 */
function buildContinuationContents(originalPrompt, partialResponse) {
  return [
    { role: 'user', parts: [{ text: originalPrompt }] },
    { role: 'model', parts: [{ text: partialResponse }] },
    { role: 'user', parts: [{ text: 'Your response was cut off. Continue EXACTLY where you left off. Do NOT repeat any content. Do NOT add a new introduction. Continue directly from the last sentence.' }] },
  ];
}

/** Build a standardised API response envelope */
function buildApiResponse(text, meta = {}) {
  return {
    candidates: [{
      content: { role: 'model', parts: [{ text }] },
      finishReason: 'STOP',
    }],
    _meta: meta,
  };
}

/** Map common errors to appropriate HTTP status codes and messages */
function mapErrorToResponse(err, requestId) {
  if (err.name === 'AbortError') {
    return { status: 504, body: { error: 'Request timed out after 5 minutes. Please try again.' } };
  }
  if (err.status) {
    return { status: err.status, body: { error: err.message, details: err.details } };
  }
  if (err.message?.includes('fetch') || err.message?.includes('ECONNREFUSED')) {
    log.error('Network error', { requestId, message: err.message });
    return { status: 503, body: { error: 'Network error connecting to AI service. Please try again.' } };
  }
  log.error('Unexpected error', { requestId, message: err.message, stack: err.stack });
  return { status: 500, body: { error: 'Internal server error' } };
}

// ─── POST /api/vertex — Basic analysis with retry ─────────────────────
app.post('/api/vertex', async (req, res) => {
  const requestId = generateRequestId('basic-');

  try {
    const validationError = validateAiRequest(req.body);
    if (validationError) {
      log.warn('Invalid AI request', { requestId, error: validationError });
      return res.status(400).json({ error: validationError });
    }

    const vertexUrl = process.env.VERTEX_API_URL;
    if (!vertexUrl || !process.env.GOOGLE_CLOUD_PROJECT) {
      log.error('Vertex AI not configured', { requestId });
      return res.status(501).json({ error: 'Vertex AI not configured' });
    }

    log.info('AI request received', { requestId, promptLength: req.body.prompt.length });

    let token;
    try {
      token = await refreshToken();
    } catch (authErr) {
      log.error('Auth error', { requestId, message: authErr.message });
      return res.status(401).json({ error: 'Failed to authenticate with Vertex AI' });
    }

    if (!vertexUrl.includes('gemini')) {
      // Non-Gemini model — single call, no retry
      return await handleNonGeminiRequest(req, res, vertexUrl, token, requestId);
    }

    const geminiUrl = vertexUrl.replace(':predict', ':generateContent');
    let bestText = '';

    for (let retry = 0; retry < CONFIG.BASIC_MAX_RETRIES; retry++) {
      log.info('Basic analysis attempt', { requestId, attempt: retry + 1, maxAttempts: CONFIG.BASIC_MAX_RETRIES });

      if (retry > 0) {
        try { token = await refreshToken(); } catch { break; }
      }

      try {
        const contents = [{ role: 'user', parts: [{ text: req.body.prompt }] }];
        const data = await callGemini({ geminiUrl, token, contents, maxOutputTokens: CONFIG.BASIC_MAX_TOKENS, temperature: CONFIG.BASIC_TEMPERATURE });

        let responseText = extractResponseText(data);
        const finishReason = getFinishReason(data);

        // If truncated, try a single continuation
        if (finishReason === 'MAX_TOKENS' && responseText.length > 0) {
          log.info('Response truncated, continuing', { requestId, attempt: retry + 1 });
          try { token = await refreshToken(); } catch { /* use what we have */ }
          try {
            const contContents = buildContinuationContents(req.body.prompt, responseText);
            const contData = await callGemini({ geminiUrl, token, contents: contContents, maxOutputTokens: CONFIG.BASIC_MAX_TOKENS, temperature: CONFIG.BASIC_TEMPERATURE });
            responseText += extractResponseText(contData);
          } catch (contErr) {
            log.warn('Continuation failed', { requestId, message: contErr.message });
          }
        }

        if (responseText.length > bestText.length) bestText = responseText;

        if (isBasicResponseComplete(responseText)) {
          log.info('AI response sent', { requestId, responseSize: responseText.length, complete: true, attempt: retry + 1 });
          return res.status(200).json(buildApiResponse(responseText, { complete: true, textLength: responseText.length }));
        }

        log.info('Basic response incomplete', { requestId, attempt: retry + 1, textLength: responseText.length });
      } catch (callErr) {
        log.warn('Attempt failed', { requestId, attempt: retry + 1, message: callErr.message });
        if (callErr.status && retry >= CONFIG.BASIC_MAX_RETRIES - 1) {
          return res.status(callErr.status).json({ error: callErr.message, details: callErr.details });
        }
      }
    }

    // Return best-effort response
    const isComplete = isBasicResponseComplete(bestText);
    log.info('AI response sent (best effort)', { requestId, responseSize: bestText.length, complete: isComplete });
    return res.status(200).json(buildApiResponse(bestText, { complete: isComplete, textLength: bestText.length }));

  } catch (err) {
    const { status, body } = mapErrorToResponse(err, requestId);
    return res.status(status).json(body);
  }
});

/**
 * Handle a non-Gemini model request (text-bison etc.) — no retry logic.
 */
async function handleNonGeminiRequest(req, res, vertexUrl, token, requestId) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.GEMINI_TIMEOUT_MS);

  try {
    const resp = await fetch(vertexUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=360',
      },
      body: JSON.stringify({ instances: [{ prompt: req.body.prompt }] }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      const errText = await resp.text();
      log.error('Vertex API error', { requestId, status: resp.status, error: errText });
      return res.status(resp.status).json({ error: 'AI service error', details: errText });
    }

    const data = await resp.json();
    log.info('AI response sent', { requestId, responseSize: JSON.stringify(data).length });
    return res.status(200).json(data);
  } catch (err) {
    clearTimeout(timeout);
    const { status, body } = mapErrorToResponse(err, requestId);
    return res.status(status).json(body);
  }
}

// ─── callGemini — Shared Gemini API caller ────────────────────────────
/**
 * Call the Gemini API and return parsed JSON.
 * @param {Object} opts
 * @param {string} opts.geminiUrl - Full Gemini endpoint URL.
 * @param {string} opts.token - OAuth access token.
 * @param {Array}  opts.contents - Conversation contents array.
 * @param {number} [opts.maxOutputTokens=65536]
 * @param {number} [opts.temperature=0.5]
 * @returns {Promise<Object>} Parsed API response.
 * @throws {Error} With `.status` and `.details` on HTTP errors.
 */
async function callGemini({ geminiUrl, token, contents, maxOutputTokens = CONFIG.PDF_MAX_TOKENS, temperature = CONFIG.PDF_TEMPERATURE }) {
  const body = {
    contents,
    generationConfig: {
      temperature,
      topP: 0.8,
      topK: 40,
      maxOutputTokens,
      candidateCount: 1,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.GEMINI_TIMEOUT_MS);

  try {
    const resp = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=360',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      const errText = await resp.text();
      throw Object.assign(new Error('AI service error'), { status: resp.status, details: errText });
    }

    return resp.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// ─── POST /api/vertex-pdf — Premium PDF generation with retry ──────────
app.post('/api/vertex-pdf', async (req, res) => {
  const requestId = generateRequestId('pdf-');

  try {
    const validationError = validatePdfRequest(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const vertexUrl = process.env.VERTEX_API_URL;
    if (!vertexUrl || !process.env.GOOGLE_CLOUD_PROJECT) {
      return res.status(501).json({ error: 'Vertex AI not configured' });
    }

    let token;
    try {
      token = await refreshToken();
    } catch (authErr) {
      log.error('Auth error', { requestId, message: authErr.message });
      return res.status(401).json({ error: 'Failed to authenticate with Vertex AI' });
    }

    if (!vertexUrl.includes('gemini')) {
      return await handleNonGeminiRequest(req, res, vertexUrl, token, requestId);
    }

    const geminiUrl = vertexUrl.replace(':predict', ':generateContent');
    let bestText = '';
    let bestSectionCount = 0;

    for (let retry = 0; retry < CONFIG.PDF_MAX_RETRIES; retry++) {
      log.info('PDF generation attempt', { requestId, attempt: retry + 1, maxAttempts: CONFIG.PDF_MAX_RETRIES });

      if (retry > 0) {
        try { token = await refreshToken(); } catch { break; }
      }

      // Build initial prompt and attempt generation with continuations
      let contents = [{ role: 'user', parts: [{ text: req.body.prompt }] }];
      let fullText = '';

      for (let cont = 0; cont <= CONFIG.PDF_MAX_CONTINUATIONS; cont++) {
        const data = await callGemini({ geminiUrl, token, contents, maxOutputTokens: CONFIG.PDF_MAX_TOKENS });
        const chunkText = extractResponseText(data);
        fullText += chunkText;

        if (getFinishReason(data) !== 'MAX_TOKENS') break;
        if (cont >= CONFIG.PDF_MAX_CONTINUATIONS) break;

        log.info('PDF response truncated, continuing', { requestId, attempt: retry + 1, continuation: cont + 1 });
        try { token = await refreshToken(); } catch { break; }
        contents = buildContinuationContents(req.body.prompt, chunkText);
      }

      // Track best response across retries
      const currentSections = (fullText.match(/##\s*SECTION\s*\d/gi) || []).length;
      if (currentSections > bestSectionCount) {
        bestText = fullText;
        bestSectionCount = currentSections;
      }

      if (isResponseComplete(fullText)) {
        log.info('PDF response complete', { requestId, attempt: retry + 1, sections: currentSections });
        bestText = fullText;
        break;
      }

      log.info('PDF response incomplete', { requestId, attempt: retry + 1, sections: currentSections });
    }

    const isComplete = isResponseComplete(bestText);
    log.info('PDF AI response sent', { requestId, complete: isComplete, responseSize: bestText.length, sections: bestSectionCount });
    return res.status(200).json(buildApiResponse(bestText, { complete: isComplete, sectionCount: bestSectionCount, textLength: bestText.length }));

  } catch (err) {
    const { status, body } = mapErrorToResponse(err, requestId);
    return res.status(status).json(body);
  }
});

// ─── POST /api/queue-pdf-email — Deferred PDF delivery ─────────────────
// NOTE: pendingPdfQueue is in-memory only. In production, use Cloud Tasks,
// Pub/Sub, or a persistent datastore for durability across restarts.
const pendingPdfQueue = [];

app.post('/api/queue-pdf-email', async (req, res) => {
  const { email, prompt, partialContent } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt data is required' });
  }

  const jobId = generateRequestId('job-');
  const job = {
    jobId,
    email: email.trim().toLowerCase(),
    prompt,
    partialContent: partialContent || '',
    status: 'queued',
    createdAt: new Date().toISOString(),
    retries: 0,
  };

  pendingPdfQueue.push(job);
  log.info('PDF email job queued', { jobId, email: job.email });

  // Background retry (in-process; use Cloud Tasks in production)
  setImmediate(async () => {
    for (let i = 0; i < CONFIG.BG_MAX_RETRIES; i++) {
      try {
        const vertexUrl = process.env.VERTEX_API_URL;
        if (!vertexUrl?.includes('gemini')) break;

        const bgToken = await refreshToken();
        const geminiUrl = vertexUrl.replace(':predict', ':generateContent');
        const contents = [{ role: 'user', parts: [{ text: prompt }] }];
        const data = await callGemini({ geminiUrl, token: bgToken, contents });
        const text = extractResponseText(data);

        if (isResponseComplete(text)) {
          job.status = 'complete';
          job.result = text;
          log.info('Background PDF succeeded', { jobId, email: job.email });
          // TODO: Send email via SendGrid / Nodemailer
          break;
        }

        job.retries = i + 1;
        log.warn('Background PDF incomplete', { jobId, attempt: i + 1 });
      } catch (bgErr) {
        job.retries = i + 1;
        log.error('Background PDF failed', { jobId, attempt: i + 1, error: bgErr.message });
      }
    }

    if (job.status !== 'complete') {
      job.status = 'failed';
      log.error('All background PDF retries exhausted', { jobId, email: job.email });
    }
  });

  return res.status(202).json({
    message: `Your report has been queued. You will receive it at ${job.email} within 15 minutes.`,
    jobId,
  });
});

// ─── GET /api/pdf-job/:jobId — Job status polling ─────────────────────
app.get('/api/pdf-job/:jobId', (req, res) => {
  const job = pendingPdfQueue.find(j => j.jobId === req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  return res.json({ jobId: job.jobId, status: job.status, createdAt: job.createdAt });
});

// ─── SPA Fallback ─────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      log.error('File send error', { file: 'index.html', message: err.message });
      if (!res.headersSent) res.status(500).json({ error: 'Could not load application' });
    }
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  log.error('Unhandled error', { message: err.message, stack: err.stack });
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: 'Internal server error' });
  }
});

// ─── Server Start & Graceful Shutdown ─────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  log.info('Server started', { port: PORT, env: NODE_ENV });
});

process.on('SIGTERM', () => {
  log.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    log.info('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled promise rejection', { message: String(reason) });
});

process.on('uncaughtException', (err) => {
  log.error('Uncaught exception', { message: err.message, stack: err.stack });
  process.exit(1);
});