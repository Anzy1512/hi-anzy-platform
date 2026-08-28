import React, { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { track } from "@/lib/api";

/**
 * Night mode switch.
 *
 * Three states, not two, which is the part most implementations get wrong:
 * "light", "dark", and *unset*. An unset preference follows the operating
 * system and keeps following it — a visitor whose laptop flips to dark at
 * sunset should see this page follow, and only stop following once they have
 * actually expressed a preference here.
 *
 * The stored value is therefore only written on an explicit click. Nothing is
 * persisted just because the OS happened to be dark on the first visit.
 */
const KEY = "hianzy-theme";

/** Reads the stored choice. Wrapped because Safari private mode throws. */
export const storedTheme = () => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch (e) {
    return null;
  }
};

const systemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const resolveTheme = () => storedTheme() || (systemPrefersDark() ? "dark" : "light");

/** Single writer for the attribute, so nothing else has to know the shape. */
export const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") root.setAttribute("data-theme", "dark");
  else root.setAttribute("data-theme", "light");
};

export const ThemeToggle = ({ className = "" }) => {
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "light"
      : "light"
  );

  // Follow the OS for as long as the reader has not chosen for themselves.
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (storedTheme()) return; // an explicit choice outranks the OS
      const next = mq.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    // addEventListener is not on MediaQueryList in older Safari
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else if (mq.removeListener) mq.removeListener(onChange);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {
      /* private mode — the choice just does not survive the session */
    }
    track("theme_changed", { to: next });
  }, [theme]);

  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${className}`}
      // The control's own name states what it does, not what it currently is.
      aria-label={dark ? "Switch to day mode" : "Switch to night mode"}
      aria-pressed={dark}
      title={dark ? "Day mode" : "Night mode"}
      data-testid="theme-toggle"
    >
      {dark ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
    </button>
  );
};

export default ThemeToggle;
