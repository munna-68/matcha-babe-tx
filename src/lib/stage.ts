"use client";

/**
 * The "stage" gate. Entrance animations (hero, page headers) wait for the
 * stage to open. It is closed while the preloader plays and while a route
 * transition covers the screen, and opens the moment those START exiting —
 * so the next scene animates in underneath the exit, never after it.
 */
type Fn = () => void;

let open = true;
let initialized = false;
const queue = new Set<Fn>();

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const c = document.documentElement.classList;
  const onSite = !window.location.pathname.startsWith("/dashboard");
  // Preloader will play: keep the stage shut until it hands off.
  if (c.contains("js") && !c.contains("mb-seen") && onSite) open = false;
}

export function onStage(cb: Fn): () => void {
  init();
  if (open) {
    cb();
    return () => {};
  }
  queue.add(cb);
  return () => {
    queue.delete(cb);
  };
}

export function closeStage() {
  init();
  open = false;
}

export function openStage() {
  init();
  open = true;
  const q = [...queue];
  queue.clear();
  q.forEach((f) => f());
}

export function isStageOpen() {
  init();
  return open;
}
