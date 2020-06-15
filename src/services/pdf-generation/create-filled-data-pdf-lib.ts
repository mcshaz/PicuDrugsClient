import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PdfTableValues } from './pdf-table-values-pdf-lib';
import { WeanDay } from '@/services/pharmacokinetics/WeanDay';
import { shortFormatter } from '@/services/utilities/dateHelpers';
import { weightRounding } from '@/services/infusion-calculations/Utilities/rounding';

interface IChartPatientDetails {
    dob: Date;
    name: string;
    nhi: string;
    weight: number;
    prescriber: string;
    medicine: string;
    doseUnits: string;
    route: string;
    regime: WeanDay[];
}
export async function createPDF(details: IChartPatientDetails, url: string) {
  const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes, { updateMetadata: true });
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  await createFilledDataStream(details, pdfDoc, helveticaFont.widthOfTextAtSize);
}

async function createFilledDataStream(details: IChartPatientDetails, doc: PDFDocument, widthOfTextAtSize: (txt: string, size: number) => number) {
  if (!details.regime.length) {
    return;
  }
  let size = 10;
  const getWidth = (txt: string) => widthOfTextAtSize(txt, size);
  const cols = 9;
  const gridsRows = 3;
  const pagesRequired = Math.ceil(details.regime.length / (cols * gridsRows));
  while (pagesRequired > doc.getPageCount()) {
    const [firstDonorPage] = await doc.copyPages(doc, [0]);
    doc.addPage(firstDonorPage);
  }
  const cellTVs = new PdfTableValues(doc, [134, 179], [77.25, 285], [cols, gridsRows], 15);
  cellTVs.setCoords([...details.regime.keys(), details.regime.length].slice(1).map(String),
    { getWidth, size });
  cellTVs.setCoords(details.regime.map(r => r.weanDateString),
    { getWidth, rowNo: 1, size });
  cellTVs.setCoords(details.regime.map(r => r.regularDose + details.doseUnits),
    { getWidth, rowNo: 2, size });
  cellTVs.setCoords(details.regime.map(r => r.frequency),
    { getWidth, rowNo: 3, size });
  cellTVs.startCoord[1] = 369;
  cellTVs.setCoords(details.regime.map(r => r.rescueDose.toString()),
    { getWidth, size, color: toRGB('e9262c') });
  cellTVs.gridsPerPage[0] = 1;
  cellTVs.startCoord = [80, 162];
  cellTVs.offsetCoord[0] = 0;
  size = 11;
  const medArray = new Array<string>(Math.ceil(details.regime.length / cols));
  // by not providing getwidth, we provide the default (0) which should left align
  cellTVs.setCoords(medArray.fill(details.medicine), { size });
  cellTVs.startCoord[0] = 323;
  cellTVs.setCoords(medArray.fill(details.route), { size });

  size = 12;
  for (let p = 0; p < pagesRequired; ++p) {
    const pg = doc.getPage(p);
    pg.drawText(shortFormatter.format(details.dob), { x: 94, y: 104, size });
    pg.drawText(details.nhi, { x: 206, y: 104, size });
    // leave out page number incase different meds printed out
    // + PdfTableValues.simpleBT(i.toString(), [756, 125], { getWidth })
    pg.drawText(weightRounding(details.weight).toString(), { x: 756, y: 89, size });
    pg.drawText(details.prescriber, { x: 132 - getWidth(details.prescriber) / 2, y: 1057, size });
  }
}

function toRGB(color: string) {
  return rgb(
    parseInt(color.slice(0, 2), 16),
    parseInt(color.slice(2, 4), 16),
    parseInt(color.slice(-2), 16));
}
