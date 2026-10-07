const fs = require('fs');

async function test() {
  const r = await fetch('https://static.cricinfo.com/rss/livescores.xml', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const xml = await r.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
    const getTag = tag => (m[1].match(new RegExp('<' + tag + '>([\\s\\S]*?)<\\/' + tag + '>'))?.[1] || '').trim();
    return { title: getTag('title'), link: getTag('link'), desc: getTag('description') };
  });
  console.log('Found items:', items.length);

  for (let i = 0; i < Math.min(4, items.length); i++) {
    console.log(`\n=== ITEM ${i}: ${items[i].title} ===`);
    try {
      const res = await fetch(items[i].link, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      if (match) {
        const json = JSON.parse(match[1]);
        const d = json.props?.appPageProps?.data?.data;
        console.log('Match Title:', d?.match?.title);
        console.log('Series:', d?.match?.series?.name);
        console.log('Ground:', d?.match?.ground?.name, d?.match?.ground?.town?.name);
        console.log('StatusText:', d?.match?.statusText);
        console.log('Teams:', d?.match?.teams?.map(t => ({
          name: t.team?.name,
          abbrev: t.team?.abbreviation,
          score: t.score,
          scoreInfo: t.scoreInfo,
          isBatting: t.isBatting
        })));
        console.log('Live Batsmen:', d?.content?.livePerformance?.batsmen?.map(b => ({
          name: b.player?.longName,
          runs: b.runs,
          balls: b.balls,
          fours: b.fours,
          sixes: b.sixes,
          sr: b.strikerate,
          strike: b.isStriker
        })));
        console.log('Live Bowlers:', d?.content?.livePerformance?.bowlers?.map(b => ({
          name: b.player?.longName,
          overs: b.overs,
          maidens: b.maidens,
          runs: b.conceded,
          wkts: b.wickets,
          econ: b.economy,
          active: b.isActive
        })));
        console.log('Live Performance meta:', Object.keys(d?.content?.livePerformance || {}));
      } else {
        console.log('No __NEXT_DATA__');
      }
    } catch (e) {
      console.log('Error parsing:', e.message);
    }
  }
}

test();
