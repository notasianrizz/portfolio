// ── Hub Landing Page — Lightweight live previews for hub cards

// ── Discord status via Lanyard (just the status dot)
const DISCORD_ID = '1120238252125868136';
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
      const status = msg.d.discord_status || 'offline';
      const dot = document.getElementById('hubDiscordDot');
      const text = document.getElementById('hubDiscordStatus');
      if (dot) {
        dot.className = 'hub-live-dot ' + status;
      }
      if (text) {
        const labels = { online: 'online', idle: 'away', dnd: 'dnd', offline: 'offline' };
        text.textContent = labels[status] || 'offline';
      }
    }
  };
  ws.onclose = () => { clearInterval(heartbeat); setTimeout(connectLanyard, 5000); };
  ws.onerror = () => ws.close();
}
connectLanyard();

// ── Music preview (Spotify → Last.fm fallback)
async function fetchMusicPreview() {
  try {
    const res = await fetch('/api/spotify');
    if (res.ok) {
      const data = await res.json();
      if (data.is_playing && data.track) {
        document.getElementById('hubMusicText').textContent = `${data.track} — ${data.artist}`;
        return;
      }
    }
  } catch (e) { }

  // Fallback to Last.fm
  try {
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=pursian&api_key=b3ba5d7e74e6393d681b81d161003177&format=json&limit=1`);
    const data = await res.json();
    const track = data.recenttracks?.track?.[0];
    if (track) {
      const song = track.name || 'Unknown';
      const artist = track.artist?.['#text'] || '';
      document.getElementById('hubMusicText').textContent = `${song} — ${artist}`;
    }
  } catch (e) { }
}
fetchMusicPreview();
setInterval(fetchMusicPreview, 15000);

// ── MCTT status preview
async function fetchMcttPreview() {
  try {
    const res = await fetch('/api/pterodactyl');
    if (!res.ok) return;
    const data = await res.json();
    const dot = document.querySelector('#hubMcttLive .hub-live-dot');
    const text = document.getElementById('hubMcttStatus');
    const peek = document.getElementById('hubMcttPeek');
    if (data.network?.online) {
      if (dot) dot.className = 'hub-live-dot online';
      if (text) text.textContent = 'online';
      const count = data.network.players?.online ?? 0;
      if (peek) peek.textContent = `play.tame.gg — ${count} player${count !== 1 ? 's' : ''} online`;
    } else {
      if (dot) dot.className = 'hub-live-dot offline';
      if (text) text.textContent = 'offline';
    }
  } catch (e) { }
}
fetchMcttPreview();
