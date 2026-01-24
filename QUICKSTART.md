# Quick Start Guide

Get ZoneIn Extension running in 5 minutes!

## 1. Load Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select the `zonein-extension` folder
6. Done! Look for the ZoneIn icon in your toolbar

## 2. Test It

1. Click the ZoneIn icon
2. You should see the current site's classification
3. Visit `twitter.com` - should show "distracting"
4. Visit `github.com` - should show "productive"

## 3. Configure Transport (Optional)

### Option A: Native Messaging (Recommended)

1. Get your extension ID from `chrome://extensions/`
2. Edit `native-host/com.zonein.host.json`:
   - Update `path` to absolute path of `zonein-host.js`
   - Replace `YOUR_EXTENSION_ID_HERE` with your extension ID
3. Install manifest:
   ```bash
   # macOS
   cp native-host/com.zonein.host.json \
      ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/
   
   # Linux
   cp native-host/com.zonein.host.json \
      ~/.config/google-chrome/NativeMessagingHosts/
   ```
4. Restart Chrome
5. In Options → Transport Mode → Select "Native Host"

### Option B: HTTP Fallback

1. Start the example HTTP server:
   ```bash
   node native-host/http-server-example.js
   ```
2. In Options → Transport Mode → Select "Local HTTP"
3. Events will be sent to `http://127.0.0.1:17321/events`

## 4. Customize Rules

1. Click extension icon → Options
2. Click "Add Rule"
3. Enter domain (e.g., `example.com`)
4. Choose classification
5. Save

## That's It!

The extension is now monitoring your browsing and classifying sites. Check the popup to see recent activity!

## Troubleshooting

**Extension not working?**
- Check browser console: Right-click extension icon → Inspect popup
- Verify monitoring is enabled in Options

**Native messaging not working?**
- Use HTTP fallback instead (see Option B above)
- Check native host script is executable: `chmod +x native-host/zonein-host.js`

**Need help?**
- See [README.md](./README.md) for detailed documentation
- See [DEPLOY.md](./DEPLOY.md) for deployment instructions
