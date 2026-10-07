# CricPulse - Live Cricket Hub & Scorecards

Professional Cricket Analytics Dashboard with Cricbuzz-style expandable match cards, official ICC rankings, verified IPL 2025 records, and Google AdSense-ready ad spaces.

## Files
- `server.js` - Zero-dependency Node.js backend server with real-time Cricinfo RSS parser & caching.
- `index.html` - Complete responsive frontend dashboard (Cricbuzz cards, fan poll, ad slots, offline fallback).
- `package.json` - Deployment configuration with `npm start`.

## Local Running
```bash
node server.js
```
Open [http://localhost:3000](http://localhost:3000)

## Free 1-Click Cloud Deployment (Render.com / Railway / Vercel)
1. Push this folder to GitHub.
2. Go to [https://render.com](https://render.com) -> New Web Service.
3. Select your GitHub repository.
4. Set Build Command: (leave empty or `npm install`)
5. Set Start Command: `node server.js`
6. Click Deploy. Your website will be live at `https://your-name.onrender.com`!
