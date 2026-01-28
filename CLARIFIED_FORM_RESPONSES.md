# CLARIFIED Chrome Web Store Form Responses

Based on your actual setup where:
- Extension classifies URLs using LOCAL rules (rules.json)
- Extension sends events to localhost server (127.0.0.1:17321)
- Your server calls AI to classify (this is OUTSIDE the extension)

## Key Points:

1. **Remote Code**: NO - Your extension doesn't use remote code. All code is bundled locally.
2. **AI Classification**: The AI happens in YOUR SERVER, not in the extension. The extension just sends URLs to localhost.
3. **Permissions**: You may not need ALL of them - let's clarify what you actually use.

---

## Questions to Answer:

### 1. Do you use Native Messaging?
- If YES → Keep `nativeMessaging` permission
- If NO → Remove it from manifest.json

### 2. Do you use HTTP transport (127.0.0.1:17321)?
- If YES → Keep `host_permissions` for 127.0.0.1:17321
- If NO → Remove it from manifest.json

### 3. Does your extension work WITHOUT the server?
- Looking at your code: YES - it classifies locally using rules.json
- The server is just for receiving events (optional)

---

## RECOMMENDED: Minimal Permissions

If you want to minimize permissions and avoid extra review:

**Keep:**
- ✅ `tabs` - Required to monitor URLs
- ✅ `storage` - Required to save rules/preferences

**Consider Removing (if not needed):**
- ❓ `nativeMessaging` - Only if you don't use native messaging
- ❓ `host_permissions` - Only if you don't use HTTP transport

**BUT**: If users need both transport methods, keep both permissions.

---

## Updated Form Responses

### 1. Single Purpose Description

```
ZoneIn Extension helps users understand their browsing habits by automatically classifying websites as productive, neutral, or distracting. The extension monitors URLs you visit and classifies them using local rules stored in the extension. All classification happens locally on your device. The extension can optionally send classification events to a local server running on your machine (127.0.0.1:17321) for users who want to track their browsing with the ZoneIn desktop application, but this is completely optional and the extension works fully without it.
```

### 2. Remote Code

**Answer:** "No, I am not using Remote code"

**Why:** All JavaScript code is included in the extension package. The extension uses only local script files (background.js, popup.js, options.js, rules-engine.js, transport.js) that are bundled with the extension. There are no external script references, no eval() calls, and no dynamic code loading from remote sources.

**Note:** Your server calling AI is OUTSIDE the extension, so it doesn't count as remote code in the extension itself.

### 3. Permission Justifications

#### tabs (REQUIRED)
```
The tabs permission is required to monitor browsing activity and classify websites. The extension listens for tab URL changes and active tab switches to detect when users navigate to different websites. This is essential for the extension's core functionality: classifying browsing activity. The extension only accesses tab URLs - it does not access page content, cookies, or any other tab data. All classification happens locally using static rules bundled with the extension.
```

#### storage (REQUIRED)
```
The storage permission is used to save user preferences and custom classification rules locally in the browser. This includes: monitoring on/off toggle, transport mode selection, user-created custom rules for classifying websites, and event history for display in the popup. All data is stored locally using Chrome's storage.local API and never leaves the user's device.
```

#### nativeMessaging (ONLY IF YOU USE IT)
```
The nativeMessaging permission enables optional communication with the ZoneIn desktop application for users who have it installed. This allows the extension to send browsing classification events to the desktop app. This is completely optional - the extension works fully without it. All communication happens locally on the user's machine between the extension and a locally-installed native messaging host. No data is sent to external servers.
```

#### Host Permission 127.0.0.1:17321 (ONLY IF YOU USE IT)
```
The host permission for http://127.0.0.1:17321/* is used as an optional transport method to send browsing classification events to a local HTTP server running on the user's machine. This is completely optional - the extension works fully without it. The extension only communicates with localhost (127.0.0.1) on the user's own machine - no external network requests are made. This permission is only used if the user explicitly enables HTTP transport mode in the extension settings.
```

### 4. Data Usage

**What user data do you plan to collect?**
- ✅ Check: **"Web history"** - The list of web pages a user has visited, as well as associated data such as page title and time of visit

**Important Note:** Even though your server calls AI, you should disclose that:
- The extension sends URLs to a local server (localhost)
- The local server may process this data with AI
- But this is optional and happens on the user's machine

**Certifications (check all three):**
- ✅ I do not sell or transfer user data to third parties
- ✅ I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- ✅ I do not use or transfer user data to determine creditworthiness or for lending purposes

### 5. Privacy Policy URL

```
https://raw.githubusercontent.com/AbhinavBajaj/ZoneIn-Extension/master/PRIVACY.md
```

**IMPORTANT:** Update your privacy policy to mention:
- URLs are sent to localhost server (127.0.0.1)
- The local server may use AI to process classifications
- All processing happens on the user's machine
- No data is sent to external servers

---

## Action Items:

1. **Decide which permissions you actually need:**
   - Do you use native messaging? → Keep or remove `nativeMessaging`
   - Do you use HTTP transport? → Keep or remove `host_permissions`

2. **Update your privacy policy** to mention:
   - URLs sent to localhost server
   - Server may use AI (but on user's machine)
   - No external data transmission

3. **Update manifest.json** to remove unused permissions (if any)

4. **Rebuild package** after removing permissions

---

## My Recommendation:

**Keep all permissions** if:
- Users might use either transport method
- You want flexibility

**Remove unused permissions** if:
- You only use one transport method
- You want faster review (fewer permissions = less scrutiny)

The choice is yours! What do you actually use?
