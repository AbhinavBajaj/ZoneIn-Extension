# Publishing ZoneIn Extension to Chrome Web Store

This guide walks you through the complete process of publishing your Chrome extension to the Chrome Web Store.

## Prerequisites

### 1. Chrome Web Store Developer Account

You need a Google Developer account to publish extensions:

1. **Sign up for Chrome Web Store Developer Program**
   - Go to: https://chrome.google.com/webstore/devconsole
   - Sign in with your Google account
   - Pay the **one-time $5 registration fee** (required for all developers)
   - Complete the registration process

2. **Verification**
   - Google may require identity verification
   - This can take a few hours to a few days

## Step 1: Prepare Your Extension Package

### Create a Production Build

1. **Create a clean build directory** (exclude development files):

```bash
cd /Users/abhinavbajaj/Documents/zonein-extension

# Create build directory
mkdir -p build

# Copy essential files only
cp manifest.json build/
cp background.js build/
cp rules-engine.js build/
cp transport.js build/
cp rules.json build/
cp popup.html build/
cp popup.js build/
cp popup.css build/
cp options.html build/
cp options.js build/
cp options.css build/

# Copy icons directory
cp -r icons build/

# DO NOT include:
# - tests/ directory
# - native-host/ directory (optional, but not needed for store)
# - .git/ directory
# - .gitignore
# - README.md, DEPLOY.md, etc. (optional)
# - create-icons.html
# - verify-setup.js
```

### Verify Manifest

Ensure your `manifest.json` is production-ready:

- ✅ Version number is correct (e.g., "1.0.0")
- ✅ Name is clear and descriptive
- ✅ Description is accurate
- ✅ All required icons are present (16, 48, 128)
- ✅ Permissions are minimal and justified
- ✅ No development URLs or test paths

### Create ZIP Package

```bash
cd build
zip -r ../zonein-extension-v1.0.0.zip .
cd ..
```

**Important**: The ZIP file should contain the files directly, not a folder containing the files. When you unzip it, you should see `manifest.json` at the root, not `zonein-extension-v1.0.0/manifest.json`.

## Step 2: Prepare Store Assets

Before uploading, prepare these assets:

### Required Assets

1. **Screenshots** (at least 1, recommended 5)
   - **1280x800 or 640x400 pixels**
   - Recommended screenshots:
     - Popup UI showing classification
     - Options page
     - Rules management interface
     - Extension in action (before/after)
     - Settings page

2. **Privacy Policy** (REQUIRED)
   - Must be hosted on a publicly accessible URL
   - Must explain:
     - What data is collected (if any)
     - How data is used
     - Data storage and sharing
   - For your extension, mention:
     - URL monitoring for classification
     - Local storage usage
     - Native messaging (if applicable)
     - No data sent to external servers (if true)

3. **Detailed Description** (up to 16,000 characters)
   - Clear explanation of features
   - Use cases
   - How it works
   - Benefits

4. **Short Description** (132 characters)
   - Brief summary for store listing

5. **Category**
   - Recommended: **Productivity**

6. **Language**
   - Default: English (US)

### Optional but Recommended

- **Promotional images** (440x280 for small, 920x680 for large)
- **Video** (YouTube link)
- **Support URL** (your website or GitHub)
- **Homepage URL**

## Step 3: Upload to Chrome Web Store

### Initial Upload

1. **Go to Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Sign in with your Google account

2. **Create New Item**
   - Click **"New Item"** button
   - Click **"Choose file"** and select your ZIP file (`zonein-extension-v1.0.0.zip`)
   - Click **"Upload"**

3. **Wait for Processing**
   - Google will validate your extension
   - Check for errors or warnings
   - Fix any issues before proceeding

### Fill Store Listing

After upload, you'll see a form with these sections:

#### 1. Store Listing

- **Name**: `ZoneIn Extension` (or your preferred name)
- **Summary**: Short description (132 chars max)
  - Example: "Classifies browsing as productive, neutral, or distracting using intelligent URL rules"
- **Description**: Detailed description
  - Example:
    ```
    ZoneIn Extension helps you stay focused by automatically classifying websites as productive, neutral, or distracting.
    
    Features:
    • Automatic URL classification using intelligent rules
    • Real-time browsing monitoring
    • Customizable rules management
    • Integration with ZoneIn desktop app
    • Privacy-focused: all processing happens locally
    
    How it works:
    The extension monitors your browsing activity and classifies each website visit based on predefined rules. You can customize these rules to match your personal productivity preferences.
    
    Perfect for:
    • Students and professionals who want to track focus time
    • Anyone looking to understand their browsing habits
    • Users of the ZoneIn desktop application
    ```
- **Category**: Select **Productivity**
- **Language**: English (United States)

#### 2. Privacy

- **Privacy Policy URL**: 
  - Required! Must be a publicly accessible URL
  - Example: `https://yourwebsite.com/privacy-policy`
  - Or: `https://github.com/yourusername/zonein-extension/blob/main/PRIVACY.md`
  - **Note**: GitHub raw URLs work: `https://raw.githubusercontent.com/yourusername/zonein-extension/main/PRIVACY.md`

#### 3. Distribution

- **Visibility**: 
  - **Unlisted**: Only people with the link can install (good for testing)
  - **Public**: Anyone can find and install (for production)
- **Regions**: Select countries (or "All regions")
- **Pricing**: Free

#### 4. Assets

- **Screenshots**: Upload your screenshots (1280x800 or 640x400)
- **Promotional images** (optional)
- **Video** (optional)

#### 5. Additional Information

- **Homepage URL** (optional)
- **Support URL** (optional but recommended)
- **Email** (for support)

### Review Your Submission

Before submitting:

- ✅ All required fields filled
- ✅ Privacy policy URL is accessible
- ✅ Screenshots uploaded
- ✅ Description is clear and accurate
- ✅ ZIP file contains correct files
- ✅ No errors in validation

## Step 4: Submit for Review

1. **Click "Submit for Review"**
2. **Review Process**:
   - Initial review: 1-3 business days
   - Google checks for:
     - Policy compliance
     - Security issues
     - Functionality
     - Accurate store listing

3. **Possible Outcomes**:
   - ✅ **Approved**: Extension goes live
   - ⚠️ **Rejected**: You'll receive feedback to fix issues
   - 📝 **More Info Needed**: Google may ask questions

## Step 5: After Approval

### Your Extension is Live!

- Users can find it by searching
- You'll get a public URL like: `https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID`
- Share this URL to distribute your extension

### Updating Your Extension

1. **Make changes** to your code
2. **Update version** in `manifest.json` (e.g., "1.0.1")
3. **Create new ZIP** with updated files
4. **Go to Developer Dashboard**
5. **Select your extension**
6. **Click "Package" → "Upload new package"**
7. **Upload new ZIP**
8. **Submit update** (review process is usually faster for updates)

## Important Notes

### Permissions Justification

Your extension requests these permissions:
- `tabs`: To monitor browsing activity
- `storage`: To save user preferences and rules
- `nativeMessaging`: To communicate with desktop app
- `host_permissions`: For local HTTP communication

**Be prepared to justify** these permissions if Google asks. They're all reasonable for your use case.

### Privacy Policy Template

If you need a privacy policy, here's a basic template:

```markdown
# Privacy Policy for ZoneIn Extension

Last updated: [Date]

## Data Collection

ZoneIn Extension processes your browsing activity locally on your device. We do not collect, store, or transmit any personal data to external servers.

## What We Process

- **URLs**: The extension monitors website URLs you visit to classify them as productive, neutral, or distracting.
- **Local Storage**: Your preferences and custom rules are stored locally in your browser.

## Data Usage

- URL classification happens entirely on your device
- No data is sent to external servers
- No analytics or tracking is performed

## Third-Party Services

This extension may communicate with:
- ZoneIn Desktop Application (via native messaging or local HTTP) - only if you have the desktop app installed
- All communication stays on your local machine

## Your Rights

You can:
- Disable the extension at any time
- Clear all stored data via browser settings
- Review and modify rules in the extension options

## Contact

For questions about privacy, contact: [your-email@example.com]
```

Save this as `PRIVACY.md` and host it on GitHub or your website.

### Common Rejection Reasons

- Missing or inaccessible privacy policy
- Insufficient description
- Permissions not justified
- Extension doesn't work as described
- Violates Chrome Web Store policies
- Security vulnerabilities

## Troubleshooting

### Upload Errors

**"Invalid ZIP file"**
- Ensure ZIP contains files directly, not a folder
- Check for hidden files or system files
- Recreate ZIP from clean directory

**"Manifest errors"**
- Validate JSON syntax
- Check all required fields are present
- Verify icon paths are correct

### Review Rejections

**"Privacy policy required"**
- Create and host a privacy policy
- Ensure URL is publicly accessible
- Update store listing with correct URL

**"Permissions need justification"**
- Add detailed description explaining each permission
- Be specific about why each permission is needed

## Next Steps

1. ✅ Create Chrome Web Store Developer account ($5 fee)
2. ✅ Prepare production ZIP package
3. ✅ Create privacy policy and host it
4. ✅ Take screenshots of your extension
5. ✅ Write store listing description
6. ✅ Upload and submit for review
7. ✅ Wait for approval (1-3 days)
8. ✅ Share your extension URL!

## Resources

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Chrome Web Store Developer Program](https://developer.chrome.com/docs/webstore/register/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)

Good luck with your publication! 🚀
