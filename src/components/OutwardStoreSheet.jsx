import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  createOutwardStoreSheet,
  getCompanyEssentials,
  getAllIPOs,
  getOutwardStoreSheetChoices,
  getVpoHistory,
  getInwardStoreSheets,
  getVpoMaterialsMeta,
} from "../services/integration";
import { uploadToBlob } from "../services/blobUpload";
import ThemedSelect from "./IMS/StockSheet/ThemedSelect";
import { CHALLAN_COMPANY, printOutwardChallan } from "./outwardChallanPrint";

// Read the logged-in user (for the "Given By" block on the printed challan).
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

// Shared Tailwind class strings — flat/clean theme matching the StockSheet revamp:
// small radius, defined grey borders, no shadows, orange primary, grey neutrals.
const CARD = "rounded-lg border border-[#e2e3e8] bg-card p-5 md:p-6";
const LABEL =
  "mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";
const CTRL =
  "w-full rounded-md border border-[#e2e3e8] bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15";
const NO_SPIN =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
const SECTION_TITLE =
  "mb-4 text-sm font-bold uppercase tracking-wide text-foreground";
// Compact table controls
const TH =
  "border-b border-[#e2e3e8] bg-muted px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground";
const TD = "border-b border-[#e2e3e8] px-2 py-1.5 align-top";
const TCTRL =
  "w-full rounded-md border border-[#e2e3e8] bg-card px-2.5 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15";

// Truncate a filename to `max` chars, keeping the extension and adding an ellipsis.
const truncateName = (name, max = 20) => {
  if (!name || name.length <= max) return name || "";
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot) : "";
  const base = dot > 0 ? name.slice(0, dot) : name;
  const keep = Math.max(1, max - ext.length - 3);
  return `${base.slice(0, keep)}...${ext}`;
};

// Themed image picker: dashed upload button with an icon, or once a file is chosen a
// thumbnail preview + truncated name + an X to clear (which re-enables the button).
const ImageUpload = ({ id, value, onChange }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  if (value) {
    return (
      <div className="flex items-center gap-2.5 rounded-md border border-[#e2e3e8] bg-card p-1.5">
        {preview ? (
          <img
            src={preview}
            alt={value.name}
            className="h-10 w-10 shrink-0 rounded object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
            <ImagePlus className="h-4 w-4" />
          </div>
        )}
        <span
          className="flex-1 truncate text-sm font-medium text-foreground"
          title={value.name}
        >
          {truncateName(value.name)}
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          title="Remove image"
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#cdced6] bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
    >
      <ImagePlus className="h-4 w-4" />
      Upload Image
      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  );
};

const createId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// One dispatch line for a single USN (row inside a UIN block). `raw_material`
// holds the material TYPE (Fabric/Yarn/…) and `ipc_component` holds "IPC / Comp",
// both auto-filled from the IPO's BOM (see buildMaterialMetaMap / getMeta).
const createEmptyUsnRow = () => ({
  id: createId(),
  raw_material: "",
  ipc_component: "",
  particulars: "",
  dispatch_quantity: "",
  unit: "CM",
  link_usn: "",
  usn_quantity: "",
  remark: "",
  dispatch_form: "",
  num_packages: "",
  uqr_sent: false,
});

// Build a lookup (lowercased material description → meta) from the VPO
// materials-meta response, and a helper to resolve a USN item's Raw Material
// (material type) + IPC/Component from it.
const buildMaterialMetaMap = (materials) => {
  const map = new Map();
  (materials || []).forEach((m) => {
    const key = String(m.material_description || "").trim().toLowerCase();
    if (key) map.set(key, m);
  });
  return map;
};

const metaFor = (metaMap, description) =>
  metaMap.get(String(description || "").trim().toLowerCase()) || {};

const ipcComponentLabel = (meta) =>
  [meta.ipc_code, meta.component_name].filter(Boolean).join(" / ");

// A "UIN block" — the parent UIN (from an inward store sheet under the selected
// VPO) plus a nested table of its USN rows. `uin_id` is the inward sheet id used as
// the block's dropdown value; `uin_code` is the real UIN shown as the header.
const createEmptyBlock = (uin = {}) => ({
  id: createId(),
  uin_id: uin.uin_id || "",
  uin_code: uin.uin_code || "",
  rows: [createEmptyUsnRow()],
});

// One USN row, pre-filled from an inward item. Raw Material = material TYPE and
// IPC/Component come from the IPO meta (matched by description); Particulars keeps
// the full material description; the USN is the inward item's usn_code.
const rowFromInwardItem = (it, metaMap) => {
  const description = it.particulars || it.material_description || "";
  const meta = metaFor(metaMap, description);
  return {
    ...createEmptyUsnRow(),
    raw_material: meta.material_type || "",
    ipc_component: ipcComponentLabel(meta),
    particulars: description,
    link_usn: it.usn_code || "",
  };
};

// Build one block per inward UIN, pre-filling a row per USN item.
const buildBlocksFromSheets = (sheets, metaMap = new Map()) =>
  (sheets || []).map((sheet) => {
    const items = Array.isArray(sheet.items) ? sheet.items : [];
    const rows = items.length
      ? items.map((it) => rowFromInwardItem(it, metaMap))
      : [createEmptyUsnRow()];
    return {
      id: createId(),
      uin_id: sheet.id,
      uin_code: sheet.uin_code || "",
      rows,
    };
  });

const IPO_TYPE_TO_ORDER_TYPE = {
  PRODUCTION: "PD",
  SAMPLING: "SAM",
  COMPANY: "SELF",
};

// Packaging form the goods are dispatched in — a fixed set for the Dispatch Form column.
const FORM_OPTIONS = [
  { value: "BALE", label: "BALE" },
  { value: "BUNDLE", label: "BUNDLE" },
  { value: "ROLL", label: "ROLL" },
  { value: "PCS", label: "PCS" },
];

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatQuantity = (value) => {
  const numeric = Number.isFinite(value) ? value : toNumber(value);
  return numeric
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
};

// Per-row balance: how much of the dispatch quantity is still unaccounted for by
// the USN quantity on that row (each USN row carries exactly one USN).
const getRowBalance = (row) =>
  toNumber(row.dispatch_quantity) - toNumber(row.usn_quantity);

const OutwardStoreSheet = ({ onBack }) => {
  const [dispatchType, setDispatchType] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [dispatchIssuedToAddress, setDispatchIssuedToAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [ipoType, setIpoType] = useState("");
  const [selectedIpo, setSelectedIpo] = useState("");
  const [selectedCompanyEssential, setSelectedCompanyEssential] = useState("");
  const [dispatchedGoodsConditionImage, setDispatchedGoodsConditionImage] =
    useState(null);
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleNoImage, setVehicleNoImage] = useState(null);
  const [companyChallanNumber, setCompanyChallanNumber] = useState("");
  const [companyChallanImage, setCompanyChallanImage] = useState(null);
  // 2-D items: one block per UIN (from the selected VPO's inward sheets), each with
  // a nested table of USN rows. Populated when a VPO is selected.
  const [uinBlocks, setUinBlocks] = useState([]);

  const [choices, setChoices] = useState({
    dispatch_types: [],
    ipo_types: [],
    departments: [],
    vendors: [],
    item_units: ["CM"],
  });
  const [ipoOptions, setIpoOptions] = useState([]);
  const [companyEssentialOptions, setCompanyEssentialOptions] = useState([]);
  // Issued VPOs — selecting one loads its inward UINs into the item blocks.
  const [issuedVpos, setIssuedVpos] = useState([]);
  const [selectedIssuedVpo, setSelectedIssuedVpo] = useState("");
  // UINs (inward store sheets) generated against the selected VPO — used to build
  // the item blocks and to (re)assign a block's UIN.
  const [vpoUins, setVpoUins] = useState([]);
  // Per-material meta (material type + IPC/Component) for the selected VPO's IPO,
  // keyed by lowercased material description. Auto-fills Raw Material + IPC/Comp.
  const [materialMeta, setMaterialMeta] = useState(() => new Map());
  const [loadingUins, setLoadingUins] = useState(false);
  const [loadingChoices, setLoadingChoices] = useState(true);
  const [loadingIpoOptions, setLoadingIpoOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadChoices = async () => {
      setLoadingChoices(true);
      try {
        const data = await getOutwardStoreSheetChoices();
        if (!isMounted) return;
        setChoices({
          dispatch_types: data?.dispatch_types || [],
          ipo_types: data?.ipo_types || [],
          departments: data?.departments || [],
          vendors: data?.vendors || [],
          item_units: data?.item_units || ["CM"],
        });
      } catch {
        if (!isMounted) return;
        setChoices({
          dispatch_types: [],
          ipo_types: [],
          departments: [],
          vendors: [],
          item_units: ["CM"],
        });
      } finally {
        if (isMounted) setLoadingChoices(false);
      }
    };

    loadChoices();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadIpoOptions = async () => {
      if (!ipoType) {
        setIpoOptions([]);
        setCompanyEssentialOptions([]);
        return;
      }

      setLoadingIpoOptions(true);
      try {
        if (ipoType === "COMPANY_ESSENTIALS") {
          const data = await getCompanyEssentials("", {});
          if (!isMounted) return;
          const results = data?.results || data || [];
          setCompanyEssentialOptions(Array.isArray(results) ? results : []);
          setIpoOptions([]);
        } else {
          const data = await getAllIPOs({
            order_type: IPO_TYPE_TO_ORDER_TYPE[ipoType],
          });
          if (!isMounted) return;
          const results = data?.results || data || [];
          const normalizedResults = Array.isArray(results) ? results : [];
          setIpoOptions(
            normalizedResults.filter(
              (option) => option.order_type === IPO_TYPE_TO_ORDER_TYPE[ipoType],
            ),
          );
          setCompanyEssentialOptions([]);
        }
      } catch {
        if (!isMounted) return;
        setIpoOptions([]);
        setCompanyEssentialOptions([]);
      } finally {
        if (isMounted) setLoadingIpoOptions(false);
      }
    };

    loadIpoOptions();

    return () => {
      isMounted = false;
    };
  }, [ipoType]);

  const activeDepartment = choices.departments.find(
    (department) => department.id === selectedDepartment,
  );
  const sectionOptions = activeDepartment?.sections || [];

  // ── UIN-block / USN-row editing ──────────────────────────────────────────
  const updateBlockRow = (blockId, rowId, updater) => {
    setUinBlocks((prev) =>
      prev.map((block) =>
        block.id !== blockId
          ? block
          : {
              ...block,
              rows: block.rows.map((row) =>
                row.id === rowId ? updater(row) : row,
              ),
            },
      ),
    );
  };

  const handleRowChange = (blockId, rowId, field, value) => {
    updateBlockRow(blockId, rowId, (row) => ({ ...row, [field]: value }));
  };

  const addRowToBlock = (blockId) => {
    setUinBlocks((prev) =>
      prev.map((block) =>
        block.id !== blockId
          ? block
          : { ...block, rows: [...block.rows, createEmptyUsnRow()] },
      ),
    );
  };

  const removeRowFromBlock = (blockId, rowId) => {
    setUinBlocks((prev) =>
      prev.map((block) =>
        block.id !== blockId
          ? block
          : {
              ...block,
              rows:
                block.rows.length > 1
                  ? block.rows.filter((row) => row.id !== rowId)
                  : block.rows,
            },
      ),
    );
  };

  const removeBlock = (blockId) => {
    setUinBlocks((prev) => prev.filter((block) => block.id !== blockId));
  };

  const addManualBlock = () => {
    setUinBlocks((prev) => [...prev, createEmptyBlock()]);
  };

  // Assign/replace a block's UIN — reloads its USN rows from that inward sheet.
  const changeBlockUin = (blockId, sheetId) => {
    const sheet = vpoUins.find((s) => s.id === sheetId);
    setUinBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== blockId) return block;
        if (!sheet) return { ...block, uin_id: "", uin_code: "" };
        const items = Array.isArray(sheet.items) ? sheet.items : [];
        const rows = items.length
          ? items.map((it) => rowFromInwardItem(it, materialMeta))
          : block.rows;
        return {
          ...block,
          uin_id: sheetId,
          uin_code: sheet.uin_code || "",
          rows,
        };
      }),
    );
  };

  // Load issued VPOs (scoped to the selected IPO when present) for auto-fill.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getVpoHistory({
          ipoId: selectedIpo || undefined,
          status: "issued",
        });
        if (!cancelled) setIssuedVpos(res?.results || []);
      } catch {
        if (!cancelled) setIssuedVpos([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedIpo]);

  // Load the UINs (inward store sheets) generated against the selected VPO and
  // build one editable block per UIN (each with a row per USN). Rebuilds whenever
  // the VPO changes; the backend scopes by ?vpo= so only that VPO's UINs return.
  useEffect(() => {
    if (!selectedIssuedVpo) {
      setVpoUins([]);
      setUinBlocks([]);
      setMaterialMeta(new Map());
      return undefined;
    }
    let cancelled = false;
    setLoadingUins(true);
    (async () => {
      try {
        // Inward UINs (for the blocks) and the IPO material meta (for auto-fill)
        // load together; meta failing shouldn't block the UINs.
        const [res, metaRes] = await Promise.all([
          getInwardStoreSheets({ vpo: selectedIssuedVpo, page_size: 200 }),
          getVpoMaterialsMeta(selectedIssuedVpo).catch(() => ({ materials: [] })),
        ]);
        const list = res?.results || res?.data || (Array.isArray(res) ? res : []);
        const scoped = list.filter((s) => s.uin_code);
        const metaMap = buildMaterialMetaMap(metaRes?.materials);
        if (!cancelled) {
          setVpoUins(scoped);
          setMaterialMeta(metaMap);
          setUinBlocks(buildBlocksFromSheets(scoped, metaMap));
        }
      } catch {
        if (!cancelled) {
          setVpoUins([]);
          setUinBlocks([]);
          setMaterialMeta(new Map());
        }
      } finally {
        if (!cancelled) setLoadingUins(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedIssuedVpo]);

  const handleSelectIssuedVpo = (vpoId) => {
    setSelectedIssuedVpo(vpoId);
    setErrorMsg("");
  };

  const handleDispatchTypeChange = (value) => {
    setDispatchType(value);
    setErrorMsg("");

    if (value === "INTERNAL_CHALLAN") {
      setSelectedVendor("");
    }

    if (value === "EXTERNAL_CHALLAN") {
      setUnitNumber("");
      setSelectedDepartment("");
      setSelectedSection("");
    }
  };

  const handleVendorChange = (vendorId) => {
    setSelectedVendor(vendorId);
    const vendor = choices.vendors.find((item) => item.id === vendorId);
    if (vendor) {
      setDispatchIssuedToAddress(vendor.address || "");
      setContactPerson(vendor.contact_person || "");
      setContactNumber(vendor.contact_number || "");
    } else {
      setDispatchIssuedToAddress("");
      setContactPerson("");
      setContactNumber("");
    }
  };

  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
    const nextDepartment = choices.departments.find(
      (department) => department.id === departmentId,
    );
    if (
      !nextDepartment?.sections?.some(
        (section) => section.id === selectedSection,
      )
    ) {
      setSelectedSection("");
    }
  };

  const handleIpoTypeChange = (value) => {
    setIpoType(value);
    setSelectedIpo("");
    setSelectedCompanyEssential("");
  };

  const validateBeforeSave = (normalizedRows) => {
    if (!dispatchType) return "Please select Dispatch Type.";
    if (
      dispatchType === "INTERNAL_CHALLAN" &&
      (!unitNumber.trim() || !selectedDepartment || !selectedSection)
    ) {
      return "Please complete Unit #, Department, and Section for internal challan.";
    }
    if (dispatchType === "EXTERNAL_CHALLAN" && !selectedVendor) {
      return "Please select a Vendor Code for external challan.";
    }
    if (!ipoType) return "Please select IPO Type.";
    if (ipoType === "COMPANY_ESSENTIALS" && !selectedCompanyEssential) {
      return "Please select a Company Essential.";
    }
    if (ipoType !== "COMPANY_ESSENTIALS" && !selectedIpo) {
      return "Please select an IPO.";
    }
    if (normalizedRows.length === 0)
      return "Please select a VPO and add at least one dispatch USN row.";

    const incompleteRow = normalizedRows.find(
      (row) => !row.particulars.trim() || !toNumber(row.dispatch_quantity),
    );
    if (incompleteRow) {
      return "Each dispatch row needs Particulars and Dispatch Quantity.";
    }

    return "";
  };

  // Build the printable Delivery Challan from the current form state, resolving the
  // selected ids to their human labels.
  const buildChallanDocument = () => {
    const user = getStoredUser();
    const dispatchTypeLabel =
      choices.dispatch_types.find((o) => o.value === dispatchType)?.label ||
      dispatchType;
    const ipoTypeLabel =
      choices.ipo_types.find((o) => o.value === ipoType)?.label || ipoType;
    const departmentName = activeDepartment?.name || "";
    const sectionName =
      sectionOptions.find((s) => s.id === selectedSection)?.name || "";
    const ipoObj = ipoOptions.find((o) => o.id === selectedIpo);
    const ceObj = companyEssentialOptions.find(
      (o) => o.id === selectedCompanyEssential,
    );
    const ipoCode =
      ipoType === "COMPANY_ESSENTIALS"
        ? ceObj?.code || ""
        : ipoObj?.ipo_code || "";
    const vendorObj = choices.vendors.find((v) => v.id === selectedVendor);
    const issuedTo =
      dispatchType === "EXTERNAL_CHALLAN"
        ? vendorObj
          ? `${vendorObj.code} - ${vendorObj.vendor_name}`
          : ""
        : [unitNumber, departmentName, sectionName].filter(Boolean).join(" / ");

    return {
      gst: CHALLAN_COMPANY.gst,
      company_contact: CHALLAN_COMPANY.contact,
      date: new Date(),
      challan_no: companyChallanNumber,
      dispatch_type: dispatchTypeLabel,
      ipo_type: ipoTypeLabel,
      ipo_code: ipoCode,
      department: departmentName,
      section: sectionName,
      issued_to: issuedTo,
      address: dispatchIssuedToAddress,
      contact_person: contactPerson,
      contact_number: contactNumber,
      vehicle_no: vehicleNo,
      lines: uinBlocks.flatMap((block) =>
        block.rows.map((r) => ({
          particulars: r.particulars,
          qty: r.dispatch_quantity,
          unit: r.unit,
          uin_code: block.uin_code,
          link_usn: [r.link_usn],
          usn_qty: [r.usn_quantity],
          dispatch_form: r.dispatch_form,
          num_packages: r.num_packages,
          uqr: r.uqr_sent,
        })),
      ),
      given_by_name:
        user.name ||
        user.full_name ||
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        "",
      given_by_userid: user.email || user.username || "",
      given_by_post: user.designation || "",
      given_to_name: issuedTo,
      given_to_person: contactPerson,
      given_to_post: "",
    };
  };

  const handlePrint = () => printOutwardChallan(buildChallanDocument());

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Flatten every UIN block's USN rows into one dispatch-line list, tagging each
    // with its parent UIN. Keep only rows that carry real content.
    const normalizedRows = uinBlocks
      .flatMap((block) =>
        block.rows.map((row) => ({ ...row, uin_code: block.uin_code })),
      )
      .filter(
        (row) =>
          row.particulars.trim() ||
          String(row.dispatch_quantity).trim() ||
          row.link_usn.trim() ||
          toNumber(row.usn_quantity) > 0 ||
          row.remark.trim(),
      );

    const validationError = validateBeforeSave(normalizedRows);
    if (validationError) {
      setSaving(false);
      setErrorMsg(validationError);
      return;
    }

    try {
      // Upload each picked image to Vercel Blob (in parallel); the API stores the
      // returned public URLs, not file bytes.
      const [dispatchedGoodsUrl, vehicleNoUrl, companyChallanUrl] =
        await Promise.all([
          dispatchedGoodsConditionImage
            ? uploadToBlob(
                dispatchedGoodsConditionImage,
                "ims/outward/goods-condition",
              )
            : "",
          vehicleNoImage
            ? uploadToBlob(vehicleNoImage, "ims/outward/vehicle-no")
            : "",
          companyChallanImage
            ? uploadToBlob(companyChallanImage, "ims/outward/company-challan")
            : "",
        ]);

      const payload = new FormData();
      payload.append("dispatch_type", dispatchType);
      payload.append("dispatch_issued_to_address", dispatchIssuedToAddress);
      payload.append("contact_person", contactPerson);
      payload.append("contact_number", contactNumber);
      payload.append("ipo_type", ipoType);
      payload.append("vehicle_no", vehicleNo);
      payload.append("company_challan_number", companyChallanNumber);

      if (dispatchType === "INTERNAL_CHALLAN") {
        payload.append("unit_number", unitNumber);
        payload.append("department", selectedDepartment);
        payload.append("section", selectedSection);
      }

      if (dispatchType === "EXTERNAL_CHALLAN") {
        payload.append("vendor_code", selectedVendor);
      }

      if (ipoType === "COMPANY_ESSENTIALS") {
        payload.append("company_essential", selectedCompanyEssential);
      } else {
        payload.append("ipo", selectedIpo);
      }

      if (dispatchedGoodsUrl) {
        payload.append("dispatched_goods_condition_image", dispatchedGoodsUrl);
      }
      if (vehicleNoUrl) {
        payload.append("vehicle_no_image", vehicleNoUrl);
      }
      if (companyChallanUrl) {
        payload.append("company_challan_image", companyChallanUrl);
      }

      payload.append(
        "items",
        JSON.stringify(
          normalizedRows.map((row) => ({
            raw_material: row.raw_material,
            ipc_component: row.ipc_component,
            // UIN snapshot for this dispatch line (from its parent block).
            uin_code: row.uin_code,
            particulars: row.particulars,
            dispatch_quantity: toNumber(row.dispatch_quantity),
            unit: row.unit || "CM",
            remark: row.remark,
            dispatch_form: row.dispatch_form,
            num_packages: Number.parseInt(row.num_packages, 10) || 0,
            uqr_sent: row.uqr_sent,
            // Each USN row carries exactly one USN link.
            usn_links:
              row.link_usn.trim() || toNumber(row.usn_quantity) > 0
                ? [
                    {
                      link_usn: row.link_usn,
                      usn_quantity: toNumber(row.usn_quantity),
                    },
                  ]
                : [],
          })),
        ),
      );

      const result = await createOutwardStoreSheet(payload);
      if (result?.status === "success") {
        setSuccessMsg("Outward Store Logs saved successfully.");
      } else {
        setErrorMsg(
          result?.message ||
            JSON.stringify(result) ||
            "Failed to save outward store logs...",
        );
      }
    } catch (error) {
      setErrorMsg(
        error.message || "An error occurred while saving outward store logs.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-full w-full overflow-y-auto bg-[#f3f4f6] pt-9 pb-40"
      style={{
        zoom: 0.9,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        // The theme's --accent is a pinkish grey used for the dropdown option hover;
        // recolor to a neutral light grey so hover reads grey (matches StockSheet).
        "--accent": "#edeef1",
      }}
    >
      <div className="mx-auto max-w-[95%] space-y-5">
        {/* Header */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#e2e3e8] bg-white px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-[#f5f5f5] hover:shadow-lg"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-foreground">
            Outward Store Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record dispatch challans, outward movements, and linked USN
            quantities
          </p>
        </div>

        {successMsg && (
          <div className="rounded-md border border-green-500/40 bg-green-500/10 px-5 py-4 text-sm font-medium text-green-600">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm font-medium text-destructive">
            {errorMsg}
          </div>
        )}

        {/* Dispatch information */}
        <div className={CARD}>
          <h3 className={SECTION_TITLE}>Dispatch Information</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
            {/* Row 1 — Dispatch Type | IPO Type */}
            <div>
              <label className={LABEL}>
                Dispatch Type <span className="text-primary">*</span>
              </label>
              <ThemedSelect
                value={dispatchType}
                onChange={handleDispatchTypeChange}
                isDisabled={loadingChoices}
                options={choices.dispatch_types}
                placeholder="-- Select --"
              />
            </div>

            <div>
              <label className={LABEL}>
                IPO Type <span className="text-primary">*</span>
              </label>
              <ThemedSelect
                value={ipoType}
                onChange={handleIpoTypeChange}
                isDisabled={loadingChoices}
                options={choices.ipo_types}
                placeholder="-- Select --"
              />
            </div>

            {/* Row 2 — Dispatch / Issued To | Address */}
            <div>
              <label className={LABEL}>
                Dispatch / Issued To <span className="text-primary">*</span>
              </label>

              {dispatchType === "INTERNAL_CHALLAN" && (
                <div className="grid grid-cols-1 gap-3">
                  <input
                    className={CTRL}
                    type="text"
                    value={unitNumber}
                    onChange={(event) => setUnitNumber(event.target.value)}
                    placeholder="Unit #"
                  />
                  <ThemedSelect
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    placeholder="-- Department --"
                    options={choices.departments.map((department) => ({
                      value: department.id,
                      label: department.name,
                    }))}
                  />
                  <ThemedSelect
                    value={selectedSection}
                    onChange={setSelectedSection}
                    isDisabled={!selectedDepartment}
                    placeholder="-- Section --"
                    options={sectionOptions.map((section) => ({
                      value: section.id,
                      label: section.name,
                    }))}
                  />
                </div>
              )}

              {dispatchType === "EXTERNAL_CHALLAN" && (
                <ThemedSelect
                  value={selectedVendor}
                  onChange={handleVendorChange}
                  placeholder="-- Vendor Code --"
                  options={choices.vendors.map((vendor) => ({
                    value: vendor.id,
                    label: `${vendor.code} - ${vendor.vendor_name}`,
                  }))}
                />
              )}

              {!dispatchType && (
                <div className="rounded-md border border-dashed border-[#d5d6dc] bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  Select a dispatch type to choose internal unit details or an
                  external vendor code.
                </div>
              )}
            </div>

            <div>
              <label className={LABEL}>Dispatch / Issued To Address</label>
              <textarea
                className={`${CTRL} min-h-20 resize-y`}
                value={dispatchIssuedToAddress}
                onChange={(event) =>
                  setDispatchIssuedToAddress(event.target.value)
                }
                placeholder="Enter address"
              />
            </div>

            {/* Row 3 — Contact Person | Contact Number */}
            <div>
              <label className={LABEL}>Contact Person</label>
              <input
                className={CTRL}
                type="text"
                value={contactPerson}
                onChange={(event) => setContactPerson(event.target.value)}
                placeholder="Enter contact person"
              />
            </div>

            <div>
              <label className={LABEL}>Contact Number</label>
              <input
                className={CTRL}
                type="tel"
                inputMode="numeric"
                value={contactNumber}
                onChange={(event) =>
                  setContactNumber(event.target.value.replace(/[^\d]/g, ""))
                }
                placeholder="Enter contact number"
              />
            </div>

            {/* Row 4 — IPO / Company Essential (half width) */}
            <div>
              <label className={LABEL}>
                {ipoType === "COMPANY_ESSENTIALS" ? "Company Essential" : "IPO"}{" "}
                <span className="text-primary">*</span>
              </label>
              {ipoType === "COMPANY_ESSENTIALS" ? (
                <ThemedSelect
                  value={selectedCompanyEssential}
                  onChange={setSelectedCompanyEssential}
                  isDisabled={!ipoType || loadingIpoOptions}
                  placeholder="-- Select Company Essential --"
                  options={companyEssentialOptions.map((option) => ({
                    value: option.id,
                    label: `${option.code}${option.item ? ` - ${option.item}` : ""}`,
                  }))}
                />
              ) : (
                <ThemedSelect
                  value={selectedIpo}
                  onChange={setSelectedIpo}
                  isDisabled={!ipoType || loadingIpoOptions}
                  placeholder="-- Select IPO --"
                  options={ipoOptions.map((option) => ({
                    value: option.id,
                    label: `${option.ipo_code} - ${option.program_name}`,
                  }))}
                />
              )}
            </div>

            {/* Row 5 — Select VPO to load its UINs into the item blocks */}
            <div>
              <label className={LABEL}>
                Select VPO (loads UIN blocks)
                {loadingUins ? " — loading…" : ""}
              </label>
              <ThemedSelect
                value={selectedIssuedVpo}
                onChange={handleSelectIssuedVpo}
                placeholder="-- Select issued VPO --"
                options={issuedVpos.map((v) => ({
                  value: v.id,
                  // The composed VPO code already carries the IPO base + category,
                  // so show it alone (no trailing ipo_code).
                  label: v.vpo_number,
                }))}
              />
            </div>
          </div>
        </div>

        {/* Dispatch details (images) */}
        <div className={CARD}>
          <h3 className={SECTION_TITLE}>Dispatch Details</h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 md:items-start">
            <div>
              <label className={LABEL}>Dispatched Goods Condition</label>
              <ImageUpload
                id="oss-dispatched-goods-image"
                value={dispatchedGoodsConditionImage}
                onChange={setDispatchedGoodsConditionImage}
              />
            </div>

            <div>
              <label className={LABEL}>Vehicle No.</label>
              <input
                className={CTRL}
                type="text"
                value={vehicleNo}
                onChange={(event) => setVehicleNo(event.target.value)}
                placeholder="Enter vehicle number"
              />
              <div className="mt-2">
                <ImageUpload
                  id="oss-vehicle-no-image"
                  value={vehicleNoImage}
                  onChange={setVehicleNoImage}
                />
              </div>
            </div>

            <div>
              <label className={LABEL}>Company Challan Number</label>
              <input
                className={CTRL}
                type="text"
                value={companyChallanNumber}
                onChange={(event) =>
                  setCompanyChallanNumber(event.target.value)
                }
                placeholder="Enter company challan number"
              />
              <div className="mt-2">
                <ImageUpload
                  id="oss-company-challan-image"
                  value={companyChallanImage}
                  onChange={setCompanyChallanImage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items — 2-D: one block per UIN (from the selected VPO's inward sheets),
            each holding a nested table of that UIN's USN rows. */}
        <div className={CARD}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Items — by UIN
            </h3>
            {vpoUins.length > 0 && (
              <button
                type="button"
                onClick={addManualBlock}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                + Add UIN block
              </button>
            )}
          </div>

          {!selectedIssuedVpo && (
            <div className="rounded-md border border-dashed border-[#d5d6dc] bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
              Select a VPO above to load its UINs and USNs.
            </div>
          )}

          {selectedIssuedVpo && loadingUins && (
            <div className="rounded-md border border-dashed border-[#d5d6dc] bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
              Loading UINs for this VPO…
            </div>
          )}

          {selectedIssuedVpo && !loadingUins && uinBlocks.length === 0 && (
            <div className="rounded-md border border-dashed border-[#d5d6dc] bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
              No inward UINs found for this VPO yet. Create an Inward Store sheet
              for this VPO, or{" "}
              <button
                type="button"
                onClick={addManualBlock}
                className="font-semibold text-primary underline"
              >
                add a UIN block manually
              </button>
              .
            </div>
          )}

          <div className="space-y-5">
            {uinBlocks.map((block, blockIndex) => (
              <div key={block.id} className="rounded-lg border border-[#e2e3e8]">
                {/* Block header — the parent UIN */}
                <div className="flex flex-wrap items-center gap-3 border-b border-[#e2e3e8] bg-muted/50 px-4 py-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    UIN #{blockIndex + 1}
                  </span>
                  <div className="min-w-[280px] flex-1">
                    <ThemedSelect
                      value={block.uin_id}
                      onChange={(v) => changeBlockUin(block.id, v)}
                      isDisabled={loadingUins}
                      menuPortal
                      options={vpoUins.map((s) => ({
                        value: s.id,
                        label: s.uin_code,
                      }))}
                      placeholder="Select UIN#"
                    />
                  </div>
                  {block.uin_code && (
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {block.uin_code}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {block.rows.length} USN
                    {block.rows.length === 1 ? "" : "s"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBlock(block.id)}
                    title="Remove this UIN block"
                    className="ml-auto cursor-pointer rounded-md border border-[#e2e3e8] px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Remove UIN
                  </button>
                </div>

                {/* Nested USN table for this UIN */}
                <div className="overflow-x-auto">
                  <table
                    className="w-full table-fixed border-collapse text-sm"
                    style={{ minWidth: 1620 }}
                  >
                    <colgroup>
                      <col style={{ width: "40px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "190px" }} />
                      <col style={{ width: "220px" }} />
                      <col style={{ width: "110px" }} />
                      <col style={{ width: "70px" }} />
                      <col style={{ width: "210px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "140px" }} />
                      <col style={{ width: "90px" }} />
                      <col style={{ width: "120px" }} />
                      <col style={{ width: "44px" }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th className={`${TH} text-center`}>Sr</th>
                        <th className={TH}>Raw Material</th>
                        <th className={TH}>IPC/Component</th>
                        <th className={TH}>Particulars</th>
                        <th className={TH}>Dispatch Qty</th>
                        <th className={TH}>Unit</th>
                        <th className={TH}>Link USN</th>
                        <th className={TH}>USN Quantity</th>
                        <th className={TH}>Remark</th>
                        <th className={TH}>Dispatch Form</th>
                        <th className={TH}># of Package</th>
                        <th className={TH}>UQR</th>
                        <th className={TH}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => {
                        const rowBalance = getRowBalance(row);
                        return (
                          <tr
                            key={row.id}
                            className="transition-colors hover:bg-muted/40"
                          >
                            <td className={`${TD} text-center font-semibold`}>
                              {rowIndex + 1}
                            </td>
                            <td className={TD}>
                              <input
                                className={TCTRL}
                                type="text"
                                value={row.raw_material}
                                title={row.raw_material}
                                onChange={(event) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "raw_material",
                                    event.target.value,
                                  )
                                }
                                placeholder="Raw Material"
                              />
                            </td>
                            <td className={TD}>
                              <input
                                className={TCTRL}
                                type="text"
                                value={row.ipc_component}
                                title={row.ipc_component}
                                onChange={(event) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "ipc_component",
                                    event.target.value,
                                  )
                                }
                                placeholder="IPC / Component"
                              />
                            </td>
                            <td className={TD}>
                              <input
                                className={TCTRL}
                                type="text"
                                value={row.particulars}
                                title={row.particulars}
                                onChange={(event) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "particulars",
                                    event.target.value,
                                  )
                                }
                                placeholder="Particulars"
                              />
                            </td>
                            <td className={TD}>
                              <input
                                className={`${TCTRL} ${NO_SPIN}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={row.dispatch_quantity}
                                onChange={(event) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "dispatch_quantity",
                                    event.target.value,
                                  )
                                }
                                placeholder="0"
                              />
                            </td>
                            <td className={TD}>
                              <input
                                className={TCTRL}
                                type="text"
                                value={row.unit}
                                onChange={(event) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "unit",
                                    event.target.value.toUpperCase(),
                                  )
                                }
                                placeholder={choices.item_units[0] || "CM"}
                              />
                            </td>
                            <td className={TD}>
                              <input
                                className={TCTRL}
                                type="text"
                                value={row.link_usn}
                                title={row.link_usn}
                                onChange={(event) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "link_usn",
                                    event.target.value,
                                  )
                                }
                                placeholder="Link USN"
                              />
                            </td>
                            <td className={TD}>
                              <input
                                className={`${TCTRL} ${NO_SPIN}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={row.usn_quantity}
                                title={row.usn_quantity}
                                onChange={(event) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "usn_quantity",
                                    event.target.value,
                                  )
                                }
                                placeholder="USN Qty"
                              />
                              {(toNumber(row.dispatch_quantity) > 0 ||
                                toNumber(row.usn_quantity) > 0) && (
                                <div className="pt-1 text-[10px] text-muted-foreground">
                                  Balance: {formatQuantity(rowBalance)}
                                </div>
                              )}
                            </td>
                            <td className={TD}>
                              <input
                                className={TCTRL}
                                type="text"
                                value={row.remark}
                                title={row.remark}
                                onChange={(event) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "remark",
                                    event.target.value,
                                  )
                                }
                                placeholder="Remark"
                              />
                            </td>
                            <td className={TD}>
                              <ThemedSelect
                                value={row.dispatch_form}
                                onChange={(v) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "dispatch_form",
                                    v,
                                  )
                                }
                                options={FORM_OPTIONS}
                                isSearchable={false}
                                menuPortal
                                placeholder="Form"
                              />
                            </td>
                            <td className={TD}>
                              <input
                                className={`${TCTRL} ${NO_SPIN}`}
                                type="number"
                                min="0"
                                value={row.num_packages}
                                onChange={(event) =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "num_packages",
                                    event.target.value,
                                  )
                                }
                                placeholder="0"
                              />
                            </td>
                            <td className={TD}>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRowChange(
                                    block.id,
                                    row.id,
                                    "uqr_sent",
                                    !row.uqr_sent,
                                  )
                                }
                                title="Click to request a quality verification — this USN is sent to the Quality team on Save."
                                className={`w-full cursor-pointer rounded-md border px-2 py-1.5 text-[9px] font-semibold leading-tight transition-colors ${
                                  row.uqr_sent
                                    ? "border-green-600 bg-green-500/10 text-green-600"
                                    : "border-amber-500 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                                }`}
                              >
                                {row.uqr_sent
                                  ? "✓ REQUESTED — SENDS ON SAVE"
                                  : "REQUEST TO VERIFICATION"}
                              </button>
                            </td>
                            <td className={`${TD} text-center`}>
                              <button
                                type="button"
                                className="cursor-pointer rounded p-1 text-lg leading-none text-destructive transition-colors hover:bg-destructive/10"
                                onClick={() =>
                                  removeRowFromBlock(block.id, row.id)
                                }
                                title="Remove USN row"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => addRowToBlock(block.id)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    + Add USN row
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            className="cursor-pointer rounded-md border border-[#e2e3e8] bg-card px-6 py-3 text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted"
            onClick={handlePrint}
          >
            Print Challan
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleSave}
            disabled={saving || loadingChoices}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutwardStoreSheet;
