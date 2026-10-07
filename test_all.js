const fs = require('fs');

async function testAll() {
  const r = await fetch('https://static.cricinfo.com/rss/livescores.xml', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const xml = await r.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
    const getTag = tag => (m[1].match(new RegExp('<' + tag + '>([\\s\\S]*?)<\\/' + tag + '>'))?.[1] || '').trim();
    return { title: getTag('title').replace(/&amp;/g, '&'), link: getTag('link'), desc: getTag('description').replace(/&amp;/g, '&') };
  });

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    try {
      const res = await fetch(it.link, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      if (m) {
        const json = JSON.parse(m[1]);
        const d = json.props?.appPageProps?.data?.data;
        const match = d?.match || {};
        const content = d?.content || {};
        const liveInfo = content.supportInfo?.liveInfo || {};
        const liveSummary = content.supportInfo?.liveSummary || {};

        console.log(`\nMatch [${i}] ${match.title || it.title}`);
        console.log('Series:', match.series?.name);
        console.log('State:', match.state, 'Status:', match.status, 'StatusText:', match.statusText);
        console.log('Teams:', match.teams?.map(t => `${t.team?.abbreviation || t.team?.name}: ${t.score || '-'} ${t.scoreInfo ? '('+t.scoreInfo+')' : ''}`).join(' vs '));
        console.log('Batters:', content.livePerformance?.batsmen?.length || 0);
        console.log('Bowlers:', content.livePerformance?.bowlers?.length || 0);
        console.log('CRR:', liveInfo.currentRunRate, 'LastWkt:', liveSummary.lastBatText);
      }
    } catch (e) {
      console.log(`Match [${i}] error:`, e.message);
    }
  }
}

testAll();
