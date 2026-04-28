import type { Metadata } from "next";
import Script from "next/script";
import { Nav } from "@/components/Nav";
import { MobileMenu } from "@/components/MobileMenu";
import { SharedClient } from "@/components/SharedClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "tame.gg",
  description: "portal",
  openGraph: {
    type: "website",
    url: "https://tame.gg",
    siteName: "tame.gg",
    title: "tame.gg",
    description: "portal",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400&display=swap"
          rel="stylesheet"
        />
        <Script src="https://cdn.vercel-insights.com/v1/script.js" strategy="afterInteractive" />
        <Script id="vercel-si-stub" strategy="afterInteractive">
          {`window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };`}
        </Script>
        <Script src="/_vercel/speed-insights/script.js" strategy="afterInteractive" />
      </head>
      <body>
        <div id="boot-screen">
          <div className="boot-logo">
            tame<em>.gg</em>
          </div>
          <div className="boot-bar-track">
            <div className="boot-bar-fill"></div>
          </div>
        </div>

        <canvas id="bg-canvas"></canvas>
        <div id="cur"></div>
        <div id="cur-ring"></div>

        <div className="fixed-actions">
          <button className="theme-btn" id="themeBtn" aria-label="Toggle theme">
            <span className="ti ti-moon">&#127769;</span>
            <span className="ti ti-sun">&#9728;&#65039;</span>
          </button>
        </div>

        <Nav />
        <MobileMenu />

        {children}

        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
        <SharedClient />
      </body>
    </html>
  );
}
