"use client";

import { useEffect } from "react";

export function HubClient() {
  useEffect(() => {
    const DISCORD_ID = "1120238252125868136";
    let ws: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

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
        if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
          const status: string = msg.d.discord_status || "offline";
          const dot = document.getElementById("hubDiscordDot");
          const text = document.getElementById("hubDiscordStatus");
          if (dot) {
            dot.className = "hub-live-dot " + status;
          }
          if (text) {
            const labels: Record<string, string> = {
              online: "online",
              idle: "away",
              dnd: "dnd",
              offline: "offline",
            };
            text.textContent = labels[status] || "offline";
          }
        }
      };
      ws.onclose = () => {
        if (heartbeat) clearInterval(heartbeat);
        if (!cancelled) reconnectTimer = setTimeout(connectLanyard, 5000);
      };
      ws.onerror = () => ws?.close();
    }
    connectLanyard();

    // ── Music preview (Spotify → Last.fm fallback)
    async function fetchMusicPreview() {
      try {
        const res = await fetch("/api/spotify");
        if (res.ok) {
          const data = await res.json();
          if (data.is_playing && data.track) {
            const el = document.getElementById("hubMusicText");
            if (el) el.textContent = `${data.track} — ${data.artist}`;
            return;
          }
        }
      } catch (_e) {}

      // Fallback to Last.fm
      try {
        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=pursian&api_key=b3ba5d7e74e6393d681b81d161003177&format=json&limit=1`,
        );
        const data = await res.json();
        const track = data.recenttracks?.track?.[0];
        if (track) {
          const song = track.name || "Unknown";
          const artist = track.artist?.["#text"] || "";
          const el = document.getElementById("hubMusicText");
          if (el) el.textContent = `${song} — ${artist}`;
        }
      } catch (_e) {}
    }
    fetchMusicPreview();
    const musicInterval = setInterval(fetchMusicPreview, 15000);

    return () => {
      cancelled = true;
      if (heartbeat) clearInterval(heartbeat);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
      clearInterval(musicInterval);
    };
  }, []);

  return null;
}
