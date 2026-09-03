const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { Report, Valuation, Vehicle, User, Company } = require('../models');

const generateReportId = async () => {
  const year = new Date().getFullYear();
  const count = await Report.count();
  return `VVS-${year}-${String(count + 1).padStart(4, '0')}`;
};

const formatDate = (v) => (!v ? 'N/A' : new Date(v).toLocaleDateString('en-GB'));
const formatDateTime = (v) => (!v ? 'N/A' : new Date(v).toLocaleString('en-GB'));
const formatCurrency = (v) => {
  const n = Number.parseFloat(v || 0);
  return `LKR ${Number.isNaN(n) ? '0.00' : n.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const safe = (v) => (v == null || v === '' ? 'N/A' : String(v));

const normalizeImages = (images) => {
  const labels = ['Front View', 'Rear View', 'Inner Side', 'Chassis No.', 'Additional'];
  if (!images) return [];
  if (typeof images === 'string') {
    try { images = JSON.parse(images); } catch (_) {
      return images.split(',').map((u, i) => ({ label: labels[i] || `Image ${i + 1}`, url: u.trim() })).filter(x => x.url);
    }
  }
  if (Array.isArray(images)) {
    return images.filter(Boolean).map((u, i) => ({ label: labels[i] || `Image ${i + 1}`, url: u }));
  }
  if (typeof images === 'object') {
    const map = [
      { label: 'Front View',  url: images.frontView },
      { label: 'Rear View',   url: images.rearView },
      { label: 'Inner Side',  url: images.innerSide },
      { label: 'Chassis No.', url: images.chasiNumber || images.chassisNumber },
      { label: 'Additional',  url: images.additionalImage },
    ];
    return map.filter(x => x.url);
  }
  return [];
};

const BACKEND_ROOT = path.resolve(__dirname, '..');

const resolveLocalPath = (imgPath) => {
  if (!imgPath || typeof imgPath !== 'string') return null;
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return null;
  // Strip leading slashes and build absolute path from backend root
  const relative = imgPath.replace(/^[/\\]+/, '');
  const abs = path.join(BACKEND_ROOT, relative);
  if (fs.existsSync(abs)) return abs;
  // fallback: try treating imgPath as already absolute
  if (path.isAbsolute(imgPath) && fs.existsSync(imgPath)) return imgPath;
  return null;
};

// Draw a compact 2-column row in a table. Returns the Y after the row.
const drawRow = (doc, y, rowH, bg, row, colDefs) => {
  doc.rect(colDefs[0].x, y, colDefs[colDefs.length - 1].x + colDefs[colDefs.length - 1].w - colDefs[0].x, rowH).fillColor(bg).fill();
  // dividers
  doc.moveTo(colDefs[1].x, y).lineTo(colDefs[1].x, y + rowH).strokeColor('#d1d5db').lineWidth(0.5).stroke();
  doc.moveTo(colDefs[2].x, y).lineTo(colDefs[2].x, y + rowH).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
  doc.moveTo(colDefs[3].x, y).lineTo(colDefs[3].x, y + rowH).strokeColor('#d1d5db').lineWidth(0.5).stroke();

  colDefs.forEach((col, ci) => {
    const cell = row[ci];
    if (!cell) return;
    const isBold = ci % 2 === 0;
    doc.fill(isBold ? '#374151' : '#111827')
      .font(isBold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(isBold ? 7.5 : 8.5)
      .text(isBold ? cell.toUpperCase() : safe(cell), col.x + 4, y + (rowH - (isBold ? 7.5 : 8.5)) / 2 - 1, { width: col.w - 6, lineBreak: false });
  });

  // bottom border
  doc.moveTo(colDefs[0].x, y + rowH).lineTo(colDefs[colDefs.length - 1].x + colDefs[colDefs.length - 1].w, y + rowH).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
  return y + rowH;
};

const generateReport = async (valuationId, adminId) => {
  const valuation = await Valuation.findByPk(valuationId, {
    include: [
      { model: Vehicle, as: 'vehicle', include: [{ model: User, as: 'owner', include: [{ model: Company, as: 'company' }] }] },
      { model: User, as: 'submittedBy', include: [{ model: Company, as: 'company' }] },
      { model: User, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'branch'] },
      { model: User, as: 'approvedByAdmin', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });
  if (!valuation) throw new Error('Valuation not found');

  const reportId = await generateReportId();
  const reportsDir = path.join(__dirname, '../uploads/reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  const fileName = `${reportId}.pdf`;
  const filePath = path.join(reportsDir, fileName);
  const headerImagePath = path.join(__dirname, '../../frontend/src/assets/Report-Header.png');
  const vehicleImages = normalizeImages(valuation.vehicle?.images);
  const headerExists = fs.existsSync(headerImagePath);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: 'A4', autoFirstPage: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const P = 40;          // page left/right padding
    const W = 515;         // content width (595 - 2*40)
    const C = '#990000';   // crimson
    const DARK = '#0f172a';

    const vehicle = valuation.vehicle || {};
    const user    = valuation.submittedBy || {};
    const manager = valuation.manager || {};
    const admin   = valuation.approvedByAdmin || {};

    let y = 25;

    // ─── 1. HEADER ───────────────────────────────────────────────────
    if (headerExists) {
      doc.image(fs.readFileSync(headerImagePath), P, y, { width: W });
      y += 78;
    } else {
      doc.rect(P, y, W, 60).fill(C);
      doc.fill('#fff').font('Helvetica-Bold').fontSize(16).text('VEHICLE VALUATION SYSTEM', P + 12, y + 14, { width: W });
      doc.fill('#fff').font('Helvetica').fontSize(8.5).text('Official Valuation & Physical Inspection Certificate', P + 12, y + 36);
      y += 68;
    }

    // ─── 2. TITLE BAR ────────────────────────────────────────────────
    doc.rect(P, y, W, 22).fill(DARK);
    doc.fill('#fff').font('Helvetica-Bold').fontSize(10.5)
      .text('VEHICLE VALUATION CERTIFICATE & ASSESSMENT REPORT', P, y + 6, { width: W, align: 'center' });
    y += 26;

    // ─── 3. META ROW ─────────────────────────────────────────────────
    const metaH = 30;
    doc.roundedRect(P, y, W, metaH, 2).fillAndStroke('#f1f5f9', '#cbd5e1');
    const metaItems = [
      ['REPORT ID', reportId],
      ['GENERATED', formatDateTime(new Date())],
      ['STATUS', valuation.status],
      ['COMPANY', safe(user.company?.name)],
    ];
    const mColW = W / metaItems.length;
    metaItems.forEach(([label, val], i) => {
      const mx = P + i * mColW + 6;
      doc.fill('#64748b').font('Helvetica-Bold').fontSize(7).text(label, mx, y + 5, { width: mColW - 8, lineBreak: false });
      doc.fill(i === 2 ? C : DARK).font('Helvetica').fontSize(8).text(val, mx, y + 15, { width: mColW - 8, lineBreak: false });
    });
    y += metaH + 6;

    // ─── 4. VALUATION BANNER ─────────────────────────────────────────
    doc.roundedRect(P, y, W, 42, 3).fill(C);
    doc.fill('#fff').font('Helvetica-Bold').fontSize(8.5).text('ESTIMATED MARKET VALUATION', P + 10, y + 7, { width: W / 2 });
    doc.fill('#fff').font('Helvetica-Bold').fontSize(19).text(formatCurrency(valuation.valuationPrice), P + 10, y + 18);
    const fee = valuation.revenueFee || user.company?.valuationFee || 0;
    doc.fill('#fde8e8').font('Helvetica').fontSize(8.5)
      .text(`Revenue Fee: ${formatCurrency(fee)}`, P + 10, y + 26, { width: W - 20, align: 'right' });
    y += 48;

    // ─── 5. TABLES ───────────────────────────────────────────────────
    // Column definitions for the 2-column key-value table (L-key, L-val, R-key, R-val)
    const rh = 20; // row height
    const colDefs = [
      { x: P,       w: 100 },  // left label
      { x: P + 100, w: 155 },  // left value
      { x: P + 260, w: 100 },  // right label
      { x: P + 360, w: 155 },  // right value
    ];

    const drawSection = (title, rows) => {
      // Section header
      doc.rect(P, y, W, 18).fill(C);
      doc.fill('#fff').font('Helvetica-Bold').fontSize(8.5).text(title, P + 8, y + 5, { width: W - 16 });
      y += 18;
      // outer border box around all rows
      const tableH = rows.length * rh;
      doc.rect(P, y, W, tableH).strokeColor('#cbd5e1').lineWidth(0.5).stroke();
      rows.forEach((row, ri) => {
        const bg = ri % 2 === 0 ? '#f9fafb' : '#ffffff';
        y = drawRow(doc, y, rh, bg, row, colDefs);
      });
      y += 6; // small gap after section
    };

    // Vehicle Particulars
    drawSection('Vehicle Particulars & Technical Specifications', [
      ['Reg. Number',     vehicle.registrationNo,     'Asset Type',      vehicle.assetType],
      ['Make',            vehicle.make,               'Model',           vehicle.model],
      ['Year of Mfg',     vehicle.yearOfManufacture,  'Fuel Type',       vehicle.fuelType],
      ['Engine Capacity', vehicle.engineCC ? `${vehicle.engineCC} CC` : null, 'Engine No.', vehicle.engineNo],
      ['Chassis No.',     vehicle.chassisNo,          'Inspection Date', formatDate(vehicle.inspectionDate)],
    ]);

    // Inspection & Authorization
    const managerName = manager.firstName ? `${manager.firstName} ${manager.lastName}` : null;
    const adminName   = admin.firstName   ? `${admin.firstName} ${admin.lastName}`     : (valuation.status === 'ADMIN_APPROVED' ? 'Authorized Manager' : null);
    drawSection('Inspection & Authorization Details', [
      ['Inspection Place', vehicle.inspectionPlace,                            'Insurance Co.',   user.company?.name],
      ['Submitted By',     `${user.firstName || ''} ${user.lastName || ''}`.trim(), 'Contact',    user.phone || user.email],
      ['Manager Inspector', managerName,                                       'Branch',          manager.branch],
      ['Approved By',      adminName,                                          'Approval Date',   formatDateTime(valuation.adminApprovedAt || valuation.updatedAt)],
    ]);

    // ── PAGE 1 FOOTER ────────────────────────────────────────────────
    const footer1Y = doc.page.height - 32;
    doc.moveTo(P, footer1Y - 4).lineTo(P + W, footer1Y - 4).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
    doc.fill('#94a3b8').font('Helvetica').fontSize(7).text(
      `Report ID: ${reportId}  |  Vehicle Valuation & Analytics Management System  |  Valid for 30 days  |  Page 1 of 2`,
      P, footer1Y, { width: W, align: 'center', lineBreak: false }
    );

    // ══════════════════ PAGE 2 ══════════════════════════════════════
    doc.addPage();
    y = 25;

    // Page 2 mini-header strip
    doc.rect(P, y, W, 18).fill(DARK);
    doc.fill('#fff').font('Helvetica-Bold').fontSize(8.5)
      .text(`VALUATION REPORT  —  ${reportId}`, P + 8, y + 5, { width: W / 2 });
    doc.fill('#fde8e8').font('Helvetica').fontSize(8).text(
      `Reg: ${safe(vehicle.registrationNo)}  |  ${safe(vehicle.make)} ${safe(vehicle.model)}`,
      P + 8, y + 5, { width: W - 16, align: 'right' }
    );
    y += 24;

    // ─── 6. REMARKS ──────────────────────────────────────────────────
    doc.rect(P, y, W, 18).fill(C);
    doc.fill('#fff').font('Helvetica-Bold').fontSize(8.5).text('INSPECTION REMARKS & VALUATION NOTES', P + 8, y + 5);
    y += 18;
    const noteText = valuation.managerNotes || valuation.adminNotes || 'Vehicle physically inspected and verified according to standard valuation criteria.';
    const noteH = 44;
    doc.rect(P, y, W, noteH).fillAndStroke('#f9fafb', '#e2e8f0');
    doc.fill(DARK).font('Helvetica-Oblique').fontSize(8.5).text(noteText, P + 8, y + 8, { width: W - 16, height: noteH - 14, lineBreak: true });
    y += noteH + 10;

    // ─── 7. VEHICLE IMAGES ───────────────────────────────────────────
    if (vehicleImages.length > 0) {
      const imgW = 160;
      const imgH = 118;
      const imgGapX = 7;
      const imgGapY = 10;
      const imagesPerRow = 3;
      const imagesTotal = vehicleImages.slice(0, 6);
      const totalImgRows = Math.ceil(imagesTotal.length / imagesPerRow);

      // Images section header
      doc.rect(P, y, W, 18).fill(DARK);
      doc.fill('#fff').font('Helvetica-Bold').fontSize(8.5)
        .text(`VEHICLE INSPECTION PHOTOGRAPHS (${imagesTotal.length})`, P + 8, y + 5);
      y += 22;

      imagesTotal.forEach((imgObj, idx) => {
        const col = idx % imagesPerRow;
        const row = Math.floor(idx / imagesPerRow);
        const x = P + col * (imgW + imgGapX);
        const iy = y + row * (imgH + imgGapY);

        doc.roundedRect(x, iy, imgW, imgH, 2).fillAndStroke('#f9fafb', '#e2e8f0');
        // caption strip
        doc.rect(x, iy, imgW, 16).fill('#e2e8f0');
        doc.fill(DARK).font('Helvetica-Bold').fontSize(7.5).text(imgObj.label.toUpperCase(), x + 4, iy + 4, { width: imgW - 8, align: 'center' });

        const localPath = resolveLocalPath(imgObj.url);
        if (localPath) {
          try {
            const imgBuffer = fs.readFileSync(localPath);
            doc.image(imgBuffer, x + 4, iy + 20, { fit: [imgW - 8, imgH - 24], align: 'center', valign: 'center' });
          } catch (imgErr) {
            console.error(`[PDF] Image embed error for ${localPath}:`, imgErr.message);
            doc.fill('#94a3b8').font('Helvetica').fontSize(7.5).text('Image Error', x, iy + imgH / 2 - 5, { width: imgW, align: 'center' });
          }
        } else {
          console.warn(`[PDF] Image not found on disk: ${imgObj.url}`);
          doc.fill('#94a3b8').font('Helvetica').fontSize(7.5).text('Not Available', x, iy + imgH / 2 - 5, { width: imgW, align: 'center' });
        }
      });

      y += totalImgRows * (imgH + imgGapY) + 10;
    }

    // ─── 8. SIGNATURE BOX ────────────────────────────────────────────
    const sigH = 65;
    doc.roundedRect(P, y, W, sigH, 2).fillAndStroke('#f9fafb', '#e2e8f0');
    // Title bar inside signature box
    doc.rect(P, y, W, 16).fill('#e2e8f0');
    doc.fill(DARK).font('Helvetica-Bold').fontSize(8).text('AUTHORIZATION & SIGNATURE', P + 8, y + 4, { width: W - 16 });
    const halfW = W / 2 - 20;
    // Left sig line
    const lx = P + 15;
    doc.moveTo(lx, y + 45).lineTo(lx + halfW, y + 45).strokeColor('#9ca3af').lineWidth(0.8).stroke();
    doc.fill(DARK).font('Helvetica-Bold').fontSize(8).text('INSPECTING MANAGER / VALUER', lx, y + 48, { width: halfW });
    doc.fill('#6b7280').font('Helvetica').fontSize(7.5).text(`${managerName || 'N/A'}  —  ${safe(manager.branch)}`, lx, y + 57, { width: halfW });
    // Right sig line
    const rx = P + W / 2 + 10;
    doc.moveTo(rx, y + 45).lineTo(rx + halfW, y + 45).strokeColor('#9ca3af').lineWidth(0.8).stroke();
    doc.fill(DARK).font('Helvetica-Bold').fontSize(8).text('AUTHORIZED SIGNATORY', rx, y + 48, { width: halfW });
    doc.fill('#6b7280').font('Helvetica').fontSize(7.5).text(adminName || 'Verified & Approved System Copy', rx, y + 57, { width: halfW });
    y += sigH + 8;

    // ── PAGE 2 FOOTER ────────────────────────────────────────────────
    const footer2Y = doc.page.height - 32;
    doc.moveTo(P, footer2Y - 4).lineTo(P + W, footer2Y - 4).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
    doc.fill('#94a3b8').font('Helvetica').fontSize(7).text(
      `Report ID: ${reportId}  |  Vehicle Valuation & Analytics Management System  |  Valid for 30 days from date of issue  |  Page 2 of 2`,
      P, footer2Y, { width: W, align: 'center', lineBreak: false }
    );

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  // Upsert report record
  let report = await Report.findOne({ where: { valuationId } });
  if (report) {
    await report.update({ filePath: `/uploads/reports/${fileName}`, generatedDate: new Date(), totalRevenue: valuation.valuationPrice });
  } else {
    report = await Report.create({ reportId, valuationId, adminId, filePath: `/uploads/reports/${fileName}`, generatedDate: new Date(), totalRevenue: valuation.valuationPrice });
  }
  return report;
};

module.exports = { generateReport };
