// Printable Goods Receipt Note for the Inward Store Sheet.
//
// Shares the exact look & feel of the outward Delivery Challan — it reuses the same
// `.challan-doc` styles (CHALLAN_STYLES) and company header — but only renders the
// fields that exist on the inward form (which has fewer than outward).

import { CHALLAN_COMPANY, CHALLAN_STYLES } from './outwardChallanPrint';

const esc = (v) => {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

const fmtNum = (v) => {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString('en-IN', { maximumFractionDigits: 3 });
};

const fmtMoney = (v) => {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtDate = (v) => {
  if (!v) return '';
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
  } catch {
    return String(v);
  }
};

const PRINT_STYLES = `
html, body { margin: 0; padding: 0; background: #fff; }
body { padding: 18px; }
.challan-doc .items td.mono { font-family: "Consolas", "Courier New", monospace; word-break: break-all; }
.challan-doc .items td.pkg-cell { padding: 0; background: #fbfbfc; }
.challan-doc .pkgs { width: 100%; border-collapse: collapse; table-layout: fixed; }
.challan-doc .pkgs th, .challan-doc .pkgs td { border: 1px solid #d7dae0; padding: 2px 6px; font-size: 10px; text-align: left; }
.challan-doc .pkgs th { background: #f3f4f6; text-transform: uppercase; font-size: 9px; letter-spacing: 0.3px; color: #555; }
.challan-doc .pkgs td.r { text-align: right; }
.challan-doc .pkgs td.c { text-align: center; }
.challan-doc .pkgs td.mono { font-family: "Consolas", "Courier New", monospace; word-break: break-all; }
@media print {
  html, body, *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body { padding: 0; }
  @page { size: A4 landscape; margin: 9mm; }
  .no-print { display: none !important; }
  .challan-doc .items thead { display: table-header-group; }
}
`;

export const buildReceiptBody = (doc) => {
  const lines = doc?.lines || [];
  const challanOnly = !!doc?.is_challan_only;

  // Item columns differ by receivable type: Challan-Only drops Rate & Amount.
  // A UIN column sits right after Particulars (before PO Qty).
  const itemCols = challanOnly
    ? '<col style="width:4%" /><col style="width:18%" /><col style="width:17%" /><col style="width:8%" /><col style="width:9%" /><col style="width:7%" /><col style="width:12%" /><col style="width:10%" /><col style="width:9%" /><col style="width:6%" />'
    : '<col style="width:3%" /><col style="width:15%" /><col style="width:14%" /><col style="width:7%" /><col style="width:8%" /><col style="width:6%" /><col style="width:7%" /><col style="width:8%" /><col style="width:10%" /><col style="width:9%" /><col style="width:7%" /><col style="width:6%" />';

  const itemHead = challanOnly
    ? '<th>Sr. No.</th><th>Particulars</th><th>UIN</th><th>PO Qty</th><th>Received Qty</th><th>Balance</th><th>Remarks</th><th>Received Form</th><th>No. of Packages</th><th>UQR</th>'
    : '<th>Sr. No.</th><th>Particulars</th><th>UIN</th><th>PO Qty</th><th>Received Qty</th><th>Balance</th><th>Rate</th><th>Amount</th><th>Remarks</th><th>Received Form</th><th>No. of Packages</th><th>UQR</th>';

  const colCount = challanOnly ? 10 : 12;

  const rowsHtml = lines
    .map((l, i) => {
      const cells = [
        `<td class="c">${i + 1}</td>`,
        `<td>${esc(l.particulars)}</td>`,
        `<td class="mono">${esc(l.uin)}</td>`,
        `<td class="r">${esc(fmtNum(l.po_quantity))}</td>`,
        `<td class="r">${esc(fmtNum(l.received_quantity))}</td>`,
        `<td class="r">${esc(fmtNum(l.balance))}</td>`,
      ];
      if (!challanOnly) {
        cells.push(`<td class="r">${esc(fmtMoney(l.rate))}</td>`);
        cells.push(`<td class="r">${esc(fmtMoney(l.amount))}</td>`);
      }
      cells.push(`<td>${esc(l.remarks)}</td>`);
      cells.push(`<td>${esc(l.received_form)}</td>`);
      cells.push(`<td class="c">${esc(l.num_packages)}</td>`);
      cells.push(`<td class="c">${l.uqr ? 'YES' : ''}</td>`);

      // Nested 2D sub-table: one row per package (Received Form / Qty / Unit / USN),
      // indented under the Sr. No. column.
      const pkgs = l.packages || [];
      let pkgRowHtml = '';
      if (pkgs.length) {
        const pkgBody = pkgs
          .map(
            (p) => `<tr>
              <td>${esc(p.form)}</td>
              <td class="r">${esc(fmtNum(p.quantity))}</td>
              <td class="c">${esc(p.unit)}</td>
              <td class="mono">${esc(p.usn)}</td>
            </tr>`,
          )
          .join('');
        pkgRowHtml = `<tr class="pkg-row">
          <td></td>
          <td colspan="${colCount - 1}" class="pkg-cell">
            <table class="pkgs">
              <colgroup><col style="width:22%" /><col style="width:14%" /><col style="width:9%" /><col style="width:55%" /></colgroup>
              <thead><tr><th>Received Form</th><th>Quantity</th><th>Unit</th><th>USN</th></tr></thead>
              <tbody>${pkgBody}</tbody>
            </table>
          </td>
        </tr>`;
      }
      return `<tr>${cells.join('')}</tr>${pkgRowHtml}`;
    })
    .join('');

  const padHtml = '';

  return `
  <table class="info divide">
    <colgroup><col style="width:30%" /><col style="width:40%" /><col style="width:30%" /></colgroup>
    <tr>
      <td><span class="k">GST:</span>${esc(CHALLAN_COMPANY.gst)}</td>
      <td rowspan="3" style="text-align:center; vertical-align:middle;">
        <div class="title-cell">GOODS RECEIPT NOTE</div>
        <div class="company" style="padding:4px;">${esc(CHALLAN_COMPANY.name)}</div>
        <div class="sub" style="padding:2px;">${esc(CHALLAN_COMPANY.subtitle)}</div>
      </td>
      <td><span class="k">CONTACT:</span>${esc(CHALLAN_COMPANY.contact)}</td>
    </tr>
    <tr>
      <td><span class="k">Date:</span>${esc(fmtDate(doc?.date))}</td>
      <td><span class="k">IPO Type:</span>${esc(doc?.ipo_type)}</td>
    </tr>
    <tr>
      <td><span class="k">Receivable Type:</span>${esc(doc?.receivable_type)}</td>
      <td></td>
    </tr>
  </table>

  <table class="info" style="margin-top:4px;">
    <colgroup><col style="width:25%" /><col style="width:25%" /><col style="width:25%" /><col style="width:25%" /></colgroup>
    <tr>
      <td><span class="k">IPO</span>${esc(doc?.ipo_code)}</td>
      <td><span class="k">VPO No</span>${esc(doc?.vpo_number)}</td>
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
<title>${esc(doc?.vendor_challan_no || 'Goods Receipt Note')}</title>
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
  const win = window.open('', '_blank', 'width=1150,height=820');
  if (!win) {
    alert('Please allow pop-ups to print the receipt.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
};
