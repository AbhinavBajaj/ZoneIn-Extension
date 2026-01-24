# Testing ZoneIn Extension Locally

## Quick Test (5 minutes)

### Step 1: Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to: `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click the "Load unpacked" button
   - Navigate to and select the `zonein-extension` folder
   - The extension should appear in your extensions list

4. **Verify Installation**
   - Look for "ZoneIn Extension" in the list
   - You should see the extension icon (purple "Z") in your Chrome toolbar
   - If not visible, click the puzzle piece icon (🧩) to find it

### Step 2: Basic Functionality Test

1. **Open the Popup**
   - Click the ZoneIn icon in the toolbar
   - You should see:
     - Current site classification
     - Recent activity list
     - Options button

2. **Test Classification**
   - Visit `https://twitter.com` → Should show "distracting"
   - Visit `https://github.com` → Should show "productive"
   - Visit `https://youtube.com/watch?v=test` → Should show "neutral"
   - Visit `https://youtube.com/shorts/abc` → Should show "distracting"

3. **Check Event History**
   - Click the extension icon
   - Scroll down to see "Recent Activity"
   - You should see the sites you visited with their classifications

### Step 3: Test Options Page

1. **Open Options**
   - Right-click extension icon → "Options"
   - Or: Click extension icon → "Options" button

2. **Test Monitoring Toggle**
   - Toggle "Enable monitoring" off
   - Visit a new site → Should not appear in history
   - Toggle back on

3. **Test Rules Management**
   - Click "Add Rule"
   - Add a test rule:
     - Type: Domain
     - Domain: `test-example.com`
     - Classification: Productive
   - Save
   - Visit `https://test-example.com` → Should show "productive"
   - Edit the rule → Change to "Distracting"
   - Visit again → Should show "distracting"
   - Delete the rule

4. **Test Import/Export**
   - Click "Export Rules" → Save JSON file
   - Delete a rule
   - Click "Import Rules" → Select the saved file
   - Verify rule is restored

### Step 4: Test Transport (Optional)

#### Option A: HTTP Fallback

1. **Start HTTP Server**
   ```bash
   cd zonein-extension/native-host
   node http-server-example.js
   ```

2. **Configure Extension**
   - Open Options page
   - Select "Local HTTP (ZoneIn app running)" transport mode
   - Save

3. **Test**
   - Visit a few sites
   - Check server console → Should see events logged
   - Check `~/.zonein-events-http.json` → Should contain events

#### Option B: Native Messaging

1. **Get Extension ID**
   - Go to `chrome://extensions/`
   - Find ZoneIn Extension
   - Copy the ID (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

2. **Update Host Manifest**
   - Edit `native-host/com.zonein.host.json`
   - Update `path` to absolute path:
     ```json
     "path": "/Users/abhinavbajaj/zonein-extension/native-host/zonein-host.js"
     ```
   - Replace extension ID:
     ```json
     "allowed_origins": [
       "chrome-extension://YOUR_EXTENSION_ID_HERE/"
     ]
     ```

3. **Install Host Manifest**
   ```bash
   # macOS
   mkdir -p ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts
   cp native-host/com.zonein.host.json \
      ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/
   
   # Linux
   mkdir -p ~/.config/google-chrome/NativeMessagingHosts
   cp native-host/com.zonein.host.json \
      ~/.config/google-chrome/NativeMessagingHosts/
   ```

4. **Test**
   - Restart Chrome
   - Open Options → Select "Native Host (recommended)"
   - Visit sites → Check `~/.zonein-events.json` for events

## Debugging

### Check Browser Console

1. **Popup Console**
   - Right-click extension icon → "Inspect popup"
   - Check Console tab for errors

2. **Background Service Worker Console**
   - Go to `chrome://extensions/`
   - Find ZoneIn Extension
   - Click "service worker" link (under "Inspect views")
   - Check Console for errors

3. **Options Page Console**
   - Open Options page
   - Right-click → "Inspect"
   - Check Console tab

### Common Issues

**Extension not loading:**
- Check `manifest.json` is valid JSON
- Verify all files exist (especially icons)
- Check browser console for errors

**Classification not working:**
- Verify monitoring is enabled in Options
- Check rules are loaded (Options → Rules Management)
- Test with known sites (twitter.com, github.com)

**Transport not working:**
- For HTTP: Ensure server is running on port 17321
- For Native: Check host manifest is installed correctly
- Extension works fine without transport (it's optional)

**Rules not saving:**
- Check browser storage: `chrome://extensions/` → ZoneIn → "Storage" → "Local"
- Verify no errors in console

## Automated Testing

Run the rules engine tests:

```bash
cd zonein-extension
node tests/rules-engine.test.js
```

Expected output: All 12 tests should pass ✓

## Test Checklist

- [ ] Extension loads without errors
- [ ] Popup displays current site classification
- [ ] Event history shows recent sites
- [ ] Options page opens and saves settings
- [ ] Monitoring toggle works
- [ ] Rules can be added, edited, deleted
- [ ] Rules import/export works
- [ ] Transport mode can be changed
- [ ] Classification works for known sites:
  - [ ] twitter.com → distracting
  - [ ] github.com → productive
  - [ ] youtube.com/shorts → distracting
  - [ ] youtube.com/watch → neutral
  - [ ] Unknown site → neutral (default)

## Next Steps

Once local testing passes:
1. Test on different websites
2. Add custom rules for your workflow
3. Integrate with ZoneIn macOS app (if applicable)
4. Prepare for Chrome Web Store submission (see DEPLOY.md)
