"use client";

import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";

  return (
    <nav>
      <a href="/" className={`logo${isHome ? " active" : ""}`}>
        tame<em>.gg</em>
      </a>
      <ul className="nav-links">
        <li>
          <a href="/status" className={pathname === "/status" ? "active" : undefined}>
            Status
          </a>
        </li>
        <li>
          <a href="/portfolio" className={pathname === "/portfolio" ? "active" : undefined}>
            Portfolio
          </a>
        </li>
        <li>
          <a href="/socials" className={pathname === "/socials" ? "active" : undefined}>
            Socials
          </a>
        </li>
      </ul>
      <button className="hamburger" id="hamburger" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}
