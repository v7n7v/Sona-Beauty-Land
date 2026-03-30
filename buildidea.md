# Ahti Nail Salon — "World's Best" Visual Upgrade Blueprint

> **Goal:** Transform the current clean-but-basic Ahti Nail Salon page into a jaw-dropping, 
> award-winning single-page experience. Keep the existing pink (#EC4899) / gold (#D4AF37) / 
> dark (#111827) / soft-pink-bg (#FFF5F7) color palette. The tech stack is Vite + React + 
> Vanilla CSS + Framer Motion (already installed). All changes go into `src/index.css` and 
> `src/App.jsx`.

---

## 1. Animated Background — Living Gradient Mesh

**What:** Three large, soft, semi-transparent gradient blobs that float lazily behind all 
content, giving the page a living, breathing feel — like luxury perfume websites.

**Implementation (CSS):**
- Create a `div.bg-blobs` as the very first child of the app wrapper, positioned `fixed`, 
  `inset: 0`, `z-index: 0`, `pointer-events: none`, `overflow: hidden`.
- Inside it, place 3 `div` elements (`.blob-1`, `.blob-2`, `.blob-3`), each ~600px wide/tall, 
  `border-radius: 50%`, `filter: blur(120px)`, `opacity: 0.4`, `position: absolute`.
- Colors:
  - Blob 1: `background: radial-gradient(circle, #EC4899 0%, transparent 70%)` — top-left area
  - Blob 2: `background: radial-gradient(circle, #D4AF37 0%, transparent 70%)` — bottom-right area  
  - Blob 3: `background: radial-gradient(circle, #F9A8D4 0%, transparent 70%)` — center-bottom area
- Animate each blob with a different `@keyframes blob-drift` that makes them slowly translate 
  and scale over 20-30 seconds, `animation: blob-drift-1 25s ease-in-out infinite alternate`.
  Each blob has different keyframes so they move independently. Example:
  ```css
  @keyframes blob-drift-1 {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(80px, -60px) scale(1.1); }
    66%  { transform: translate(-40px, 40px) scale(0.95); }
    100% { transform: translate(60px, -30px) scale(1.05); }
  }
  ```
- All other page content gets `position: relative; z-index: 1` to sit above the blobs.

---

## 2. Floating Sparkle Particles in the Hero

**What:** 15-20 tiny sparkle dots that float upward in the hero section, like dust catching 
light in a luxury salon. Pure CSS, no JS needed.

**Implementation (CSS + JSX):**
- Create a `.sparkle-field` container inside the hero section, `position: absolute`, 
  `inset: 0`, `overflow: hidden`, `pointer-events: none`.
- Generate 15-20 `<span className="sparkle">` elements inside it (can hardcode in JSX).
- Each `.sparkle`:
  - `position: absolute`
  - `width: 4px; height: 4px; border-radius: 50%;`
  - `background: #D4AF37` (gold) — alternate some with `#EC4899` (pink)
  - `opacity: 0`
  - `animation: sparkle-rise 6s ease-in infinite`
  - Use inline styles for randomized `left: X%`, `bottom: -10px`, `animation-delay: Xs`, 
    `animation-duration: Ys` (vary between 4-8 seconds)
- Keyframes:
  ```css
  @keyframes sparkle-rise {
    0%   { opacity: 0; transform: translateY(0) scale(0); }
    10%  { opacity: 1; transform: scale(1); }
    90%  { opacity: 0.6; }
    100% { opacity: 0; transform: translateY(-600px) scale(0.5); }
  }
  ```

---

## 3. Hero Section — Dramatic Typographic Upgrade

**What:** Make the hero headline feel like a fashion editorial. Massive text, creative line 
breaks, a subtle text shimmer effect on the gradient word.

**Implementation:**
- Increase hero title to `clamp(3.5rem, 8vw, 7rem)` for truly dramatic scaling.
- The gradient text span (the second word) gets an animated shimmer:
  ```css
  .text-gradient {
    background: linear-gradient(
      120deg, 
      #EC4899 0%, #D4AF37 25%, #EC4899 50%, #D4AF37 75%, #EC4899 100%
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  ```
- Add a decorative thin gold line element beneath the subtitle:
  A `<div className="hero-line">` that's `width: 80px; height: 2px; background: linear-gradient(to right, transparent, #D4AF37, transparent); margin: 24px auto 48px;` (left-aligned on desktop via `margin: 24px 0 48px`).

---

## 4. Image Slider — Ken Burns Parallax Zoom

**What:** Instead of static slides, the active image slowly zooms in (Ken Burns effect), 
giving cinematic depth. The transition between slides uses a smooth crossfade with scale.

**Implementation:**
- The active slide's `img` gets:
  ```css
  .slide.active img {
    animation: ken-burns 5s ease-out forwards;
  }
  @keyframes ken-burns {
    0%   { transform: scale(1); }
    100% { transform: scale(1.08); }
  }
  ```
- Non-active slides: `opacity: 0; transform: scale(1.15);` with a 1.2s transition.
- Add a subtle color overlay on the slider frame itself: a gradient border effect using 
  `border-image: linear-gradient(135deg, rgba(236,72,153,0.3), rgba(212,175,55,0.3)) 1` 
  or a pseudo-element approach for a glowing frame edge.

---

## 5. Service Cards — 3D Perspective Tilt on Hover + Glow

**What:** When you hover a service card, it subtly tilts in 3D toward the cursor and emits 
a soft pink underglow. This is a massive "wow" factor.

**Implementation (JS + CSS):**
- Add `onMouseMove`, `onMouseLeave` handlers to each service card.
- On mouse move, calculate the cursor position relative to the card center:
  ```js
  const handleTilt = (e, cardRef) => {
    const rect = cardRef.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (y / rect.height) * -15; // ±15 degrees max
    const rotateY = (x / rect.width) * 15;
    cardRef.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };
  ```
- On mouse leave, reset to `transform: perspective(800px) rotateX(0) rotateY(0) scale(1)`.
- CSS additions for the card:
  ```css
  .service-card {
    transition: transform 0.2s ease, box-shadow 0.3s ease;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .service-card:hover {
    box-shadow: 
      0 20px 60px rgba(236, 72, 153, 0.15),
      0 0 40px rgba(236, 72, 153, 0.08);
  }
  ```
- Add a `::after` pseudo-element for the underglow:
  ```css
  .service-card::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 10%;
    width: 80%;
    height: 40px;
    background: radial-gradient(ellipse, rgba(236,72,153,0.25), transparent 70%);
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .service-card:hover::after {
    opacity: 1;
  }
  ```

---

## 6. Scroll-Triggered Stagger Animations

**What:** As the user scrolls down to the services section, the section title fades in first, 
then each card appears one-by-one from below with a stagger delay. Uses Framer Motion's 
`useInView` and `motion` components.

**Implementation (JSX):**
- Wrap the section header in a `motion.div` with `initial={{ opacity: 0, y: 40 }}`, 
  `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.3 }}`, 
  `transition={{ duration: 0.8 }}`.
- Each service card already uses `motion.div`. Add:
  ```jsx
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  ```
  (Map with index to pass `index * 0.15` as delay.)

---

## 7. NEW SECTION — Social Proof / Stats Counter Bar

**What:** A horizontal strip between the hero and services showing 3-4 animated statistics 
in glassmorphism capsules. Numbers count up on scroll into view.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│   ✨ 1,200+        ⭐ 4.9/5        🕐 Since 2020       │
│   Happy Clients    Avg Rating      Years of Care        │
└─────────────────────────────────────────────────────────┘
```

**Implementation:**
- A `.stats-bar` flex row, centered, `gap: 48px`, wrapped in a glassmorphism container 
  `(background: rgba(255,255,255,0.5); backdrop-filter: blur(20px); border-radius: 2rem; 
  padding: 40px 60px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 20px 60px rgba(0,0,0,0.05))`.
- Each stat is a `.stat-item` with a large number (font-size: 2.5rem, font-weight: 900, 
  color: #EC4899 or #D4AF37) and a small label below (font-size: 0.75rem, uppercase, 
  letter-spacing: 0.2em, color: #9CA3AF).
- **Counter animation:** Use a simple React `useEffect` + `useInView` from framer-motion. 
  When in view, animate from 0 to target number using `requestAnimationFrame` over ~2 seconds 
  with an easing function.

---

## 8. NEW SECTION — Gallery Showcase Before Footer

**What:** A horizontal-scrolling gallery of nail art images displayed in a masonry-like 
staggered layout. Each image has a hover zoom + overlay with a small pink heart icon.

**Layout:**
```
        ┌───────┐  ┌───────────┐  ┌───────┐
        │       │  │           │  │       │
        │ img 1 │  │   img 2   │  │ img 3 │
        │       │  │           │  │       │
        └───────┘  └───────────┘  └───────┘
           ┌───────────┐  ┌───────┐  ┌───────────┐
           │           │  │       │  │           │
           │   img 4   │  │ img 5 │  │   img 6   │
           │           │  │       │  │           │
           └───────────┘  └───────┘  └───────────┘
```

**Implementation:**
- Use CSS Grid with `grid-template-columns: repeat(3, 1fr)` and alternating `grid-row: span 2` for varied heights.
- Each `.gallery-item` is a rounded-3xl container with `overflow: hidden`.
- On hover: `img { transform: scale(1.1); }` with a pink overlay `::after` that fades in with a `Heart` icon centered.
- Use Unsplash nail art images (already have some URLs, add more variety).
- The section title: "Our Nail Art" / "የጥፍር ጥበባችን" with the same section-header style.
- Wrap in `motion.div` with stagger for scroll reveal.

---

## 9. NEW SECTION — Testimonials Carousel

**What:** 2-3 customer testimonials in rotating cards, small avatar circles, star ratings, 
and quotes. Auto-rotates every 4 seconds with a smooth crossfade.

**Layout (single card visible at a time):**
```
┌──────────────────────────────────────────┐
│  ★★★★★                                   │
│                                          │
│  "Ahti completely transformed my nails.  │
│   The gel polish lasted 3 weeks!"        │
│                                          │
│  ○  Hanna M. — Regular Client            │
└──────────────────────────────────────────┘
```

**Implementation:**
- State variable `currentTestimonial` cycling 0-2 with `setInterval` every 4s.
- Container is a glassmorphism card centered, max-width 600px.
- Use `AnimatePresence` with `mode="wait"` and `motion.div` for crossfade:
  ```jsx
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -40 }}
  ```
- 3 dot indicators below showing active testimonial (small circles, active = pink filled).

---

## 10. CTA Section — Glowing Call to Action Before Footer

**What:** A dramatic full-width banner with a radial glow, inviting users to book.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│            Ready for Your Nail Glow-Up?              │
│     Book your appointment today and experience       │
│              the Ahti difference.                    │
│                                                      │
│              [ Book Now → ]                          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Implementation:**
- `.cta-section` with:
  ```css
  background: linear-gradient(135deg, #111827 0%, #1F1225 50%, #111827 100%);
  border-radius: 4rem;
  padding: 80px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  ```
- A `::before` pseudo for a large radial pink glow behind the text:
  ```css
  .cta-section::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%);
    filter: blur(60px);
  }
  ```
- Title in white, subtitle in gray-400, button in pink with glow shadow.

---

## 11. Enhanced Footer — Richer Layout

**What:** Upgrade the footer from a simple centered column to a more editorial layout with 
a mini navigation, operating hours, and a decorative gold line.

**Layout:**
```
─────────── gold decorative line ───────────

         [ Ahti Logo ]

    Services  •  Location  •  Book Now

    Mon-Sat: 9AM - 8PM  |  Sun: 10AM - 6PM

    [ Instagram ]  [ Location ]  [ Phone ]

  ┌─ MEGENAGNA • ZEFMESH MALL • ADDIS ABABA ─┐

         © 2025 AHTI SALON. ALL RIGHTS RESERVED.
```

**Implementation:**
- Add a thin gradient line at the top: `border-top: 2px solid; border-image: linear-gradient(to right, transparent, #D4AF37, transparent) 1;`
- Add operating hours text in gray-400.
- Add a mini nav row of text links.
- Add phone icon social button.

---

## 12. Micro-Interactions & Polish Checklist

These small details separate "good" from "award-winning":

| Element | Effect |
|---|---|
| **All buttons** | Add `transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)` for a springy overshoot feel |
| **Nav logo** | On hover, rotate slightly: `transform: rotate(-3deg) scale(1.05)` |
| **Language toggle** | Active button slides with a smooth `transition: 0.3s` (feels like a physical switch) |
| **Form inputs** | On focus, add a subtle pink glow: `box-shadow: 0 0 0 4px rgba(236,72,153,0.1)` |
| **Hero badge** | Gentle `animation: float 3s ease-in-out infinite` up/down hover |
| **Scrollbar** | Custom thin scrollbar: `scrollbar-width: thin; scrollbar-color: #EC4899 transparent` |
| **Selection** | `::selection { background: rgba(236,72,153,0.2); color: #111827; }` |
| **Page transitions** | Wrap each `activeStep` content in `AnimatePresence mode="wait"` with fade+slide |

---

## 13. Mobile Responsive Polish

- Hero stacks vertically, title drops to `clamp(2.5rem, 6vw, 4rem)`.
- Slider becomes full-width with smaller border-radius (`2rem`).
- Service cards become `grid-template-columns: 1fr 1fr` on mobile, `1fr` on very small screens.
- Stats bar wraps vertically with smaller gaps.
- Gallery grid becomes 2 columns on tablet, 1 column on mobile.
- Floating badge repositions to `top: -20px; right: -10px` and shrinks on mobile.
- Add a functioning mobile hamburger menu that slides down with `AnimatePresence`.

---

## File Change Summary

| File | What Changes |
|---|---|
| `src/index.css` | Add blob animations, sparkle keyframes, 3D card styles, Ken Burns, underglow pseudo-elements, stats/gallery/CTA/testimonial section styles, custom scrollbar, enhanced typography, all responsive queries |
| `src/App.jsx` | Add blob elements, sparkle generator, stats section, gallery section, testimonials carousel with state, CTA section, 3D tilt handlers on cards, scroll-triggered motions with stagger, `AnimatePresence` page transitions, mobile menu |

---

## Color Reference (DO NOT CHANGE)

| Token | Value | Usage |
|---|---|---|
| Primary Pink | `#EC4899` | Buttons, accents, glows, gradients |
| Primary Light | `#FCE7F3` | Subtle backgrounds, borders |
| Primary Dark | `#BE185D` | Badge fills, deep accents |
| Gold | `#D4AF37` | Sparkles, shimmer, decorative lines, secondary accent |
| Rose | `#F9A8D4` | Blob gradient, soft accents |
| Dark | `#111827` | Text, CTA background, dark elements |
| Text Gray | `#6B7280` | Subtitles, descriptions |
| Background | `#FFF5F7` | Page background |
| Glass White | `rgba(255,255,255,0.4)` | Card/modal backgrounds |
| Glass Border | `rgba(255,255,255,0.8)` | Glass element borders |

---

## Font Stack (KEEP)

- **Headings:** `'Outfit', sans-serif` — weights 800, 900
- **Body:** `'Inter', sans-serif` — weights 400, 500, 700, 900
- Import: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Outfit:wght@300;600;800;900&display=swap`
