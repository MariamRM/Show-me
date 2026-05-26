# Show Me Guide

Show Me Guide is an accessible camera web app for blind and low-vision users. It can:

- describe the path ahead and highlight hazards
- explain surrounding objects and landmarks
- identify grocery items and shelf context
- speak the result aloud in the browser

## What it is

This is a browser-based prototype with:

- a large, high-contrast UI
- live camera access
- one-tap scene analysis
- optional auto-scan every few seconds
- server-side OpenAI vision calls so the API key stays off the client

## Setup

1. Create `.env` from `.env.example`.
2. Add your `OPENAI_API_KEY`.
3. Start the app:

```bash
npm start
```

4. Open `http://localhost:3000`.

## Important notes

- Camera access in browsers usually requires `localhost` or `https`.
- This app is an assistive prototype, not a substitute for a cane, guide dog, orientation training, or human support.
- Images captured for analysis are sent to the OpenAI API.

## Modes

- `Path Guide`: explains the safest visible route and urgent hazards.
- `Surroundings`: describes nearby objects, landmarks, and orientation cues.
- `Grocery Helper`: identifies products, labels, and nearby shelf items.

## Recommended next improvements

- add live audio conversation
- add OCR-focused close-up item reading
- add language switching
- add vibration or tone cues on hazards
- add phone-friendly HTTPS deployment
