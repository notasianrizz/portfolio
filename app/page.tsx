import { Footer } from "@/components/Footer";
import { HubClient } from "@/components/HubClient";

export default function HomePage() {
  return (
    <>
      <section id="hero">
        <div className="grid-lines"></div>
        <p className="hero-eyebrow">hub</p>
        <h1 className="hero-name">
          tame<em>.gg</em>
        </h1>

        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      <section id="hub">
        <div className="sec-inner">
          <div className="hub-grid">
            <a href="/status" className="hub-card hub-card-now rv d1">
              <div className="hub-card-glow"></div>
              <div className="hub-card-top">
                <div className="hub-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="hub-card-live" id="hubStatusLive">
                  <span className="hub-live-dot" id="hubDiscordDot"></span>
                  <span id="hubDiscordStatus">offline</span>
                </div>
              </div>
              <div className="hub-card-body">
                <div className="hub-card-title">/status</div>
                <div className="hub-card-desc">
                  Music, Discord, GitHub — everything live, right now.
                </div>
              </div>
              <div className="hub-card-peek">
                <span className="hub-peek-icon">&#127925;</span>
                <span className="hub-peek-text" id="hubMusicText">
                  Loading...
                </span>
              </div>
              <div className="hub-card-arrow">&rarr;</div>
            </a>

            <a href="/portfolio" className="hub-card hub-card-portfolio rv d2">
              <div className="hub-card-glow"></div>
              <div className="hub-card-top">
                <div className="hub-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                </div>
              </div>
              <div className="hub-card-body">
                <div className="hub-card-title">/portfolio</div>
                <div className="hub-card-desc">
                  Work experience, education, and everything I&apos;ve built.
                </div>
              </div>
              <div className="hub-card-arrow">&rarr;</div>
            </a>

            <a href="/socials" className="hub-card hub-card-socials-link rv d3">
              <div className="hub-card-glow"></div>
              <div className="hub-card-top">
                <div className="hub-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </div>
              </div>
              <div className="hub-card-body">
                <div className="hub-card-title">/socials</div>
                <div className="hub-card-desc">
                  Instagram, TikTok, Discord, GitHub, and more.
                </div>
              </div>
              <div className="hub-card-arrow">&rarr;</div>
            </a>
          </div>
        </div>
      </section>

      <Footer variant="minimal" />
      <HubClient />
    </>
  );
}
