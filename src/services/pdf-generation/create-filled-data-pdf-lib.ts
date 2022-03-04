import { PDFDocument, StandardFonts, grayscale, PDFPage, PDFPageDrawTextOptions, PrintScaling, Duplex } from 'pdf-lib';
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
  const pdfDoc = await createPDF(details, require('@/assets/pdf/WeaningProtocol.pdf'));
  const dt = new Date();
  const title = `Withdrawal Chart ${details.nhi} ${dt.toISOString().slice(0, 10)}`;
  pdfDoc.setTitle(title);
  const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences();
  viewerPrefs.setPrintScaling(PrintScaling.None);
  viewerPrefs.setDuplex(Duplex.DuplexFlipLongEdge);
  viewerPrefs.setPickTrayByPDFSize(true);
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
  let size = 14;
  const getWidth = (txt: string) => widthOfTextAtSize(txt, size);
  const shrinkPrn = (txt: string, maxWidth: number, page: PDFPage, opts: PDFPageDrawTextOptions, centre = false) => {
    const limits = { min: 8, max: size };
    const res = shrinkTxtSizeToFit(txt, maxWidth, widthOfTextAtSize, limits);
    size = res.size > 0 ? res.size : limits.min;
    const textDrawOpts = { ...opts, size };
    if (centre) {
      textDrawOpts.x = (textDrawOpts.x === void 0 ? page.getX() : textDrawOpts.x) - res.width / 2;
    }
    page.drawText(txt, textDrawOpts);
    size = limits.max;
  };

  const signArgs = await getSignArguments(doc);
  // current doc { width: 841.89, height: 1190.55 }
  // adding constant data to first page before cloning
  const firstPg = doc.getPage(0);
  shrinkPrn(details.lastN, 200, firstPg, { x: 102, y: 1130 }); // Family Name
  shrinkPrn(details.firstN, 118, firstPg, { x: 97, y: 1113 }); // Given Name
  if (typeof details.isMale === 'boolean') {
    firstPg.drawText(details.isMale ? 'Male' : 'Female', { x: 253, y: 1113, size }); // Gender
  }
  if (details.dob) {
    firstPg.drawText(fixIE11Format(details.dob), { x: 107, y: 1082, size });
  }
  firstPg.drawText(details.nhi, { x: 230, y: 1082, size });
  const wtText = weightRounding(details.weight) + ' kg';
  const boxMidline = 798;
  firstPg.drawText(wtText, { x: boxMidline - getWidth(wtText) / 2, y: 1106, size });
  shrinkPrn(details.prescriber, 116, firstPg, { x: 109, y: 146 }, true);
  firstPg.drawText('SIGN HERE', { x: 181, y: 146, ...signArgs });
  // adding pages to doc including page No
  const addPgNo = (no: number, pg: PDFPage) => {
    const pgText = `${no} of ${pageNo}`;
    pg.drawText(pgText, { x: boxMidline - getWidth(pgText) / 2, y: 1062, size });
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

  const yBetweenGrids = 278.5;
  const cellTVs = new PdfTableValues(doc, [164, 1005], [77.8, yBetweenGrids], [cols, gridsRows], [0, 15, 29, 45, 64, 181, 202]);
  const labelDrug = new PdfTableValues(doc, [95, 1023], [0, yBetweenGrids], [1, gridsRows]);
  const labelRoute = new PdfTableValues(doc, [363, 1022], [0, yBetweenGrids], [1, gridsRows]);

  const originalRxOpts = {
    color: grayscale(0.8),
    size: 8,
    x: 329,
    y: 1059,
    pre: 'original: ',
    preWidth: 0,
  };
  originalRxOpts.preWidth = widthOfTextAtSize(originalRxOpts.pre, originalRxOpts.size);
  for (const r of regimes) {
    for (let startRow = 0; startRow < r.weaningDrugs.length; ++startRow) {
      const details = r.weaningDrugs[startRow];
      size = 12;
      let opts: ICoordOptions = {
        getWidth,
        size,
        currentPage: r.pageNo,
        startCol: daysDif(r.weaningDrugs[0].weaningRegime[0].weanDate, details.weaningRegime[0].weanDate),
        startRow,
      };
      // original prescription
      if (startRow === 0) {
        doc.getPage(r.pageNo).drawText(originalRxOpts.pre, originalRxOpts);
      }
      const origTxt = `${details.originalDrug} ${details.originalConc} ${details.originalVol}`.trimRight();
      doc.getPage(r.pageNo).drawText(origTxt, {
        ...originalRxOpts,
        x: originalRxOpts.x + originalRxOpts.preWidth,
        y: originalRxOpts.y - originalRxOpts.size * 1.1 * startRow,
      });
      // day #
      cellTVs.setCoords([...details.weaningRegime.keys(), details.weaningRegime.length].map(k => (k + 1).toString()), opts);
      // date
      opts.size = size = 11;
      opts.itemRowNo = 1;
      let txt = details.weaningRegime.map(r => r.weanDateString);
      const lastDate = new Date(details.weaningRegime[details.weaningRegime.length - 1].weanDate);
      lastDate.setDate(lastDate.getDate() + 1);
      txt.push(WeanDay.formatDate(lastDate));
      cellTVs.setCoords(txt, opts);
      // dose
      opts.itemRowNo = 2;
      txt = details.weaningRegime.map(r => r.regularDose + ' ' + details.weaningDoseUnits);
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
      cellTVs.setCoords(details.weaningRegime.concat(details.weaningRegime[details.weaningRegime.length - 1])
        .map(r => r.rescueDose + ' ' + details.weaningDoseUnits), opts);
      // sign here below rescue
      shortSignText.push(shortSignText[shortSignText.length - 1]);
      cellTVs.setCoords(shortSignText, { ...opts, ...signArgs, itemRowNo: 6 });

      // drug name & route
      size = 13;
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

interface ISignArgs extends ICoordOptions {signWidth: (txt: string, size: number) => number}
async function getSignArguments(doc: PDFDocument): Promise<ISignArgs> {
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const size = 12;
  const signWidth = helveticaBold.widthOfTextAtSize.bind(helveticaBold);
  return {
    font: helveticaBold,
    color: grayscale(200 / 255),
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

/*
function shrinkThenWrap(txt: string,
                        maxWidth: number,
                        widthOfTextAtSize: (t: string, s: number) => number,
                        txtSizes: { min: number, max: number }) {
  let size = shrinkTxtSizeToFit(txt, maxWidth, widthOfTextAtSize, txtSizes);
  if (size !== -1) {
    return {
      size,
      txt: [ txt ],
    }
  }
  size = txtSizes.min;
  return {
    size,
    txt: breakTextIntoLines(txt, [' ', '-'], maxWidth, t => widthOfTextAtSize(t, size))
  }
}
*/

function shrinkTxtSizeToFit(txt: string,
  maxWidth: number,
  widthOfTextAtSize: (t: string, s: number) => number,
  txtSizes: { min: number; max: number }) {
  let size = txtSizes.max + 1;
  let fits = false;
  let width = 0;
  do {
    --size;
    width = widthOfTextAtSize(txt, size);
    fits = width < maxWidth;
  } while (!fits && size > txtSizes.min);
  if (!fits) {
    size = -1;
  }
  return {
    size,
    width,
  };
}

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
