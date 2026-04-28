import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Portfolio — tame.gg",
  openGraph: {
    type: "website",
    url: "https://tame.gg/portfolio",
    siteName: "tame.gg",
    title: "Portfolio — Andrew Zandi",
    description: "Andrew Zandi's experience, work history, and education",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <section id="hero" className="page-hero">
        <div className="grid-lines"></div>
        <p className="hero-eyebrow">Charlotte, NC &middot; Seattle, WA</p>
        <h1 className="hero-name">
          Andrew <em>Zandi</em>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://flagofiran.com/files/flag-of-iran-emoji-ios.png"
            alt="Pahlavi Iranian Flag"
            title="Lion & Sun — Imperial Iran"
            style={{
              height: "0.82em",
              width: "auto",
              display: "inline-block",
              verticalAlign: "middle",
              marginLeft: "0.18em",
              position: "relative",
              top: "-0.04em",
            }}
          />
        </h1>
        <p className="hero-domain">Portfolio & Experience</p>
      </section>

      <section id="about">
        <div className="sec-inner">
          <p className="sec-lbl rv">About me</p>
          <h2 className="sec-h rv">
            A Student,
            <br />
            <em>supercharging my future</em>
          </h2>
          <div className="about-grid">
            <div>
              <div className="about-body rv d1">
                <p>
                  Hey, I&apos;m Andrew — a high schooler from Charlotte, NC. I&apos;ve worn a few
                  different hats: manager in training at Dave&apos;s Hot Chicken, customer advisor
                  at Tesla, stocking shelves at CVS, serving up soups at Panera. Each one taught me
                  something different about people, patience, and showing up.
                </p>
                <p>
                  When I&apos;m not working, I&apos;m gaming, listening to music, building things
                  online, or just vibing. This site is my little corner of the internet — come
                  hang.
                </p>
              </div>
              <div className="tags rv d2">
                <span className="tag">Gaming</span>
                <span className="tag">Music</span>
                <span className="tag">Charlotte, NC</span>
                <span className="tag">Content Creator</span>
                <span className="tag">Tech</span>
                <span className="tag">Discord</span>
              </div>
            </div>
            <div className="stats">
              <div className="stat rv d1">
                <div className="stat-n">Dave&apos;s Hot Chicken</div>
                <div className="stat-d">Manager / Shift Leader &middot; 2026 &ndash; Present</div>
              </div>
              <div className="stat rv d2">
                <div className="stat-n">5+</div>
                <div className="stat-d">Jobs across Charlotte, WA & beyond</div>
              </div>
              <div className="stat rv d3">
                <div className="stat-n">2026</div>
                <div className="stat-d">Graduating Palisades High School</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="sec-inner">
          <p className="sec-lbl rv">Experience & Work</p>
          <h2 className="sec-h rv">
            What I&apos;ve <em>been up to</em>
          </h2>
          <div className="port-grid">
            <div className="pc rv d1">
              <div className="pc-icon">&#128293;</div>
              <div className="pc-type">Work &middot; Food & Service</div>
              <div className="pc-title">Manager / Shift Leader (in training)</div>
              <div className="pc-desc">
                Leading shifts and managing operations at Dave&apos;s Hot Chicken — one of the
                fastest-growing fast casual brands in the country.
              </div>
              <div className="pc-meta">
                <span>Dave&apos;s Hot Chicken</span>
                <span>2026 &ndash; Present</span>
                <span>SC</span>
              </div>
            </div>
            <div className="pc rv d2">
              <div className="pc-icon">&#9889;</div>
              <div className="pc-type">Work &middot; Customer Facing</div>
              <div className="pc-title">Tesla Advisor</div>
              <div className="pc-desc">
                Worked directly with Tesla customers in Charlotte, delivering product knowledge and
                premium service at one of the most iconic brands in the world.
              </div>
              <div className="pc-meta">
                <span>Tesla</span>
                <span>Nov 2025 &ndash; Jan 2026</span>
                <span>Charlotte, NC</span>
              </div>
            </div>
            <div className="pc rv d3">
              <div className="pc-icon">&#128138;</div>
              <div className="pc-type">Work &middot; Retail</div>
              <div className="pc-title">Cashier & Stocker</div>
              <div className="pc-desc">
                Managed front-end operations at CVS Health, handling customer transactions and
                inventory in a fast-paced retail pharmacy environment.
              </div>
              <div className="pc-meta">
                <span>CVS Health</span>
                <span>Feb &ndash; Apr 2025</span>
                <span>Charlotte, NC</span>
              </div>
            </div>
            <div className="pc rv d4">
              <div className="pc-icon">&#129366;</div>
              <div className="pc-type">Work &middot; Food & Service</div>
              <div className="pc-title">Crew Member</div>
              <div className="pc-desc">
                Fast-paced food service at Panera Bread across two locations. Built strong work
                ethic and thrived in a high-volume team environment.
              </div>
              <div className="pc-meta">
                <span>Panera Bread</span>
                <span>2024 &ndash; 2025</span>
                <span>Charlotte & WA</span>
              </div>
            </div>
            <div className="pc rv d2">
              <div className="pc-icon">&#127979;</div>
              <div className="pc-type">Education</div>
              <div className="pc-title">Palisades High School</div>
              <div className="pc-desc">Completing a High School Diploma, graduating June 2026.</div>
              <div className="pc-meta">
                <span>Jun 2026</span>
                <span>Charlotte, NC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="andrew-with-linkedin" />
    </>
  );
}
