# PrintQueue 🖨️

A family-friendly 3D print queue manager. Add prints from MakerWorld, track what's printing, and keep everyone in the loop.

## Features

- **Queue Management** - Add, reorder, and track 3D prints with priority levels (low/normal/high/urgent)
- **Status Tracking** - Mark prints as queued → printing → done/cancelled
- **MakerWorld Integration** - Paste a MakerWorld URL and auto-fetch title, thumbnail, and description
- **Comments** - Leave notes on prints (color requests, size, etc.)
- **Stats Dashboard** - See prints per week, top requesters, completion rate
- **PWA** - Install on your phone, works as a share target from Bambu Handy
- **Chrome Extension** - One-click add from MakerWorld pages
- **Multi-user** - Simple name-based users, no login required

## Quick Start

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Phone Setup (PWA)

1. Open the app in your phone's browser
2. Tap "Add to Home Screen" (or the install prompt)
3. Now you can share links from Bambu Handy directly to PrintQueue!

## Chrome Extension

1. Open `chrome://extensions` in Chrome
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `chrome-extension/` folder
4. On any MakerWorld model page, click the floating "Add to PrintQueue" button
5. First time, it'll ask for your server URL

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4
- Prisma 7 + SQLite
- PWA with Share Target API
- Chrome Extension (Manifest V3)

## Deployment

For Vercel deployment, you'll want to swap SQLite for a hosted database (Turso, PlanetScale, etc.).
For self-hosting, just run `npm run build && npm start`.
