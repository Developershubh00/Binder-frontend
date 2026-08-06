import { createPortal } from "react-dom";
import { X } from "lucide-react";
import PermissionRequestCard from "./PermissionRequestCard";

// A dismissable modal version of the "access restricted → request access" card.
// Use it for blocked ACTIONS (e.g. an Edit/Delete button) that shouldn't take
// over the whole screen. Backdrop click or the ✕ closes it.
export default function PermissionRequestModal({
  open,
  onClose,
  title,
  message,
  permission,
  onRequestAccess,
}) {
  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
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
