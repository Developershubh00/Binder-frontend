import { useMemo, useState } from "react";
import { Lock, Send, CheckCircle2 } from "lucide-react";
import { getUser } from "../api/authService";

// The "access restricted → request access" card, shared by the full-screen
// PermissionBlocked overlay and the PermissionRequestModal. It knows WHO is
// asking (current user id + name) and WHAT (`permission`), so wiring the request
// to a backend later is just filling in `onRequestAccess`.
export default function PermissionRequestCard({
  title = "Access restricted",
  message = "You don't have permission for this. Please contact your admin to request access.",
  permission = "", // e.g. "code.buyer.all.update" — the grant we checked for
  onRequestAccess, // optional: (payload) => Promise — wire the real endpoint here
}) {
  const user = useMemo(() => getUser() || {}, []);
  const userName =
    user.full_name ||
    user.name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
    user.email ||
    "";

  const [open, setOpen] = useState(false); // request form expanded?
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (sending) return;
    const payload = {
      userId: user.id || null,
      userName,
      permission,
      message: note.trim(),
    };
    setSending(true);
    try {
      if (typeof onRequestAccess === "function") {
        await onRequestAccess(payload);
      } else {
        // No endpoint yet — log the exact payload we'll POST later.
        console.log("Permission access request:", payload);
      }
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#e2e3e8] bg-white p-8 text-center shadow-2xl">
      {sent ? (
        <>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Request sent</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your admin has been notified. You&apos;ll get access once they
            approve your request.
          </p>
        </>
      ) : (
        <>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>

          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              Request access from admin
            </button>
          ) : (
            <div className="mt-5 space-y-3 text-left">
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Message (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for your admin…"
                  className="min-h-20 w-full resize-y rounded-md border border-[#e2e3e8] bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={sending}
                  className="cursor-pointer rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-3.5 w-3.5" />
                  {sending ? "Sending…" : "Send request"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
