# ZoneIn Extension - Deployment Guide

This guide covers installation, configuration, and deployment of the ZoneIn Chrome Extension.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Loading Unpacked Extension](#loading-unpacked-extension)
3. [Native Messaging Host Setup](#native-messaging-host-setup)
4. [Building for Chrome Web Store](#building-for-chrome-web-store)
5. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- Google Chrome or Chromium browser
- Node.js (for native messaging host and tests)

### Directory Structure

Ensure your extension directory has the following structure:

```
zonein-extension/
├── manifest.json
├── background.js
├── rules-engine.js
├── transport.js
├── rules.json
├── popup.html
├── popup.js
├── popup.css
├── options.html
├── options.js
├── options.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── tests/
└── native-host/
```

## Loading Unpacked Extension

### Step 1: Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage Extensions

### Step 2: Enable Developer Mode

1. Toggle "Developer mode" switch in the top-right corner

### Step 3: Load Extension

1. Click "Load unpacked" button
2. Select the `zonein-extension` directory
3. The extension should appear in your extensions list

### Step 4: Verify Installation

1. Look for the ZoneIn icon in the Chrome toolbar
2. Click the icon to open the popup
3. You should see the current site classification

### Step 5: Pin Extension (Optional)

1. Right-click the extension icon
2. Select "Pin" to keep it visible in the toolbar

## Updating the Extension (Unpacked)

When you change code or bump the version in `manifest.json`:

1. Open **Chrome** → `chrome://extensions/`
2. Find **ZoneIn Extension** in the list
3. Click the **reload** (circular arrow) icon on the extension card  
   - This reloads the extension from disk and picks up the new version
4. Confirm the version under the extension name (e.g. **1.0.1**)

You do **not** need to remove and "Load unpacked" again unless you moved the folder. Bumping the version in `manifest.json` (e.g. to `1.0.1`) before reloading helps you confirm the right build is active.

## Native Messaging Host Setup

The native messaging host allows the extension to communicate directly with the ZoneIn macOS app.

### macOS Setup

#### Step 1: Make Host Script Executable

```bash
chmod +x /path/to/zonein-extension/native-host/zonein-host.js
```

#### Step 2: Update Host Manifest

Edit `native-host/com.zonein.host.json`:

1. Update the `path` to the absolute path of `zonein-host.js`
2. Get your extension ID:
   - Go to `chrome://extensions/`
   - Find ZoneIn extension
   - Copy the ID (e.g., `abcdefghijklmnopqrstuvwxyz123456`)
3. Replace `YOUR_EXTENSION_ID_HERE` in the manifest:

```json
{
  "name": "com.zonein.host",
  "description": "ZoneIn Extension Native Messaging Host",
  "path": "/absolute/path/to/zonein-extension/native-host/zonein-host.js",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://abcdefghijklmnopqrstuvwxyz123456/"
  ]
}
```

#### Step 3: Install Host Manifest

Copy the manifest to Chrome's native messaging hosts directory:

```bash
# Create directory if it doesn't exist
mkdir -p ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts

# Copy manifest
cp native-host/com.zonein.host.json \
   ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/com.zonein.host.json
```

#### Step 4: Verify Installation

1. Restart Chrome
2. Open extension popup
3. Go to Options → Transport Mode
4. Select "Native Host (recommended)"
5. Check browser console for connection errors

### Linux Setup

Similar to macOS, but use different paths:

```bash
# Make executable
chmod +x /path/to/zonein-extension/native-host/zonein-host.js

# Install manifest
mkdir -p ~/.config/google-chrome/NativeMessagingHosts
cp native-host/com.zonein.host.json \
   ~/.config/google-chrome/NativeMessagingHosts/com.zonein.host.json
```

### Windows Setup

1. Make sure Node.js is in PATH
2. Create registry entry (or use manifest file):

```powershell
# Create directory
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\Google\Chrome\User Data\NativeMessagingHosts"

# Copy manifest
Copy-Item native-host\com.zonein.host.json `
          "$env:LOCALAPPDATA\Google\Chrome\User Data\NativeMessagingHosts\com.zonein.host.json"
```

Or manually create registry entry:
- Key: `HKEY_CURRENT_USER\SOFTWARE\Google\Chrome\NativeMessagingHosts\com.zonein.host`
- Value: Path to `com.zonein.host.json`

## Building for Chrome Web Store

### Step 1: Prepare Extension

1. Create a clean build directory
2. Copy only necessary files (exclude `tests/`, `native-host/`, `.git/`, etc.)

```bash
# Create build directory
mkdir zonein-extension-build

# Copy files
cp manifest.json background.js rules-engine.js transport.js rules.json \
   popup.html popup.js popup.css options.html options.js options.css \
   zonein-extension-build/

# Copy icons directory
cp -r icons zonein-extension-build/
```

### Step 2: Update Manifest for Store

Edit `manifest.json` to ensure:
- Version number is correct
- All permissions are justified
- Icons are present

### Step 3: Create ZIP

```bash
cd zonein-extension-build
zip -r ../zonein-extension-v1.0.0.zip .
```

### Step 4: Upload to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "New Item"
3. Upload the ZIP file
4. Fill in store listing:
   - Name: ZoneIn Extension
   - Description: Classifies browsing as productive, neutral, or distracting
   - Screenshots: Add screenshots of popup and options page
   - Privacy policy: Required for extensions with permissions
5. Submit for review

### Step 5: Store Listing Requirements

- **Screenshots**: At least 1, recommended 5
  - Popup UI
  - Options page
  - Rules management
- **Privacy Policy**: Required (host on your website)
- **Detailed Description**: Explain features and use cases
- **Category**: Productivity

## Testing Before Deployment

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup displays current site classification
- [ ] Options page opens and saves settings
- [ ] Rules can be added, edited, deleted
- [ ] Rules import/export works
- [ ] Monitoring toggle works
- [ ] Transport mode switching works
- [ ] Events are classified correctly
- [ ] Event history displays in popup
- [ ] Native messaging connects (if configured)
- [ ] HTTP fallback works (if ZoneIn app running)

### Automated Testing

```bash
# Run rules engine tests
node tests/rules-engine.test.js
```

## Troubleshooting

### Extension Won't Load

**Error**: "Manifest file is missing or unreadable"
- Check `manifest.json` exists and is valid JSON
- Verify file encoding is UTF-8

**Error**: "Service worker registration failed"
- Check `background.js` syntax
- Verify `importScripts` paths are correct

### Native Messaging Not Working

**Error**: "Native host not found"
- Verify manifest is in correct location
- Check manifest JSON is valid
- Ensure path in manifest is absolute

**Error**: "Native host disconnected"
- Check host script is executable
- Verify Node.js is in PATH
- Check host script for errors

### Classification Not Working

- Verify monitoring is enabled in Options
- Check rules are loaded (Options → Rules Management)
- Test with known sites (e.g., `twitter.com` should be distracting)
- Check browser console for errors

### Events Not Reaching ZoneIn App

**Native Messaging**:
- Verify host is installed and registered
- Check extension ID matches in manifest
- Restart Chrome after installing host

**HTTP Fallback**:
- Ensure ZoneIn app is running
- Verify app listens on `127.0.0.1:17321`
- Check firewall settings
- Test with curl:
  ```bash
  curl -X POST http://127.0.0.1:17321/events \
    -H "Content-Type: application/json" \
    -d '{"ts":1234567890,"url":"https://example.com","classification":"neutral"}'
  ```

## Version History

- **v1.0.0**: Initial release
  - Static URL classification
  - Native messaging and HTTP transport
  - Popup and options UI
  - ~100 default rules

## Support

For issues or questions:
1. Check this guide
2. Review browser console for errors
3. Check native host logs (if using native messaging)
4. Open an issue on GitHub (if applicable)
