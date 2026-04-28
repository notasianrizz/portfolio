"use client";

import { usePathname } from "next/navigation";

export function MobileMenu() {
  const pathname = usePathname() || "/";
  const link = (href: string) => (pathname === href ? "mm-link active" : "mm-link");

  return (
    <div className="mobile-menu" id="mobileMenu">
      <div className="mm-overlay" id="mmOverlay"></div>
      <div className="mm-panel">
        <a href="/" className={link("/")}>
          Home
        </a>
        <a href="/status" className={link("/status")}>
          Status
        </a>
        <a href="/portfolio" className={link("/portfolio")}>
          Portfolio
        </a>
        <a href="/socials" className={link("/socials")}>
          Socials
        </a>
        <div className="mm-foot">
          tame<em>.gg</em>
        </div>
      </div>
    </div>
  );
}
