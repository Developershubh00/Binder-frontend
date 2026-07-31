// Printable Goods Receipt Note for the Inward Store Sheet.
//
// Shares the exact look & feel of the outward Delivery Challan — it reuses the same
// `.challan-doc` styles (CHALLAN_STYLES) and company header — but only renders the
// fields that exist on the inward form (which has fewer than outward).

import { CHALLAN_COMPANY, CHALLAN_STYLES } from "./outwardChallanPrint";

const esc = (v) => {
  if (v === null || v === undefined) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

const fmtNum = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("en-IN", { maximumFractionDigits: 3 });
};

const fmtDate = (v) => {
  if (!v) return "";
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
  } catch {
    return String(v);
  }
};

const PRINT_STYLES = `
html, body { margin: 0; padding: 0; background: #fff; }
body { padding: 18px; }
.challan-doc .items td .pname { font-weight: 600; }
.challan-doc .items td .psep { border-top: 1px dashed #c7cad0; margin: 3px 0; }
.challan-doc .items td .pmeta { display: flex; gap: 5px; font-size: 10px; line-height: 1.35; margin-top: 1px; }
.challan-doc .items td .plbl { font-weight: 700; color: #555; white-space: nowrap; }
.challan-doc .items td .pmono { font-family: "Consolas", "Courier New", monospace; word-break: break-all; }
.challan-doc .items td .pusns { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.challan-doc .items td .usnrow { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
.challan-doc .items td .uqty { white-space: nowrap; color: #444; }
.challan-doc .items td.nowrap { white-space: nowrap; }
@media print {
  html, body, *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body { padding: 0; }
  /* Portrait — overrides the landscape @page from the shared CHALLAN_STYLES
     (this rule comes later in the concatenated stylesheet, so it wins). */
  @page { size: A4 portrait; margin: 9mm; }
  .no-print { display: none !important; }
  .challan-doc .items thead { display: table-header-group; }
}
`;

export const buildReceiptBody = (doc) => {
  const lines = doc?.lines || [];

  // One row per item. The (wide) Particulars cell carries the material name, then
  // a separator, then the linked UIN and every linked USN with its quantity+unit;
  // so there are no separate Link USN / Unit / USN Qty columns.
  const itemCols =
    '<col style="width:5%" /><col style="width:55%" /><col style="width:12%" />' +
    '<col style="width:12%" /><col style="width:10%" /><col style="width:6%" />';

  const itemHead =
    "<th>Sr. No.</th><th>Particulars</th><th>Qty</th>" +
    "<th>Dispatch Form</th><th>No. of Package</th><th>UQR</th>";

  const rowsHtml = lines
    .map((l, i) => {
      const pkgs = l.packages && l.packages.length ? l.packages : [];
      // Each package's USN with its quantity + unit, e.g.
      //   USN-1A/VISCOSE-TWILL-100-VISCOSE-90GSM (12,000 cm)
      const usnLines = pkgs
        .map((p) => {
          const hasQty =
            p.quantity !== "" &&
            p.quantity !== null &&
            p.quantity !== undefined;
          const qty = hasQty
            ? `<span class="uqty">(${esc(fmtNum(p.quantity))} ${esc((p.unit || "").toLowerCase())})</span>`
            : "";
          return `<span class="usnrow"><span class="pmono">${esc(p.usn)}</span>${qty}</span>`;
        })
        .join("");
      return (
        `<tr>` +
        `<td class="c">${i + 1}</td>` +
        `<td>` +
        `<div class="pname">${esc(l.particulars)}</div>` +
        `<div class="psep"></div>` +
        `<div class="pmeta"><span class="plbl">Link UIN:</span><span class="pmono">${esc(l.uin)}</span></div>` +
        (usnLines
          ? `<div class="pmeta"><span class="plbl">Link USN:</span><span class="pusns">${usnLines}</span></div>`
          : "") +
        `</td>` +
        `<td class="r nowrap">${esc(fmtNum(l.received_quantity))}</td>` +
        `<td class="nowrap">${esc(l.received_form)}</td>` +
        `<td class="c">${esc(l.num_packages)}</td>` +
        `<td class="c">${l.uqr ? "YES" : ""}</td>` +
        `</tr>`
      );
    })
    .join("");

  const padHtml = "";

  return `
  <table class="info">
    <colgroup><col style="width:30%" /><col style="width:40%" /><col style="width:30%" /></colgroup>
    <tr>
      <td><span class="k">Date:</span>${esc(fmtDate(doc?.date))}</td>
      <td rowspan="3" style="text-align:center; vertical-align:top;">
        <div class="company" style="padding:2px 4px 4px; font-size:16px;">${esc(CHALLAN_COMPANY.name)}</div>
        <div class="sub" style="padding:2px;">${esc(CHALLAN_COMPANY.subtitle)}</div>
      </td>
      <td><span class="k">CONTACT:</span>${esc(CHALLAN_COMPANY.contact)}</td>
    </tr>
    <tr>
      <td><span class="k">GST:</span>${esc(CHALLAN_COMPANY.gst)}</td>
      <td><span class="k">Challan Type:</span>Inward</td>
    </tr>
    <tr>
      <td><span class="k">Receivable Type:</span>${esc(doc?.receivable_type)}</td>
      <td><span class="k">IPO Type:</span>${esc(doc?.ipo_type)}</td>
    </tr>
  </table>

  <table class="info" style="margin-top:6px; border-top:1px solid #d7dae0;">
    <colgroup><col style="width:50%" /><col style="width:50%" /></colgroup>
    <tr>
      <td><span class="k">IPO</span>${esc(doc?.ipo_code)}</td>
      <td><span class="k">VPO No</span>${esc(doc?.vpo_number)}</td>
    </tr>
    <tr>
      <td><span class="k">Vendor Challan No.</span>${esc(doc?.vendor_challan_no)}</td>
      <td><span class="k">Vendor Invoice No.</span>${esc(doc?.vendor_invoice_no)}</td>
    </tr>
  </table>

  <table class="items" style="margin-top:6px;">
    <colgroup>${itemCols}</colgroup>
    <thead><tr>${itemHead}</tr></thead>
    <tbody>
      ${rowsHtml}
      ${padHtml}
    </tbody>
  </table>

  <table class="foot" style="margin-top:6px; table-layout:fixed;">
    <colgroup><col style="width:48%" /><col style="width:4%" /><col style="width:48%" /></colgroup>
    <tr>
      <td><span class="k">Received By</span>${esc(doc?.received_by_name)}</td>
      <td class="gap"></td>
      <td class="stampbox" rowspan="3">STAMP AND SIGN</td>
    </tr>
    <tr>
      <td><span class="k">User ID</span>${esc(doc?.received_by_userid)}</td>
      <td class="gap"></td>
    </tr>
    <tr>
      <td><span class="k">Post</span>${esc(doc?.received_by_post)}</td>
      <td class="gap"></td>
    </tr>
  </table>`;
};

export const buildReceiptHtml = (doc) => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${esc(doc?.vendor_challan_no || "Goods Receipt Note")}</title>
<style>${CHALLAN_STYLES}${PRINT_STYLES}</style>
</head>
<body>
  <div class="challan-doc">${buildReceiptBody(doc)}</div>
  <div class="no-print" style="margin:18px 0 4px; text-align:center;">
    <button onclick="window.print()" style="padding:10px 28px; font-size:14px; font-weight:600; color:#fff; background:#f94d00; border:0; border-radius:6px; cursor:pointer;">Print</button>
  </div>
  <div class="no-print" style="text-align:center; font-size:11px; color:#6b7280;">
    If the colours are missing in the preview, enable “Background graphics” in the print dialog.
  </div>
</body>
</html>`;

// Open the Goods Receipt Note in a standalone window (user reviews, then prints).
export const printInwardReceipt = (doc) => {
  if (!doc) return;
  const html = buildReceiptHtml(doc);
  const win = window.open("", "_blank", "width=850,height=1100");
  if (!win) {
    alert("Please allow pop-ups to print the receipt.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
};
