# Privacy Policy for ZoneIn Extension

**Last Updated:** January 26, 2026

## Overview

ZoneIn Extension ("we", "our", or "the extension") is committed to protecting your privacy. This privacy policy explains how we handle your data when you use our Chrome extension.

## Data Collection and Processing

**We do not collect, store, or transmit any personal data to external servers.**

All processing happens locally on your device:

- **URL Monitoring**: The extension monitors website URLs you visit to classify them as productive, neutral, or distracting. This classification happens entirely on your device using local rules.
- **Local Storage**: Your preferences, custom rules, and settings are stored locally in your browser's storage. This data never leaves your device.

## What We Don't Do

- ❌ We do not send any data to external servers
- ❌ We do not use analytics or tracking
- ❌ We do not collect personal information
- ❌ We do not share data with third parties
- ❌ We do not use cookies for tracking

## Optional Features

### Native Messaging

If you have the ZoneIn desktop application installed, the extension can communicate with it using Chrome's native messaging feature. This communication:

- Happens entirely on your local machine
- Does not involve any external servers
- Is optional and can be disabled in the extension settings

### HTTP Transport

The extension sends classification events to the ZoneIn macOS application running on your local machine via `http://127.0.0.1:17321/events`. This:

- Sends URL classification data to your local macOS app
- The macOS app may use AI to process and analyze your browsing patterns
- All communication stays on your local machine (localhost)
- The extension works independently even if the macOS app is not running
- All AI processing happens on your local machine - no data is sent to external servers

## Permissions Explained

The extension requests the following permissions:

- **`tabs`**: To monitor your browsing activity and classify websites
- **`storage`**: To save your preferences and custom rules locally
- **`host_permissions`**: To send classification events to the ZoneIn macOS app running on localhost (127.0.0.1:17321)

All permissions are used only for the stated purposes and no data leaves your device.

## Your Rights

You have full control over your data:

- **Disable Monitoring**: You can disable website monitoring at any time in the extension options
- **Clear Data**: You can clear all stored data via Chrome's extension settings
- **Modify Rules**: You can view, edit, and delete custom rules in the extension options
- **Uninstall**: You can uninstall the extension at any time, which removes all local data

## Data Storage

All data is stored locally in your browser:

- **Chrome Storage API**: Used for preferences and settings
- **No Cloud Storage**: Nothing is synced to the cloud or external servers
- **No Cookies**: We do not use cookies

## Third-Party Services

This extension does not integrate with any third-party services that collect data. The only optional integration is with the ZoneIn desktop application, which runs locally on your machine.

## Children's Privacy

This extension is not intended for children under 13. We do not knowingly collect any information from children.

## Changes to This Policy

We may update this privacy policy from time to time. We will notify users of any material changes by updating the "Last Updated" date at the top of this policy.

## Contact Us

If you have questions about this privacy policy or how we handle your data, please contact us at:

- Email: hello@zonein.io
- Website: https://zonein.io

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

---

**Note**: This privacy policy is hosted on https://zonein.io/privacy-policy. For the most up-to-date version, please visit the hosted URL.
