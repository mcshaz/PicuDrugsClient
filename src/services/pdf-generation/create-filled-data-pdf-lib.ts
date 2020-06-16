import { PDFDocument, rgb, StandardFonts, radians } from 'pdf-lib';
import { PdfTableValues } from './pdf-table-values-pdf-lib';
import { WeanDay } from '@/services/pharmacokinetics/WeanDay';
import { shortFormatter } from '@/services/utilities/dateHelpers';
import { weightRounding } from '@/services/infusion-calculations/Utilities/rounding';
import download from 'downloadjs';

interface IChartPatientDetails {
    dob: Date | null;
    lastN: string;
    firstN: string;
    isMale: boolean | null;
    nhi: string;
    weight: number;
    prescriber: string;
    medicine: string;
    doseUnits: string;
    route: string;
    regime: WeanDay[];
}

export async function createAndDownloadPDF(details: IChartPatientDetails) {
  const pdfDoc = await createPDF(details, '/pdf/WeaningProtocol.pdf');
  const pdfBytes = await pdfDoc.save();
  const dt = new Date();
  dt.setMinutes(dt.getTimezoneOffset());
  download(pdfBytes, `withdrawal-chart-${details.nhi}-${dt.toISOString().slice(0, 10)}.pdf`, 'application/pdf');
}

export async function createPDF(details: IChartPatientDetails, url: string) {
  const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes, { updateMetadata: true });
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  await createFilledPdfStream(details, pdfDoc, helveticaFont.widthOfTextAtSize.bind(helveticaFont));
  return pdfDoc;
}

async function createFilledPdfStream(details: IChartPatientDetails, doc: PDFDocument, widthOfTextAtSize: (txt: string, size: number) => number) {
  if (!details.regime.length) {
    return;
  }
  const cols = 9;
  const gridsRows = 3;
  const pagesRequired = Math.ceil(details.regime.length / (cols * gridsRows));
  while (pagesRequired > doc.getPageCount()) {
    const [firstPage] = await doc.copyPages(doc, [0]);
    doc.addPage(firstPage);
  }
  let size = 11;
  const rotate = radians(Math.PI);
  const getWidth = (txt: string) => widthOfTextAtSize(txt, size);
  for (let p = 0; p < pagesRequired; ++p) {
    // Object { x: 0, y: 0, width: 595.22, height: 842 }
    // vs 825 1168 on gimp
    const pg = doc.getPage(p);

    pg.drawText(details.lastN, { x: 532, y: 42, size, rotate }); // Family Name
    pg.drawText(details.firstN, { x: 532, y: 53, size, rotate }); // Given Name
    if (typeof details.isMale === 'boolean') {
      pg.drawText(details.isMale ? 'Male' : 'Female', { x: 428, y: 53, size, rotate }); // Given Name
    }
    if (details.dob) {
      pg.drawText(shortFormatter.format(details.dob), { x: 531, y: 75, size, rotate });
    }
    pg.drawText(details.nhi, { x: 446, y: 75, size, rotate });
    // leave out page number incase different meds printed out
    // + PdfTableValues.simpleBT(i.toString(), [756, 125], { getWidth })
    const wtText = weightRounding(details.weight) + ' kg';
    pg.drawText(wtText, { x: 48 + getWidth(wtText) / 2, y: 60, size, rotate });
    pg.drawText(details.prescriber, { x: 500 + getWidth(details.prescriber) / 2, y: 759, size, rotate });
  }
  size -= 2;
  const cellTVs = new PdfTableValues(doc, [498, 129], [55.5, 205], [cols, gridsRows], 10.6);
  cellTVs.setCoords([...details.regime.keys(), details.regime.length].slice(1).map(String),
    { getWidth, size, rotate });
  cellTVs.setCoords(details.regime.map(r => r.weanDateString),
    { getWidth, rowNo: 1, size, rotate });
  cellTVs.setCoords(details.regime.map(r => r.regularDose + details.doseUnits),
    { getWidth, rowNo: 2, size, rotate });
  cellTVs.setCoords(details.regime.map(r => r.frequency),
    { getWidth, rowNo: 3, size, rotate });
  cellTVs.startCoord[1] = 266;
  cellTVs.setCoords(details.regime.map(r => r.rescueDose + details.doseUnits),
    { getWidth, size, color: toRGB('e9262c'), rotate });
  cellTVs.gridsPerPage[0] = 1;
  cellTVs.startCoord = [537, 117];
  cellTVs.offsetCoord[0] = 0;
  ++size;
  const medArray = new Array<string>(Math.ceil(details.regime.length / cols));
  // by not providing getwidth, we provide the default (0) which should left align
  cellTVs.setCoords(medArray.fill(details.medicine), { size, rotate });
  cellTVs.startCoord[0] = 362;
  cellTVs.setCoords(medArray.fill(details.route), { size, rotate });
}

function toRGB(color: string) {
  return rgb(
    parseInt(color.slice(0, 2), 16) / 255,
    parseInt(color.slice(2, 4), 16) / 255,
    parseInt(color.slice(-2), 16) / 255);
}
