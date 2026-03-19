# Heist Landing Page — Deployment Guide

## What's in the package

```
deploy/
├── index.html        # Main landing page (CRO-optimized)
├── privacy.html      # Privacy policy
├── terms.html        # Terms of service
├── 404.html          # Custom 404 page
├── favicon.svg       # SVG favicon (purple H)
├── _redirects        # URL routing (Netlify/Cloudflare Pages)
└── _headers          # Security + caching headers
```

## Step 1: Email capture backend (5 minutes)

The email form is wired to Formspree. Set it up:

1. Go to **https://formspree.io** and sign up (free tier = 50 submissions/month)
2. Click **New Form** → name it "Heist Early Access"
3. Copy your form ID (looks like `xabc1234`)
4. Open `index.html` and find this line near the bottom:
   ```js
   const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
5. Replace `YOUR_FORM_ID` with your actual form ID
6. Formspree emails you every submission automatically

**Alternative backends** (if you want more control later):
- **ConvertKit** — best for drip email sequences ($0 up to 10K subscribers)
- **Buttondown** — minimal, developer-friendly newsletter tool
- **Supabase** — free Postgres DB, wire up with a 5-line edge function
- **Google Sheets** — use a Google Apps Script webhook to push emails to a sheet

## Step 2: Choose your host (all free)

### Option A: Cloudflare Pages (recommended)

Best performance, free SSL, global CDN, supports `_redirects` and `_headers`.

1. Push the `deploy/` folder to a GitHub repo (or upload directly)
2. Go to **https://dash.cloudflare.com** → Pages → Create Project
3. Connect your GitHub repo (or upload the folder)
4. Build settings: leave blank (no build command needed — it's static)
5. Deploy — you'll get a `*.pages.dev` URL immediately
6. Add your custom domain in project settings (see Step 3)

### Option B: Netlify

1. Go to **https://app.netlify.com** → Add New Site → Deploy manually
2. Drag the entire `deploy/` folder into the upload area
3. Done — you'll get a `*.netlify.app` URL
4. Add custom domain in Site Settings → Domain Management

### Option C: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the `deploy/` folder
3. Run `vercel` and follow the prompts
4. Add custom domain in project settings

## Step 3: Connect heistbrain.com

You've already registered heistbrain.com. Now point it to your host.

### If using Cloudflare Pages:

1. In Cloudflare dashboard → your Pages project → Custom Domains
2. Click "Set up a custom domain" → enter `heistbrain.com`
3. Cloudflare auto-configures DNS if the domain is already on Cloudflare
4. Add `www.heistbrain.com` as well (redirects to root)
5. SSL is automatic — no action needed

### If using Netlify or Vercel:

1. In your hosting dashboard, add `heistbrain.com` as a custom domain
2. They'll give you DNS records (typically a CNAME or A record)
3. Go to your domain registrar's DNS settings
4. Add the records they specify
5. Wait 5-30 minutes for propagation
6. SSL is automatic on all three hosts

## Step 4: Create an OG image (10 minutes)

The page references `https://heistbrain.com/og-image.png` for social sharing previews.

**Quick option:** Create a 1200×630px image with:
- Dark background (#06050C)
- "Heist." logo top-left
- "A month of content. Ten minutes." as headline
- Purple accent gradient
- Save as `og-image.png` in the `deploy/` folder

**Tools:** Figma, Canva, or even just a screenshot of the hero section cropped to 1200×630.

## Step 5: Add analytics (2 minutes)

### Google Analytics

Add this right before the closing `</head>` tag in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your Measurement ID from Google Analytics.

### Plausible (privacy-friendly alternative)

```html
<script defer data-domain="heistbrain.com" src="https://plausible.io/js/script.js"></script>
```

## Step 6: Pre-launch checklist

### Before going live:
- [ ] Replace `YOUR_FORM_ID` in index.html with real Formspree ID
- [ ] Test email capture — submit a test email, verify it arrives
- [ ] Test exit-intent popup (move mouse above viewport on desktop)
- [ ] Test mobile sticky CTA (resize browser to mobile width, scroll down)
- [ ] Test all anchor links (#how, #features, #pricing, #faq, #start)
- [ ] Test pricing toggle (monthly ↔ annual)
- [ ] Test marquee controls (pause/play, speed change)
- [ ] Test FAQ expand/collapse
- [ ] Create and upload `og-image.png` (1200×630)
- [ ] Create and upload `apple-touch-icon.png` (180×180)
- [ ] Add analytics snippet
- [ ] Deploy to host
- [ ] Connect heistbrain.com domain
- [ ] Verify SSL certificate is active (https works)
- [ ] Test the live URL in Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- [ ] Test the live URL in Twitter Card Validator
- [ ] Test on mobile (real device, not just browser resize)

### After going live:
- [ ] Share the URL on social and verify OG card renders correctly
- [ ] Set up Formspree email notifications
- [ ] Monitor form submissions
- [ ] Consider upgrading to ConvertKit/Buttondown for drip sequences

## Link Map (all functional)

| Link | Destination | Status |
|------|------------|--------|
| Nav logo | `/` (homepage) | ✅ Working |
| How It Works | `#how` (anchor scroll) | ✅ Working |
| Features | `#features` (anchor scroll) | ✅ Working |
| Pricing | `#pricing` (anchor scroll) | ✅ Working |
| FAQ | `#faq` (anchor scroll) | ✅ Working |
| Get Your Time Back → | `#start` (anchor scroll) | ✅ Working |
| Try Heist Free (hero) | `#start` (anchor scroll) | ✅ Working |
| See How It Works | `#how` (anchor scroll) | ✅ Working |
| Start Free Trial (×3) | `#start` (anchor scroll) | ✅ Working |
| Try Heist Free (final) | Email capture form | ✅ Working |
| Get Access (exit popup) | Email capture form | ✅ Working |
| Privacy | `/privacy` → privacy.html | ✅ Working |
| Terms | `/terms` → terms.html | ✅ Working |
| Contact | `mailto:pulledtheheist@gmail.com` | ✅ Working |
| Changelog | `/changelog` → redirects to `/` | ✅ Redirect |
| About | `/about` → redirects to `/` | ✅ Redirect |
| Blog | `/blog` → redirects to `/` | ✅ Redirect |

## Folder structure for future pages

When you're ready to add About, Blog, or Changelog pages, create them as HTML files:

```
deploy/
├── index.html
├── about.html        # Add when ready
├── blog.html         # Add when ready — or use a CMS
├── changelog.html    # Add when ready
├── privacy.html
├── terms.html
├── 404.html
├── favicon.svg
├── og-image.png      # Create this
├── apple-touch-icon.png  # Create this (180×180)
├── _redirects        # Remove redirect lines as you add real pages
└── _headers
```
