# Final Chrome Web Store Form Responses

**Your Setup:**
- Extension monitors URLs using `tabs` permission
- Extension classifies locally using rules.json
- Extension sends events to macOS app via HTTP: `http://127.0.0.1:17321/events`
- macOS app shows focus score (uses AI on the server side)
- **NOT using native messaging** (removed from manifest)

---

## 1. Single Purpose Description

```
ZoneIn Extension helps users track their focus time by monitoring browsing activity and classifying websites as productive, neutral, or distracting. The extension monitors URLs you visit and classifies them using local rules. It sends these classification events to the ZoneIn macOS application running on your local machine (via http://127.0.0.1:17321), which displays your focus score. All communication stays on your local machine - no data is sent to external servers. The extension works independently and classifies websites locally even if the macOS app is not running.
```

---

## 2. Permission Justifications

### tabs justification

```
The tabs permission is required to monitor browsing activity and detect which websites users visit. The extension listens for tab URL changes and active tab switches to identify when users navigate to different websites. This is essential for the extension's core functionality: classifying browsing activity and sending events to the ZoneIn macOS app. The extension only accesses tab URLs - it does not access page content, cookies, or any other tab data. All classification happens locally using static rules bundled with the extension.
```

### storage justification

```
The storage permission is used to save user preferences and custom classification rules locally in the browser. This includes: monitoring on/off toggle, user-created custom rules for classifying websites, and event history for display in the popup. All data is stored locally using Chrome's storage.local API and never leaves the user's device. This permission is essential for persisting user settings and custom rules across browser sessions.
```

### Host Permission justification (http://127.0.0.1:17321/*)

```
The host permission for http://127.0.0.1:17321/* is required to send browsing classification events to the ZoneIn macOS application running on the user's local machine. The extension sends URL classification events to this local HTTP server so the macOS app can display the user's focus score. This communication happens entirely on the user's own machine (localhost) - no external network requests are made. The extension continues to function normally even if the macOS app is not running, as classification happens locally in the extension.
```

---

## 3. Remote Code

**Answer:** "No, I am not using Remote code"

**Justification (if asked):**

```
All JavaScript code is included in the extension package. The extension uses only local script files (background.js, popup.js, options.js, rules-engine.js, transport.js) that are bundled with the extension. There are no external script references, no eval() calls, no Function() constructors, and no dynamic code loading from remote sources. All code is static and included in the extension ZIP package. The extension sends data to a local server (127.0.0.1) which processes it with AI, but this AI processing happens outside the extension on the user's local machine.
```

---

## 4. Data Usage

### What user data do you plan to collect?

**Check ONLY:**
- ✅ **Web history** - The list of web pages a user has visited, as well as associated data such as page title and time of visit

**DO NOT check:**
- ❌ Personally identifiable information
- ❌ Health information
- ❌ Financial and payment information
- ❌ Authentication information
- ❌ Personal communications
- ❌ Location
- ❌ User activity (clicks, mouse position, scroll, keystroke logging)
- ❌ Website content

**Explanation:**
The extension monitors URLs and page titles of visited websites to classify them and send classification events to the local macOS app. It does not collect any other data types.

### Certifications (CHECK ALL THREE):

- ✅ I do not sell or transfer user data to third parties, outside of the approved use cases
- ✅ I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- ✅ I do not use or transfer user data to determine creditworthiness or for lending purposes

---

## 5. Privacy Policy URL

```
https://raw.githubusercontent.com/AbhinavBajaj/ZoneIn-Extension/master/PRIVACY.md
```

**Note:** Make sure your privacy policy mentions:
- URLs are sent to localhost server (127.0.0.1:17321)
- The local macOS app may use AI to process classifications
- All processing happens on the user's machine
- No data is sent to external servers

---

## Summary

**Permissions you need:**
- ✅ `tabs` - To monitor URLs
- ✅ `storage` - To save preferences/rules
- ✅ `host_permissions` for `127.0.0.1:17321/*` - To send events to macOS app

**Permissions you DON'T need:**
- ❌ `nativeMessaging` - Removed (you're using HTTP transport)

**This is simpler and will get approved faster!** 🎉
