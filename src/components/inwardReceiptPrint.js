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
  const itemCols = challanOnly
    ? '<col style="width:5%" /><col style="width:24%" /><col style="width:10%" /><col style="width:11%" /><col style="width:9%" /><col style="width:15%" /><col style="width:12%" /><col style="width:8%" /><col style="width:6%" />'
    : '<col style="width:4%" /><col style="width:19%" /><col style="width:8%" /><col style="width:9%" /><col style="width:7%" /><col style="width:8%" /><col style="width:9%" /><col style="width:12%" /><col style="width:10%" /><col style="width:8%" /><col style="width:6%" />';

  const itemHead = challanOnly
    ? '<th>Sr. No.</th><th>Particulars</th><th>PO Qty</th><th>Received Qty</th><th>Balance</th><th>Remarks</th><th>Received Form</th><th>No. of Packages</th><th>UQR</th>'
    : '<th>Sr. No.</th><th>Particulars</th><th>PO Qty</th><th>Received Qty</th><th>Balance</th><th>Rate</th><th>Amount</th><th>Remarks</th><th>Received Form</th><th>No. of Packages</th><th>UQR</th>';

  const colCount = challanOnly ? 9 : 11;

  const rowsHtml = lines
    .map((l, i) => {
      const cells = [
        `<td class="c">${i + 1}</td>`,
        `<td>${esc(l.particulars)}</td>`,
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
      return `<tr>${cells.join('')}</tr>`;
    })
    .join('');

  const padRows = Math.max(0, 8 - lines.length);
  const emptyTds = `<td>&nbsp;</td>${'<td></td>'.repeat(colCount - 1)}`;
  const padHtml = Array.from({ length: padRows })
    .map(() => `<tr>${emptyTds}</tr>`)
    .join('');

  return `
  <table class="info divide">
    <colgroup><col style="width:34%" /><col style="width:32%" /><col style="width:34%" /></colgroup>
    <tr>
      <td><span class="k">GST:</span>${esc(CHALLAN_COMPANY.gst)}</td>
      <td class="title-cell">GOODS RECEIPT NOTE</td>
      <td><span class="k">CONTACT:</span>${esc(CHALLAN_COMPANY.contact)}</td>
    </tr>
    <tr><td colspan="3" class="company" style="padding-top:2px;">${esc(CHALLAN_COMPANY.name)}</td></tr>
    <tr><td colspan="3" class="sub">${esc(CHALLAN_COMPANY.subtitle)}</td></tr>
  </table>

  <table class="info" style="margin-top:2px;">
    <colgroup><col style="width:25%" /><col style="width:25%" /><col style="width:25%" /><col style="width:25%" /></colgroup>
    <tr>
      <td><span class="k">Date</span>${esc(fmtDate(doc?.date))}</td>
      <td><span class="k">Receivable Type</span>${esc(doc?.receivable_type)}</td>
      <td><span class="k">IPO Type</span>${esc(doc?.ipo_type)}</td>
      <td><span class="k">IPO</span>${esc(doc?.ipo_code)}</td>
    </tr>
    <tr>
      <td><span class="k">IPC / Factory Code</span>${esc(doc?.ipc_code)}</td>
      <td><span class="k">VPO No</span>${esc(doc?.vpo_number)}</td>
      <td><span class="k">Vendor Challan No.</span>${esc(doc?.vendor_challan_no)}</td>
      <td><span class="k">Vendor Invoice No.</span>${esc(doc?.vendor_invoice_no)}</td>
    </tr>
    <tr>
      <td colspan="4"><span class="k">Goods Receiving Condition</span>${esc(doc?.goods_condition)}</td>
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
