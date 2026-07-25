// VPO code — self-contained module that mirrors the backend `vpo_code` package
// so the Generate-VPO flow can show a live projected code before issuing.
// Format: VPO-{ipoBase}/{vendorCode}/{categoryCode}/VPO-{seq}.
export {
  CATEGORY_CODE_MAP,
  UNKNOWN_CATEGORY_CODE,
  categoryToCode,
  normalizeCategory,
} from "./categoryCodes";
export {
  buildVpoCode,
  ipoBase,
  VPO_PREFIX,
  SEQ_PLACEHOLDER,
  DEFAULT_IPO_BASE,
  DEFAULT_VENDOR_CODE,
} from "./buildVpoCode";