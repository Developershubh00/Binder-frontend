import { useContext } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import PermissionRequestCard from "./PermissionRequestCard";
import { SidebarContext } from "../context/SidebarContext";

// Sidebar widths (mirror src/components/sidebar/Sidebar.jsx) — used to offset the
// backdrop so it only covers the content area, never the sidebar. The backdrop
// butts exactly against the sidebar's right edge; the collapse toggle is tucked
// just inside that edge (see Sidebar.jsx) so it's never overlapped/dimmed.
const SIDEBAR_WIDTH = 248;
const SIDEBAR_COLLAPSED_WIDTH = 72;

// A dismissable modal version of the "access restricted → request access" card.
// Use it for blocked ACTIONS (e.g. an IPO-type select) that shouldn't take over
// the whole screen. Backdrop click or the ✕ closes it. The backdrop spans only
// the DashboardContent area (offset past the sidebar), so the sidebar stays
// interactive and un-dimmed.
export default function PermissionRequestModal({
  open,
  onClose,
  title,
  message,
  permission,
  onRequestAccess,
}) {
  const { isSidebarCollapsed } = useContext(SidebarContext) || {};
  if (!open) return null;
  const left = isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  return createPortal(
    <div
      className="fixed inset-y-0 right-0 z-[10000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      style={{ left, fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          title="Close"
          className="absolute -right-2 -top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#e2e3e8] bg-white text-muted-foreground shadow-md transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <PermissionRequestCard
          title={title}
          message={message}
          permission={permission}
          onRequestAccess={onRequestAccess}
        />
      </div>
    </div>,
    document.body,
  );
}
