const fs = require('fs');
const path = require('path');
const http = require('http');

async function updateIndex() {
  const serverPath = path.join(__dirname, 'server.js');
  const serverCode = fs.readFileSync(serverPath, 'utf8');

  // Fetch current live matches from server
  const liveMatches = await new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/live', res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(d).matches || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });

  // Extract datasets from server.js
  const iccMatch = serverCode.match(/const ICC_DATA = ({[\s\S]*?});\n\n\/\/ 100% VERIFIED REAL RECENT/);
  const recentMatch = serverCode.match(/const RECENT_MATCHES = (\[[\s\S]*?\]);\n\n\/\/ 100% VERIFIED REAL UPCOMING/);
  const upcomingMatch = serverCode.match(/const UPCOMING_MATCHES = (\[[\s\S]*?\]);\n\n\/\/ IPL OFFICIAL DATA/);
  const iplMatch = serverCode.match(/const IPL_DATA = ({[\s\S]*?});\n\n\/\/ Fetch real-time live/);

  if (!iccMatch || !recentMatch || !upcomingMatch || !iplMatch) {
    console.error('Failed to extract datasets from server.js');
    process.exit(1);
  }

  const iccStr = iccMatch[1];
  const recentStr = recentMatch[1];
  const upcomingStr = upcomingMatch[1];
  const iplStr = iplMatch[1];

  let indexPath = path.join(__dirname, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Let's create the client data script block
  const clientDataScript = `
    // DEFAULT / INITIAL DATASETS (Ensures instant render & 100% offline reliability)
    window.FALLBACK_LIVE_MATCHES = ${JSON.stringify(liveMatches, null, 2)};
    window.iccData = ${iccStr};
    window.recentMatches = ${recentStr};
    window.upcomingMatches = ${upcomingStr};
    window.iplData = ${iplStr};
  `;

  // Check if clientDataScript is already placed or where to place it
  // Let's put it right before "let expandedMatchIds = new Set();"
  if (indexHtml.includes('window.FALLBACK_LIVE_MATCHES =')) {
    // replace existing
    indexHtml = indexHtml.replace(/\/\/ DEFAULT \/ INITIAL DATASETS[\s\S]*?window\.iplData =[\s\S]*?;\n/, clientDataScript);
  } else {
    indexHtml = indexHtml.replace('let expandedMatchIds = new Set();', clientDataScript + '\n    let expandedMatchIds = new Set();');
  }

  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log('Successfully injected datasets into index.html');
}

updateIndex();
