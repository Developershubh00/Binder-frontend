// Pure payload / image helpers extracted from GenerateFactoryCode.jsx (Change 23,
// part 1 of splitting the 6k-line orchestrator). No React / component state here —
// image compression + packaging-stiffener normalisation + payload shaping only.

// ─── IMAGE COMPRESSION UTILITY ───────────────────────────────────────────────
// Compresses image to maxKB. Quality never drops below (1 - maxQualityDrop).
// e.g. maxKB=100, maxQualityDrop=0.2 → min quality = 80%, target size = 100KB
const compressImage = (file, maxKB = 100, maxQualityDrop = 0.2) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        // Scale down if larger than 1200px on any side
        const MAX_DIM = 1200;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        const minQuality = 1 - maxQualityDrop; // e.g. 0.8
        let quality = 0.95;

        const tryCompress = () => {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const sizeKB = (dataUrl.length * 3) / 4 / 1024;

          if (sizeKB <= maxKB || quality <= minQuality) {
            // Convert dataUrl → File
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            const newName = file.name.replace(/\.[^.]+$/, '.jpg');
            resolve(new File([u8arr], newName, { type: mime }));
          } else {
            quality = Math.max(minQuality, +(quality - 0.05).toFixed(2));
            tryCompress();
          }
        };
        tryCompress();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
// ─────────────────────────────────────────────────────────────────────────────

const STIFFENER_PLY_FIELD = 'cartonBoxStiffenerNoOfPlys';
const STIFFENER_PLY_API_FIELD = 'carton_box_stiffener_no_of_plys';

const normalizePackagingMaterialStiffenerPlys = (material) => {
  if (!material || typeof material !== 'object' || Array.isArray(material)) return material;
  const normalized = { ...material };
  const value = normalized[STIFFENER_PLY_FIELD] ?? normalized[STIFFENER_PLY_API_FIELD];
  if (value === undefined || value === null) return normalized;

  normalized[STIFFENER_PLY_FIELD] = value;
  if (String(value).trim() !== '') {
    normalized[STIFFENER_PLY_API_FIELD] = value;
  } else if (Object.prototype.hasOwnProperty.call(normalized, STIFFENER_PLY_API_FIELD)) {
    delete normalized[STIFFENER_PLY_API_FIELD];
  }

  return normalized;
};

const normalizePackagingBlockStiffenerPlys = (packaging) => {
  if (!packaging || typeof packaging !== 'object' || Array.isArray(packaging)) return packaging;

  const normalizeMaterials = (materials) =>
    Array.isArray(materials)
      ? materials.map((material) => normalizePackagingMaterialStiffenerPlys(material))
      : materials;

  return {
    ...packaging,
    materials: normalizeMaterials(packaging.materials),
    extraPacks: Array.isArray(packaging.extraPacks)
      ? packaging.extraPacks.map((pack) =>
          pack && typeof pack === 'object' && !Array.isArray(pack)
            ? { ...pack, materials: normalizeMaterials(pack.materials) }
            : pack
        )
      : packaging.extraPacks,
  };
};

/** Map frontend packaging (camelCase) to backend Packaging API fields (snake_case). */
const packagingToBackendShape = (packaging) => {
  if (!packaging || typeof packaging !== 'object' || Array.isArray(packaging)) return packaging;
  const ps = packaging.productSelection ?? packaging.product_selection;
  const product_selection = Array.isArray(ps) ? ps.join(',') : (ps != null ? String(ps) : '');
  const packQty = packaging.packQty ?? packaging.pack_qty;
  return {
    product_selection,
    packaging_type: packaging.type ?? packaging.packaging_type ?? 'STANDARD',
    casepack_qty: packaging.casepackQty ?? packaging.casepack_qty ?? null,
    assorted_sku_link: packaging.assortedSkuLink ?? packaging.assorted_sku_link ?? '',
    // Per-IPC allocation for the main pack (Step 5 quantity ledger) → JSONField on the model.
    pack_qty: packQty && typeof packQty === 'object' ? packQty : {},
    materials: packaging.materials ?? [],
  };
};

/**
 * Merge blob URLs from the uploaded payload back into the in-memory
 * artwork-materials array by index. Any key whose in-memory value is a
 * `File` (or is missing) is replaced with the string URL returned by
 * `replaceFilesWithBlobUrls`. Non-file fields and already-string URLs are
 * left alone.
 *
 * This keeps the on-screen "UPLOADED" badge and the per-IPO draft consistent
 * with what the backend actually stores after a successful wizard commit.
 */
const mergeArtworkWithUrls = (memMaterials, uploadedMaterials) => {
  if (!Array.isArray(memMaterials)) return memMaterials;
  if (!Array.isArray(uploadedMaterials) || uploadedMaterials.length === 0) {
    return memMaterials;
  }
  return memMaterials.map((mem, idx) => {
    const uploaded = uploadedMaterials[idx];
    if (!mem || typeof mem !== 'object') return mem;
    if (!uploaded || typeof uploaded !== 'object') return mem;
    const merged = { ...mem };
    for (const [key, uploadedValue] of Object.entries(uploaded)) {
      const current = merged[key];
      // Only overwrite when the uploaded value is a string (URL) and the
      // current value is either missing or a File. Never clobber a
      // user-edited string with a stale upload.
      const isUploadedUrl = typeof uploadedValue === 'string' && uploadedValue;
      if (!isUploadedUrl) continue;
      const currentIsFile = typeof File !== 'undefined' && current instanceof File;
      const currentIsMissing = current == null || current === '';
      if (currentIsFile || currentIsMissing) {
        merged[key] = uploadedValue;
      }
    }
    return merged;
  });
};

const normalizeFactoryCodePayloadStiffenerPlys = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return payload;

  const normalizeStepData = (stepData) => {
    if (!stepData || typeof stepData !== 'object' || Array.isArray(stepData)) return stepData;
    return {
      ...stepData,
      packaging: normalizePackagingBlockStiffenerPlys(stepData.packaging),
    };
  };

  return {
    ...payload,
    packaging: normalizePackagingBlockStiffenerPlys(payload.packaging),
    skus: Array.isArray(payload.skus)
      ? payload.skus.map((sku) =>
          sku && typeof sku === 'object' && !Array.isArray(sku)
            ? {
                ...sku,
                stepData: normalizeStepData(sku.stepData),
                subproducts: Array.isArray(sku.subproducts)
                  ? sku.subproducts.map((sub) =>
                      sub && typeof sub === 'object' && !Array.isArray(sub)
                        ? { ...sub, stepData: normalizeStepData(sub.stepData) }
                        : sub
                    )
                  : sku.subproducts,
              }
            : sku
        )
      : payload.skus,
  };
};

export {
  compressImage,
  normalizePackagingMaterialStiffenerPlys,
  normalizePackagingBlockStiffenerPlys,
  packagingToBackendShape,
  mergeArtworkWithUrls,
  normalizeFactoryCodePayloadStiffenerPlys,
};
