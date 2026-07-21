import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ChevronLeft, ShieldCheck } from "lucide-react";
import {
  FingerprintScanIcon,
  ReceiptIcon,
  ShoppingBagIcon,
  Stack3Icon,
  StorefrontIcon,
} from "../icons/SidebarIcons";

// Aliased so ESLint credits `motion` as used (JSX member-expression usage isn't
// detected by jsx-uses-vars in this repo's config — same pattern as Reveal.jsx).
const MotionAside = motion.aside;
const MotionSpan = motion.span;
const MotionDiv = motion.div;

const IMS_ACTIVE_PAGES = [
  "courier-slip",
  "courier-master",
  "inward-store-sheet",
  "inward-store-sheet-db",
  "outward-store-sheet",
  "outward-store-sheet-db",
  "stock-sheet",
  "stock-sheet-db",
];

// UQR lives under its own "Quality" menu (moved out of Inventory Management).
const QUALITY_ACTIVE_PAGES = ["uqr-forms", "uqr-database"];

const getMenuItems = () => [
  { id: "home", label: "Home", icon: Home },
  { id: "tasks", label: "Tasks", icon: ReceiptIcon },
  { id: "code-creation", label: "Code Creation", icon: FingerprintScanIcon },
  { id: "ipo-management", label: "IPO Management", icon: Stack3Icon },
  { id: "purchase", label: "Purchase", icon: ShoppingBagIcon },
  { id: "ims", label: "Inventory Management", icon: StorefrontIcon },
  { id: "quality", label: "Quality", icon: ShieldCheck },
];

const SIDEBAR_WIDTH = 248;
const SIDEBAR_COLLAPSED_WIDTH = 72;

// Shared reveal animation for text that hides when the sidebar collapses.
const labelMotion = {
  initial: { opacity: 0, width: 0 },
  animate: { opacity: 1, width: "auto" },
  exit: { opacity: 0, width: 0 },
  transition: { duration: 0.18, ease: "easeOut" },
  className: "overflow-hidden whitespace-nowrap",
};

const Sidebar = ({
  sidebarRef,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  companyLogo,
  companyDisplayName,
  companyInitials,
  activePage,
  setActivePage,
  setHoveredMenu,
  setCodeCreationView,
  setSelectedIpoForCNS,
  setSelectedIpoForSpec,
  setSelectedIpoForDerivedCNS,
  profileMenuRef,
  showProfileMenu,
  setShowProfileMenu,
  displayName,
  showEmailLine,
  user,
  handleLogout,
  loggingOut = false,
}) => {
  const collapsed = isSidebarCollapsed;

  const isActive = (id) =>
    activePage === id ||
    (id === "ims" && IMS_ACTIVE_PAGES.includes(activePage)) ||
    (id === "quality" && QUALITY_ACTIVE_PAGES.includes(activePage));

  const handleNavClick = (id) => {
    if (id === "home" || id === "tasks" || id === "purchase") {
      setActivePage(id);
      setHoveredMenu(null);
      return;
    }
    if (id === "code-creation") setCodeCreationView(null);
    if (id === "ipo-management") {
      setSelectedIpoForCNS(null);
      setSelectedIpoForSpec(null);
      setSelectedIpoForDerivedCNS(null);
    }
    setActivePage(id);
    setHoveredMenu(id);
  };

  return (
    <MotionAside
      ref={sidebarRef}
      initial={false}
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      transition={{ type: "spring", stiffness: 400, damping: 38 }}
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      className="relative z-[100] flex h-full shrink-0 flex-col border-r border-[#e2e3e8] bg-[#f8f9fb] shadow-[2px_0_12px_rgba(17,24,39,0.06)]"
    >
      {/* Edge collapse / expand toggle */}
      <button
        type="button"
        onClick={() => setIsSidebarCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand" : "Collapse"}
        className="absolute -right-3 top-7 z-[110] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#e2e3e8] bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
      >
        <MotionSpan
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="inline-flex"
        >
          <ChevronLeft size={14} />
        </MotionSpan>
      </button>

      {/* Header / logo */}
      <div
        className={`flex min-h-[68px] items-center border-b border-[#e2e3e8] ${
          collapsed ? "justify-center px-3" : "gap-2.5 px-4"
        }`}
      >
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={companyDisplayName}
            className="h-[38px] w-[38px] shrink-0 rounded-[10px] border border-[#e2e3e8] object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling && (e.target.nextSibling.style.display = "");
            }}
          />
        ) : null}
        <div
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-primary text-[18px] font-extrabold text-primary-foreground"
          style={companyLogo ? { display: "none" } : undefined}
        >
          {companyInitials}
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <MotionSpan
              {...labelMotion}
              className="min-w-0 overflow-hidden truncate whitespace-nowrap text-[18px] font-bold text-foreground"
            >
              {companyDisplayName.split(" ")[0]}
            </MotionSpan>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3">
        {getMenuItems().map((item) => {
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              title={collapsed ? item.label : undefined}
              onClick={() => handleNavClick(item.id)}
              className={`mb-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                collapsed ? "justify-center" : ""
              } ${active ? "bg-primary" : "hover:bg-[#eceef1]"}`}
            >
              <span
                className={`inline-flex shrink-0 items-center justify-center ${
                  active ? "text-primary-foreground" : "text-[#6b7280]"
                }`}
                aria-hidden="true"
              >
                <item.icon size={18} />
              </span>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <MotionSpan
                    {...labelMotion}
                    className={`overflow-hidden whitespace-nowrap text-sm ${
                      active
                        ? "font-semibold text-primary-foreground"
                        : "font-medium text-[#374151]"
                    }`}
                  >
                    {item.label}
                  </MotionSpan>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Footer / profile */}
      <div
        className="relative border-t border-[#e2e3e8] p-2.5"
        ref={profileMenuRef}
      >
        <button
          type="button"
          onClick={() => setShowProfileMenu((prev) => !prev)}
          aria-label="Open profile menu"
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-[#e2e3e8] hover:bg-[#eceef1] ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {displayName?.charAt(0)?.toUpperCase() || "U"}
          </span>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <MotionSpan
                {...labelMotion}
                className="min-w-0 flex-1 overflow-hidden truncate whitespace-nowrap text-sm font-semibold text-foreground"
              >
                {displayName}
              </MotionSpan>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {showProfileMenu && (
            <MotionDiv
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              style={{ transformOrigin: "bottom" }}
              className={`absolute z-[200] rounded-[10px] border border-[#e2e3e8] bg-card p-2.5 shadow-[0_8px_24px_rgba(17,24,39,0.1)] ${
                collapsed
                  ? "bottom-2 left-[calc(100%+8px)] w-56"
                  : "inset-x-2.5 bottom-[calc(100%+8px)]"
              }`}
            >
              {showEmailLine && (
                <div className="break-all px-1.5 pb-2 pt-1 text-xs leading-relaxed text-muted-foreground">
                  {user.email}
                </div>
              )}
              {showEmailLine && <div className="my-2 h-px bg-[#e2e3e8]" />}
              <Link
                to="/company-profile"
                className="block rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[#f3f4f6]"
                onClick={() => setShowProfileMenu(false)}
              >
                Profile
              </Link>
              <Link
                to="/profile"
                className="mt-1 block rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[#f3f4f6]"
                onClick={() => setShowProfileMenu(false)}
              >
                Master Panel
              </Link>
              <div className="my-2 h-px bg-[#e2e3e8]" />
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-[#e2e3e8] px-3 py-2 text-center text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"
                    />
                  </svg>
                )}
                {loggingOut ? "Signing out…" : "Logout"}
              </button>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </MotionAside>
  );
};

export default Sidebar;
