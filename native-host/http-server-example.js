#!/usr/bin/env node

/**
 * Example HTTP Server for ZoneIn Extension
 * 
 * This is a simple HTTP server that receives events from the extension
 * when using HTTP transport mode.
 * 
 * Usage:
 *   node http-server-example.js
 * 
 * The server listens on http://127.0.0.1:17321/events
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 17321;
const HOST = '127.0.0.1';
const eventsFile = path.join(process.env.HOME || process.env.USERPROFILE, '.zonein-events-http.json');

// Load existing events
let events = [];
try {
  if (fs.existsSync(eventsFile)) {
    const data = fs.readFileSync(eventsFile, 'utf8');
    events = JSON.parse(data);
  }
} catch (error) {
  console.error('Failed to load events:', error);
}

// Save events
function saveEvents() {
  try {
    fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Failed to save events:', error);
  }
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/events') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const event = JSON.parse(body);
        console.log('Received event:', JSON.stringify(event, null, 2));

        // Store event
        events.push({
          ...event,
          receivedAt: Date.now()
        });

        // Keep only last 1000 events
        if (events.length > 1000) {
          events = events.slice(-1000);
        }

        saveEvents();

        // Send response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, received: true }));
      } catch (error) {
        console.error('Error processing event:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`ZoneIn HTTP server listening on http://${HOST}:${PORT}`);
  console.log(`Events will be saved to: ${eventsFile}`);
  console.log('Press Ctrl+C to stop');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  saveEvents();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  saveEvents();
  server.close(() => {
    process.exit(0);
  });
});
