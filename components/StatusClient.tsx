"use client";

import { useEffect } from "react";

const LFM_KEY = "b3ba5d7e74e6393d681b81d161003177";
const LFM_USER = "pursian";

const WEATHER_CODE_MAP: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

type LyricsResult =
  | { type: "synced"; data: Array<{ time: number; text: string }> }
  | { type: "plain"; data: string }
  | { type: "instrumental" };

export function StatusClient() {
  useEffect(() => {
    let currentLyrics: Array<{ time: number; text: string }> | null = null;
    let lyricsSyncRAF: number | null = null;
    let spotifyProgress: number | null = null;
    let spotifyPollTime: number | null = null;
    let spotifyTrackKey: string | null = null;
    let cancelled = false;

    function parseLRC(lrc: string) {
      const lines = lrc.split("\n");
      const parsed: Array<{ time: number; text: string }> = [];
      for (const line of lines) {
        const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
        if (match) {
          const mins = parseInt(match[1]);
          const secs = parseInt(match[2]);
          const ms = parseInt(match[3].padEnd(3, "0"));
          const time = mins * 60 + secs + ms / 1000;
          const text = match[4].trim();
          if (text) parsed.push({ time, text });
        }
      }
      return parsed;
    }

    async function fetchLyrics(song: string, artist: string): Promise<LyricsResult | null> {
      try {
        const res = await fetch(
          `https://lrclib.net/api/get?track_name=${encodeURIComponent(song)}&artist_name=${encodeURIComponent(artist)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.syncedLyrics) return { type: "synced", data: parseLRC(data.syncedLyrics) };
          if (data.plainLyrics) return { type: "plain", data: data.plainLyrics };
          if (data.instrumental) return { type: "instrumental" };
        }
        const res2 = await fetch(
          `https://lrclib.net/api/search?track_name=${encodeURIComponent(song)}&artist_name=${encodeURIComponent(artist)}`,
        );
        if (res2.ok) {
          const results = await res2.json();
          const best =
            results.find((r: { syncedLyrics?: string }) => r.syncedLyrics) ||
            results.find((r: { plainLyrics?: string }) => r.plainLyrics) ||
            results[0];
          if (best?.syncedLyrics) return { type: "synced", data: parseLRC(best.syncedLyrics) };
          if (best?.plainLyrics) return { type: "plain", data: best.plainLyrics };
          if (best?.instrumental) return { type: "instrumental" };
        }
        return null;
      } catch (_e) {
        return null;
      }
    }

    function renderLyrics(result: LyricsResult) {
      const container = document.getElementById("nowLyricsLines");
      const panel = document.getElementById("nowLyricsPanel");
      if (!container || !panel) return;
      container.replaceChildren();
      if (result.type === "synced") {
        result.data.forEach((line, i) => {
          const div = document.createElement("div");
          div.className = "lyrics-line upcoming";
          div.textContent = line.text;
          div.dataset.index = String(i);
          container.appendChild(div);
        });
        currentLyrics = result.data;
      } else if (result.type === "plain") {
        const div = document.createElement("div");
        div.className = "lyrics-plain";
        div.textContent = result.data;
        container.appendChild(div);
        currentLyrics = null;
      } else if (result.type === "instrumental") {
        const div = document.createElement("div");
        div.className = "lyrics-instrumental";
        div.textContent = "♪ Instrumental ♪";
        container.appendChild(div);
        currentLyrics = null;
      }
      panel.classList.add("visible", "live");
    }

    function lyricsSyncLoop() {
      if (!currentLyrics) {
        lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop);
        return;
      }
      let elapsed: number;
      if (spotifyProgress !== null && spotifyPollTime !== null) {
        elapsed = (spotifyProgress + (Date.now() - spotifyPollTime)) / 1000;
      } else {
        lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop);
        return;
      }
      const container = document.getElementById("nowLyricsLines");
      if (!container) return;
      const lines = container.querySelectorAll<HTMLElement>(".lyrics-line");
      if (!lines.length) {
        lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop);
        return;
      }
      let activeIdx = -1;
      for (let i = 0; i < currentLyrics.length; i++) {
        if (elapsed >= currentLyrics[i].time) activeIdx = i;
      }
      lines.forEach((line, i) => {
        line.classList.remove("active", "past", "upcoming");
        if (i === activeIdx) line.classList.add("active");
        else if (i < activeIdx) line.classList.add("past");
        else line.classList.add("upcoming");
      });
      if (activeIdx >= 0 && lines[activeIdx]) {
        const scroll = document.getElementById("nowLyricsScroll");
        if (scroll) {
          const line = lines[activeIdx];
          scroll.scrollTop = line.offsetTop - scroll.offsetHeight / 2 + line.offsetHeight / 2;
        }
      }
      lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop);
    }

    function startLyricsSync() {
      if (lyricsSyncRAF) cancelAnimationFrame(lyricsSyncRAF);
      lyricsSyncRAF = requestAnimationFrame(lyricsSyncLoop);
    }

    function hideLyricsPanel() {
      const panel = document.getElementById("nowLyricsPanel");
      if (panel) panel.classList.remove("visible", "live");
      if (lyricsSyncRAF) cancelAnimationFrame(lyricsSyncRAF);
      lyricsSyncRAF = null;
      currentLyrics = null;
    }

    const resyncBtn = document.getElementById("nowLyricsResync");
    const onResyncClick = () => {
      spotifyProgress = null;
      spotifyPollTime = null;
      pollSpotify();
    };
    if (resyncBtn) resyncBtn.addEventListener("click", onResyncClick);

    function updateMusicWidget({
      song,
      artist,
      artUrl,
      isLive,
    }: {
      song: string | null | undefined;
      artist: string | null | undefined;
      artUrl: string | null | undefined;
      isLive: boolean;
    }) {
      const songEl = document.getElementById("nowMusicSong");
      const artistEl = document.getElementById("nowMusicArtist");
      if (songEl) songEl.textContent = song || "Unknown";
      if (artistEl) artistEl.textContent = artist || "Unknown Artist";
      const badge = document.getElementById("nowMusicBadge");
      const statusEl = document.getElementById("nowMusicStatus");
      const bars = document.getElementById("nowMusicBars");
      const musicCard = document.querySelector(".now-card-wide");
      if (isLive) {
        badge?.classList.add("live");
        if (statusEl) statusEl.textContent = "Now Playing";
        if (bars) bars.classList.add("active");
        if (musicCard) musicCard.classList.add("live");
      } else {
        badge?.classList.remove("live");
        if (statusEl) statusEl.textContent = "Last Played";
        if (bars) bars.classList.remove("active");
        if (musicCard) musicCard.classList.remove("live");
      }
      if (artUrl && !artUrl.includes("2a96cbd8b46e442fc41c2b86b821562f")) {
        const artEl = document.getElementById("nowMusicArt");
        if (artEl && artEl.parentNode) {
          const img = document.createElement("img");
          img.className = "now-music-art";
          img.id = "nowMusicArt";
          img.src = artUrl;
          img.alt = "album art";
          artEl.parentNode.replaceChild(img, artEl);
        }
      }
    }

    async function pollSpotify() {
      if (cancelled) return;
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) return;
        const data = await res.json();
        if (data.is_playing && data.progress_ms !== undefined) {
          spotifyProgress = data.progress_ms;
          spotifyPollTime = Date.now();
          updateMusicWidget({
            song: data.track,
            artist: data.artist,
            artUrl: data.album_art,
            isLive: true,
          });
          const trackKey = `${data.track}|||${data.artist}`;
          if (trackKey !== spotifyTrackKey) {
            spotifyTrackKey = trackKey;
            const result = await fetchLyrics(data.track, data.artist);
            if (result) {
              renderLyrics(result);
              if (result.type === "synced") startLyricsSync();
            } else hideLyricsPanel();
          }
        } else {
          spotifyProgress = null;
          spotifyPollTime = null;
          spotifyTrackKey = null;
          hideLyricsPanel();
        }
      } catch (_e) {}
    }
    pollSpotify();
    const spotifyInterval = setInterval(pollSpotify, 5000);

    async function fetchLastFm() {
      if (cancelled) return;
      try {
        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFM_USER}&api_key=${LFM_KEY}&format=json&limit=1`,
        );
        const data = await res.json();
        const track = data.recenttracks?.track?.[0];
        if (!track) return;
        const isLive = track["@attr"]?.nowplaying === "true";
        if (!isLive && !spotifyTrackKey) {
          updateMusicWidget({
            song: track.name || "Unknown",
            artist: track.artist?.["#text"] || "Unknown Artist",
            artUrl: track.image?.find((i: { size: string }) => i.size === "large")?.["#text"] || "",
            isLive: false,
          });
        }
      } catch (_e) {}
    }
    fetchLastFm();
    const lfmInterval = setInterval(fetchLastFm, 30000);

    // ── Discord via Lanyard
    const DISCORD_ID = "1120238252125868136";
    const STATUS_LABELS: Record<string, string> = {
      online: "Online",
      idle: "Away",
      dnd: "Do Not Disturb",
      offline: "Offline",
    };

    function updatePresence(data: {
      discord_status?: string;
      discord_user?: { avatar?: string };
      activities?: Array<{ type: number; name?: string; details?: string; state?: string }>;
    }) {
      const { discord_status, discord_user, activities } = data;
      const avatarHash = discord_user?.avatar;
      if (avatarHash) {
        const el = document.getElementById("nowDiscAvatar") as HTMLImageElement | null;
        if (el) {
          el.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.png?size=128`;
          el.style.display = "block";
        }
      }
      const dot = document.getElementById("nowDiscDot");
      if (dot) dot.className = "now-discord-dot " + (discord_status || "offline");
      const statusEl = document.getElementById("nowDiscStatus");
      if (statusEl)
        statusEl.textContent = STATUS_LABELS[discord_status || "offline"] || "Offline";
      const act = activities?.find((a) => a.type !== 4);
      const actEl = document.getElementById("nowDiscActivity");
      if (act) {
        if (actEl) actEl.style.display = "block";
        const nameEl = document.getElementById("nowDiscActName");
        const detailEl = document.getElementById("nowDiscActDetail");
        if (nameEl) nameEl.textContent = act.name || "";
        if (detailEl)
          detailEl.textContent = [act.details, act.state].filter(Boolean).join(" · ");
      } else {
        if (actEl) actEl.style.display = "none";
      }
    }

    let ws: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    function connectLanyard() {
      if (cancelled) return;
      ws = new WebSocket("wss://api.lanyard.rest/socket");
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.op === 1) {
          ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
          heartbeat = setInterval(
            () => ws?.send(JSON.stringify({ op: 3 })),
            msg.d.heartbeat_interval,
          );
        }
        if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE"))
          updatePresence(msg.d);
      };
      ws.onclose = () => {
        if (heartbeat) clearInterval(heartbeat);
        if (!cancelled) reconnectTimer = setTimeout(connectLanyard, 5000);
      };
      ws.onerror = () => ws?.close();
    }
    connectLanyard();

    // ── GitHub Activity
    async function fetchGitHub() {
      try {
        const userRes = await fetch("https://api.github.com/users/notasianrizz");
        if (userRes.ok) {
          const user = await userRes.json();
          const statsEl = document.getElementById("nowGhStats");
          if (statsEl) statsEl.textContent = `${user.followers} followers · ${user.public_repos} repos`;
        }
        const evtRes = await fetch(
          "https://api.github.com/users/notasianrizz/events/public?per_page=1",
        );
        if (evtRes.ok) {
          const events = await evtRes.json();
          if (events.length > 0) {
            const ev = events[0];
            const actEl = document.getElementById("nowGhActivity");
            if (actEl) actEl.style.display = "block";
            let type = ev.type.replace("Event", "");
            if (type === "Push") type = "Pushed code";
            if (type === "Watch") type = "Starred a repo";
            if (type === "Create") type = "Created a repo";
            const typeEl = document.getElementById("nowGhActType");
            const repoEl = document.getElementById("nowGhActRepo");
            if (typeEl) typeEl.textContent = type;
            if (repoEl) repoEl.textContent = ev.repo.name;
          }
        }
      } catch (_e) {}
    }
    fetchGitHub();

    // ── Open-Meteo Weather
    async function fetchWeather() {
      if (cancelled) return;
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=35.2271,47.6062&longitude=-80.8431,-122.3321&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto",
        );
        if (!res.ok) return;
        const data = await res.json();

        // Charlotte
        if (data[0] && data[0].current) {
          const tempClt = Math.round(data[0].current.temperature_2m);
          const codeClt = data[0].current.weather_code;
          const conditionClt = WEATHER_CODE_MAP[codeClt] || "Unknown";
          const timeClt = new Date().toLocaleTimeString("en-US", {
            timeZone: "America/New_York",
            hour: "2-digit",
            minute: "2-digit",
          });
          const tempEl = document.getElementById("nowWeatherCltTemp");
          const statusEl = document.getElementById("nowWeatherCltStatus");
          const timeEl = document.getElementById("nowWeatherCltTime");
          if (tempEl) tempEl.textContent = `${tempClt}°F`;
          if (statusEl) statusEl.textContent = conditionClt;
          if (timeEl) timeEl.textContent = `Local time: ${timeClt}`;
        }

        // Seattle
        if (data[1] && data[1].current) {
          const tempSea = Math.round(data[1].current.temperature_2m);
          const codeSea = data[1].current.weather_code;
          const conditionSea = WEATHER_CODE_MAP[codeSea] || "Unknown";
          const timeSea = new Date().toLocaleTimeString("en-US", {
            timeZone: "America/Los_Angeles",
            hour: "2-digit",
            minute: "2-digit",
          });
          const tempEl = document.getElementById("nowWeatherSeaTemp");
          const statusEl = document.getElementById("nowWeatherSeaStatus");
          const timeEl = document.getElementById("nowWeatherSeaTime");
          if (tempEl) tempEl.textContent = `${tempSea}°F`;
          if (statusEl) statusEl.textContent = conditionSea;
          if (timeEl) timeEl.textContent = `Local time: ${timeSea}`;
        }
      } catch (e) {
        console.error("Weather fetch error:", e);
      }
    }
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 600000);

    return () => {
      cancelled = true;
      if (lyricsSyncRAF) cancelAnimationFrame(lyricsSyncRAF);
      if (resyncBtn) resyncBtn.removeEventListener("click", onResyncClick);
      clearInterval(spotifyInterval);
      clearInterval(lfmInterval);
      clearInterval(weatherInterval);
      if (heartbeat) clearInterval(heartbeat);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  return null;
}
