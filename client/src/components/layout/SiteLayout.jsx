import { Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

// Scroll handling for a single-page app: a new page starts at the top (and moves
// keyboard / screen-reader focus to it); a link like /#menu scrolls to that section.
function useScrollOnNavigate(mainRef) {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (hash) {
      // Wait a frame so the section exists after a page change.
      const frame = requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
    // Only on a real page change (not the first load), so the skip link stays first.
    if (previousPath.current !== pathname) {
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [pathname, hash, mainRef]);

  useEffect(() => {
    previousPath.current = pathname;
  }, [pathname]);
}

export default function SiteLayout() {
  const mainRef = useRef(null);
  useScrollOnNavigate(mainRef);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Suspense
          fallback={
            <p role="status" className="px-4 py-24 text-center text-muted">
              Loading
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
