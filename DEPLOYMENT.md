# 🌤️ Puff - Production Deployment Guide

Complete guide for launching Puff on Google Play Store.

---

## 📋 Pre-Launch Checklist

### ✅ Completed
- [x] Privacy Policy HTML created (`public/privacy-policy.html`)
- [x] Health Disclaimer component added
- [x] Error Boundary implemented
- [x] Analytics system (privacy-first)
- [x] BubbleWrap config created (`twa-manifest.json`)
- [x] Play Store assets template created

### ⏳ To Do Before Launch

---

## 🚀 Step-by-Step Deployment

### 1. Set Up GitHub Pages (For Privacy Policy)

```bash
# Enable GitHub Pages in your repo settings
# Go to: Settings → Pages → Source → main branch → /root folder
# Your privacy policy will be at:
# https://yourusername.github.io/puff-breathwork/privacy-policy.html
```

**Action Items:**
- [ ] Create GitHub repository (if not already done)
- [ ] Enable GitHub Pages
- [ ] Test privacy policy URL works

---

### 2. Register Domain (Optional but Recommended)

**Recommended domains:**
- `puffbreathwork.com` (~$12/year)
- `puff-app.com` (~$12/year)
- `breathepuff.com` (~$12/year)

**Why register:**
- Professional email (support@puffbreathwork.com)
- Custom privacy policy URL
- Landing page for the app
- Better trust with users

**Action Items:**
- [ ] Purchase domain (Namecheap, Google Domains, etc.)
- [ ] Set up email forwarding to your personal email
- [ ] Update privacy policy contact info

---

### 3. Generate App Icons

**Required Sizes:**
- 512x512 PNG (Play Store, TWA)
- 192x192 PNG (Android launcher)
- Adaptive icon (XML + foreground/background layers)

**From Your Puff SVG:**

```bash
# Option 1: Use an online converter
# https://icon.kitchen/ (free, generates Android icons)

# Option 2: Use ImageMagick locally
convert puff.svg -resize 512x512 puff-512.png
convert puff.svg -resize 192x192 puff-192.png

# Option 3: Use Figma/Canva
# Export as PNG at required sizes
```

**Place icons in:**
```
public/
├── icons/
│   ├── puff-512.png
│   ├── puff-192.png
│   └── puff-adaptive.xml (if using adaptive icon)
```

**Action Items:**
- [ ] Generate 512x512 PNG from Puff SVG
- [ ] Generate 192x192 PNG
- [ ] Test icons look good on Android home screen

---

### 4. Install BubbleWrap

```bash
# Install Node.js (if not already installed)
# https://nodejs.org/

# Install BubbleWrap globally
npm install -g @bubblewrap/cli

# Verify installation
bubblewrap --version
```

**Action Items:**
- [ ] Install Node.js v18+
- [ ] Install BubbleWrap CLI
- [ ] Verify installation works

---

### 5. Generate Signing Key

```bash
# Navigate to project directory
cd /path/to/puff-breathwork

# Generate keystore (KEEP THIS SAFE!)
keytool -genkey -v -keystore puff-keystore.jks -keyalg RSA \
  -keysize 2048 -validity 10000 -alias puff

# You'll be prompted for:
# - Keystore password (remember this!)
# - Your name, organization, etc.
```

**⚠️ IMPORTANT:**
- Backup your keystore file securely
- Never lose the password
- This key signs all your app updates
- If lost, you cannot update your app on Play Store

**Action Items:**
- [ ] Generate keystore
- [ ] Backup keystore to secure location (password manager, encrypted drive)
- [ ] Update `twa-manifest.json` with correct keystore path

---

### 6. Build TWA (Trusted Web Activity)

```bash
# Update twa-manifest.json with your values:
# - host: "yourusername.github.io"
# - baseDir: "/puff-breathwork" (or "/" if using custom domain)
# - applicationId: "com.yourdomain.puff"

# Build the Android app
bubblewrap build

# This creates:
# - app-release-signed.aab (for Play Store)
# - app-release-unsigned.apk (for testing)
```

**Action Items:**
- [ ] Update `twa-manifest.json` with correct values
- [ ] Run `bubblewrap build`
- [ ] Test `.apk` on Android device
- [ ] Verify all features work (breathing, cycle mode, themes, etc.)

---

### 7. Create Play Console Account

```
1. Go to: https://play.google.com/console
2. Sign up with Google account
3. Pay $25 one-time registration fee
4. Complete developer profile
```

**Action Items:**
- [ ] Create Play Console account
- [ ] Pay registration fee
- [ ] Complete developer profile

---

### 8. Create Play Store Listing

**Use assets from `PLAY_STORE_ASSETS.md`:**

**Required:**
- [ ] App name (e.g., "Puff - Your Breathwork Companion")
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (minimum 2, recommended 8)
- [ ] Privacy policy URL
- [ ] Contact email
- [ ] Content rating (IARC questionnaire)

**Optional:**
- [ ] Promo video (30 seconds)
- [ ] A/B test variants

**Action Items:**
- [ ] Create all graphic assets
- [ ] Write descriptions (use templates provided)
- [ ] Complete content rating questionnaire
- [ ] Set pricing ($9.99 one-time premium)
- [ ] Select distribution countries (all)

---

### 9. Upload App to Play Store

```
1. Create new app in Play Console
2. Select "App" (not Game)
3. Enter app name
4. Upload .aab file (from bubblewrap build)
5. Complete store listing
6. Submit for review
```

**Review Timeline:**
- First review: 3-7 days typically
- Subsequent updates: 1-3 days

**Action Items:**
- [ ] Upload .aab file
- [ ] Complete all store listing fields
- [ ] Submit for review
- [ ] Wait for approval

---

### 10. Post-Launch

**Monitor:**
- [ ] Crash reports (Play Console → Android Vitals)
- [ ] User reviews and ratings
- [ ] Install numbers
- [ ] Analytics (if enabled)

**Update Cycle:**
- Fix bugs as reported
- Add features based on user feedback
- Update every 2-4 weeks initially

---

## 🔧 Configuration Files

### Update These Before Building:

**`twa-manifest.json`:**
```json
{
  "source": {
    "host": "yourusername.github.io",
    "baseDir": "/puff-breathwork"
  },
  "android": {
    "applicationId": "com.yourdomain.puff",
    "signing": {
      "path": "./puff-keystore.jks"
    }
  }
}
```

**`public/privacy-policy.html`:**
- Replace `[yourdomain].com` with actual domain
- Replace `[yourusername]` with GitHub username
- Add real contact email

**`PLAY_STORE_ASSETS.md`:**
- Replace all placeholder URLs
- Add actual contact information

---

## 📱 Testing Checklist

Before submitting to Play Store, test on actual Android device:

- [ ] App installs successfully
- [ ] Onboarding flow works
- [ ] Health disclaimer appears on first launch
- [ ] All breathing programs start and complete
- [ ] Mood check-in works
- [ ] Cycle mode tracking works
- [ ] Theme switching works
- [ ] Settings save correctly
- [ ] Premium upgrade flow works (test purchase)
- [ ] Analytics toggle works
- [ ] "Delete All Data" works
- [ ] App works offline (after first load)
- [ ] No crashes after 10+ minutes of use
- [ ] Push notifications permission (if implemented)

---

## 💰 Monetization Setup

**In-App Purchase (One-time):**

Since we're using RevenueCat stub for web, for production you have options:

**Option A: RevenueCat (Recommended)**
```
1. Create RevenueCat account (free tier available)
2. Set up Google Play in-app product
3. Replace revenuecat.js stub with actual SDK
4. Configure product ID: "premium_unlock"
5. Price: $9.99 USD
```

**Option B: Google Play Billing Directly**
```
1. Set up in Play Console
2. Implement billing library
3. More work, no RevenueCat fees
```

**Option C: Keep Free (Launch Strategy)**
```
1. Launch completely free
2. Add "Support Puff" donation option
3. Add premium later based on feedback
```

---

## 🎯 Launch Strategy

### Week 1: Soft Launch
- Release in 2-3 small countries first (e.g., New Zealand, Ireland)
- Test for critical bugs
- Gather initial feedback

### Week 2-3: Iterate
- Fix any issues found
- Update app based on feedback
- Prepare marketing materials

### Week 4: Global Launch
- Release worldwide
- Announce on social media
- Reach out to wellness communities
- Consider Product Hunt launch

---

## 📞 Support Setup

**Recommended:**
- Email: support@[yourdomain].com (forward to your personal)
- GitHub Issues: Enable for bug reports
- Twitter/X: @puffbreathwork (optional)

**Auto-responder Template:**
```
Thanks for contacting Puff support! 

I'll get back to you within 24-48 hours. For faster help:
- Check our FAQ: [link]
- Report bugs on GitHub: [link]
- Privacy concerns: privacy@[yourdomain].com

Breathe easy,
[Your name]
Founder, Puff Breathwork
```

---

## 🎉 You're Ready!

Once all checkboxes are complete, you're ready to launch Puff to the world! 🌤️

**Questions?** Reach out or check:
- BubbleWrap docs: https://github.com/GoogleChromeLabs/bubblewrap
- Play Console Help: https://support.google.com/googleplay/android-developer
- RevenueCat docs: https://docs.revenuecat.com

Good luck! 🚀
