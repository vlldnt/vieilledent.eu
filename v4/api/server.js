const { Resend } = require('resend');
const { createServer } = require('http');

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.TO_EMAIL || 'vieilledent.adrien@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@iakoa.fr';
const PORT = 3000;
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes
const MIN_FORM_TIME_MS = 3000;        // form must be open at least 3s

const SPAM_KEYWORDS = [
  'casino', 'viagra', 'crypto', 'bitcoin', 'forex', 'loan', 'prize',
  'winner', 'click here', 'buy now', 'free money', 'make money',
  'earn $', 'seo service', 'backlink',
];

const URL_REGEX = /https?:\/\/|www\./gi;

// ip -> timestamp of last accepted submission
const rateMap = new Map();

// Clean old entries every 10 minutes
setInterval(() => {
  const cutoff = Date.now() - RATE_LIMIT_MS;
  for (const [ip, ts] of rateMap) {
    if (ts < cutoff) rateMap.delete(ip);
  }
}, 10 * 60 * 1000);

function getIP(req) {
  // X-Real-IP is set by the host nginx from the actual TCP peer and cannot be
  // forged by the client. X-Forwarded-For is appended to by every proxy, so
  // its first entry is client-controlled; only use it as a last resort.
  const real = req.headers['x-real-ip']?.trim();
  if (real) return real;
  const xff = req.headers['x-forwarded-for'];
  if (xff) {
    const hops = xff.split(',').map((h) => h.trim()).filter(Boolean);
    // last entry = added by the container nginx (= host proxy address),
    // the one before it = address seen by the host proxy (= real client)
    if (hops.length >= 2) return hops[hops.length - 2];
  }
  return req.socket.remoteAddress || 'unknown';
}

// Pragmatic email check: one @, no spaces, a dot in the domain part
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); }
      catch { reject(new Error('Invalid JSON')); }
    });
  });
}

function sanitize(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

const server = createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // No CORS headers on purpose: the form is served from the same origin
  // (/api/ behind nginx), so browsers block posts from other sites.

  if (req.method === 'POST' && req.url === '/api/contact') {
    const ip = getIP(req);

    try {
      const body = await readBody(req);
      const { name, email, message, website } = body;

      // 1. Honeypot — bots fill the hidden "website" field
      if (website) {
        res.writeHead(200);
        return res.end(JSON.stringify({ ok: true })); // silently discard
      }

      // 2. Timing check — submitted in under 3s = bot
      const formTime = parseInt(body._t, 10);
      if (!formTime || Date.now() - formTime < MIN_FORM_TIME_MS) {
        res.writeHead(200);
        return res.end(JSON.stringify({ ok: true })); // silently discard
      }

      // 3. Rate limit per IP
      const lastSent = rateMap.get(ip);
      if (lastSent && Date.now() - lastSent < RATE_LIMIT_MS) {
        const retryAfter = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastSent)) / 1000);
        res.writeHead(429);
        return res.end(JSON.stringify({ error: 'Too many requests', retryAfter }));
      }

      // 4. Basic validation + field length limits
      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'Missing fields' }));
      }
      if (name.length > 100 || email.length > 200 || message.length > 3000) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'Field too long' }));
      }
      if (message.trim().length < 10) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'Message too short' }));
      }
      if (!EMAIL_REGEX.test(email.trim())) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'Invalid email' }));
      }

      // 5. URL count — more than 2 links = likely spam
      const urlMatches = message.match(URL_REGEX) || [];
      if (urlMatches.length > 2) {
        res.writeHead(200);
        return res.end(JSON.stringify({ ok: true })); // silently discard
      }

      // 6. Spam keyword filter
      const msgLower = message.toLowerCase();
      const isSpam = SPAM_KEYWORDS.some((kw) => msgLower.includes(kw));
      if (isSpam) {
        res.writeHead(200);
        return res.end(JSON.stringify({ ok: true })); // silently discard
      }

      // The Resend SDK does not throw on API errors: it returns { error }.
      const { error: sendError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        replyTo: email.trim(),
        subject: `[Portfolio] Message de ${name.trim()}`,
        html: `
          <p><strong>Nom :</strong> ${sanitize(name)}</p>
          <p><strong>Email :</strong> ${sanitize(email)}</p>
          <hr>
          <p>${sanitize(message)}</p>
        `,
      });
      if (sendError) throw new Error(sendError.message || 'Resend error');

      rateMap.set(ip, Date.now());
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.error('Error:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Send failed' }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => console.log(`Contact API listening on :${PORT}`));
