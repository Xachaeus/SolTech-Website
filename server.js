/**
 * SolTech — Contact Form Server
 * ─────────────────────────────
 * Handles POST /api/contact:
 *   1. Validates input fields
 *   2. Verifies Google reCAPTCHA v2 token
 *   3. Sends email via SMTP using Nodemailer
 *   4. Returns JSON { success: true } or { error: "..." }
 *
 * Setup:
 *   1. cp .env.example .env  → fill in your values
 *   2. npm install
 *   3. node server.js        (or: pm2 start server.js --name soltech)
 */

'use strict';

require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const axios      = require('axios');
const path       = require('path');
const rateLimit  = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Middleware ─────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the website static files from the same directory
app.use(express.static(path.join(__dirname, '')));

/* ── Rate limiting — max 5 contact submissions per 15 min per IP ── */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many messages sent. Please wait 15 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ── Nodemailer transporter ─────────────────────────── */
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true = port 465, false = STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ── reCAPTCHA v2 verification ──────────────────────── */
const https = require('https');
const querystring = require('querystring');

function verifyRecaptcha(token, remoteIp) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      secret:   process.env.RECAPTCHA_SECRET_KEY,
      response: token,
      remoteip: remoteIp,
    });

    const options = {
      hostname: 'www.google.com',
      path:     '/recaptcha/api/siteverify',
      method:   'POST',
      headers: {
        'Content-Type':   'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        resolve(parsed.success === true);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/* ── Input sanitisation (basic) ─────────────────────── */
function sanitize(str = '', maxLen = 2000) {
  return String(str).trim().slice(0, maxLen);
}

/* ── POST /api/contact ──────────────────────────────── */
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message, recaptchaToken } = req.body;


    // ── 1. Input validation ──
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'reCAPTCHA token missing.' });
    }

    // ── 2. reCAPTCHA verification ──
    const remoteIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const captchaResult = await verifyRecaptcha(recaptchaToken, remoteIp);
    if (!captchaResult) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
    }

    // ── 3. Sanitise fields ──
    const cleanName    = sanitize(name,    100);
    const cleanEmail   = sanitize(email,   254);
    const cleanSubject = sanitize(subject, 200) || 'New enquiry from SolTech website';
    const cleanMsg     = sanitize(message, 5000);

    // ── 4. Build & send email ──
    const mailOptions = {
      from:    `"SolTech Website" <${process.env.SMTP_USER}>`,
      to:      process.env.CONTACT_RECIPIENT,   // your inbox
      replyTo: cleanEmail,                       // reply goes straight to the client
      subject: `[SolTech] ${cleanSubject}`,
      text: [
        `New message via SolTech contact form`,
        `═══════════════════════════════════`,
        `Name:    ${cleanName}`,
        `Email:   ${cleanEmail}`,
        `Subject: ${cleanSubject}`,
        ``,
        `Message:`,
        cleanMsg,
        ``,
        `─────────────────────────────────`,
        `Sent from SolTech contact form`,
        `IP: ${remoteIp}`,
        `Time: ${new Date().toUTCString()}`,
      ].join('\n'),
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a1018;color:#c8dde8;padding:32px;border-radius:4px;">
          <div style="border-bottom:1px solid rgba(0,229,192,0.2);padding-bottom:16px;margin-bottom:24px;">
            <h2 style="margin:0;font-size:1.2rem;letter-spacing:.1em;color:#00E5C0;">
              New Message — SolTech Contact Form
            </h2>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:6px 0;color:#5a7a88;width:80px;vertical-align:top">Name</td>
                <td style="padding:6px 0;color:#EEF6FA">${cleanName}</td></tr>
            <tr><td style="padding:6px 0;color:#5a7a88;vertical-align:top">Email</td>
                <td style="padding:6px 0;color:#EEF6FA"><a href="mailto:${cleanEmail}" style="color:#00E5C0">${cleanEmail}</a></td></tr>
            <tr><td style="padding:6px 0;color:#5a7a88;vertical-align:top">Subject</td>
                <td style="padding:6px 0;color:#EEF6FA">${cleanSubject}</td></tr>
          </table>
          <div style="background:rgba(0,229,192,0.05);border:1px solid rgba(0,229,192,0.12);border-radius:3px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;white-space:pre-wrap;line-height:1.7;color:#c8dde8">${cleanMsg.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
          </div>
          <p style="margin:0;font-size:.75rem;color:#5a7a88;">
            Sent: ${new Date().toUTCString()} · IP: ${remoteIp}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // ── 5. Confirmation email to client ──
    if (process.env.SEND_CONFIRMATION === 'true') {
      await transporter.sendMail({
        from:    `"SolTech" <${process.env.SMTP_USER}>`,
        to:      cleanEmail,
        subject: 'We received your message — SolTech',
        text: [
          `Hi ${cleanName},`,
          ``,
          `Thanks for reaching out to SolTech. We've received your message and will`,
          `get back to you within one business day.`,
          ``,
          `— The SolTech Team`,
          `Sollenberger Technologies, LLC`,
        ].join('\n'),
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a1018;color:#c8dde8;padding:32px;border-radius:4px;">
            <h2 style="color:#00E5C0;margin-top:0">Thanks for reaching out, ${cleanName}.</h2>
            <p style="line-height:1.7;color:#8aaabb">
              We've received your message and will get back to you within one business day.
            </p>
            <p style="line-height:1.7;color:#5a7a88;font-size:.85rem;margin-top:32px;border-top:1px solid rgba(255,255,255,.06);padding-top:16px">
              — The SolTech Team<br>Sollenberger Technologies, LLC
            </p>
          </div>
        `,
      });
    }

    return res.json({ success: true });

  } catch (err) {
    console.error('[Contact] Error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

/* ── Catch-all — serve index.html for SPA routing ───── */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ── Start ──────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`SolTech server running on http://localhost:${PORT}`);
});
