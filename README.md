# ZoneIn Extension

A Chrome Extension (Manifest V3) that classifies browsing activity as **productive**, **neutral**, or **distracting** using static URL rules. No machine learning, no cloud services - everything runs locally.

## Features

- 🎯 **Static URL Classification**: Fast, deterministic classification based on domain and path rules
- 📊 **Real-time Monitoring**: Tracks tab URL changes and active tab switches
- 🔧 **Customizable Rules**: Add, edit, delete, import, and export classification rules
- 🚀 **Local Transport**: Sends events to local machine via native messaging or HTTP
- 💾 **Offline First**: Works completely offline, no network required
- 🎨 **Clean UI**: Modern popup and options page

## Architecture

### Core Components

1. **Rules Engine** (`rules-engine.js`)
   - Classifies URLs using domain and path-contains rules
   - Supports exact domain matching and path pattern matching
   - Default classification: `neutral`

2. **Background Service Worker** (`background.js`)
   - Monitors `chrome.tabs.onUpdated` and `chrome.tabs.onActivated`
   - Classifies URLs and emits events
   - Manages event history (last 100 events)

3. **Transport Layer** (`transport.js`)
   - Native Messaging (preferred): Direct communication with ZoneIn app
   - HTTP Fallback: Sends to `http://127.0.0.1:17321/events`
   - Gracefully handles transport failures

4. **UI Components**
   - **Popup** (`popup.html/js/css`): Shows current site classification and recent activity
   - **Options** (`options.html/js/css`): Manage rules, toggle monitoring, configure transport

### Event Schema

```json
{
  "ts": 1234567890123,
  "url": "https://youtube.com/shorts/abc123",
  "host": "youtube.com",
  "path": "/shorts/abc123",
  "classification": "distracting",
  "ruleId": "youtube-shorts",
  "tabId": 123
}
```

## Installation

See [DEPLOY.md](./DEPLOY.md) for detailed installation instructions.

### Quick Start

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `zonein-extension` directory
5. Click the extension icon to open the popup

## Usage

### Popup

The popup shows:
- Current active tab classification
- Last 10 browsing events
- Link to options page

### Options Page

Access via:
- Right-click extension icon → Options
- Or click "Options" button in popup

**Settings:**
- **Monitoring Toggle**: Enable/disable URL classification
- **Transport Mode**: Choose Native Messaging or HTTP fallback
- **Rules Management**: Add, edit, delete, import, export rules

### Adding Rules

1. Go to Options page
2. Click "Add Rule"
3. Choose rule type:
   - **Domain**: Matches entire domain (e.g., `twitter.com`)
   - **Path Contains**: Matches domain + path pattern (e.g., `youtube.com` + `/shorts`)
4. Set classification: `productive`, `neutral`, or `distracting`
5. Save

### Rule Priority

1. Path-contains rules (most specific)
2. Domain rules
3. Default classification (`neutral`)

## Default Rules

The extension comes with ~100 pre-configured rules for common sites:

- **Productive**: GitHub, Stack Overflow, Wikipedia, Google Docs, Notion, etc.
- **Neutral**: Gmail, Slack, LinkedIn, news sites, etc.
- **Distracting**: Twitter, TikTok, Instagram, Reddit, Netflix, etc.

See `rules.json` for the complete list.

## Integration with ZoneIn macOS App

### Event Flow

```
Chrome Extension → Native Messaging/HTTP → ZoneIn App → SQLite Storage
```

### Native Messaging (Recommended)

1. Install the native messaging host (see `native-host/zonein-host.js`)
2. Register with Chrome (see DEPLOY.md)
3. Extension automatically uses native messaging

### HTTP Fallback

1. Ensure ZoneIn app is running and listening on `http://127.0.0.1:17321/events`
2. Select "Local HTTP" transport mode in options
3. Extension sends POST requests with event JSON

### Event Storage

Events are stored locally in the ZoneIn app (SQLite recommended). The extension continues to function even if transport is unavailable.

## Development

### Project Structure

```
zonein-extension/
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker
├── rules-engine.js        # Classification engine
├── transport.js           # Event transport layer
├── rules.json             # Default rules
├── popup.html/js/css      # Popup UI
├── options.html/js/css    # Options page UI
├── icons/                 # Extension icons
├── tests/                 # Test files
├── native-host/           # Native messaging host
├── README.md
└── DEPLOY.md
```

### Running Tests

```bash
node tests/rules-engine.test.js
```

### Building for Chrome Web Store

1. Zip the extension directory (excluding `tests/`, `native-host/`, etc.)
2. See DEPLOY.md for detailed instructions

## Configuration

### Storage Keys

- `monitoringEnabled`: Boolean, default `true`
- `transportMode`: String, `"native"` or `"http"`, default `"native"`
- `rules`: Array of rule objects
- `defaultClassification`: String, default `"neutral"`
- `eventHistory`: Array of last 100 events

## Troubleshooting

### Extension not classifying sites

1. Check if monitoring is enabled in Options
2. Verify rules are loaded (check Options page)
3. Check browser console for errors

### Native messaging not working

1. Verify native host is installed and registered
2. Check native host script is executable
3. Use HTTP fallback as temporary solution

### Events not reaching ZoneIn app

1. Check transport mode in Options
2. For HTTP: Ensure ZoneIn app is running on port 17321
3. Check browser console for transport errors

## License

MIT

## Contributing

Contributions welcome! Please open an issue or pull request.
