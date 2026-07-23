// Printable Delivery Challan for the Outward Store Sheet.
//
// Mirrors the pattern used by the VPO Purchase Order (see purchase/vpo/vpoPrint.js):
// printOutwardChallan() opens a standalone window with self-contained, print-clean
// markup so the printout never inherits the dashboard's Tailwind/oklch styles.
// All CSS is scoped under `.challan-doc`.

// Company header — fixed for Creative Home Decor LLP.
export const CHALLAN_COMPANY = {
  name: 'CREATIVE HOME DECOR LLP',
  subtitle: 'VPO BRAHMAN MAJRA, PANIPAT-132105',
  gst: '06AAUFC6113C1ZO',
  contact: '',
};

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

/* ------------------------------------------------------------------ *
 * Styles — brand orange + grey. Every rule scoped under `.challan-doc`.
 * `print-color-adjust: exact` so Chrome/Edge actually paint the orange
 * label cells even with "Background graphics" off.
 * ------------------------------------------------------------------ */
export const CHALLAN_STYLES = `
.challan-doc {
  --brand: #f94d00; --line: #d7dae0; --line-strong: #aab0b8; --ink: #1f2937; --muted: #6b7280;
  font-family: "Segoe UI", Inter, Arial, Helvetica, sans-serif;
  color: var(--ink); font-size: 12.5px; line-height: 1.4; background: #fff;
  border: 1.5px solid var(--line-strong);
}
.challan-doc, .challan-doc *, .challan-doc *::before, .challan-doc *::after {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  color-adjust: exact !important;
  print-color-adjust: exact !important;
}
.challan-doc table { border-collapse: collapse; width: 100%; }
.challan-doc td, .challan-doc th {
  border: 1px solid var(--line); padding: 6px 10px; vertical-align: middle; text-align: left;
}
.challan-doc .c { text-align: center; }
.challan-doc .r { text-align: right; }
.challan-doc .b { font-weight: 700; }
.challan-doc .i { font-style: italic; color: var(--muted); }
.challan-doc .title-cell {
  text-align: center; font-weight: 800; font-size: 15px; letter-spacing: 5px; vertical-align: middle;
}
.challan-doc .company { text-align: center; font-size: 22px; font-weight: 800; letter-spacing: 1px; padding: 9px; }
.challan-doc .sub { text-align: center; font-size: 11.5px; font-weight: 600; padding: 5px; color: var(--muted); letter-spacing: 0.5px; }

/* Info blocks above the table (letterhead + meta): plain bold labels, NO orange,
   NO internal lines at all. Fixed layout keeps the label columns aligned. */
.challan-doc .info { table-layout: fixed; }
.challan-doc .info td { border: 0; padding: 5px 12px; vertical-align: top; }
.challan-doc .k { font-weight: 700; color: #374151; font-size: 11.5px; letter-spacing: 0.3px; margin-right: 9px; }
.challan-doc .divide td { border-bottom: 1px solid var(--line); }

/* Items table — keeps its grid + orange header. */
.challan-doc .items { table-layout: fixed; }
.challan-doc .items th {
  background: var(--brand); color: #fff; text-align: center; font-weight: 700;
  font-size: 11.5px; letter-spacing: 0.3px; vertical-align: middle; padding: 8px 6px;
}
.challan-doc .items td { height: 24px; word-break: break-word; }

/* Footer — the 6 given-by/to fields are borderless (like the info block above);
   only the stamp/sign area keeps an outline. */
.challan-doc .foot { break-inside: avoid; }
.challan-doc .foot td { border: 0; padding: 6px 12px; vertical-align: middle; }
.challan-doc .gap { border: 0 !important; }
.challan-doc .stampbox {
  border: 1px solid var(--line) !important; vertical-align: bottom; text-align: center;
  font-weight: 600; letter-spacing: 0.5px; color: #b4b8c0; font-size: 11px;
  height: 112px; padding-bottom: 6px;
}
`;

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

/* ------------------------------------------------------------------ *
 * Document body (no <html>/<head>) — used by the print window.
 * ------------------------------------------------------------------ */
export const buildChallanBody = (doc) => {
  const lines = doc?.lines || [];

  const rowsHtml = lines
    .map((l, i) => {
      const linkUsn = (l.link_usn || []).filter(Boolean).map(esc).join('<br/>');
      const usnQty = (l.usn_qty || [])
        .filter((v) => v !== '' && v !== null && v !== undefined)
        .map((v) => esc(fmtNum(v)))
        .join('<br/>');
      return `
        <tr>
          <td class="c">${i + 1}</td>
          <td>${esc(l.particulars)}</td>
          <td class="r">${esc(fmtNum(l.qty))}</td>
          <td class="c">${esc(l.unit)}</td>
          <td>${linkUsn}</td>
          <td class="r">${usnQty}</td>
          <td>${esc(l.dispatch_form)}</td>
          <td class="c">${esc(l.num_packages)}</td>
          <td class="c">${l.uqr ? 'YES' : ''}</td>
        </tr>`;
    })
    .join('');

  // Keep a modest, filled look but stay on one page for short lists.
  const padRows = Math.max(0, 8 - lines.length);
  const padHtml = Array.from({ length: padRows })
    .map(
      () =>
        '<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
    )
    .join('');

  return `
  <table class="info divide">
    <colgroup><col style="width:34%" /><col style="width:32%" /><col style="width:34%" /></colgroup>
    <tr>
      <td><span class="k">GST:</span>${esc(doc?.gst)}</td>
      <td class="title-cell">DELIVERY CHALLAN</td>
      <td><span class="k">CONTACT:</span>${esc(doc?.company_contact)}</td>
    </tr>
    <tr><td colspan="3" class="company" style="padding-top:2px;">${esc(CHALLAN_COMPANY.name)}</td></tr>
    <tr><td colspan="3" class="sub">${esc(CHALLAN_COMPANY.subtitle)}</td></tr>
  </table>

  <table class="info" style="margin-top:2px;">
    <colgroup><col style="width:25%" /><col style="width:25%" /><col style="width:25%" /><col style="width:25%" /></colgroup>
    <tr>
      <td><span class="k">Date</span>${esc(fmtDate(doc?.date))}</td>
      <td><span class="k">Challan No.</span>${esc(doc?.challan_no)}</td>
      <td><span class="k">Dispatch Type</span><span class="i">${esc(doc?.dispatch_type)}</span></td>
      <td><span class="k">IPO Type</span>${esc(doc?.ipo_type)}</td>
    </tr>
    <tr>
      <td><span class="k">IPO</span>${esc(doc?.ipo_code)}</td>
      <td><span class="k">Department</span>${esc(doc?.department)}</td>
      <td><span class="k">Section</span>${esc(doc?.section)}</td>
      <td><span class="k">Dispatch / Issued To</span>${esc(doc?.issued_to)}</td>
    </tr>
    <tr>
      <td colspan="2"><span class="k">Address</span>${esc(doc?.address)}</td>
      <td><span class="k">Contact Person</span>${esc(doc?.contact_person)}</td>
      <td><span class="k">Contact Number</span>${esc(doc?.contact_number)}</td>
    </tr>
    <tr>
      <td colspan="4"><span class="k">Vehicle No.</span>${esc(doc?.vehicle_no)}</td>
    </tr>
  </table>

  <table class="items" style="margin-top:6px;">
    <colgroup>
      <col style="width:5%" /><col style="width:23%" /><col style="width:9%" />
      <col style="width:7%" /><col style="width:13%" /><col style="width:10%" />
      <col style="width:13%" /><col style="width:12%" /><col style="width:8%" />
    </colgroup>
    <thead>
      <tr>
        <th>Sr. No.</th>
        <th>Particulars</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Link USN</th>
        <th>USN Qty</th>
        <th>Dispatch Form</th>
        <th>No. of Packages</th>
        <th>UQR</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
      ${padHtml}
    </tbody>
  </table>

  <table class="foot" style="margin-top:6px; table-layout:fixed;">
    <colgroup>
      <col style="width:35%" /><col style="width:33%" />
      <col style="width:4%" /><col style="width:28%" />
    </colgroup>
    <tr>
      <td><span class="k">Given By</span>${esc(doc?.given_by_name)}</td>
      <td><span class="k">Given To</span>${esc(doc?.given_to_name)}</td>
      <td class="gap"></td>
      <td class="stampbox" rowspan="3">STAMP AND SIGN</td>
    </tr>
    <tr>
      <td><span class="k">User ID</span>${esc(doc?.given_by_userid)}</td>
      <td><span class="k">Name</span>${esc(doc?.given_to_person)}</td>
      <td class="gap"></td>
    </tr>
    <tr>
      <td><span class="k">Post</span>${esc(doc?.given_by_post)}</td>
      <td><span class="k">Post</span>${esc(doc?.given_to_post)}</td>
      <td class="gap"></td>
    </tr>
  </table>`;
};

// Full standalone document for the print window.
export const buildChallanHtml = (doc) => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${esc(doc?.challan_no || 'Delivery Challan')}</title>
<style>${CHALLAN_STYLES}${PRINT_STYLES}</style>
</head>
<body>
  <div class="challan-doc">${buildChallanBody(doc)}</div>
  <div class="no-print" style="margin:18px 0 4px; text-align:center;">
    <button onclick="window.print()" style="padding:10px 28px; font-size:14px; font-weight:600; color:#fff; background:#f94d00; border:0; border-radius:6px; cursor:pointer;">Print</button>
  </div>
  <div class="no-print" style="text-align:center; font-size:11px; color:#6b7280;">
    If the colours are missing in the preview, enable “Background graphics” in the print dialog.
  </div>
</body>
</html>`;

// Open the Delivery Challan in a standalone window. Like the VPO print, we do NOT
// auto-fire window.print(): the user reviews the coloured document, then hits Print.
export const printOutwardChallan = (doc) => {
  if (!doc) return;
  const html = buildChallanHtml(doc);
  const win = window.open('', '_blank', 'width=1150,height=820');
  if (!win) {
    alert('Please allow pop-ups to print the challan.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
};
