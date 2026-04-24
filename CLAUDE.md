@AGENTS.md

# ARITHMOS™ — Project Reference

## What this is
A satirical premium SaaS (submitted to "Useless AI Championship"). A calculator that costs ₩49,000–₩2,490,000/mo, powered by Gemini, rendered in Three.js. **Everything is dead serious in tone.** No irony, no winking at the camera.

## Stack
- **Framework**: Next.js 16 (App Router), TypeScript strict
- **3D**: React Three Fiber + Drei + Three.js + @react-three/postprocessing
- **Animation**: Framer Motion
- **AI**: @google/genai (Gemini 1.5 Flash / 2.0 Flash / 2.5 Pro)
- **Payments**: Stripe (TEST MODE ONLY — `sk_test_*` / `pk_test_*`)
- **DB**: Supabase (schema provided by user, keys in `.env.local`)
- **Styling**: Tailwind v4 (CSS-based config in `globals.css`)

## Key rules
1. Stripe is **test mode only**. Any `sk_live_` key throws at import.
2. `.env.local` is gitignored. Never hardcode secrets.
3. `any` type is forbidden.
4. All copy must be 100% serious luxury B2B tone — no jokes, no emojis in UI.
5. Footer always shows: "This is a demonstration project. No real charges will be made. Test card: 4242 4242 4242 4242"

## Models
| ID | Name | Price | Gemini |
|----|------|-------|--------|
| one | ARITHMOS One | ₩49,000 | gemini-1.5-flash |
| pro | ARITHMOS Pro | ₩149,000 | gemini-2.0-flash |
| ultra | ARITHMOS Ultra | ₩499,000 | gemini-2.5-pro |
| quantum | ARITHMOS Quantum Edition | ₩2,490,000 | gemini-2.5-pro |
| zero | ARITHMOS Zero | ₩990,000 | gemini-2.0-flash |

## Design tokens (globals.css)
- Background: `#0a0a0a`
- Gold accent: `#c9a961`
- Foreground: `#f5f5f7`
- Secondary: `#86868b`
- Fonts: Inter (display), JetBrains Mono (numbers), Pretendard (Korean)

## Supabase
User creates the SQL schema and provides API keys. Keys go in `.env.local`.
