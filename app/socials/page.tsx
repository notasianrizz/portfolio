import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Socials — tame.gg",
  openGraph: {
    type: "website",
    url: "https://tame.gg/socials",
    siteName: "tame.gg",
    title: "Socials — asianrizz",
    description: "Find asianrizz across the internet",
  },
};

export default function SocialsPage() {
  return (
    <>
      <section id="hero" className="page-hero">
        <div className="grid-lines"></div>
        <p className="hero-eyebrow">Find me online</p>
        <h1 className="hero-name">
          asian<em>rizz</em>
        </h1>
        <p className="hero-domain">All my links, one place</p>
      </section>

      <section id="socials-section">
        <div className="sec-inner">
          <p className="sec-lbl rv">Platforms</p>
          <h2 className="sec-h rv">
            Where I <em>hang out</em>
          </h2>

          <div className="soc-grid">
            <a
              href="https://instagram.com/andrew_zandi"
              target="_blank"
              rel="noopener"
              className="soc-card rv d1"
            >
              <div className="soc-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div className="soc-card-body">
                <div className="soc-card-platform">Instagram</div>
                <div className="soc-card-handle">@andrew_zandi</div>
              </div>
              <div className="soc-card-arrow">&rarr;</div>
            </a>

            <a
              href="https://tiktok.com/@andrew_zandi"
              target="_blank"
              rel="noopener"
              className="soc-card rv d2"
            >
              <div className="soc-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z" />
                </svg>
              </div>
              <div className="soc-card-body">
                <div className="soc-card-platform">TikTok</div>
                <div className="soc-card-handle">@andrew_zandi</div>
              </div>
              <div className="soc-card-arrow">&rarr;</div>
            </a>

            <a
              href="https://discord.com/users/asianrizz"
              target="_blank"
              rel="noopener"
              className="soc-card rv d3"
            >
              <div className="soc-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                </svg>
              </div>
              <div className="soc-card-body">
                <div className="soc-card-platform">Discord</div>
                <div className="soc-card-handle">asianrizz</div>
              </div>
              <div className="soc-card-arrow">&rarr;</div>
            </a>

            <a
              href="https://github.com/notasianrizz"
              target="_blank"
              rel="noopener"
              className="soc-card rv d4"
            >
              <div className="soc-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div className="soc-card-body">
                <div className="soc-card-platform">GitHub</div>
                <div className="soc-card-handle">notasianrizz</div>
              </div>
              <div className="soc-card-arrow">&rarr;</div>
            </a>

            <a
              href="https://linkedin.com/in/andrewzandi"
              target="_blank"
              rel="noopener"
              className="soc-card rv d1"
            >
              <div className="soc-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div className="soc-card-body">
                <div className="soc-card-platform">LinkedIn</div>
                <div className="soc-card-handle">andrewzandi</div>
              </div>
              <div className="soc-card-arrow">&rarr;</div>
            </a>

            <a
              href="https://last.fm/user/pursian"
              target="_blank"
              rel="noopener"
              className="soc-card rv d2"
            >
              <div className="soc-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-1.404.84-3.045 1.241-4.741 1.177a6.76 6.76 0 01-3.064-.75c-.929-.489-1.647-1.205-2.093-2.082-.446-.876-.564-1.878-.34-2.846.225-.969.774-1.833 1.558-2.449a5.463 5.463 0 012.705-.987 4.07 4.07 0 012.025.312c.617.28 1.12.74 1.44 1.312l-1.185.7a2.13 2.13 0 00-.818-.742 2.733 2.733 0 00-1.33-.205 4.097 4.097 0 00-1.993.727c-.57.424-.978 1.04-1.149 1.737-.17.697-.088 1.433.233 2.083.32.65.86 1.185 1.537 1.517.676.332 1.451.457 2.216.358a6.39 6.39 0 002.018-.638l.44 1.076zm.668-3.424l-.614-1.513c.383-.154.793-.225 1.204-.208.41.017.807.12 1.162.302l-.614 1.184a1.92 1.92 0 00-.586-.195 1.987 1.987 0 00-.552.43zm2.04 2.16l-.61-1.505c.38-.154.787-.225 1.195-.208.408.017.803.12 1.156.302l-.61 1.183a1.902 1.902 0 00-.582-.195 1.964 1.964 0 00-.549.423z" />
                </svg>
              </div>
              <div className="soc-card-body">
                <div className="soc-card-platform">Last.fm</div>
                <div className="soc-card-handle">pursian</div>
              </div>
              <div className="soc-card-arrow">&rarr;</div>
            </a>
          </div>

          <div className="soc-cta rv">
            <p className="soc-cta-text">
              Want to see what I&apos;m up to <em>right now?</em>
            </p>
            <a href="/status" className="soc-cta-btn mag">
              <span>Live Status</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="18"
                height="18"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer variant="asianrizz" />
    </>
  );
}
