declare global {
  interface Window {
    gsap?: typeof import("gsap")["gsap"] & {
      registerPlugin: (...plugins: unknown[]) => void;
      utils: { toArray: (selector: unknown) => HTMLElement[] };
      to: (target: unknown, vars: Record<string, unknown>) => unknown;
      fromTo: (target: unknown, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => unknown;
    };
    ScrollTrigger?: unknown;
    si?: (...args: unknown[]) => void;
    siq?: unknown[];
  }
}

export {};
