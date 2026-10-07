const fs = require('fs');
const path = require('path');

const recentMatches = require('./all_recent_matches.js');
const recentMatchesJson = JSON.stringify(recentMatches, null, 2);

// 1. Update server.js
const serverPath = path.join(__dirname, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

serverCode = serverCode.replace(
  /\/\/ 100% VERIFIED REAL RECENT MATCHES[\s\S]*?const RECENT_MATCHES = \[[\s\S]*?\n\];/,
  `// 100% VERIFIED REAL RECENT MATCHES ACROSS ALL COUNTRIES (TEST, ODI, T20I)\nconst RECENT_MATCHES = ${recentMatchesJson};`
);

fs.writeFileSync(serverPath, serverCode, 'utf8');
console.log('Updated server.js with all countries recent matches!');

// 2. Update index.html
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Replace window.recentMatches in initial datasets
indexHtml = indexHtml.replace(
  /window\.recentMatches = \[[\s\S]*?\n    \];\n    window\.upcomingMatches/,
  `window.recentMatches = ${recentMatchesJson};\n    window.upcomingMatches`
);

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('Updated index.html datasets with all countries recent matches!');
