import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/data/content";
import { MagneticButton } from "@/components/MagneticButton";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { track } from "@/lib/api";

export const Nav = () => {
  const location = useLocation();
  const listRef = useRef(null);
  const [bar, setBar] = useState({ left: 0, width: 0, visible: false });
  const [open, setOpen] = useState(false);

  const positionBar = () => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector("[data-active='true']");
    if (!active) {
      setBar((b) => ({ ...b, visible: false }));
      return;
    }
    const lr = list.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    setBar({ left: ar.left - lr.left, width: ar.width, visible: true });
  };

  useEffect(() => {
    positionBar();
    const t = setTimeout(positionBar, 350);
    window.addEventListener("resize", positionBar);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", positionBar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#232A2A]/12 bg-[#E0D8C1]/88 backdrop-blur-md" data-testid="site-nav">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" data-testid="nav-logo" aria-label="Hi Anzy — home">
          <img src="/brand/logo-dark.png" alt="hiAnzy" className="nav-logo-img h-[34px] w-auto sm:h-[40px]" />
        </Link>

        {/* Desktop */}
        <nav aria-label="Primary" className="hidden lg:block">
          <div ref={listRef} className="relative flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={`nav-item-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) => `relative py-2 text-[13.5px] font-semibold transition-colors ${isActive ? "text-[#232A2A]" : "text-[#232A2A]/64 hover:text-[#232A2A]"}`}
              >
                {({ isActive }) => <span data-active={isActive}>{l.label}</span>}
              </NavLink>
            ))}
            <span className="nav-route-bar" style={{ left: bar.left, width: bar.width, opacity: bar.visible ? 1 : 0 }} aria-hidden="true" />
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <MagneticButton to="/contact" className="btn-ink hidden sm:inline-flex" hoverText="Good start." testId="nav-say-hi-cta" onClick={() => track("cta_primary_click", { cta: "say_hi_nav" })}>
            Say Hi
          </MagneticButton>

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#232A2A]/25 lg:hidden" aria-label="Open menu" data-testid="nav-mobile-toggle">
                <Menu size={18} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-[#232A2A]/15 bg-[#E0D8C1] p-0">
              <nav aria-label="Mobile" className="flex h-full flex-col justify-between p-6 pt-14">
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((l) => (
                    <SheetClose asChild key={l.to}>
                      <NavLink
                        to={l.to}
                        end={l.to === "/"}
                        data-testid={`nav-mobile-item-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                        className={({ isActive }) => `font-display rounded-lg px-3 py-2.5 text-3xl uppercase ${isActive ? "bg-[#232A2A] text-[#F7F5EE]" : "text-[#232A2A]"}`}
                      >
                        {l.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </div>
                <div className="space-y-3">
                  <SheetClose asChild>
                    <Link to="/contact" className="btn-orange w-full justify-center" data-testid="nav-mobile-say-hi" onClick={() => track("cta_primary_click", { cta: "say_hi_mobile" })}>
                      Say Hi
                    </Link>
                  </SheetClose>
                  <p className="sys-chip text-center text-[#232A2A]/50">From ABC to ROI</p>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
