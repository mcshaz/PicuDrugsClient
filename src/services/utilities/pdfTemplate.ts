import { shortFormatter } from './dateHelpers';
import jsPDF from 'jspdf';
import { BaseConfig } from 'jspdf-autotable';

export function pdfTemplate(doc: jsPDF): BaseConfig {
  return {
    margin: { top: 30 },
    didDrawPage: (data) => {
      // Header
      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.setFontStyle('normal');

      doc.text('Report', (data.settings as any).margin.left, 18);

      // Footer
      doc.setFontSize(10);
      const bottom = doc.internal.pageSize.getHeight() - 10;
      const right = doc.internal.pageSize.getWidth() - (data.settings as any).margin.right;
      doc.text(`Page ${data.pageNumber} of ${data.pageCount}`, right, bottom, { align: 'right' });
      const now = new Date();
      doc.text(`Printed ${shortFormatter.format(now)} ${now.toLocaleTimeString()}`, (data.settings as any).margin.left, bottom);
    },
  };
}

export function createLabelHead(doc: jsPDF) {
  // Don't forget, that there are CORS-Restrictions. So if you want to run it without a Server in your Browser you need to transform the image to a dataURL
// Use http://dataurl.net/#dataurlmaker
// var doc = new jsPDF('p', 'mm', 'a4');

  // left label
  const lLabelL = 18;
  const lLabelR = 117;
  const lineSpace = 7;
  const beginY = 28;
  doc.rect(15, 20, 105, 28);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Name:', lLabelL, beginY);
  doc.text('NHI:', lLabelL, beginY + lineSpace);
  doc.text('DOB:', lLabelL, beginY + 2 * lineSpace);

  const rtAlign = { align: 'right' };
  doc.setFont('Helvetica', 'bold');
  const pointsPMm = 2.8125;
  let text = '1 y 1 m';
  let w = doc.getStringUnitWidth(text) * (doc as any).getFontSize() / pointsPMm;
  doc.text(text, lLabelR, beginY + lineSpace, rtAlign);
  doc.setFont('Helvetica', 'normal');
  doc.text('Age:', lLabelR - w, beginY + lineSpace, rtAlign);

  doc.setFontSize(10);
  doc.setFont('Helvetica', 'italic');
  doc.text('Male', lLabelR, beginY, rtAlign);
  doc.text('Attach patient sticker here', lLabelR, beginY + 2 * lineSpace, rtAlign);

  // right label
  doc.setFont('Helvetica', 'normal');
  doc.rect(127, 20, 70, 28);
  doc.setFontSize(9);
  text = 'signature: ';
  w = doc.getStringUnitWidth(text) * (doc as any).getFontSize() / pointsPMm;
  doc.text(text, 130, beginY + lineSpace);
  (doc as any).setLineDash([0.2, 0.6], 0);
  doc.line(130 + w, beginY + lineSpace, 165, beginY + lineSpace);
}
