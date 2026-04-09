// ── /now Page — Live Activity

// ── Spotify + Lyrics (same logic as main page)
const LFM_KEY = 'b3ba5d7e74e6393d681b81d161003177';
const LFM_USER = 'pursian';

let currentLyrics = null;
let lyricsSyncRAF = null;
let spotifyProgress = null;
let spotifyPollTime = null;
let spotifyTrackKey = null;

function parseLRC(lrc) {
  const lines = lrc.split('\n');
  const parsed = [];
  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (match) {
      const mins = parseInt(match[1]);
      const secs = parseInt(match[2]);
      const ms = parseInt(match[3].padEnd(3, '0'));
      const time = mins * 60 + secs + ms / 1000;
      const text = match[4].trim();
      if (text) parsed.push({ time, text });
    }
  }
  return parsed;
}

async function fetchLyrics(song, artist) {
  try {
    const res = await fetch(`https://lrclib.net/api/get?track_name=${encodeURIComponent(song)}&artist_name=${encodeURIComponent(artist)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.syncedLyrics) return { type: 'synced', data: parseLRC(data.syncedLyrics) };
      if (data.plainLyrics) return { type: 'plain', data: data.plainLyrics };
      if (data.instrumental) return { type: 'instrumental' };
    }
    const res2 = await fetch(`https://lrclib.net/api/search?track_name=${encodeURIComponent(song)}&artist_name=${encodeURIComponent(artist)}`);
    if (res2.ok) {
      const results = await res2.json();
      const best = results.find(r => r.syncedLyrics) || results.find(r => r.plainLyrics) || results[0];
      if (best?.syncedLyrics) return { type: 'synced', data: parseLRC(best.syncedLyrics) };
      if (best?.plainLyrics) return { type: 'plain', data: best.plainLyrics };
      if (best?.instrumental) return { type: 'instrumental' };
    }
    return null;
  } catch (e) { return null; }
}

function renderLyrics(result) {
  const container = document.getElementById('nowLyricsLines');
  const panel = document.getElementById('nowLyricsPanel');
  container.innerHTML = '';
  if (result.type === 'synced') {
    result.data.forEach((line, i) => {
      const div = document.createElement('div');
      div.className = 'lyrics-line upcoming';
      div.textContent = line.text;
      div.dataset.index = i;
      container.appendChild(div);
    });
    currentLyrics = result.data;
  } else if (result.type === 'plain') {
    container.innerHTML = `<div class="lyrics-plain">${result.data}</div>`;
    currentLyrics = null;
  } else if (result.type === 'instrumental') {
    container.innerHTML = '<div class="lyrics-instrumental">&#9834; Instrumental &#9834;</div>';
    currentLyrics = null;
  }
  panel.classList.add('visible');
}

function lyricsSyncLoop() {
  if (!currentLyrics) { lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop); return; }
  let elapsed;
  if (spotifyProgress !== null && spotifyPollTime !== null) {
    elapsed = (spotifyProgress + (Date.now() - spotifyPollTime)) / 1000;
  } else {
    lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop); return;
  }
  const container = document.getElementById('nowLyricsLines');
  const lines = container.querySelectorAll('.lyrics-line');
  if (!lines.length) { lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop); return; }
  let activeIdx = -1;
  for (let i = 0; i < currentLyrics.length; i++) {
    if (elapsed >= currentLyrics[i].time) activeIdx = i;
  }
  lines.forEach((line, i) => {
    line.classList.remove('active', 'past', 'upcoming');
    if (i === activeIdx) line.classList.add('active');
    else if (i < activeIdx) line.classList.add('past');
    else line.classList.add('upcoming');
  });
  if (activeIdx >= 0 && lines[activeIdx]) {
    const scroll = document.getElementById('nowLyricsScroll');
    const line = lines[activeIdx];
    scroll.scrollTop = line.offsetTop - scroll.offsetHeight / 2 + line.offsetHeight / 2;
  }
  lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop);
}

function startLyricsSync() {
  if (lyricsSyncRAF) cancelAnimationFrame(lyricsSyncRAF);
  lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop);
}

function hideLyricsPanel() {
  document.getElementById('nowLyricsPanel').classList.remove('visible');
  if (lyricsSyncRAF) cancelAnimationFrame(lyricsSyncRAF);
  lyricsSyncRAF = null;
  currentLyrics = null;
}

// Resync button
const resyncBtn = document.getElementById('nowLyricsResync');
if (resyncBtn) resyncBtn.addEventListener('click', () => {
  spotifyProgress = null;
  spotifyPollTime = null;
  pollSpotify();
});

function updateMusicWidget({ song, artist, artUrl, isLive }) {
  document.getElementById('nowMusicSong').textContent = song || 'Unknown';
  document.getElementById('nowMusicArtist').textContent = artist || 'Unknown Artist';
  const badge = document.getElementById('nowMusicBadge');
  const statusEl = document.getElementById('nowMusicStatus');
  const bars = document.getElementById('nowMusicBars');
  if (isLive) {
    badge.classList.add('live');
    statusEl.textContent = 'Now Playing';
    if (bars) bars.classList.add('active');
  } else {
    badge.classList.remove('live');
    statusEl.textContent = 'Last Played';
    if (bars) bars.classList.remove('active');
  }
  if (artUrl && !artUrl.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
    const artEl = document.getElementById('nowMusicArt');
    if (artEl) artEl.outerHTML = `<img class="now-music-art" id="nowMusicArt" src="${artUrl}" alt="album art"/>`;
  }
}

async function pollSpotify() {
  try {
    const res = await fetch('/api/spotify');
    if (!res.ok) return;
    const data = await res.json();
    if (data.is_playing && data.progress_ms !== undefined) {
      spotifyProgress = data.progress_ms;
      spotifyPollTime = Date.now();
      updateMusicWidget({ song: data.track, artist: data.artist, artUrl: data.album_art, isLive: true });
      const trackKey = `${data.track}|||${data.artist}`;
      if (trackKey !== spotifyTrackKey) {
        spotifyTrackKey = trackKey;
        const result = await fetchLyrics(data.track, data.artist);
        if (result) { renderLyrics(result); if (result.type === 'synced') startLyricsSync(); }
        else hideLyricsPanel();
      }
    } else {
      spotifyProgress = null; spotifyPollTime = null; spotifyTrackKey = null;
      hideLyricsPanel();
    }
  } catch (e) { }
}
pollSpotify();
setInterval(pollSpotify, 5000);

// Last.fm fallback
async function fetchLastFm() {
  try {
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFM_USER}&api_key=${LFM_KEY}&format=json&limit=1`);
    const data = await res.json();
    const track = data.recenttracks?.track?.[0];
    if (!track) return;
    const isLive = track['@attr']?.nowplaying === 'true';
    if (!isLive && !spotifyTrackKey) {
      updateMusicWidget({
        song: track.name || 'Unknown',
        artist: track.artist?.['#text'] || 'Unknown Artist',
        artUrl: track.image?.find(i => i.size === 'large')?.['#text'] || '',
        isLive: false,
      });
    }
  } catch (e) { }
}
fetchLastFm();
setInterval(fetchLastFm, 30000);

// ── Discord Presence via Lanyard
const DISCORD_ID = '1120238252125868136';
const STATUS_LABELS = { online: 'Online', idle: 'Away', dnd: 'Do Not Disturb', offline: 'Offline' };

function updatePresence(data) {
  const { discord_status, discord_user, activities } = data;
  const avatarHash = discord_user?.avatar;
  if (avatarHash) {
    const el = document.getElementById('nowDiscAvatar');
    el.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.png?size=128`;
    el.style.display = 'block';
  }
  const dot = document.getElementById('nowDiscDot');
  dot.className = 'now-discord-dot ' + (discord_status || 'offline');
  document.getElementById('nowDiscStatus').textContent = STATUS_LABELS[discord_status] || 'Offline';

  const act = activities?.find(a => a.type !== 4);
  const actEl = document.getElementById('nowDiscActivity');
  if (act) {
    actEl.style.display = 'block';
    document.getElementById('nowDiscActName').textContent = act.name || '';
    document.getElementById('nowDiscActDetail').textContent = [act.details, act.state].filter(Boolean).join(' · ');
  } else {
    actEl.style.display = 'none';
  }
}

function connectLanyard() {
  const ws = new WebSocket('wss://api.lanyard.rest/socket');
  let heartbeat;
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.op === 1) {
      ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
      heartbeat = setInterval(() => ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
    }
    if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
      updatePresence(msg.d);
    }
  };
  ws.onclose = () => { clearInterval(heartbeat); setTimeout(connectLanyard, 5000); };
  ws.onerror = () => ws.close();
}
connectLanyard();

// ── GitHub Activity
async function fetchGitHub() {
  try {
    const userRes = await fetch('https://api.github.com/users/notasianrizz');
    if (userRes.ok) {
      const user = await userRes.json();
      document.getElementById('nowGhStats').textContent = `${user.followers} followers · ${user.public_repos} repos`;
    }
    const evtRes = await fetch('https://api.github.com/users/notasianrizz/events/public?per_page=1');
    if (evtRes.ok) {
      const events = await evtRes.json();
      if (events.length > 0) {
        const ev = events[0];
        document.getElementById('nowGhActivity').style.display = 'block';
        let type = ev.type.replace('Event', '');
        if (type === 'Push') type = 'Pushed code';
        if (type === 'Watch') type = 'Starred a repo';
        if (type === 'Create') type = 'Created a repo';
        document.getElementById('nowGhActType').textContent = type;
        document.getElementById('nowGhActRepo').textContent = ev.repo.name;
      }
    }
  } catch (e) { }
}
fetchGitHub();

// ── MCTT Quick Status
async function fetchMCTTQuick() {
  try {
    const res = await fetch('/api/pterodactyl');
    if (!res.ok) return;
    const data = await res.json();
    const dot = document.getElementById('nowMcDot');
    const status = document.getElementById('nowMcStatus');
    const players = document.getElementById('nowMcPlayers');
    if (data.network?.online) {
      dot.classList.add('online');
      status.textContent = 'Online';
      players.textContent = data.network.players?.online ?? 0;
    } else {
      dot.classList.add('offline');
      status.textContent = 'Offline';
      players.textContent = '0';
    }
  } catch (e) { }
}
fetchMCTTQuick();
