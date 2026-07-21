import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadToBlob } from "../services/blobUpload";
import { saveTenantLogoUrl } from "../services/integration";

/**
 * First-login prompt asking the tenant owner to add a company logo.
 *
 * Flow (per the product spec):
 *  - Shown only when the tenant has no logo yet.
 *  - Two choices: "Add later" (dismiss) or "Upload".
 *  - Upload sends the PNG to Vercel Blob, persists only the public URL on the
 *    tenant, refreshes the user so the logo shows everywhere immediately.
 *  - "Add later" just closes; the parent re-shows this on the next login until a
 *    logo exists, after which it never appears again.
 *
 * Props:
 *  - tenantId    : tenant UUID (user.tenant_details.id)
 *  - companyName : display name for copy
 *  - onLater()   : user chose "Add later"
 *  - onUploaded(url) : logo saved successfully
 */
const ACCEPTED = "image/png,image/jpeg,image/svg+xml,image/webp";
const MAX_BYTES = 5 * 1024 * 1024; // 5MB hard cap before we even try

export default function TenantLogoPrompt({
  tenantId,
  companyName = "your company",
  onLater,
  onUploaded,
}) {
  const { refreshUser } = useAuth();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pickFile = (f) => {
    setError("");
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (PNG recommended).");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("Image is too large. Please use a file under 5MB.");
      return;
    }
    setFile(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadToBlob(file, "tenant-logos");
      if (!url) {
        setError(
          "Upload isn't configured on this environment. Please try again later.",
        );
        setUploading(false);
        return;
      }
      const res = await saveTenantLogoUrl(tenantId, url);
      if (res?.status !== "success") {
        setError(res?.message || "Could not save the logo. Please try again.");
        setUploading(false);
        return;
      }
      await refreshUser();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      onUploaded?.(url);
    } catch (err) {
      console.error("Logo upload failed", err);
      setError("Something went wrong while uploading. Please try again.");
      setUploading(false);
    }
  };

  const handleLater = () => {
    if (uploading) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onLater?.();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logo-prompt-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {/* image icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <h2 id="logo-prompt-title" className="text-lg font-bold text-gray-900">
            Add {companyName}'s logo
          </h2>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-gray-500">
          Upload your company logo so it shows across your dashboard instead of
          the initials. A square PNG with a transparent background looks best.
        </p>

        {/* Dropzone / picker */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center transition-colors hover:border-primary hover:bg-primary/5"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected logo preview"
              className="h-16 w-16 rounded-xl border border-gray-200 object-contain"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </span>
          )}
          <span className="text-sm font-medium text-gray-700">
            {file ? file.name : "Click to choose a logo"}
          </span>
          <span className="text-xs text-gray-400">PNG, JPG, SVG or WEBP · up to 5MB</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0] || null)}
        />

        {error && (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleLater}
            disabled={uploading}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            Add later
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
            )}
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
