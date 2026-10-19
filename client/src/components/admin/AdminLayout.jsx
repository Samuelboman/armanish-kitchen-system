import { Suspense } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { ExternalLink, LogOut } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { cx } from "../../lib/cx";

const tabs = [
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/areas", label: "Delivery areas" },
  { to: "/admin/orders", label: "Orders" },
];

// Back-office frame: dark bar with the logo, tabs, a link to the site and Log out.
export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-dvh bg-page">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header className="on-dark sticky top-0 z-30 bg-ink text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="" className="h-10 w-auto" />
            <div>
              <p className="font-display font-bold leading-tight">Admin</p>
              {user?.name && <p className="hidden text-xs text-white/75 sm:block">{user.name}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-semibold hover:bg-white/10"
            >
              <ExternalLink className="size-4" aria-hidden="true" /> View site
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-semibold hover:bg-white/10"
            >
              <LogOut className="size-4" aria-hidden="true" /> Log out
            </button>
          </div>
        </div>
        <nav aria-label="Admin sections" className="mx-auto max-w-5xl px-2 sm:px-4">
          <ul className="scrollbar-none flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <li key={tab.to} className="shrink-0">
                <NavLink
                  to={tab.to}
                  className={({ isActive }) =>
                    cx(
                      "inline-flex min-h-12 items-center border-b-[3px] px-3 font-display text-sm font-semibold",
                      isActive ? "border-yellow text-white" : "border-transparent text-white/75 hover:text-white"
                    )
                  }
                >
                  {tab.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="admin-main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-6 outline-none sm:px-6 sm:py-8">
        <Suspense
          fallback={
            <p role="status" className="py-10 text-center text-muted">
              Loading
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
