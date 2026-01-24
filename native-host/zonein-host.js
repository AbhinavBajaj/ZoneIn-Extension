#!/usr/bin/env node

/**
 * ZoneIn Native Messaging Host
 * 
 * This script receives events from the Chrome extension via native messaging
 * and can forward them to the ZoneIn macOS app or store them locally.
 * 
 * Installation:
 * 1. Make this file executable: chmod +x zonein-host.js
 * 2. Register with Chrome (see DEPLOY.md for platform-specific instructions)
 * 
 * For macOS, create: ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.zonein.host.json
 */

const fs = require('fs');
const path = require('path');

// Event storage (SQLite would be better for production)
const eventsFile = path.join(process.env.HOME || process.env.USERPROFILE, '.zonein-events.json');

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

// Save events to file
function saveEvents() {
  try {
    fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Failed to save events:', error);
  }
}

// Native messaging protocol
// Messages are sent via stdin (length-prefixed JSON)
function readMessage() {
  const stdin = process.stdin;
  const buffers = [];
  let bufferLength = 0;
  let expectedLength = null;

  stdin.on('readable', () => {
    let chunk;
    while ((chunk = stdin.read()) !== null) {
      buffers.push(chunk);
      bufferLength += chunk.length;

      // Read 4-byte length prefix
      if (expectedLength === null && bufferLength >= 4) {
        const lengthBuffer = Buffer.concat(buffers.slice(0, 4));
        expectedLength = lengthBuffer.readUInt32LE(0);
        buffers.splice(0, 4);
        bufferLength -= 4;
      }

      // Read message when we have enough data
      if (expectedLength !== null && bufferLength >= expectedLength) {
        const messageBuffer = Buffer.concat(buffers.slice(0, expectedLength));
        buffers.splice(0, expectedLength);
        bufferLength -= expectedLength;

        try {
          const message = JSON.parse(messageBuffer.toString('utf8'));
          handleMessage(message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }

        expectedLength = null;
      }
    }
  });

  stdin.on('end', () => {
    process.exit(0);
  });
}

// Handle incoming message
function handleMessage(message) {
  console.error('Received event:', JSON.stringify(message, null, 2));
  
  // Store event
  events.push({
    ...message,
    receivedAt: Date.now()
  });
  
  // Keep only last 1000 events
  if (events.length > 1000) {
    events = events.slice(-1000);
  }
  
  saveEvents();
  
  // TODO: Forward to ZoneIn macOS app via IPC or local socket
  // For now, just log and store
  
  // Send response (optional)
  sendResponse({ success: true, received: true });
}

// Send response back to extension
function sendResponse(response) {
  const message = JSON.stringify(response);
  const length = Buffer.byteLength(message, 'utf8');
  const buffer = Buffer.allocUnsafe(4 + length);
  buffer.writeUInt32LE(length, 0);
  buffer.write(message, 4, 'utf8');
  process.stdout.write(buffer);
}

// Start reading messages
readMessage();

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  saveEvents();
  process.exit(0);
});

process.on('SIGTERM', () => {
  saveEvents();
  process.exit(0);
});
