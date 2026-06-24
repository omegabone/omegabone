# Come With Me — Page Style Guide
**URL:** omegabone.com/come-with-me
**Route file:** `src/app/pages/ComeWithMePage.tsx`

---

## Identity

**What this page is:** A crowdfunding / pre-order page for *Come With Me*, a "polyptych" artistic project by Omega Bone — a multinational divorce story told simultaneously as an album, a hardback novel, and a full-color comic book.

**Tagline:** "One Story. Multiple Formats. Zero Compromises."

**Eyebrow descriptor:** "A Multinational Divorce Story"

---

## Visual Identity

### Color Palette

| Role | Value |
|---|---|
| Page background | `#0c0c0c` (near-black) |
| Section alt background | `#0f0f0f`, `#0a0a0a`, `#0d0d0d` |
| Body text / cream | `#f0ead8` |
| Muted body text | `#a89880`, `#c8bfb0` |
| Very muted / ghost text | `#6b6b6b`, `#4a4a4a` |
| Accent red | `#ef4444` |
| Red vignette / radial bg | `#2a0505`, `#450a0a` |
| Card background | `#131313`, `#161616` |
| Card border | `#2a2a2a`, `#1e1e1e` |
| Gold (Angel tier only) | `#b8922a`, `#d4aa3a` |

### Typography

Three fonts, always referenced as inline style objects:

```js
const cinzel    = { fontFamily: "'Cinzel', serif" }
const cinzelDec = { fontFamily: "'Cinzel Decorative', serif" }
const garamond  = { fontFamily: "'EB Garamond', serif" }
```

| Use | Font | Weight | Style |
|---|---|---|---|
| Section eyebrows / labels | Cinzel | 400 | uppercase, wide letter-spacing (0.3–0.35em) |
| H1 main title | Cinzel Decorative | 700 | very large (`clamp(3rem, 10vw, 7rem)`) |
| H2 section headings | Cinzel | 700 | `clamp(1.6rem–2.8rem)` |
| H3 card titles | Cinzel | 700 | 1.3rem |
| Tier / label lines | Cinzel | 400–700 | small, uppercase |
| Body / story copy | EB Garamond | 400 | italic, `lineHeight: 1.8–1.9` |
| Red accent lines | Cinzel Decorative | 700 | e.g. "So she runs." |

### Divider Component

Used between sections. Red hairlines + red glyph:
```
——— ✦ ———
```
- Lines: `h-px w-16 bg-[#ef4444]/60`
- Glyph: `✦` in `#ef4444` at `1.2rem`

### List Bullet

All bullet lists use `✦` as the bullet, colored `#ef4444`.

---

## Page Sections (in order)

### 1. Hero

- Full-viewport (`min-height: 100vh`), dark background
- Decorative: noise texture SVG overlay + blood-red radial vignette at top
- **Eyebrow:** `A Multinational Divorce Story` — Cinzel, red, 0.35em tracking
- **H1:** `Come With Me` — Cinzel Decorative, `clamp(3rem, 10vw, 7rem)`, cream with red text-shadow glow (`0 0 60px rgba(239,68,68,0.4)`)
- **Subtitle:** `A  P O L Y P T Y C H` — Cinzel, red, widely spaced
- **Divider**
- **Body:** *"One Story. Multiple Formats. Zero Compromises."* — EB Garamond italic, muted cream (`#c8bfb0`)
- **Scroll cue:** "SCROLL" + animated bouncing chevron, opacity 0.5

---

### 2. The Story

- Dark section, centered text, `max-width: 700px`
- **Eyebrow:** `The Story`
- Four staggered lines in EB Garamond, large (`clamp(1.4rem, 4vw, 2rem)`), cream:
  - "A woman."
  - "A foreign country."
  - "A husband who won't let go."
  - "A legal system that won't protect her."
- **Climax line:** `So she runs.` — Cinzel Decorative, red, `clamp(1.8rem, 5vw, 2.8rem)`, bold
- **Divider**
- **Body:** *"Come With Me is a multinational divorce story told as a metaphysical journey — across borders, across formats, across the full range of human endurance."* — EB Garamond italic, muted (`#a89880`)

---

### 3. The Polyptych (Multiple Formats)

- Background: `#0f0f0f`
- **Eyebrow:** `The Multiple Formats`
- **H2:** "The heroine's flight across multiple objects"
- Three format cards in a responsive grid (`minmax(260px, 1fr)`):

| Card | Title | Accent |
|---|---|---|
| 1 | The Album | `#e0dcd4` |
| 2 | The Novel | `#c8bfb0` |
| 3 | The Comic | `#ef4444` (red) |

Each card: `background: #161616`, `border: 1px solid #1e1e1e`, `border-radius: 16px`, 2rem padding.

**Descriptions:**
- **The Album:** "10 original songs. Each one a chapter marker. Each one recorded raw - bedroom studios, late nights, no budget - and now being elevated to full professional standard. The rawness is preserved in the DNA."
- **The Novel:** "A hardback novel that carries the full weight of the journey - every border crossed, every door that closed, every silence that stretched too long. The story the songs cannot hold alone."
- **The Comic:** "A full-color glossy comic book. The final chapter. Not merchandise - it is the ending. Professional hands, every panel drawn and colored. The visual reckoning."

---

### 4. Conceived Across Three Continents

- Red radial background vignette
- **Eyebrow:** `Origin`
- **H2:** "Conceived Across Three Continents"
- SVG world map showing three location pins: **Newark (USA)**, **Düsseldorf (Germany)**, **Tokyo (Japan)**
- Map uses dark image background (`mapBgImg`) with top/bottom fade overlays into `#0c0c0c`
- **Body:** *"Every demo was recorded raw - bedroom studios, late nights, no budget. That rawness is preserved in the DNA of the work."* — EB Garamond italic
- **Accent line:** `Raw.  Real.` — Cinzel, red, bold, wide tracking

---

### 5. Press to Hear (Audio Player)

- Background: `#0a0a0a`
- **Eyebrow:** `The Work`
- **H2:** "Press the illustration"
- **Subtext:** *"Hear 'I Am' and you'll understand immediately."*
- Clickable Frankfurt illustration card (`frankfurtCardImg`) — max-width 340px, `border-radius: 16px`
  - When idle: dark overlay (`rgba(0,0,0,0.35)`), white frosted-glass play button
  - When playing: red glow (`0 0 60px rgba(239,68,68,0.5)`), red border, red play button with pulsing waveform bars
- **Track info below image:**
  - Title: `I Am` — Cinzel, cream, 0.85rem
  - Label: `Come With Me - Track 06` — EB Garamond italic, muted
  - Animated waveform bars (13 bars, red) appear on both sides when playing

---

### 6. All 10 Cards — The Journey

- Background: `#0f0f0f`
- **Eyebrow:** `The Journey`
- **H2:** "10 Songs. 10 Cities. One Escape."
- Two rows of 5 cards displayed as a fanned card spread
- Each card: `width: clamp(130px, 16vw, 200px)`, rotated and overlapping, hover lifts card up 24px with scale(1.08)

**Row 1 (Cards 1–5):**
| # | Image | City | Rotation |
|---|---|---|---|
| 1 | havanaImg | Havana | -16deg |
| 2 | spread1Img | Los Angeles | -8deg |
| 3 | lasVegasImg | Las Vegas | 0deg (center) |
| 4 | dusseldorfSingImg | Düsseldorf | +8deg |
| 5 | spread4Img | Nierstein am Rhein | +16deg |

**Row 2 (Cards 6–10):**
| # | Image | City | Rotation |
|---|---|---|---|
| 6 | frankfurtCardNewImg (local asset) | Frankfurt | -16deg |
| 7 | seoul6Img (local asset) | Seoul | -8deg |
| 8 | tokyoImg | Tokyo | 0deg (center) |
| 9 | lombokImg (local asset) | Lombok | +8deg |
| 10 | theFutureImg | The Future | +16deg |

Cards: `border-radius: 10px`, `border: 2px solid #2a2a2a`, heavy drop shadow.

---

### 7. This Is Not a Promise

- Red radial vignette background
- **Divider**
- Red line: `This is not a promise.`
- Cream line: `The creative work is done.`
- Body (EB Garamond italic, `#a89880`):
  - "The album, novel, and comic are in final draft. What you are funding is the finishing - and what you receive in return is the finished collector's edition."
  - "Now being elevated to professional standard - every track recorded and mastered, every page of the novel edited and typeset, every panel of the comic drawn and colored by professional hands."
- Ghost text: "The music, the book, and the art are not merchandise for each other - they are each other. The 10 songs serve as chapter markers. The comic is the final chapter. Nothing is filler."
- **Divider**

---

### 8. Scarcity + Countdown + CTA

- **id:** `get-started`
- Scarcity box: dark red gradient card, red border (`rgba(239,68,68,0.35)`)
  - `47 of 200 Supporter packages claimed`
  - Red progress bar at 23.5% fill
  - Ghost text: "Only 200 will ever exist. This offer closes permanently when they are gone."
- **H2:** "The gates are open now. They will not stay open." — Cinzel Decorative, large
- **Body:** *"In 10 years, when this artist has a catalog, a following, and a story - you were there at the beginning. Your name is already part of it."*
- **Countdown timer** to March 31 at midnight EST — 4 dark boxes showing Days / Hours / Minutes / Seconds in red Cinzel numerals
- Label: `Investor Gates Close -- March 31 at Midnight EST`
- Footer ghost line: "Collector windows on first-run artistic projects do not reopen."

---

### 9. Investment Tiers

- Background: `#0a0a0a`
- **Eyebrow:** `Investor Gates Are Open`
- **H2:** "Choose Your Role in This Story"
- Responsive grid of 4 tier cards

#### Tier I — Witness — $150
- Badge: none
- Card border: `#2a2a2a`
- Image: `spread7Img`
- Includes: digital album, vinyl record, hardback novel, full color glossy comic book
- CTA button: red pill → PayPal

#### Tier II — Companion — $500
- Badge: `Signed Set` (red border, red text)
- Image: `spread6Img`
- Includes everything in Witness (signed) + T-shirt. Signed items highlighted in cream.
- CTA: red pill → PayPal

#### Tier III — Patron — $1,000 *(Most Coveted)*
- Badge: `Most Coveted` (solid red background, white text)
- Card: `border: 2px solid #ef4444`, red glow box-shadow, dark red background (`#180606`)
- Image: `spread8Img`
- Includes everything in Companion + 1-hour private session
- CTA: red pill with glow → PayPal

#### Tier IV — Angel — $15,000 *(Only One)*
- Badge: `Only One` (gold gradient, dark text, top-right corner)
- Card: gold accent border (`#5a4a2a`), subtle gold glow
- Image: `horsebackImg`
- Includes everything in Patron + live performance within 1 year of investment
- CTA: gold gradient pill → PayPal

**Footer note:** *"This is not a crowdfund where you get a thank-you email. You are receiving finished, premium art objects, the kind that sit on shelves and get passed down."*

---

### 10. Dispatches (Blog)

- Background: `#0c0c0c`
- **Eyebrow:** `Dispatches`
- **H2:** "From Behind the Work"
- Pulls live posts from Blogspot feed: `https://comewithmeseries.blogspot.com`
- Cards: `background: #111111`, `border: 1px solid #1e1e1e`, hover → red border + red glow
- Shows up to 6 posts; if more exist, shows "View All Dispatches" ghost-border pill button
- Each post card: image (180px tall), date + read-time, title (Cinzel), excerpt (EB Garamond italic), "Read →" link in red

---

### 11. Bottom CTA — Learn to Sing

- Background: `#0a0a0a`, red radial vignette
- **Divider**
- **H2:** "Would you like to create an album yourself or learn to sing?"
- **Body:** *"Omega Bone teaches what he practices. Start your own vocal journey."*
- CTA button → `/learn2sing`

---

## Tone & Voice

- **Formal, literary, unhurried.** No exclamation marks. No casual language.
- Sentences are short and declarative when making bold claims; long and lyrical in body copy.
- Copy never over-explains. The reader is trusted to feel the weight.
- Red is used for urgency, scarcity, and emotional climaxes — never decoratively.
- Gold is reserved exclusively for the Angel tier (most rare, most precious).
- The word "promise" is used precisely once, and negated: *"This is not a promise."*

---

## Key Copy Phrases (do not paraphrase)

- "A Multinational Divorce Story"
- "One Story. Multiple Formats. Zero Compromises."
- "A  P O L Y P T Y C H"
- "So she runs."
- "The rawness is preserved in the DNA."
- "The comic is the final chapter. Nothing is filler."
- "The gates are open now. They will not stay open."
- "This is not a crowdfund where you get a thank-you email."
- "Collector windows on first-run artistic projects do not reopen."
- "Raw.  Real."

---

## Technical Notes

- All styling is inline React `style={{}}` — no Tailwind on this page
- Images imported via `figma:asset/` (Vite plugin) or `../../assets/` for local uploads
- Audio file: `/audio/i-am.mp3` (served from `public/`)
- Blog feed: custom hook `useBlogspotFeed` in `src/app/hooks/`
- Countdown target: `new Date("2026-03-31T23:59:59-05:00")`
- PayPal links hardcoded per tier (PayPal hosted checkout pages)
