import { PDFDocument, StandardFonts, grayscale, PDFPage } from 'pdf-lib';
import { PdfTableValues, ICoordOptions } from './pdf-table-values-pdf-lib';
import { WeanDay } from '@/services/pharmacokinetics/WeanDay';
import { fixIE11Format, daysDif } from '@/services/utilities/dateHelpers';
import { weightRounding } from '@/services/infusion-calculations/Utilities/rounding';
import download from 'downloadjs';

export interface IWeaningDrug {
  weaningDrug: string;
  weaningDoseUnits: string;
  route: string;
  originalDrug: string;
  originalConc: string;
  originalVol: string;
  weaningRegime: WeanDay[];
}

export interface IChartPatientDetails {
    dob: Date | null;
    lastN: string;
    firstN: string;
    isMale: boolean | null;
    nhi: string;
    weight: number;
    prescriber: string;
    drugs: IWeaningDrug[];
}

export async function createAndDownloadPDF(details: IChartPatientDetails) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pdfDoc = await createPDF(details, require('./../../assets/pdf/WeaningProtocol.pdf'));
  const dt = new Date();
  const title = `Withdrawal Chart ${details.nhi} ${dt.toISOString().slice(0, 10)}`;
  pdfDoc.setTitle(title);
  const pdfBytes = await pdfDoc.save();
  dt.setMinutes(dt.getTimezoneOffset());
  download(pdfBytes, title.replace(/ /g, '-') + '.pdf', 'application/pdf');
}

export async function createPDF(details: IChartPatientDetails, url: string) {
  const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes, { updateMetadata: true });
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  await createFilledPdfStream(details, pdfDoc, helveticaFont.widthOfTextAtSize.bind(helveticaFont));
  return pdfDoc;
}

async function createFilledPdfStream(details: IChartPatientDetails, doc: PDFDocument, widthOfTextAtSize: (txt: string, size: number) => number) {
  if (!details.drugs.length) {
    return;
  }
  const cols = 9;
  const gridsRows = 3;
  const maxDays = cols * gridsRows;
  let pageNo = 0;
  const regimes = groupRegimes(details.drugs, cols - 1) // -1 for the "stop"
    .map(weaningDrugs => {
      const returnVar = {
        pageNo,
        weaningDrugs,
      };
      pageNo += Math.ceil(regimeDays(weaningDrugs) / maxDays);
      return returnVar;
    });
  // set up pdf drawing variables
  let size = 11;
  const getWidth = (txt: string) => widthOfTextAtSize(txt, size);
  const signArgs = await getSignArguments(doc);
  // old doc { width: 595.22, height: 842 }
  // new doc { width: 841.89, height: 1190.55 }
  // adding constant data to first page before cloning
  const firstPg = doc.getPage(0);
  firstPg.drawText(details.lastN, { x: 532, y: 42, size }); // Family Name
  firstPg.drawText(details.firstN, { x: 532, y: 53, size }); // Given Name
  if (typeof details.isMale === 'boolean') {
    firstPg.drawText(details.isMale ? 'Male' : 'Female', { x: 428, y: 53, size }); // Gender
  }
  if (details.dob) {
    firstPg.drawText(fixIE11Format(details.dob), { x: 531, y: 74, size });
  }
  firstPg.drawText(details.nhi, { x: 446, y: 74, size });
  const wtText = weightRounding(details.weight) + ' kg';
  firstPg.drawText(wtText, { x: 48 + getWidth(wtText) / 2, y: 58, size });
  firstPg.drawText(details.prescriber, { x: 500 + getWidth(details.prescriber) / 2, y: 759, size });
  firstPg.drawText('SIGN HERE', { x: 422, y: 760, ...signArgs });
  // adding pages to doc including page No
  const addPgNo = (no: number, pg: PDFPage) => {
    const pgText = `${no} of ${pageNo}`;
    pg.drawText(pgText, { x: 48 + getWidth(pgText) / 2, y: 88, size });
  };
  while (pageNo > doc.getPageCount()) {
    const [clonedPg] = await doc.copyPages(doc, [0]);
    doc.addPage(clonedPg);
    addPgNo(doc.getPageCount(), clonedPg);
  }
  addPgNo(1, firstPg);

  const signText = 'SIGN';
  const shortSignWidth = signArgs.signWidth(signText, signArgs.size!);
  signArgs.opacity = 0.85;
  signArgs.getWidth = () => shortSignWidth;

  const cellTVs = new PdfTableValues(doc, [499, 129], [55.5, 205], [cols, gridsRows], [0, 10, 20, 32, 46.6, 137, 151]);
  const labelDrug = new PdfTableValues(doc, [537, 117], [0, 205], [1, gridsRows]);
  const labelRoute = new PdfTableValues(doc, [362, 117], [0, 205], [1, gridsRows]);

  for (const r of regimes) {
    for (let startRow = 0; startRow < r.weaningDrugs.length; ++startRow) {
      const details = r.weaningDrugs[startRow];
      size = 9;
      let opts: ICoordOptions = {
        getWidth,
        size,
        currentPage: r.pageNo,
        startCol: daysDif(r.weaningDrugs[0].weaningRegime[0].weanDate, details.weaningRegime[0].weanDate),
        startRow,
      };
      // original prescription
      const origTxt = `${startRow === 0 ? 'original: ' : ''}${details.originalDrug} ${details.originalConc} ${details.originalVol}`.trim();
      doc.getPage(r.pageNo).drawText(origTxt, { x: 206 + widthOfTextAtSize(origTxt, 8), y: 21 + 10 * startRow, color: grayscale(0.8), size: 8 });
      // day #
      cellTVs.setCoords([...details.weaningRegime.keys(), details.weaningRegime.length].map(k => (k + 1).toString()), opts);
      // date
      opts.itemRowNo = 1;
      let txt = details.weaningRegime.map(r => r.weanDateString);
      const lastDate = new Date(details.weaningRegime[details.weaningRegime.length - 1].weanDate);
      lastDate.setDate(lastDate.getDate() + 1);
      txt.push(WeanDay.formatter.format(lastDate));
      cellTVs.setCoords(txt, opts);
      // dose
      opts.itemRowNo = 2;
      txt = details.weaningRegime.map(r => r.regularDose + details.weaningDoseUnits);
      txt.push('- stop -');
      cellTVs.setCoords(txt, opts);
      // frequency
      opts.itemRowNo = 3;
      cellTVs.setCoords(details.weaningRegime.map(r => r.frequency), opts);
      // sign here below freq
      const shortSignText = new Array(details.weaningRegime.length).fill(signText);
      cellTVs.setCoords(shortSignText, { ...opts, ...signArgs, itemRowNo: 4 });

      // rescue dose
      opts.itemRowNo = 5; // { ...opts, color: toRGB('e9262c') }
      cellTVs.setCoords(details.weaningRegime.map(r => r.rescueDose + details.weaningDoseUnits), opts);
      // sign here below rescue
      cellTVs.setCoords(shortSignText, { ...opts, ...signArgs, itemRowNo: 6, opacity: 0.5 });

      // drug name & route
      size = 10;
      // by not providing getwidth, we provide the default (0) which should left align
      opts = {
        size,
        currentPage: r.pageNo,
        startRow,
      };
      const medArray = new Array<string>(Math.ceil(details.weaningRegime.length / cols));
      labelDrug.setCoords(medArray.fill(details.weaningDrug), opts);
      labelRoute.setCoords(medArray.fill(details.route), opts);
    }
  }
}

interface ISignArgs extends ICoordOptions {signWidth: (txt: string, size: number) => number};
async function getSignArguments(doc: PDFDocument): Promise<ISignArgs> {
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const size = 11;
  const signWidth = helveticaBold.widthOfTextAtSize.bind(helveticaBold);
  return {
    font: helveticaBold,
    color: grayscale(230 / 255),
    size,
    signWidth,
  };
}
/*
function toRGB(color: string) {
  return rgb(
    parseInt(color.slice(0, 2), 16) / 255,
    parseInt(color.slice(2, 4), 16) / 255,
    parseInt(color.slice(-2), 16) / 255);
}
*/
function regimeDays(drugs: IWeaningDrug[]) {
  const lastRegime = drugs[drugs.length - 1].weaningRegime;
  return daysDif(drugs[0].weaningRegime[0].weanDate, lastRegime[lastRegime.length - 1].weanDate);
}

function groupRegimes(regimes: IWeaningDrug[], maxSize: number) {
  regimes = regimes.slice();
  regimes.sort((a, b) => {
    const start = a.weaningRegime[0].weanDate.getTime() - b.weaningRegime[0].weanDate.getTime();
    if (start === 0) {
      return a.weaningRegime[a.weaningRegime.length - 1].weanDate.getTime() - b.weaningRegime[b.weaningRegime.length - 1].weanDate.getTime();
    }
    return start;
  });
  const returnVar: IWeaningDrug[][] = [];
  let currentFinishIndx = 1;
  while (currentFinishIndx < regimes.length) {
    const r = regimes[currentFinishIndx].weaningRegime;
    const daysInMax = daysDif(regimes[0].weaningRegime[0].weanDate, r[r.length - 1].weanDate) < maxSize;
    if (daysInMax) {
      ++currentFinishIndx;
    } else {
      returnVar.push(regimes.splice(0, currentFinishIndx));
      currentFinishIndx = 1;
    }
    // if > max, push to prior
    // else if indx >= length, push all
  }
  if (regimes.length) {
    returnVar.push(regimes);
  }
  return returnVar;
}
