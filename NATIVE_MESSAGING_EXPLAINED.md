# Native Messaging Explained

## What is Native Messaging?

**Native Messaging** is a Chrome feature that lets extensions communicate with programs installed on your computer (like your macOS app) through a special protocol.

### Two Ways to Communicate:

1. **HTTP Transport** (What you're using):
   - Extension → HTTP POST → `http://127.0.0.1:17321/events`
   - Your macOS app runs an HTTP server
   - Simple, works like any web API
   - Requires `host_permissions` for `127.0.0.1:17321/*`

2. **Native Messaging** (What you're NOT using):
   - Extension → Chrome Native Messaging Protocol → Native Host Script → Your macOS app
   - Requires a special "native host" script installed on the user's computer
   - More complex setup, but doesn't need host_permissions
   - Requires `nativeMessaging` permission

## Your Situation:

You're using **HTTP Transport** (127.0.0.1:17321), which means:
- ✅ You need `host_permissions` for `127.0.0.1:17321/*`
- ❌ You DON'T need `nativeMessaging` permission
- ❌ You DON'T need the native-host files

## Recommendation:

**Remove `nativeMessaging` permission** - you're not using it!

This will:
- Simplify your extension
- Reduce Chrome Web Store review scrutiny
- Make permissions easier to justify
- Still work perfectly with your macOS app via HTTP
