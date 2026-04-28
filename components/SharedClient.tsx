"use client";

import { useEffect } from "react";

export function SharedClient() {
  useEffect(() => {
    // ── Custom Cursor
    const cur = document.getElementById("cur");
    const ring = document.getElementById("cur-ring");
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);
    let cursorRAF = 0;
    const tick = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (cur) {
        cur.style.left = mx + "px";
        cur.style.top = my + "px";
      }
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      cursorRAF = requestAnimationFrame(tick);
    };
    cursorRAF = requestAnimationFrame(tick);

    const hoverEls = Array.from(document.querySelectorAll<HTMLElement>("a,button"));
    const onHoverEnter = () => document.body.classList.add("hovering");
    const onHoverLeave = () => document.body.classList.remove("hovering");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onHoverEnter);
      el.addEventListener("mouseleave", onHoverLeave);
    });

    // ── Theme
    const html = document.documentElement;
    const themeBtn = document.getElementById("themeBtn");
    const discWidget = document.getElementById("discordWidget") as HTMLIFrameElement | null;
    function applyTheme(t: string) {
      html.setAttribute("data-theme", t);
      try {
        localStorage.setItem("tame-theme", t);
      } catch (_e) {}
      if (discWidget)
        discWidget.src =
          "https://discord.com/widget?id=1012876825573204048&theme=" +
          (t === "dark" ? "dark" : "light");
    }
    const savedTheme = (() => {
      try {
        return localStorage.getItem("tame-theme");
      } catch (_e) {
        return null;
      }
    })();
    applyTheme(
      savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    );
    const onThemeClick = () =>
      applyTheme(html.getAttribute("data-theme") === "light" ? "dark" : "light");
    if (themeBtn) themeBtn.addEventListener("click", onThemeClick);

    // ── Mobile Menu
    const hamburgerBtn = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const mmOverlay = document.getElementById("mmOverlay");
    const onHamburgerClick = () => {
      hamburgerBtn?.classList.toggle("active");
      mobileMenu?.classList.toggle("open");
      document.body.classList.toggle("locked");
    };
    const onOverlayClick = () => {
      hamburgerBtn?.classList.remove("active");
      mobileMenu?.classList.remove("open");
      document.body.classList.remove("locked");
    };
    if (hamburgerBtn && mobileMenu) {
      hamburgerBtn.addEventListener("click", onHamburgerClick);
      if (mmOverlay) mmOverlay.addEventListener("click", onOverlayClick);
      document.querySelectorAll<HTMLElement>(".mm-link").forEach((link) => {
        link.addEventListener("click", onOverlayClick);
      });
    }

    // ── Canvas Background
    const bgCanvas = document.getElementById("bg-canvas") as HTMLCanvasElement | null;
    let bgRAF = 0;
    let onResize: (() => void) | null = null;
    if (bgCanvas) {
      const bgCtx = bgCanvas.getContext("2d")!;
      let w = 0;
      let h = 0;
      const bgParticles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        rad: number;
        update: () => void;
        draw: () => void;
      }> = [];
      const resizeBg = () => {
        w = bgCanvas.width = window.innerWidth;
        h = bgCanvas.height = window.innerHeight;
      };
      onResize = resizeBg;
      window.addEventListener("resize", resizeBg);
      resizeBg();

      class BgParticle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        rad: number;
        constructor() {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = (Math.random() - 0.5) * 0.4;
          this.rad = Math.random() * 1.2 + 0.5;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > w) this.vx *= -1;
          if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
          bgCtx.beginPath();
          bgCtx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
          bgCtx.fillStyle =
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "rgba(255,255,255,0.3)"
              : "rgba(200,169,110,0.4)";
          bgCtx.fill();
        }
      }
      for (let i = 0; i < 60; i++) bgParticles.push(new BgParticle());

      const animateBg = () => {
        bgCtx.clearRect(0, 0, w, h);
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const cp = isDark ? "255,255,255" : "200,169,110";
        bgParticles.forEach((p) => {
          p.update();
          p.draw();
        });
        for (let i = 0; i < bgParticles.length; i++) {
          for (let j = i + 1; j < bgParticles.length; j++) {
            const dx = bgParticles[i].x - bgParticles[j].x;
            const dy = bgParticles[i].y - bgParticles[j].y;
            const dist = dx * dx + dy * dy;
            if (dist < 12000) {
              bgCtx.beginPath();
              bgCtx.strokeStyle = `rgba(${cp},${0.08 - dist / 150000})`;
              bgCtx.lineWidth = 0.5;
              bgCtx.moveTo(bgParticles[i].x, bgParticles[i].y);
              bgCtx.lineTo(bgParticles[j].x, bgParticles[j].y);
              bgCtx.stroke();
            }
          }
          const dx = bgParticles[i].x - mx;
          const dy = bgParticles[i].y - my;
          const dist = dx * dx + dy * dy;
          if (dist < 25000) {
            bgCtx.beginPath();
            bgCtx.strokeStyle = `rgba(${cp},${0.2 - dist / 125000})`;
            bgCtx.lineWidth = 0.8;
            bgCtx.moveTo(bgParticles[i].x, bgParticles[i].y);
            bgCtx.lineTo(mx, my);
            bgCtx.stroke();
          }
        }
        bgRAF = requestAnimationFrame(animateBg);
      };
      bgRAF = requestAnimationFrame(animateBg);
    }

    // ── GSAP Animations
    const onDOMContentReady = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap) return;
      if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

      document.querySelectorAll<HTMLElement>(".rv").forEach((el) => {
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
      });

      gsap.utils.toArray("section").forEach((sec: HTMLElement) => {
        const elems = sec.querySelectorAll(".rv");
        if (elems.length) {
          gsap.to(elems, {
            scrollTrigger: { trigger: sec, start: "top 80%" },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      });

      // Magnetic Buttons
      document
        .querySelectorAll<HTMLElement>(".ss-btn, .port-btn, .soc, .fsoc, .mctt-copy-btn")
        .forEach((btn) => {
          btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const bx = e.clientX - rect.left - rect.width / 2;
            const by = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
              x: bx * 0.3,
              y: by * 0.3,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
          btn.addEventListener("mouseleave", () => {
            gsap.to(btn, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.3)",
              overwrite: "auto",
            });
          });
        });
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onDOMContentReady);
    } else {
      onDOMContentReady();
    }

    // ── Parallax (only on pages with hero)
    const heroEl = document.getElementById("hero");
    const gridEl = document.querySelector<HTMLElement>(".grid-lines");
    const onScroll = () => {
      if (!heroEl) return;
      const y = window.scrollY;
      if (y > heroEl.offsetHeight) return;
      if (gridEl) gridEl.style.transform = `translateY(${y * 0.12}px)`;
      heroEl.style.setProperty("--prlx", `${y * 0.22}px`);
    };
    if (heroEl) window.addEventListener("scroll", onScroll, { passive: true });

    // ── Boot Screen
    const bootScreen = document.getElementById("boot-screen");
    let bootHideTimeout: ReturnType<typeof setTimeout> | undefined;
    let bootDisplayTimeout: ReturnType<typeof setTimeout> | undefined;
    if (bootScreen) {
      document.body.classList.add("locked");
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      bootHideTimeout = setTimeout(() => {
        bootScreen.classList.add("hidden");
        bootDisplayTimeout = setTimeout(() => {
          bootScreen.style.display = "none";
          document.body.classList.remove("locked");
        }, 1000);
      }, 3200);
    }

    return () => {
      cancelAnimationFrame(cursorRAF);
      cancelAnimationFrame(bgRAF);
      document.removeEventListener("mousemove", onMouseMove);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", onHoverEnter);
        el.removeEventListener("mouseleave", onHoverLeave);
      });
      if (themeBtn) themeBtn.removeEventListener("click", onThemeClick);
      if (hamburgerBtn) hamburgerBtn.removeEventListener("click", onHamburgerClick);
      if (mmOverlay) mmOverlay.removeEventListener("click", onOverlayClick);
      if (onResize) window.removeEventListener("resize", onResize);
      if (heroEl) window.removeEventListener("scroll", onScroll);
      document.removeEventListener("DOMContentLoaded", onDOMContentReady);
      if (bootHideTimeout) clearTimeout(bootHideTimeout);
      if (bootDisplayTimeout) clearTimeout(bootDisplayTimeout);
    };
  }, []);

  return null;
}
