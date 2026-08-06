import PermissionRequestCard from "./PermissionRequestCard";

// Shown in place of a whole screen the user isn't permitted to access. Pass the
// real screen as children and it renders behind a dimmed, frosted-blur overlay
// with the "request access" card on top. The API still enforces server-side;
// this is only what the user is shown.
export default function PermissionBlocked({
  title = "Access restricted",
  message = "You don't have permission to access this screen. Please contact your admin to request access.",
  permission = "",
  onRequestAccess,
  children,
}) {
  return (
    <div className="relative min-h-full w-full bg-[#f3f4f6]">
      {children ? (
        <div className="pointer-events-none select-none" aria-hidden="true">
          {children}
        </div>
      ) : null}

      <div className="absolute inset-0 z-40 overflow-y-auto bg-gray-500/25 backdrop-blur-md">
        <div className="flex min-h-full items-center justify-center p-6">
          <PermissionRequestCard
            title={title}
            message={message}
            permission={permission}
            onRequestAccess={onRequestAccess}
          />
        </div>
      </div>
    </div>
  );
}
