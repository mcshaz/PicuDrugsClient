import { PDFDocument, rgb, StandardFonts, radians, grayscale, PDFPage } from 'pdf-lib';
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
  regime: WeanDay[];
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
  const rotate = radians(Math.PI);
  const getWidth = (txt: string) => widthOfTextAtSize(txt, size);
  const signArgs = await getSignArguments(doc);
  signArgs.rotate = rotate;
  // adding constant data to first page before cloning
  const firstPg = doc.getPage(0);
  firstPg.drawText(details.lastN, { x: 532, y: 42, size, rotate }); // Family Name
  firstPg.drawText(details.firstN, { x: 532, y: 53, size, rotate }); // Given Name
  if (typeof details.isMale === 'boolean') {
    firstPg.drawText(details.isMale ? 'Male' : 'Female', { x: 428, y: 53, size, rotate }); // Gender
  }
  if (details.dob) {
    firstPg.drawText(fixIE11Format(details.dob), { x: 531, y: 75, size, rotate });
  }
  firstPg.drawText(details.nhi, { x: 446, y: 75, size, rotate });
  const wtText = weightRounding(details.weight) + ' kg';
  firstPg.drawText(wtText, { x: 48 + getWidth(wtText) / 2, y: 60, size, rotate });
  firstPg.drawText(details.prescriber, { x: 500 + getWidth(details.prescriber) / 2, y: 759, size, rotate });
  firstPg.drawText('SIGN HERE', { x: 422, y: 760, ...signArgs });
  // adding pages to doc including page No
  const addPgNo = (no: number, pg: PDFPage) => {
    const pgText = `${no}/${pageNo}`;
    pg.drawText(pgText, { x: 48 + getWidth(pgText) / 2, y: 70, size, rotate });
  };
  while (pageNo > doc.getPageCount()) {
    const [clonedPg] = await doc.copyPages(doc, [0]);
    doc.addPage(clonedPg);
    addPgNo(doc.getPageCount(), clonedPg);
  }
  addPgNo(1, firstPg);
  // adding withdrawal regimes
  //    const origTxt = `original: ${details.originalDrug} ${details.originalConc} ${details.originalVol}`.trim();
  //    pg.drawText(origTxt, { x: 77 + widthOfTextAtSize(origTxt, 8), y: 42, color: grayscale(0.8), rotate, size: 8 });

  const signText = 'SIGN';
  const shortSignWidth = signArgs.signWidth(signText, signArgs.size!);
  signArgs.opacity = 0.85;
  signArgs.getWidth = () => shortSignWidth;

  const cellTVs = new PdfTableValues(doc, [499, 129], [55.5, 205], [cols, gridsRows], [0, 10.6, 21.1, 31.8, 46.6, 100, 115]);
  const labelDrug = new PdfTableValues(doc, [537, 117], [0, 205], [1, gridsRows], []);
  const labelRoute = new PdfTableValues(doc, [362, 117], [0, 205], [1, gridsRows], []);

  for (const r of regimes) {
    for (let startRow = 0; startRow < r.weaningDrugs.length; ++startRow) {
      const details = r.weaningDrugs[startRow];
      size = 9;
      const opts: ICoordOptions = {
        getWidth,
        size,
        rotate,
        currentPage: r.pageNo,
        startCol: daysDif(r.weaningDrugs[0].regime[0].weanDate, details.regime[0].weanDate),
        startRow,
      };
      // day #
      cellTVs.setCoords([...details.regime.keys(), details.regime.length].map(k => (k + 1).toString()), opts);
      // date
      opts.itemRowNo = 1;
      let txt = details.regime.map(r => r.weanDateString);
      const lastDate = details.regime[details.regime.length - 1].weanDate;
      lastDate.setDate(lastDate.getDate() + 1);
      txt.push(WeanDay.formatter.format(lastDate));
      cellTVs.setCoords(txt, opts);
      // dose
      opts.itemRowNo = 2;
      txt = details.regime.map(r => r.regularDose + details.weaningDoseUnits);
      txt.push('STOP');
      cellTVs.setCoords(txt, opts);
      // frequency
      opts.itemRowNo = 3;
      cellTVs.setCoords(details.regime.map(r => r.frequency), { ...opts, color: toRGB('e9262c') });
      // sign here below freq
      const shortSignText = new Array(details.regime.length).fill(signText);
      cellTVs.setCoords(shortSignText, { ...opts, ...signArgs, itemRowNo: 4 });

      // rescue dose
      opts.itemRowNo = 5;
      cellTVs.setCoords(details.regime.map(r => r.rescueDose + details.weaningDoseUnits), opts);
      // sign here below rescue
      cellTVs.setCoords(shortSignText, { ...opts, ...signArgs, itemRowNo: 6, opacity: 0.5 });

      // drug name & route
      opts.size = size = 10;
      const medArray = new Array<string>(Math.ceil(details.regime.length / cols));
      // by not providing getwidth, we provide the default (0) which should left align
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

function toRGB(color: string) {
  return rgb(
    parseInt(color.slice(0, 2), 16) / 255,
    parseInt(color.slice(2, 4), 16) / 255,
    parseInt(color.slice(-2), 16) / 255);
}

function regimeDays(regimes: IWeaningDrug[]) {
  const lastRegime = regimes[regimes.length - 1].regime;
  return daysDif(regimes[0].regime[0].weanDate, lastRegime[lastRegime.length - 1].weanDate);
}

function groupRegimes(regimes: IWeaningDrug[], maxSize: number) {
  regimes = regimes.slice();
  regimes.sort((a, b) => {
    const start = a.regime[0].weanDate.getTime() - b.regime[0].weanDate.getTime();
    if (start === 0) {
      return a.regime[a.regime.length - 1].weanDate.getTime() - b.regime[b.regime.length - 1].weanDate.getTime();
    }
    return start;
  });
  const returnVar: IWeaningDrug[][] = [];
  let currentFinishIndx = 1;
  while (currentFinishIndx < regimes.length) {
    const r = regimes[currentFinishIndx].regime;
    const daysInMax = daysDif(regimes[0].regime[0].weanDate, r[r.length - 1].weanDate) < maxSize;
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
