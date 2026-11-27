#!/usr/bin/env python3
"""Visibility Phase 1 (audit/visibility-2026-11 in the app repo): one deterministic pass over the
site's <head> metadata and JSON-LD. Visible page copy is NOT touched.

  python scripts/visibility-phase1.py          # apply
  python scripts/visibility-phase1.py --check  # report what would change, write nothing

Idempotent: running it twice changes nothing the second time.
"""
import glob, html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHECK = "--check" in sys.argv
SKIP_DIRS = ("blog/", ".claude/", "scripts/", "node_modules/", "_gen/", "docs/")

HOME_TITLE = "Heist | Content Planner & Social Media Scheduler"
HOME_DESC = ("Plan your month, create on-brand content and schedule your social posts in one place. "
             "Bring the AI you already use. 7-day free trial, no card.")
APP_DESC = ("Content planner and social media scheduler that keeps your brand voice on file and works with the AI "
            "you already use (Claude, ChatGPT or your own API key) to plan, write and schedule a month of social posts.")
ORG_DESC = ("Heist is a content planner and social media scheduler for small businesses, consultants and creators. "
            "It keeps your brand voice on file and works with the AI you already use to plan, draft, review and schedule your posts.")
ABOUT_TITLE = "About Heist | Steal Your Time Back"
ABOUT_DESC = ("Heist is a content planner and social media scheduler for small businesses, consultants and creators. "
              "What it does, what it costs, and who builds it.")

# Solution pages: (title, description). Metadata only; body copy is a later content phase.
FOR = {
    "for/agencies.html": ("Social Media Planning for Small Agencies | Heist",
        "Plan and approve content for up to 25 client brands, each with its own voice, calendar and approvals. One login for every client. 7-day free trial."),
    "for/authors.html": ("Content Planner for Authors | Heist",
        "Turn your book ideas into a month of social posts in your voice, build a readership and plan launches without feeling salesy. 7-day free trial."),
    "for/coaches.html": ("Content Calendar for Coaches | Heist",
        "Plan a month of posts that sound like you, keep them on one calendar, and approve each one before it posts. 7-day free trial."),
    "for/consultants.html": ("Content Planning for Consultants & Small Firms | Heist",
        "Turn your expertise into a month of LinkedIn and social posts in your voice, and review everything before it goes out. 7-day free trial."),
    "for/ecommerce.html": ("Social Media Planner for Ecommerce Brands | Heist",
        "Plan a month of product-focused social posts in your brand voice, review them, and schedule them in one place. 7-day free trial."),
    "for/fitness-creators.html": ("Content Planner for Fitness Coaches & Trainers | Heist",
        "Plan workout tips, client wins and program launches in your voice, then review and schedule them in one place. 7-day free trial."),
    "for/freelancers.html": ("Social Media Planner for Freelancers | Heist",
        "Stay visible without becoming a full-time marketer: plan a month of posts in your voice and schedule them in one place. 7-day free trial."),
    "for/nonprofits.html": ("Social Media Planner for Nonprofits | Heist",
        "Plan storytelling, fundraising and advocacy posts in your organization's voice, then review and schedule them in one place. 7-day free trial."),
    "for/real-estate.html": ("Social Media Planner for Real Estate Agents | Heist",
        "Plan listing posts, market updates and local content in your voice, then review and schedule them in one place. 7-day free trial."),
    "for/saas.html": ("Content Planning for B2B SaaS Teams | Heist",
        "Plan thought leadership, launch campaigns and product posts in your brand voice, review them, and schedule them in one place. 7-day free trial."),
}

# Phrase-level fixes inside <head> and JSON-LD only (old -> new).
PHRASES = [
    ("The AI content OS that runs from your favorite AI.", "Plan your content from the AI you already use."),
    ("Heist is the AI content OS designed to be operated from chat.", "Plan and draft from chat; review and schedule in Heist."),
    ("multi-platform AI content OS", "multi-platform content planner"),
    ("a single AI content OS", "one content planning workspace"),
    ("How Heist works — AI Content OS", "How Heist works: plan, write and schedule your month"),
    ("Heist — AI Content OS pricing", "Heist pricing and plans"),
    ("The AI content operating system built for", "A content planner built for"),
    ("The AI content operating system for", "A content planner for"),
    ("the AI content OS that remembers your brand", "a content planner and social media scheduler that keeps your brand voice on file"),
    ("Heist is the AI content OS for", "Heist is a content planner and social media scheduler for"),
    ("Heist Brain Changelog", "Heist Changelog"),
    ("for Heist Brain.", "for Heist."),
    ("from Heist Brain", "from Heist"),
    ("See what's new in Heist Brain.", "See what's new in Heist."),
    ("Changelog — Heist Brain Product Updates", "Changelog — Heist Product Updates"),
    ("Follow along as Heist ships weekly updates to the AI content OS.", "Follow along as Heist ships weekly updates."),
]
KEYWORD_DROP = re.compile(r"\s*(AI content OS|content OS from chat|content OS|Heist Brain updates|Heist Brain learning|Heist Brain blog),?", re.I)

HUBS = {}  # https://heistbrain.com/x/index.html -> https://heistbrain.com/x/
for f in glob.glob(os.path.join(ROOT, "*", "index.html")):
    d = os.path.basename(os.path.dirname(f))
    HUBS[f"https://heistbrain.com/{d}/index.html"] = f"https://heistbrain.com/{d}/"

ICON_LINKS = ('<link rel="icon" href="/favicon.ico" sizes="32x32">', '<link rel="manifest" href="/manifest.webmanifest">')


def set_tag(head, pattern_attr, value):
    """Replace content="..." of <meta {pattern_attr}>, value is plain text."""
    esc = html.escape(value, quote=True)
    rx = re.compile(r'(<meta\s+' + pattern_attr + r'\s+content=")[^"]*(")')
    return rx.sub(lambda m: m.group(1) + esc + m.group(2), head)


def set_title(head, value):
    return re.sub(r"<title>[^<]*</title>", "<title>" + html.escape(value, quote=False) + "</title>", head, count=1)


def edit_jsonld(doc, rel):
    """doc is the text between <script type=application/ld+json> tags."""
    for old, new in PHRASES:
        doc = doc.replace(old, new)
    doc = re.sub(r'("name"\s*:\s*)"Heist Brain"', r'\1"Heist"', doc)
    doc = re.sub(r'("logo"\s*:\s*\{\s*"@type"\s*:\s*"ImageObject"\s*,\s*"url"\s*:\s*)"https://heistbrain.com/og-image\.png"',
                 r'\1"https://heistbrain.com/img/heist-mark.webp"', doc)
    if rel in ("index.html", "pricing.html"):
        doc = re.sub(r'("@type"\s*:\s*"SoftwareApplication"\s*,\s*"name"\s*:\s*"Heist"\s*,\s*"description"\s*:\s*)"[^"]*"',
                     lambda m: m.group(1) + json.dumps(APP_DESC), doc)
    if rel == "index.html":
        doc = re.sub(r'\s*,\s*"alternateName"\s*:\s*"Heist Brain"', "", doc)
        doc = re.sub(r'("@type"\s*:\s*"Organization".*?"description"\s*:\s*)"[^"]*"',
                     lambda m: m.group(1) + json.dumps(ORG_DESC), doc, count=1, flags=re.S)
        doc = re.sub(r'\s*,\s*"potentialAction"\s*:\s*\{"@type"\s*:\s*"SearchAction".*?"query-input"\s*:\s*"[^"]*"\s*\}', "", doc, flags=re.S)
    if rel in FOR:
        t, d = FOR[rel]
        doc = re.sub(r'("@type"\s*:\s*"WebPage"\s*,\s*"name"\s*:\s*)"[^"]*"', lambda m: m.group(1) + json.dumps(t), doc)
    for old, new in HUBS.items():
        doc = doc.replace(old, new)
    return doc


changed = []
for path in sorted(glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True)):
    rel = os.path.relpath(path, ROOT).replace("\\", "/")
    if rel.startswith(SKIP_DIRS):
        continue
    src = open(path, encoding="utf-8").read()
    if "</head>" not in src:
        continue
    head, rest = src.split("</head>", 1)

    head = head.replace('<meta name="author" content="Heist Brain">', '<meta name="author" content="Heist">')
    for old, new in PHRASES:
        head = head.replace(old, new)
    head = re.sub(r'(<meta name="keywords" content=")([^"]*)(")',
                  lambda m: m.group(1) + KEYWORD_DROP.sub("", m.group(2)).strip(" ,") + m.group(3), head)
    head = re.sub(r'<script type="application/ld\+json">(.*?)</script>',
                  lambda m: '<script type="application/ld+json">' + edit_jsonld(m.group(1), rel) + "</script>", head, flags=re.S)
    for old, new in HUBS.items():
        head = head.replace(old, new)

    if rel == "index.html":
        head = set_title(head, HOME_TITLE)
        for a in ('name="description"', 'property="og:description"', 'name="twitter:description"'):
            head = set_tag(head, a, HOME_DESC)
        head = re.sub(r'\s*<meta name="keywords" content="[^"]*">', "", head)
    if rel == "about.html":
        head = set_title(head, ABOUT_TITLE)
        for a in ('property="og:title"', 'name="twitter:title"'):
            head = set_tag(head, a, ABOUT_TITLE)
        for a in ('name="description"', 'property="og:description"', 'name="twitter:description"'):
            head = set_tag(head, a, ABOUT_DESC)
    if rel in FOR:
        t, d = FOR[rel]
        head = set_title(head, t)
        for a in ('property="og:title"', 'name="twitter:title"'):
            head = set_tag(head, a, t)
        for a in ('name="description"', 'property="og:description"', 'name="twitter:description"'):
            head = set_tag(head, a, d)

    # Icons: favicon.ico + manifest next to the existing SVG favicon; apple-touch + theme-color where missing.
    m = re.search(r'<link rel="icon" href="(?:https://heistbrain\.com)?/favicon\.svg\?v=2"[^>]*>', head)
    if m:
        add = []
        if "/favicon.ico" not in head:
            add.append(ICON_LINKS[0])
        if 'rel="apple-touch-icon"' not in head:
            add.append('<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">')
        if 'rel="manifest"' not in head:
            add.append(ICON_LINKS[1])
        if 'name="theme-color"' not in head:
            add.append('<meta name="theme-color" content="#F3EEE3">')
        if add:
            head = head[:m.end()] + "\n" + "\n".join(add) + head[m.end():]

    # Validate every JSON-LD block still parses.
    for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>', head, flags=re.S):
        json.loads(blk)

    out = head + "</head>" + rest
    for old, new in HUBS.items():  # body links to hub index.html (rare)
        out = out.replace('href="' + old + '"', 'href="' + new + '"')
    if out != src:
        changed.append(rel)
        if not CHECK:
            open(path, "w", encoding="utf-8", newline="").write(out)

print(("would change" if CHECK else "changed"), len(changed), "files")
for r in changed:
    print("  ", r)
