# Troubleshooting Guide

## Common Issues and Solutions

### "Native messaging host not found" Error

**Symptom:** You see an error in `chrome://extensions/` → Errors tab:
> "Unchecked runtime.lastError: Specified native messaging host not found"

**Cause:** The extension tries to connect to the native messaging host on startup, but it's not installed.

**Solution:** This is **expected behavior** if you haven't set up native messaging. The extension will still work perfectly! You have two options:

#### Option 1: Ignore the Error (Recommended for Testing)
- The extension works fine without native messaging
- Classification and monitoring still function
- Events are stored locally in the extension
- You can set up native messaging later if needed

#### Option 2: Switch to HTTP Mode
1. Open Options page
2. Select "Local HTTP (ZoneIn app running)" transport mode
3. The error will stop appearing
4. Start the HTTP server if you want to receive events:
   ```bash
   node native-host/http-server-example.js
   ```

#### Option 3: Install Native Messaging Host
If you want to use native messaging:
1. See [DEPLOY.md](./DEPLOY.md) for installation instructions
2. Install the native host manifest
3. Restart Chrome
4. The error will disappear

**Note:** The extension is designed to work even if transport fails. Classification and UI work independently of transport.

---

### Extension Not Classifying Sites

**Symptoms:**
- Popup shows "neutral" for all sites
- Event history is empty
- No classification changes when visiting different sites

**Solutions:**

1. **Check Monitoring is Enabled**
   - Open Options page
   - Verify "Enable monitoring" is checked
   - If unchecked, toggle it on

2. **Check Rules are Loaded**
   - Open Options page
   - Scroll to "Rules Management"
   - You should see a list of rules
   - If empty, click "Reset to Default" to restore default rules

3. **Test with Known Sites**
   - Visit `twitter.com` → Should show "distracting"
   - Visit `github.com` → Should show "productive"
   - If these don't work, check browser console for errors

4. **Check Browser Console**
   - Go to `chrome://extensions/`
   - Find ZoneIn Extension
   - Click "service worker" link
   - Check Console tab for errors

---

### Popup Not Showing

**Symptoms:**
- Clicking extension icon does nothing
- Popup appears blank
- Error in popup console

**Solutions:**

1. **Check Popup Console**
   - Right-click extension icon → "Inspect popup"
   - Check Console tab for errors
   - Common issues: Missing files, CORS errors

2. **Verify Files Exist**
   - Check `popup.html`, `popup.js`, `popup.css` exist
   - Run: `node verify-setup.js` to verify all files

3. **Reload Extension**
   - Go to `chrome://extensions/`
   - Find ZoneIn Extension
   - Click reload icon (↻)

---

### Options Page Not Saving

**Symptoms:**
- Changes in Options page don't persist
- Rules disappear after reload
- Transport mode resets

**Solutions:**

1. **Check Storage Permissions**
   - Verify `manifest.json` includes `"storage"` permission
   - Reload extension if you just added it

2. **Check Browser Storage**
   - Go to `chrome://extensions/`
   - Find ZoneIn Extension
   - Click "Storage" → "Local"
   - Check if your settings are saved

3. **Check Console for Errors**
   - Open Options page
   - Right-click → "Inspect"
   - Check Console for storage errors

---

### Transport Not Working

#### Native Messaging Issues

**Symptoms:**
- Events not reaching ZoneIn app
- Native messaging error persists

**Solutions:**

1. **Verify Host is Installed**
   ```bash
   # macOS
   ls ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/com.zonein.host.json
   
   # Linux
   ls ~/.config/google-chrome/NativeMessagingHosts/com.zonein.host.json
   ```

2. **Check Host Script is Executable**
   ```bash
   chmod +x native-host/zonein-host.js
   ```

3. **Verify Extension ID Matches**
   - Get extension ID from `chrome://extensions/`
   - Check `com.zonein.host.json` has correct ID in `allowed_origins`

4. **Restart Chrome** after installing host

#### HTTP Transport Issues

**Symptoms:**
- Events not reaching server
- Connection refused errors

**Solutions:**

1. **Verify Server is Running**
   ```bash
   node native-host/http-server-example.js
   ```
   Should see: "ZoneIn HTTP server listening on http://127.0.0.1:17321"

2. **Test with curl**
   ```bash
   curl -X POST http://127.0.0.1:17321/events \
     -H "Content-Type: application/json" \
     -d '{"ts":1234567890,"url":"https://example.com","classification":"neutral"}'
   ```

3. **Check Firewall**
   - Ensure port 17321 is not blocked
   - Try different port if needed

4. **Verify Transport Mode**
   - Options → Transport Mode → Select "Local HTTP"

---

### Rules Not Working

**Symptoms:**
- Custom rules don't apply
- Rules import/export fails
- Rules disappear

**Solutions:**

1. **Check Rule Format**
   - Domain rules: `{ type: "domain", domain: "example.com", classification: "productive" }`
   - Path rules: `{ type: "path-contains", domain: "youtube.com", pathPattern: "/shorts", classification: "distracting" }`

2. **Verify Rule Priority**
   - Path-contains rules are checked first (more specific)
   - Domain rules are checked second
   - Default classification is used last

3. **Test Rule**
   - Add a simple rule: `test.com` → `productive`
   - Visit `https://test.com`
   - Check popup shows "productive"

4. **Import/Export Issues**
   - Ensure JSON is valid
   - Check file encoding is UTF-8
   - Verify JSON structure matches expected format

---

### Extension Crashes or Freezes

**Symptoms:**
- Extension stops responding
- Service worker shows error
- Chrome becomes slow

**Solutions:**

1. **Check Service Worker**
   - Go to `chrome://extensions/`
   - Find ZoneIn Extension
   - Click "service worker" link
   - Check for errors in Console

2. **Clear Extension Storage**
   - Options → Reset to Default (for rules)
   - Or manually clear: `chrome://extensions/` → ZoneIn → Storage → Clear

3. **Reload Extension**
   - Click reload icon (↻) in extensions page

4. **Check Event History Size**
   - Extension keeps last 100 events
   - If issues persist, clear event history:
     - Open background console
     - Run: `chrome.storage.local.set({ eventHistory: [] })`

---

### Still Having Issues?

1. **Check All Files Exist**
   ```bash
   node verify-setup.js
   ```

2. **Run Tests**
   ```bash
   node tests/rules-engine.test.js
   ```

3. **Check Documentation**
   - [README.md](./README.md) - Full documentation
   - [DEPLOY.md](./DEPLOY.md) - Installation guide
   - [TESTING.md](./TESTING.md) - Testing guide

4. **Browser Console**
   - Always check browser console for detailed error messages
   - Service worker console: `chrome://extensions/` → ZoneIn → "service worker"
   - Popup console: Right-click icon → "Inspect popup"

5. **Report Issues**
   - Note the exact error message
   - Check which Chrome version you're using
   - Check if error occurs on specific sites or all sites
