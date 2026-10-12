# SLOTWISE — Complete Build Plan (for OpenCode)

> Working name "Slotwise" is a placeholder. Keep every brand string in one config object (`/assets/js/config.js`) so renaming is a one-file change.
> This is a **concept / portfolio project**. All testimonials, stats, logos and customer names are fictional placeholders and must be labeled as such (see §16).

---

## 0. HOW TO USE THIS FILE (instructions to the coding agent)

1. Read the entire file before writing code.
2. Build exactly what is specified. Where a detail is not specified, choose the simplest option that matches the design system in §4.
3. Build order is in §17. Finish and self-check each phase before moving on.
4. Do not use any framework build step. Output must be deployable by dragging the folder to Netlify.
5. Do not invent extra pages, sections, or libraries not listed here.
6. When done, run the acceptance checklist in §18 and report which items pass.

---

## 1. PRODUCT DEFINITION

**What it is:** Slotwise is a SaaS that cuts no-shows and refills empty slots for appointment-based local businesses (dental clinics, salons, gyms/studios, physio and general clinics).

**Core job:** Every booked appointment gets automatic reminders and one-tap confirm/reschedule. If someone cancels or doesn't confirm, Slotwise instantly offers the slot to a waitlist. Customers who miss an appointment get a friendly win-back message.

**Who buys:** Owner or front-desk manager. Non-technical. Busy. Cares about revenue and staff time, not features.

**Main promise (headline):** Fewer empty chairs. More booked days.

**Primary CTA:** "Start free trial" (14 days, no card).
**Secondary CTA:** "See how it works" (scrolls to demo).
**Tertiary CTA (pricing/footer):** "Book a 15-min demo".

**Core messaging pillars:**
1. Reminders that people actually answer (SMS + WhatsApp + email).
2. Empty slots refill themselves (waitlist auto-offer).
3. Missed visits come back (win-back flows).
4. Set up in an afternoon, no tech skills.

**Tone of voice:** Warm, plain-spoken, confident, a little witty. Short sentences. No jargon ("leverage", "synergy", "robust" are banned). Speak to "you" and "your clients".

---

## 2. TECH STACK AND CONSTRAINTS

- Static site: plain **HTML5 + CSS3 + vanilla JavaScript (ES modules)**.
- No bundler, no npm requirement to run. Fonts via Google Fonts `<link>` with `display=swap`.
- Optional animation: **GSAP + ScrollTrigger from cdnjs** only if needed; otherwise CSS + IntersectionObserver. Prefer the latter.
- Icons: inline SVG (Lucide-style, 1.75px stroke, rounded caps), stored as `<symbol>` sprites in `/assets/icons/sprite.svg`.
- Images: only generated SVG illustrations and CSS shapes. No stock photos, no copyrighted logos, no real brand marks. Where logos are needed, use text-only placeholder wordmarks of fictional businesses.
- Deployment: Netlify static. Include `netlify.toml` (headers + 404 handling) and `_redirects` if needed.
- Performance targets: Lighthouse ≥ 95 Performance, 100 Accessibility, ≥ 95 SEO, ≥ 95 Best Practices on mobile. LCP < 2.0 s. CLS < 0.05. No layout shift from fonts (use `size-adjust` fallbacks or preload).
- Browser support: last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 16+.

---

## 3. FILE AND FOLDER STRUCTURE

```
slotwise/
├─ index.html
├─ pricing.html
├─ book-demo.html
├─ privacy.html
├─ 404.html
├─ netlify.toml
├─ robots.txt
├─ sitemap.xml
├─ site.webmanifest
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css        (design tokens only)
│  │  ├─ base.css          (reset, typography, utilities)
│  │  ├─ layout.css        (container, grid, section spacing)
│  │  ├─ components.css    (buttons, cards, badges, forms, nav, footer)
│  │  ├─ sections.css      (per-section styles)
│  │  └─ pages.css         (pricing/demo/legal specifics)
│  ├─ js/
│  │  ├─ config.js         (brand name, nav links, pricing data, copy constants)
│  │  ├─ main.js           (entry: init everything)
│  │  ├─ nav.js            (sticky nav, mobile drawer)
│  │  ├─ reveal.js         (scroll reveal)
│  │  ├─ calculator.js     (no-show revenue calculator)
│  │  ├─ chat-demo.js      (reminder conversation simulator)
│  │  ├─ industry-tabs.js  (industry switcher)
│  │  ├─ pricing-toggle.js (monthly/annual)
│  │  ├─ faq.js            (accordion)
│  │  └─ form.js           (demo form validation + fake submit)
│  ├─ icons/sprite.svg
│  └─ img/                 (og-image.png 1200x630, favicon.svg, apple-touch-icon.png)
```

Each HTML page loads the same CSS files in the order above and `main.js` as `type="module"` with `defer`.

---

## 4. DESIGN SYSTEM

### 4.1 Aesthetic direction
"Friendly clinic-meets-boutique." Light, warm, airy, tactile. Rounded shapes, soft shadows, a hand-drawn squiggle accent, calm confidence. It must feel nothing like a cold enterprise dashboard. Think: paper-cream background, deep pine ink, a single hot coral accent used sparingly for action.

### 4.2 Color tokens (`tokens.css`)
```
--cream-50:  #FFFDF9;   /* page bg lightest */
--cream-100: #FBF7F0;   /* default page bg */
--cream-200: #F3ECDF;   /* alt section bg */
--cream-300: #E8DECB;   /* borders on cream */

--pine-950: #0A2420;    /* darkest, footer bg, headings on light */
--pine-900: #0E3B34;    /* primary dark */
--pine-700: #1C5A50;
--pine-500: #2F7D70;
--pine-100: #D8EBE6;

--coral-600: #E5502F;   /* hover/pressed */
--coral-500: #F4694C;   /* primary accent / CTA */
--coral-100: #FDE3DC;

--sun-400:  #F6C453;    /* highlight / star / badge */
--sun-100:  #FCEFC9;

--ink-900: #17211F;     /* body text */
--ink-600: #4A5754;     /* secondary text */
--ink-400: #7C8885;     /* muted text */

--success: #1F9D6B;  --warning: #E0A100;  --danger: #D13B3B;
```
Contrast rules: body text `--ink-900` on `--cream-100` (≥ 12:1). CTA button text `#FFFFFF` on `--coral-500` must be bold 16px+ (verify ≥ 4.5:1; if not, darken to `--coral-600` for the button background). Never put coral text on cream for body copy.

### 4.3 Typography
- Display: **Fraunces** (variable, weights 600–800, optical size on, "SOFT" 50 if available). Used for H1, H2, big stat numbers.
- UI/body: **DM Sans** (400, 500, 700).
- Fluid scale (`clamp`):
  - H1: `clamp(2.5rem, 1.6rem + 4.2vw, 5rem)`, line-height 1.02, letter-spacing -0.02em
  - H2: `clamp(2rem, 1.4rem + 2.6vw, 3.25rem)`, line-height 1.08
  - H3: `clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)`, line-height 1.25
  - Body L: 1.125rem / 1.65; Body: 1rem / 1.6; Small: 0.875rem / 1.5
  - Eyebrow: 0.8125rem, uppercase, tracking 0.12em, weight 700, color `--pine-700`
- Max line length 62ch for paragraphs.

### 4.4 Spacing, radius, shadow, motion
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px. Section vertical padding: `clamp(64px, 8vw, 128px)`.
- Container: max-width 1200px, side padding `clamp(20px, 5vw, 48px)`.
- Radius: sm 10px, md 16px, lg 24px, xl 32px, pill 999px.
- Shadows: `--shadow-1: 0 1px 2px rgba(10,36,32,.06), 0 4px 12px rgba(10,36,32,.06)`; `--shadow-2: 0 8px 24px rgba(10,36,32,.10)`; `--shadow-3: 0 24px 60px rgba(10,36,32,.16)`.
- Borders: 1px solid `--cream-300`.
- Motion: ease `cubic-bezier(.22,.8,.24,1)`; durations 160ms (hover), 320ms (UI), 700ms (reveal). Reveal = fade + translateY(16px). **Respect `prefers-reduced-motion`**: disable all non-essential motion, show content immediately.

### 4.5 Signature visual motifs
1. **Squiggle underline** (hand-drawn SVG path, coral) under one key word in H1 and H2s.
2. **Appointment-slot chips**: rounded rectangles with a small time label (e.g., "9:30"), states: booked (pine), open (dashed outline), refilled (coral with sparkle), no-show (struck-through, muted).
3. **Soft blob backgrounds**: two blurred organic shapes (cream-200, pine-100) behind hero, low opacity.
4. **Paper grain**: subtle SVG noise overlay at 4% opacity on cream backgrounds.

### 4.6 Components
- **Button**: height 52px (large) / 44px (default); radius pill; primary = coral bg + white text + `--shadow-1`; hover lifts 2px and darkens; secondary = pine-900 outline, transparent bg; ghost = text only with arrow that nudges 4px on hover. Focus ring: 3px `--sun-400` offset 2px.
- **Card**: bg `--cream-50`, 1px border, radius lg, padding 28–32px, hover: translateY(-4px) + shadow-2.
- **Badge**: pill, 12px bold, bg `--pine-100` text `--pine-900`.
- **Input**: 52px height, radius md, 1.5px border `--cream-300`, focus border `--pine-700` + 4px ring `--pine-100`. Label above, helper text below, error text in `--danger` with icon.
- **Nav**: sticky, 72px, bg `rgba(251,247,240,.85)` + backdrop blur, bottom border appears after 8px scroll.
- **Footer**: bg `--pine-950`, text cream, coral hover on links.

---

## 5. GLOBAL LAYOUT RULES

- Mobile-first. Breakpoints: 480, 768, 1024, 1280.
- 12-col grid on desktop with 24px gutters; stack to 1 col under 768.
- Every section: eyebrow → H2 → one-line subcopy (max 2 lines) → content. Alternate backgrounds: cream-100 / cream-200 / cream-100 ... with one pine-900 dark section (the results section) for rhythm.
- Skip-to-content link, `<main id="main">`, semantic landmarks, one `<h1>` per page.
- Tap targets ≥ 44px. No horizontal scroll at 320px.

---

## 6. NAVIGATION (all pages)

Left: logo (inline SVG: calendar-slot glyph made of 3 rounded bars with one coral + wordmark "Slotwise" in Fraunces 700).
Center links: Product (anchor `/#how`), Industries (`/#industries`), Pricing (`/pricing.html`), FAQ (`/#faq`).
Right: "Log in" (text link, goes to `#`), "Start free trial" (primary button → `/book-demo.html?plan=trial`).
Mobile (<900px): hamburger opens full-height drawer from right, links stacked at 28px Fraunces, CTA pinned at bottom, focus trapped, ESC closes, body scroll locked.
Active link has coral 2px underline.

Top announcement bar (index only, dismissible, remembers dismissal in `sessionStorage`): "New: WhatsApp reminders are live. →" (links to #features).

---

## 7. HOME PAGE (`index.html`) — SECTION BY SECTION

### 7.1 Hero
- Layout: 2 columns (copy 6 cols / visual 6 cols); stack on mobile (copy first).
- Eyebrow badge: "For clinics, salons & studios".
- H1: "Fewer empty chairs. **More booked days.**" ("More booked days" gets squiggle underline in coral.)
- Subcopy: "Slotwise reminds your clients, refills cancelled slots from your waitlist, and wins back no-shows — automatically. Set up in an afternoon."
- CTAs: [Start free trial] [See how it works ▸]
- Micro-trust under CTAs (small, with 3 check icons): "14-day free trial · No credit card · Cancel anytime".
- Visual (right): a **floating "Today's schedule" card** (rounded xl, shadow-3) listing 6 time slots (9:00–12:30). Animation loop (JS, 9 s cycle, paused when off-screen or reduced motion):
  1. All slots "booked".
  2. 10:30 slot flips to "cancelled" (strike-through) with a small red toast "Cancelled".
  3. A coral pill "Offering to 3 on waitlist…" appears.
  4. 10:30 flips to "Refilled · Ayesha M." with sparkle and a green "+$85 recovered" tag floating up.
  5. Pause 2 s, reset.
  Behind it: two smaller floating cards (phone bubble "Reply C to confirm ✓" and a stat chip "No-shows −38%") with slow parallax float (translateY ±8px, 6s ease-in-out infinite).
- Below hero CTAs on mobile the visual simply sits underneath, scaled to 100%.

### 7.2 Trust strip
Text: "Built for appointment-based businesses like" followed by 6 industry chips with icons (Dental clinics, Hair & beauty salons, Gyms & studios, Physio clinics, Medical clinics, Spas). No fake brand logos.

### 7.3 Problem section ("The quiet leak")
- Eyebrow: "The problem". H2: "Every empty slot is money walking out the door."
- 3 cards in a row, each with big Fraunces number and caption (placeholders; add "Illustrative figures" footnote):
  1. "1 in 5" — "appointments are missed or cancelled late."
  2. "$150" — "average revenue lost per missed appointment."
  3. "6 hrs" — "a week your front desk spends on reminder calls."
- Under cards, a left-aligned line: "You could chase every client by hand. Or you could let Slotwise do it."

### 7.4 No-show revenue calculator (interactive)
- Card with two columns: inputs left, live result right.
- Inputs (range sliders with numeric readouts and +/- steppers):
  - Appointments per week (10–400, default 80)
  - Average value per appointment in $ (10–500, default 90)
  - Current no-show rate % (2–40, default 15)
- Output: "You're losing about **$X / month**" (animated count-up), and "With Slotwise (est. −40% no-shows) you could recover **$Y / month**" in coral, plus a tiny bar comparing "Now" vs "With Slotwise".
- Formulas: `lost_month = appts_week * 4.33 * rate * value`; `recovered = lost_month * 0.40`.
- Footnote: "Estimate based on a modeled 40% reduction. Your results will vary."
- CTA below: "Start recovering that →".
- Accessibility: sliders have `aria-valuetext`, output in `aria-live="polite"`.

### 7.5 How it works (`#how`)
- Eyebrow "How it works". H2: "Three steps. Zero chasing."
- Left: vertical stepper (3 steps, numbered circles joined by dashed line). Right: **chat-demo** phone mockup that changes per active step. Steps auto-advance every 6s; clicking a step selects it and pauses auto-advance.
  1. **Connect your calendar** — "Link Google Calendar or your booking tool. Your appointments sync in seconds." Phone shows a "Connected ✓" screen with calendar list.
  2. **Reminders go out by themselves** — "Friendly SMS, WhatsApp or email at the times you choose. Clients tap to confirm or reschedule." Phone shows a conversation: Slotwise bubble "Hi Sara! Reminder: Dental check-up tomorrow at 10:30. Reply C to confirm or R to reschedule." → client bubble "C" → Slotwise "Confirmed ✓ See you tomorrow!"
  3. **Empty slots refill, no-shows return** — "Cancellations are offered to your waitlist instantly. Missed visits get a kind nudge to rebook." Phone shows a waitlist offer: "A 10:30 slot just opened today. Want it? Reply Y" → "Y" → "Booked ✓".
- Chat bubbles animate in sequentially (typing indicator 700ms then message). Respect reduced motion (show all at once).

### 7.6 Features grid (`#features`)
- H2: "Everything the front desk wishes it had time for."
- 6 cards (3×2 desktop, 1 col mobile), each: icon in pine-100 circle, H3, 2-line description, tiny "Learn more" ghost link (non-functional anchor).
  1. Smart reminders — "Multi-step reminders by SMS, WhatsApp and email at the times that work best."
  2. One-tap confirm & reschedule — "Clients answer in one tap. No calls, no app to download."
  3. Instant waitlist refill — "Cancelled slot? Next-in-line gets the offer in seconds."
  4. Win-back flows — "Kind, automatic messages that bring missed visits back to your calendar."
  5. Deposit & policy links — "Share your cancellation policy and take deposits for high-risk slots."
  6. Simple reports — "See no-shows, refills and recovered revenue on one calm page."
- Featured card (Instant waitlist refill) spans 2 columns on desktop with a mini slot-chip illustration.

### 7.7 Industries (`#industries`)
- Tabs: Dental · Salon · Gym & Studio · Clinic. Keyboard-accessible (arrow keys, `role="tablist"`).
- Each tab panel: left = heading + 3 bullets of how Slotwise helps that business; right = a themed slot-chip illustration and a quote-style "Typical result" callout (labeled "Illustrative").
  - Dental: long appointments, high value, recall reminders (6-month check-ups), pre-visit forms link.
  - Salon: stylist-specific waitlist, last-minute gap filling, color-appointment deposits.
  - Gym & Studio: class waitlist auto-promotion, late-cancel windows, trial-class follow-ups.
  - Clinic: confirm-by-reply, reschedule links, reminder languages (English/Arabic note: "Reminders in your clients' language").
- RTL note for Arabic is future scope; include a small badge "Arabic & English messages".

### 7.8 Results (dark section, pine-900)
- H2 (cream): "Calmer days. Fuller calendars."
- 4 stat counters (count up on scroll): "−38% no-shows", "92% reminders read", "3 min avg. to refill a slot", "+$1,240 recovered per month (avg.)". Footnote: "Illustrative placeholder figures for this concept project."
- One large testimonial carousel below (3 slides, fictional people, clearly labeled "Fictional example"): name, role, business type, a 2-sentence quote. Autoplay off; arrows + dots; swipe on mobile.

### 7.9 Comparison table
- H2: "Slotwise vs. doing it by hand."
- Table: rows = Reminders sent, Confirmations tracked, Cancelled slots refilled, Win-back messages, Time spent per week, Cost; columns = "By hand / spreadsheets" vs "Slotwise". By-hand column uses muted ✕ and grey; Slotwise column pine-100 highlight with coral ✓. On mobile, convert to stacked cards.

### 7.10 Integrations
- H2: "Works with the tools you already use." A 4×2 grid of text-only chips with simple generic icons: Google Calendar, Outlook Calendar, WhatsApp, SMS, Email, Zapier-style webhooks, Make.com, CSV import. (Text names only, no trademarked logos.)

### 7.11 Pricing teaser
- 3 compact plan cards pulled from `config.js` (Starter, Growth, Pro) with "from $X/mo" and a link "See full pricing →".

### 7.12 FAQ (`#faq`)
Accordion, one open at a time, `button[aria-expanded]`. Questions:
1. Do my clients need to download an app? — No. They reply to a message or tap a link.
2. Which calendars and booking tools does it connect to? — Google Calendar and Outlook today, plus CSV import and webhooks for anything else.
3. Is WhatsApp allowed for reminders? — Yes, using approved message templates through the official business channels.
4. How long does setup take? — Most businesses are live in an afternoon.
5. Can I customize the messages? — Yes, tone, wording, language and timing.
6. What happens to my clients' data? — It's encrypted in transit and at rest; you can export or delete it any time.
7. Can I cancel anytime? — Yes. No contracts.
Include FAQPage JSON-LD in `<head>`.

### 7.13 Final CTA
Large rounded xl panel (coral-100 bg, squiggle decoration): H2 "Fill your calendar, not your inbox." Subcopy "Try Slotwise free for 14 days." Buttons: [Start free trial] [Book a 15-min demo].

### 7.14 Footer
4 columns: Brand + 1-line pitch + small "Made in Doha" line (neutral, optional); Product (How it works, Features, Pricing, Integrations); Industries (Dental, Salon, Gym, Clinic); Company (Book a demo, Privacy, Contact). Bottom row: © year Slotwise · "Concept project — all data fictional" · language chip (visual only).

---

## 8. PRICING PAGE (`pricing.html`)

- Hero: H1 "Simple pricing that pays for itself." Subcopy: "One recovered appointment a week usually covers it."
- Billing toggle (Monthly / Annual, annual = 2 months free, badge "Save 17%"). Smooth number swap animation.
- 3 cards (data in `config.js`):
  - **Starter** $29/mo ($24 annual) — 1 location, up to 150 reminders/mo, SMS + email, basic reports.
  - **Growth** $79/mo ($66 annual) — **Most popular** (coral ribbon, slightly elevated): up to 800 reminders/mo, WhatsApp, waitlist auto-refill, win-back flows.
  - **Pro** $159/mo ($132 annual) — multi-location (up to 5), unlimited reminders fair-use, deposits, priority support, custom sender name.
- Each card: price, "per month, billed monthly/annually", feature list with check icons, CTA button.
- Below: full feature comparison table (collapsible on mobile).
- "Need more?" strip with Book-a-demo link.
- Pricing FAQ (4 items): trial details, changing plans, overage, refunds.
- Product JSON-LD offers markup optional.

---

## 9. BOOK A DEMO PAGE (`book-demo.html`)

- Two columns: left = reassurance copy (3 benefits + a fictional-person quote), right = form card.
- Fields: Full name*, Work email*, Business name*, Business type* (select: Dental, Salon, Gym/Studio, Clinic, Other), Appointments per week (select ranges), Phone/WhatsApp (optional), "What would you like to fix?" (textarea, optional). Hidden `plan` field from query string.
- Validation: inline, on blur and submit, accessible error messages tied via `aria-describedby`; email regex; disable button while "sending".
- Submit: no backend. Use Netlify Forms (`data-netlify="true"`, honeypot field `bot-field`, hidden `form-name`) and show a success panel (animated check, "Thanks! We'll reply within one business day.").
- Success state is in the same page (no redirect).

---

## 10. PRIVACY PAGE (`privacy.html`) AND 404

- Privacy: plain-language template page labeled "Sample policy for a concept project", with headings (What we collect, How we use it, Sharing, Retention, Your rights, Contact). Table of contents sticky on desktop.
- 404: friendly illustration (slot chip with a question mark), H1 "This slot is empty.", sub "The page you wanted isn't booked here.", button "Back to home".

---

## 11. INTERACTION SPECS (JS behavior)

- **Reveal**: IntersectionObserver, threshold 0.15, adds `.is-visible`; stagger children by 80ms using CSS var `--i`.
- **Count-up**: runs once on enter, 1.2s easeOutCubic, uses `Intl.NumberFormat`.
- **Hero loop**: state machine with timeouts; clears timers on `visibilitychange` hidden and when `prefers-reduced-motion` (then show the final "refilled" state statically).
- **Chat demo**: data-driven from a JS array per step; supports pause/resume; announces nothing to screen readers except a hidden text transcript (`aria-live="off"`, with a visually hidden full transcript available).
- **Tabs / accordion / carousel**: follow WAI-ARIA authoring practices (roving tabindex, Home/End).
- **Nav scroll state** via IntersectionObserver sentinel, not scroll listeners.
- **Smooth scroll** only with `scroll-behavior: smooth` guarded by media query for reduced motion; anchor offset via `scroll-margin-top: 88px`.
- No layout thrash: use `transform` and `opacity` only for animations.

---

## 12. CONTENT RULES

- Headlines ≤ 10 words. Subcopy ≤ 24 words. Card text ≤ 20 words.
- Use real-feeling microcopy for buttons ("Start free trial", not "Submit").
- Names for fictional testimonials: "Dr. Layla H. — Dental clinic owner", "Marcus T. — Salon owner", "Priya S. — Studio manager". Always tagged "Fictional example".
- Currency: USD in the UI. Keep a `currency` field in `config.js` for later localization.

---

## 13. SEO AND META

- Per page: unique `<title>` (≤ 60 chars), meta description (≤ 155), canonical, Open Graph + Twitter card, theme-color `#0E3B34`.
- Home title: "Slotwise — Cut no-shows and refill empty slots automatically".
- JSON-LD: `Organization`, `SoftwareApplication` (home), `FAQPage` (home/pricing).
- `sitemap.xml` and `robots.txt` included. Add `noindex` meta on the concept site if requested by the owner (default: indexable).
- OG image: generate a 1200×630 SVG-to-PNG export with brand colors and the hero slot-card.

---

## 13b. ACCESSIBILITY

- WCAG 2.2 AA. Visible focus on every interactive element. Color is never the only signal (slot states also use icon/strike-through).
- Landmarks, headings in order, `alt` text for meaningful images, `aria-hidden` for decorative SVG.
- Forms: labels, errors, required indicators in text not color alone.
- Test with keyboard only and a screen reader pass on nav, tabs, accordion, form.

---

## 14. PERFORMANCE AND QUALITY

- Inline critical CSS for above-the-fold (hero + nav) or keep CSS small enough (< 40 KB gzipped total).
- Preload the two font files used above the fold; `font-display: swap`.
- SVG only; no raster images except OG/touch icons.
- Defer all JS; each module under 6 KB min where possible.
- `netlify.toml`: security headers (CSP allowing Google Fonts, `X-Content-Type-Options`, `Referrer-Policy`), long-cache for `/assets/*`.

---

## 15. RESPONSIVE BEHAVIOR (summary table)

| Area | ≥1024 | 768–1023 | <768 |
|---|---|---|---|
| Hero | 2 col | 1 col, visual scaled 90% | 1 col, visual full width |
| Features | 3×2 | 2×3 | 1 col |
| Calculator | 2 col | 2 col | stacked, result sticky at bottom |
| How it works | stepper + phone | stepper above phone | steps become accordion, phone below |
| Pricing | 3 cards | 3 cards compact | stacked, "Most popular" first |
| Table | full | full | stacked cards |

---

## 16. TRANSPARENCY LABELS (required)

- Footer: "Concept project. All names, figures and testimonials are fictional placeholders."
- Under any stat or testimonial: "Illustrative" / "Fictional example".
- No real company logos, no claims of real customers, no fake review badges, no fake awards.

---

## 17. BUILD ORDER

1. **Phase 1 — Foundation:** folder structure, `tokens.css`, `base.css`, layout, nav, footer, sprite icons, `config.js`.
2. **Phase 2 — Home static:** all sections with final copy, fully responsive, no JS.
3. **Phase 3 — Interactions:** reveal, hero loop, calculator, chat demo, tabs, carousel, accordion.
4. **Phase 4 — Other pages:** pricing (with toggle), book-demo (form + Netlify), privacy, 404.
5. **Phase 5 — Polish:** motion tuning, reduced-motion, focus states, microcopy pass.
6. **Phase 6 — Technical:** SEO tags, JSON-LD, sitemap, robots, manifest, `netlify.toml`, OG image.
7. **Phase 7 — QA:** run §18.

---

## 18. ACCEPTANCE CHECKLIST

- [ ] All 5 pages render with no console errors at 320, 375, 768, 1024, 1440 px.
- [ ] No horizontal scroll on any viewport.
- [ ] Hero loop, calculator, chat demo, tabs, carousel, FAQ, pricing toggle, form all work by mouse, touch and keyboard.
- [ ] `prefers-reduced-motion` disables animation without hiding content.
- [ ] Lighthouse mobile: Perf ≥ 95, A11y 100, BP ≥ 95, SEO ≥ 95.
- [ ] Every image/icon has appropriate alt or is hidden from AT.
- [ ] All brand strings come from `config.js`.
- [ ] Concept/fictional labels present (§16).
- [ ] No third-party logos, stock photos, or copied text from other sites.
- [ ] Deploys cleanly by dragging the folder into Netlify.
