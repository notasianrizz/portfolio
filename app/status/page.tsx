import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { StatusClient } from "@/components/StatusClient";

export const metadata: Metadata = {
  title: "Live Status — tame.gg",
  openGraph: {
    type: "website",
    url: "https://tame.gg/status",
    siteName: "tame.gg",
    title: "Live Status — tame.gg",
    description: "A live snapshot of what Andrew is up to right now",
  },
};

export default function StatusPage() {
  return (
    <>
      <section id="hero" className="page-hero">
        <div className="grid-lines"></div>
        <p className="hero-eyebrow">Real-time</p>
        <h1 className="hero-name">
          Live <em>Status</em>
        </h1>
        <p className="hero-domain">Everything I&apos;m doing at this exact moment</p>
      </section>

      <section id="now-activity">
        <div className="sec-inner">
          <p className="sec-lbl rv">Live Activity</p>
          <h2 className="sec-h rv">
            What I&apos;m <em>up to</em>
          </h2>

          <div className="now-grid">
            <div className="now-card now-card-wide rv d1">
              <div className="now-card-header">
                <span className="now-card-icon">&#127925;</span>
                <span className="now-card-title">Music</span>
                <div className="now-live-badge" id="nowMusicBadge">
                  <span className="now-live-dot"></span>
                  <span id="nowMusicStatus">Checking...</span>
                </div>
              </div>
              <div className="now-music-content">
                <div className="now-music-art-wrap">
                  <div
                    className="now-music-art"
                    id="nowMusicArt"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    &#127925;
                  </div>
                </div>
                <div className="now-music-info">
                  <div className="now-music-song" id="nowMusicSong">
                    Loading...
                  </div>
                  <div className="now-music-artist" id="nowMusicArtist">
                    &mdash;
                  </div>
                  <div className="now-music-bars" id="nowMusicBars">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="now-lyrics-panel" id="nowLyricsPanel">
                <div className="now-lyrics-header">
                  <span>&#127908; Live Lyrics</span>
                  <button className="now-lyrics-resync" id="nowLyricsResync" title="Resync">
                    &#8635; Resync
                  </button>
                </div>
                <div className="now-lyrics-scroll" id="nowLyricsScroll">
                  <div className="now-lyrics-lines" id="nowLyricsLines"></div>
                </div>
                <div className="now-lyrics-footer">
                  <span className="lyrics-src">via lrclib.net</span>
                </div>
              </div>
            </div>

            <div className="now-card rv d2">
              <div className="now-card-header">
                <span className="now-card-icon">&#127918;</span>
                <span className="now-card-title">Discord</span>
              </div>
              <div className="now-discord-content">
                <div className="now-discord-user">
                  <div className="now-discord-avatar-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="now-discord-avatar"
                      id="nowDiscAvatar"
                      src=""
                      alt="avatar"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="now-discord-dot" id="nowDiscDot"></div>
                  </div>
                  <div>
                    <div className="now-discord-name">asianrizz</div>
                    <div className="now-discord-status" id="nowDiscStatus">
                      Fetching...
                    </div>
                  </div>
                </div>
                <div
                  className="now-discord-activity"
                  id="nowDiscActivity"
                  style={{ display: "none" }}
                >
                  <div className="now-discord-act-label">Currently</div>
                  <div className="now-discord-act-name" id="nowDiscActName"></div>
                  <div className="now-discord-act-detail" id="nowDiscActDetail"></div>
                </div>
              </div>
            </div>

            <div className="now-card rv d3">
              <div className="now-card-header">
                <span className="now-card-icon">&#128187;</span>
                <span className="now-card-title">GitHub</span>
              </div>
              <div className="now-github-content">
                <div className="now-github-user">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="now-github-avatar"
                    src="https://github.com/notasianrizz.png"
                    alt="avatar"
                  />
                  <div>
                    <div className="now-github-name">notasianrizz</div>
                    <div className="now-github-stats" id="nowGhStats">
                      Fetching...
                    </div>
                  </div>
                </div>
                <div
                  className="now-github-activity"
                  id="nowGhActivity"
                  style={{ display: "none" }}
                >
                  <div className="now-github-act-label">Latest</div>
                  <div className="now-github-act-type" id="nowGhActType"></div>
                  <div className="now-github-act-repo" id="nowGhActRepo"></div>
                </div>
              </div>
            </div>

            <div className="now-card rv d4">
              <div className="now-card-header">
                <span className="now-card-icon">🌤️</span>
                <span className="now-card-title">Charlotte, NC</span>
              </div>
              <div className="now-weather-content">
                <div
                  className="now-weather-temp"
                  id="nowWeatherCltTemp"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: "2.2rem",
                    lineHeight: 1,
                    color: "var(--accent)",
                  }}
                >
                  --°F
                </div>
                <div
                  className="now-weather-status"
                  id="nowWeatherCltStatus"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: ".85rem",
                    fontWeight: 600,
                    marginTop: ".4rem",
                  }}
                >
                  Fetching...
                </div>
                <div
                  className="now-weather-time"
                  id="nowWeatherCltTime"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: ".75rem",
                    color: "var(--muted)",
                    marginTop: ".1rem",
                  }}
                >
                  --:--
                </div>
              </div>
            </div>

            <div className="now-card rv d5">
              <div className="now-card-header">
                <span className="now-card-icon">🌧️</span>
                <span className="now-card-title">Seattle, WA</span>
              </div>
              <div className="now-weather-content">
                <div
                  className="now-weather-temp"
                  id="nowWeatherSeaTemp"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: "2.2rem",
                    lineHeight: 1,
                    color: "var(--accent)",
                  }}
                >
                  --°F
                </div>
                <div
                  className="now-weather-status"
                  id="nowWeatherSeaStatus"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: ".85rem",
                    fontWeight: 600,
                    marginTop: ".4rem",
                  }}
                >
                  Fetching...
                </div>
                <div
                  className="now-weather-time"
                  id="nowWeatherSeaTime"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: ".75rem",
                    color: "var(--muted)",
                    marginTop: ".1rem",
                  }}
                >
                  --:--
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="andrew" />
      <StatusClient />
    </>
  );
}
