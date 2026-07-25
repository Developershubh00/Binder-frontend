// VPO code composition (client mirror of the backend `vpo_code` package).
//
// Format:  VPO-{ipoBase}/{vendorCode}/{categoryCode}/VPO-{seq}
// Example: VPO-CHD/PD/646A/111/HH/VPO-1
//
//   ipoBase       first three segments of the IPO code (CHD/PD/646A)
//   vendorCode    the vendor the VPO is issued to (111)
//   categoryCode  2-letter master-sheet product code (CUSHION -> HH)
//   seq           per-tenant running VPO number
//
// The backend is the source of truth for the persisted `vpo_number`; this is
// used to show a live projected code in the Generate-VPO modal before issuing.

import { categoryToCode } from "./categoryCodes";

export const VPO_PREFIX = "VPO";
export const DEFAULT_IPO_BASE = "CHD";
export const DEFAULT_VENDOR_CODE = "000";
// Shown for the running sequence before the backend assigns the real number.
export const SEQ_PLACEHOLDER = "N";

// First three '/'-separated segments of an IPO code.
//   "CHD/PD/646A/PRACHI-CUSHION/6" -> "CHD/PD/646A"
export const ipoBase = (ipoCode) => {
  const parts = String(ipoCode || "")
    .trim()
    .split("/")
    .filter((p) => p !== "");
  return (parts.length >= 3 ? parts.slice(0, 3) : parts).join("/");
};

// Compose the full VPO code from its parts. `sequence` defaults to the "N"
// placeholder so the modal can preview the shape before the code is assigned.
export const buildVpoCode = ({
  ipoCode,
  vendorCode,
  productCategory,
  categoryCode,
  sequence = SEQ_PLACEHOLDER,
} = {}) => {
  const base = ipoBase(ipoCode) || DEFAULT_IPO_BASE;
  const vendor = (vendorCode && String(vendorCode).trim()) || DEFAULT_VENDOR_CODE;
  const cat = categoryCode || categoryToCode(productCategory);
  return `${VPO_PREFIX}-${base}/${vendor}/${cat}/${VPO_PREFIX}-${sequence}`;
};