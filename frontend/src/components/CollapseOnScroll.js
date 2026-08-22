import { useEffect } from "react";
import { subscribeScroll, resyncScroll } from "@/lib/motion";

/**
 * Anything expanded closes itself once the reader scrolls away from it.
 *
 * An open <details> pushes everything below it down. Open three or four while
 * reading and the page becomes a different length than the one you were
 * navigating, so scroll position stops meaning what it meant — you lose your
 * place. Closing on scroll keeps the page the length the reader last saw it.
 *
 * Two details matter:
 *
 * - The threshold. Opening a <details> can itself move the page slightly, and
 *   a smooth-scroll library settles over a few frames, so closing on the first
 *   pixel of movement would snap panels shut the instant they opened. We record
 *   the position at open time and only close once the reader has genuinely
 *   travelled past it.
 *
 * - React-controlled expanders (the case studies on /work) cannot be closed by
 *   touching the DOM, so this also emits a `hianzy:collapse` event they listen
 *   for. One rule, one place, rather than each component inventing its own.
 */
const COLLAPSE_EVENT = "hianzy:collapse";
const THRESHOLD_PX = 260;

/**
 * Opening or closing a panel changes the page height, which silently
 * invalidates every ScrollTrigger start/end already measured against the old
 * height. Left alone, pinned sections and scrubbed reveals fire at the wrong
 * place for the rest of the session. Coalesce the churn into one resync.
 */
let resyncTimer = 0;
const scheduleResync = () => {
  window.clearTimeout(resyncTimer);
  resyncTimer = window.setTimeout(() => {
    resyncTimer = 0;
    resyncScroll();
  }, 260);
};

export const CollapseOnScroll = ({ threshold = THRESHOLD_PX }) => {
  useEffect(() => {
    // Where the page was when the most recent thing was opened. Null means
    // nothing is open, so there is nothing to watch for.
    let openedAt = null;

    const onToggle = (e) => {
      const el = e.target;
      if (!(el instanceof HTMLElement) || el.tagName !== "DETAILS") return;
      if (el.open) openedAt = window.scrollY;
      else if (!document.querySelector("details[open]")) openedAt = null;
      scheduleResync();
    };
    // `toggle` does not bubble, so it has to be captured.
    document.addEventListener("toggle", onToggle, true);

    const onExpand = () => {
      openedAt = window.scrollY;
    };
    document.addEventListener("hianzy:expanded", onExpand);

    const off = subscribeScroll((y) => {
      if (openedAt === null) return;
      if (Math.abs(y - openedAt) < threshold) return;
      openedAt = null;
      document.querySelectorAll("details[open]").forEach((d) => {
        d.open = false;
      });
      document.dispatchEvent(new CustomEvent(COLLAPSE_EVENT));
      scheduleResync();
    });

    // Images without intrinsic dimensions land after the first measure and
    // push everything below them down, which has the same effect.
    const onMediaLoad = (e) => {
      const t = e.target;
      if (t instanceof HTMLImageElement || t instanceof HTMLVideoElement) scheduleResync();
    };
    document.addEventListener("load", onMediaLoad, true);

    return () => {
      document.removeEventListener("toggle", onToggle, true);
      document.removeEventListener("hianzy:expanded", onExpand);
      document.removeEventListener("load", onMediaLoad, true);
      window.clearTimeout(resyncTimer);
      off && off();
    };
  }, [threshold]);

  return null;
};

/** Components with their own expanded state announce it so the rule applies. */
export const announceExpanded = () => {
  document.dispatchEvent(new CustomEvent("hianzy:expanded"));
};

/** …and subscribe to the collapse the same rule triggers. */
export const onCollapse = (handler) => {
  document.addEventListener(COLLAPSE_EVENT, handler);
  return () => document.removeEventListener(COLLAPSE_EVENT, handler);
};
