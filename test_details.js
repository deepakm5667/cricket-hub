async function inspectDetails() {
  const res = await fetch('http://www.cricinfo.com/ci/engine/match/1535685.html', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (m) {
    const json = JSON.parse(m[1]);
    const d = json.props?.appPageProps?.data?.data;
    console.log('Match fields:', {
      title: d?.match?.title,
      slug: d?.match?.slug,
      status: d?.match?.status,
      statusText: d?.match?.statusText,
      state: d?.match?.state,
      series: d?.match?.series?.name,
      ground: d?.match?.ground?.name + ', ' + d?.match?.ground?.town?.name,
      toss: d?.match?.tossDetails?.text,
      teams: d?.match?.teams?.map(t => ({
        name: t.team?.name,
        abbreviation: t.team?.abbreviation,
        score: t.score,
        scoreInfo: t.scoreInfo,
        isBatting: t.isBatting
      })),
      liveBatsmen: d?.content?.livePerformance?.batsmen?.map(b => ({
        name: b.player?.longName,
        runs: b.runs,
        balls: b.balls,
        fours: b.fours,
        sixes: b.sixes,
        sr: b.strikerate,
        strike: b.isStriker
      })),
      liveBowlers: d?.content?.livePerformance?.bowlers?.map(b => ({
        name: b.player?.longName,
        overs: b.overs,
        maidens: b.maidens,
        runs: b.conceded,
        wickets: b.wickets,
        econ: b.economy,
        active: b.isActive
      })),
      supportInfo: d?.content?.supportInfo,
      matchSummary: d?.content?.matchSummary
    });
  }
}
inspectDetails();
