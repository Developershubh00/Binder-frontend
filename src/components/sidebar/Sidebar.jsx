import { Link } from "react-router-dom";
import { Home, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import {
  FingerprintScanIcon,
  ReceiptIcon,
  ShoppingBagIcon,
  Stack3Icon,
  StorefrontIcon,
} from "../icons/SidebarIcons";

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
    <aside
      ref={sidebarRef}
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      className={`relative z-[100] flex h-full shrink-0 flex-col border-r border-[#e2e3e8] bg-card transition-[width] duration-200 ease-in-out ${
        collapsed ? "w-18" : "w-62"
      }`}
    >
      {/* Edge collapse / expand toggle */}
      <button
        type="button"
        onClick={() => setIsSidebarCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand" : "Collapse"}
        className="absolute -right-3 top-7 z-[110] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#e2e3e8] bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
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
        {!collapsed && (
          <span className="min-w-0 truncate text-[18px] font-bold text-foreground">
            {companyDisplayName.split(" ")[0]}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
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
              } ${active ? "bg-primary" : "hover:bg-[#f3f4f6]"}`}
            >
              <span
                className={`inline-flex shrink-0 items-center justify-center ${
                  active ? "text-primary-foreground" : "text-[#6b7280]"
                }`}
                aria-hidden="true"
              >
                <item.icon size={18} />
              </span>
              {!collapsed && (
                <span
                  className={`text-sm ${
                    active
                      ? "font-semibold text-primary-foreground"
                      : "font-medium text-[#374151]"
                  }`}
                >
                  {item.label}
                </span>
              )}
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
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-[#e2e3e8] hover:bg-[#f3f4f6] ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {displayName?.charAt(0)?.toUpperCase() || "U"}
          </span>
          {!collapsed && (
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
              {displayName}
            </span>
          )}
        </button>

        {showProfileMenu && (
          <div
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
              className="w-full cursor-pointer rounded-md border border-[#e2e3e8] px-3 py-2 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
