# Chrome Web Store Upload Checklist

## ✅ Automated Steps (Completed)

- [x] Production package built: `zonein-extension-v1.0.0.zip`
- [x] Package verified (15 files, all essential components included)
- [x] Manifest validated (version 1.0.0, all required fields present)
- [x] Privacy policy template created: `PRIVACY.md`

## 📋 Manual Steps (For You)

### Step 1: Host Privacy Policy

1. **Option A: GitHub (Easiest)**
   - Push `PRIVACY.md` to your GitHub repo
   - Get the raw URL: `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/PRIVACY.md`
   - Or use GitHub Pages if you have it set up

2. **Option B: Your Website**
   - Upload `PRIVACY.md` to your website
   - Get the public URL: `https://yourwebsite.com/privacy-policy`

3. **Update PRIVACY.md first:**
   - Replace `[YOUR_EMAIL@example.com]` with your actual email
   - Replace `[YOUR_GITHUB_REPO_URL]` with your repo URL (if applicable)
   - Replace `[YOUR_HOSTING_URL]` with the URL where you'll host it

**Save this URL - you'll need it when uploading!**

### Step 2: Take Screenshots

Take at least 1 screenshot (recommended: 3-5) at **1280x800** or **640x400** pixels:

- [ ] **Screenshot 1**: Extension popup showing classification
- [ ] **Screenshot 2**: Options page
- [ ] **Screenshot 3**: Rules management interface
- [ ] **Screenshot 4**: Extension in action (optional)
- [ ] **Screenshot 5**: Settings/transport mode (optional)

**Tip**: Use Chrome's developer tools to resize your browser window to exact dimensions.

### Step 3: Prepare Store Listing Text

#### Short Description (132 characters max):
```
Classifies browsing as productive, neutral, or distracting using intelligent URL rules
```

#### Detailed Description (16,000 characters max):
You can use this template or customize it:

```
ZoneIn Extension helps you stay focused by automatically classifying websites as productive, neutral, or distracting.

Features:
• Automatic URL classification using intelligent rules
• Real-time browsing monitoring
• Customizable rules management
• Integration with ZoneIn desktop app (optional)
• Privacy-focused: all processing happens locally

How it works:
The extension monitors your browsing activity and classifies each website visit based on predefined rules. You can customize these rules to match your personal productivity preferences.

Perfect for:
• Students and professionals who want to track focus time
• Anyone looking to understand their browsing habits
• Users of the ZoneIn desktop application

Privacy:
All data processing happens locally on your device. No data is sent to external servers. See our privacy policy for details.
```

### Step 4: Upload to Chrome Web Store

1. Go to: https://chrome.google.com/webstore/devconsole
2. Click **"New Item"**
3. Upload: `zonein-extension-v1.0.0.zip`
4. Wait for validation (check for errors)

### Step 5: Fill Store Listing Form

Fill in these sections:

#### Store Listing:
- [ ] **Name**: ZoneIn Extension
- [ ] **Summary**: (use short description from Step 3)
- [ ] **Description**: (use detailed description from Step 3)
- [ ] **Category**: Productivity
- [ ] **Language**: English (United States)

#### Privacy:
- [ ] **Privacy Policy URL**: (paste the URL from Step 1)

#### Distribution:
- [ ] **Visibility**: 
  - Start with **"Unlisted"** for testing (only people with link can install)
  - Change to **"Public"** after testing
- [ ] **Regions**: All regions (or select specific)
- [ ] **Pricing**: Free

#### Assets:
- [ ] Upload screenshots from Step 2
- [ ] (Optional) Promotional images
- [ ] (Optional) Video URL

#### Additional Information:
- [ ] **Homepage URL**: (optional - your website or GitHub)
- [ ] **Support URL**: (optional but recommended)
- [ ] **Email**: Your support email

### Step 6: Review & Submit

- [ ] Review all information
- [ ] Check privacy policy URL is accessible
- [ ] Verify screenshots look good
- [ ] Click **"Submit for Review"**

### Step 7: Wait for Review

- Review typically takes **1-3 business days**
- You'll receive an email when reviewed
- Check dashboard for status updates

## 📦 Package Details

**File**: `zonein-extension-v1.0.0.zip`  
**Location**: `/Users/abhinavbajaj/Documents/zonein-extension/zonein-extension-v1.0.0.zip`  
**Size**: ~53 KB  
**Files**: 15 files (all essential components)

## 🔍 Quick Test Before Upload

You can test the build package locally:

1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `build/` directory (not the ZIP file)
5. Test that everything works

If it works from the `build/` directory, the ZIP will work too!

## ⚠️ Common Issues

**If upload fails:**
- Make sure ZIP file is not corrupted
- Verify manifest.json is valid JSON
- Check that all icon files are present

**If review is rejected:**
- Privacy policy URL must be publicly accessible
- Description must clearly explain what the extension does
- Permissions must be justified (yours are fine - tabs for monitoring, storage for preferences)

## 📝 Notes

- The extension uses Manifest V3 (required for new extensions)
- All permissions are justified and reasonable
- Privacy policy is required - don't skip Step 1!
- You can update the extension later by uploading a new ZIP with incremented version number

Good luck! 🚀
