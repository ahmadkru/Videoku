# Storyboard — ASDTUG Handling TikTok (30s, vertical)

**Status:** Draft v1. Not rendered.
**Format:** 1080×1920 (9:16), 30 fps, 900 frames, built in Remotion.
**Brand asset:** `public/logo.png` (ASDTUG Handling, white on black, 500×500).

> ⚠️ The 5 raw-footage clips couldn't be downloaded into the editing environment yet, so I haven't seen them.
> The shot slots below are defined by **role** (hook, A-roll, B-roll), not by clip. The clips get
> assigned and the captions get transcribed once the footage is available (see "Open items").

---

## 1. Editing direction, taken from the reference

Reference: `v14044g…qobg.mp4` (576×1024, 30 fps, 83 s). It's a corporate "meet the team" interview TikTok.

| Element | What the reference does | What we'll do |
|---|---|---|
| Structure | Talking head → question card → answer, repeated 3× → logo end card | Same rhythm, compressed into 30 s: hook → 2 Q&A beats → end card |
| Pacing | A-roll cuts every ~2–4 s. Question cards hold ~3 s. | Cuts every 1.5–3 s. Question cards hold 1.5 s. |
| Captions | 2–3 words at a time, bold uppercase sans with a dark drop shadow, in the lower third (~72% height). The keyword is highlighted yellow. | Same style. The highlight is white with a yellow keyword (see §3). |
| Intro title | "Meet Robert" plus a subtitle line, upper-middle, in the first ~3 s | "Meet ASDTUG Handling" plus a tagline, at the same position |
| Transition | Diagonal wipe in 2 layers (white, then brand red) sweeping bottom-left → top-right, ~0.5 s, landing on the card | Same diagonal double-wipe in brand colors (white → black) |
| Question card | Plain white background with centered dark text. Words reveal one by one. | Same, with words revealed one at a time |
| Zooms | Mostly static punch-ins on a medium shot (cut-zoom between angles) | Static punch-ins (100% → 115%) on alternate A-roll cuts, plus a slow push-in (100 → 108%) during holds |
| End card | Logo on white, then the platform outro | Logo pop-in on black (matches the logo) with the handle/CTA. No TikTok outro, since TikTok adds its own. |
| Branding | Logo visible on clothing throughout | Small logo bug in the top-right corner for the whole video, at 70% opacity |

## 2. Timeline

Times are in seconds, with frames at 30 fps in brackets.

| # | Time | Visual | Footage slot | Motion / transition | On-screen text |
|---|---|---|---|---|---|
| 1 | 0.0–2.0 [0–60] | **HOOK.** The most dynamic, visually striking moment in the footage | B-roll, strongest clip | Hard open. Push-in from 100% to 112%. Flash frame on the cut at 2.0 s. | Big hook line, center, 2 lines max (written from the footage, e.g. a bold claim or question) |
| 2 | 2.0–5.0 [60–150] | Establishing / A-roll | A-roll or wide shot | Cut. "Meet" title slides up and fades in by 2.3 s and out at 4.6 s. | **Meet ASDTUG Handling** / tagline. Captions start. |
| 3 | 5.0–8.0 [150–240] | A-roll continues | A-roll | Punch-in to 115% at 6.5 s | Captions |
| 4 | 8.0–8.5 [240–255] | Transition | — | Diagonal double-wipe (white → black) | — |
| 5 | 8.5–10.0 [255–300] | **Question card 1** | — | Words reveal at ~4 frames per word | Q1 (e.g. "What do we do?") |
| 6 | 10.0–12.5 [300–375] | Answer, part 1 | A-roll | Cut-zoom: 100% to 115% at 11.2 s | Captions |
| 7 | 12.5–14.0 [375–420] | **B-roll cutaway** illustrating the answer | B-roll 2 | Slide-in cut. Slow push-in. | Captions continue over the B-roll |
| 8 | 14.0–17.0 [420–510] | Answer, part 2 | A-roll / B-roll 3 | Punch-in on the keyword | Captions |
| 9 | 17.0–17.5 [510–525] | Transition | — | Diagonal double-wipe | — |
| 10 | 17.5–19.0 [525–570] | **Question card 2** | — | Word reveal | Q2 (e.g. "Why work with us?") |
| 11 | 19.0–21.5 [570–645] | Answer | A-roll | Cut-zoom | Captions |
| 12 | 21.5–23.0 [645–690] | **B-roll cutaway** | B-roll 4 | Whip-pan blur transition in (6 frames) | Captions |
| 13 | 23.0–26.5 [690–795] | Payoff: the strongest closing line or visual | A-roll / best B-roll | Slow push-in, 100% to 110% | Captions with a yellow keyword emphasis |
| 14 | 26.5–27.0 [795–810] | Transition | — | Diagonal wipe to black | — |
| 15 | 27.0–30.0 [810–900] | **End card** | — | Logo scale pop from 80% to 100% (spring), then a CTA fade-in at 28 s | Logo, "Follow for more", handle |

Audio: keep the original audio from the A-roll. Add a music bed at about −18 dB under speech (track TBD). Add a whoosh on each diagonal wipe and a light hit on the end-card logo.

## 3. Caption spec

- **Font:** Poppins ExtraBold, or Montserrat ExtraBold as a fallback, uppercase.
- **Size:** 64 px on a 1080-wide frame, 2–3 words per page, one line.
- **Position:** centered at y ≈ 1380 px (72%), clear of the TikTok UI on the right and bottom.
- **Colors:** white text, 1–2 keywords per sentence in yellow `#FFE600`, drop shadow `0 4px 0 rgba(0,0,0,.6)`.
- **Animation:** each page pops in from 90% to 100% over 4 frames. There's no animation between words inside a page.
- **Source:** transcribed from the A-roll audio with word timestamps, then manually checked for spelling of names and terms.

## 4. Brand system

- **Colors:** black `#000000`, white `#FFFFFF`, yellow `#FFE600` as the caption accent only.
- **Logo bug:** top-right, 120 px wide, 70% opacity, hidden on question cards and the end card.
- **Safe zones:** top 150 px, bottom 420 px, right 140 px are kept free of text (TikTok UI).

## 5. Remotion build plan (after approval)

- `src/Video.tsx`: main composition `AsdtugTikTok` (1080×1920, 900 frames).
- Components: `Hook`, `MeetTitle`, `DiagonalWipe`, `QuestionCard`, `Captions`, `LogoBug`, `EndCard`.
- Footage is placed with `<OffthreadVideo>` + `<Sequence>`, with trims driven by a `timeline.ts` config so cuts can be retimed without touching components.
- Captions come from `captions.json`, generated from the footage transcription.

## 6. Open items: blocking before build

1. **Footage access.** The clips (45–497 MB) are over the Drive connector's 10 MB limit. Direct Google download is also blocked by this environment's network policy.
2. **Clip roles.** Which clips are talking-head (A-roll) and which are B-roll? Does anyone speak on camera?
3. **Language of captions/questions:** Indonesian or English?
4. **Hook line, tagline, questions and CTA/handle:** confirm, or I'll write them from the footage.
5. **Music:** provide a track, or none.
