import { PDFDocument, StandardFonts, grayscale, PDFPage, PDFPageDrawTextOptions, PrintScaling, Duplex, toDegrees, degrees } from 'pdf-lib';
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
  const pdfDoc = await createPDF(details, require('@/assets/pdf/WeaningProtocol2Page.pdf'));
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
  const cols = 8;
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
  const rotate = degrees(90);
  // current doc { width: 841.89, height: 1190.55 }
  const transform = (opts: PDFPageDrawTextOptions) => ({
    ...opts,
    x: 1230 - (opts.y ?? 0),
    y: opts.x ?? 0,
    rotate,
  });
  let fontSize = 14;
  const getWidth = (txt: string) => widthOfTextAtSize(txt, fontSize);
  const sizeAndTransform = (txt: string, maxWidth: number, page: PDFPage, opts: PDFPageDrawTextOptions, centre = false) => {
    const fontSizeLimits = { min: 8, max: fontSize };
    const res = shrinkTxtSizeToFit(txt, maxWidth, widthOfTextAtSize, fontSizeLimits);
    fontSize = res.size > 0 ? res.size : fontSizeLimits.min;
    const textDrawOpts = { ...opts, size: fontSize };
    if (centre) {
      if (opts.rotate && toDegrees(opts.rotate) === 90) {
        textDrawOpts.y = (textDrawOpts.y ?? page.getY()) - res.width / 2;
      } else {
        textDrawOpts.x = (textDrawOpts.x ?? page.getX()) - res.width / 2;
      }
    }
    page.drawText(txt, textDrawOpts);
    fontSize = fontSizeLimits.max;
  };

  const signArgs = await getSignArguments(doc);
  // adding constant data to first page before cloning
  const firstPg = doc.getPage(0);
  sizeAndTransform(details.lastN, 200, firstPg, transform({ x: 85, y: 1132 })); // Family Name
  sizeAndTransform(details.firstN, 118, firstPg, transform({ x: 85, y: 1112 })); // Given Name
  if (typeof details.isMale === 'boolean') {
    firstPg.drawText(details.isMale ? 'M' : 'F', transform({ x: 304, y: 1112, size: fontSize })); // Gender
  }
  if (details.dob) {
    firstPg.drawText(fixIE11Format(details.dob), transform({ x: 107, y: 1072, size: fontSize }));
  }
  firstPg.drawText(details.nhi, transform({ x: 248, y: 1072, size: fontSize }));
  const wtText = weightRounding(details.weight) + ' kg';
  const boxMidline = 749;
  firstPg.drawText(wtText, transform({ x: boxMidline - getWidth(wtText) / 2, y: 1098, size: fontSize }));
  sizeAndTransform(details.prescriber, 116, firstPg, transform({ x: 136, y: 146 }), true);
  firstPg.drawText('SIGN HERE', transform({ x: 251, y: 146, ...signArgs }));
  // adding pages to doc including page No
  const addPgNo = (no: number, pg: PDFPage) => {
    const pgText = `${no} of ${pageNo}`;
    pg.drawText(pgText, transform({ x: boxMidline - getWidth(pgText) / 2, y: 1066, size: fontSize }));
  };
  // 1 less page for the weaning chart
  while (pageNo > doc.getPageCount() - 1) {
    const [clonedPg] = await doc.copyPages(doc, [0]);
    doc.addPage(clonedPg);
    addPgNo(doc.getPageCount() - 1, clonedPg);
  }
  addPgNo(1, firstPg);

  const signText = 'SIGN';
  const shortSignWidth = signArgs.signWidth(signText, signArgs.size!);
  signArgs.opacity = 0.85;
  signArgs.getWidth = () => shortSignWidth;

  const yBetweenGrids = 283;
  const pageGetter = () => {
    let currentPage = 0;
    let beginPage = 0;
    const incrPage = (pg: number) => pg === 0 ? 2 : pg + 1;
    return {
      nextBeginPage() {
        beginPage = currentPage === 0 ? 0 : currentPage;
      },
      reset() {
        currentPage = beginPage;
      },
      next() {
        const oldVal = currentPage;
        currentPage = incrPage(currentPage);
        return doc.getPage(oldVal);
      },
    };
  };
  const pg = pageGetter();
  const cellTVs = new PdfTableValues(pg, [171, 1022], [82.25, yBetweenGrids], [cols, gridsRows], transform, [0, 15, 31, 46, 68, 187.5, 208]);
  const labelDrug = new PdfTableValues(pg, [102, 1041], [0, yBetweenGrids], [1, gridsRows], transform);
  const labelRoute = new PdfTableValues(pg, [381, 1041], [0, yBetweenGrids], [1, gridsRows], transform);

  const originalRxOpts = {
    color: grayscale(0.8),
    size: 8,
    x: 490,
    y: 1168,
    pre: 'original: ',
    preWidth: 0,
  };
  originalRxOpts.preWidth = widthOfTextAtSize(originalRxOpts.pre, originalRxOpts.size);
  for (const r of regimes) {
    pg.nextBeginPage();
    const pageNo = r.pageNo === 0 ? 0 : r.pageNo + 1;
    for (let startRow = 0; startRow < r.weaningDrugs.length; ++startRow) {
      const details = r.weaningDrugs[startRow];
      fontSize = 12;
      let opts: ICoordOptions = {
        getWidth,
        size: fontSize,
        startCol: daysDif(r.weaningDrugs[0].weaningRegime[0].weanDate, details.weaningRegime[0].weanDate),
        startRow,
      };
      // original prescription
      if (startRow === 0) {
        doc.getPage(pageNo).drawText(originalRxOpts.pre, transform(originalRxOpts));
      }
      const origTxt = `${details.originalDrug} ${details.originalConc} ${details.originalVol}`.trimRight();
      doc.getPage(pageNo).drawText(origTxt, transform({
        ...originalRxOpts,
        x: originalRxOpts.x + originalRxOpts.preWidth,
        y: originalRxOpts.y - originalRxOpts.size * 1.1 * startRow,
      }));
      // day #
      cellTVs.setCoords([...details.weaningRegime.keys(), details.weaningRegime.length].map(k => (k + 1).toString()), opts);
      // date
      opts.size = fontSize = 11;
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
      fontSize = 13;
      // by not providing getwidth, we provide the default (0) which should left align
      opts = {
        size: fontSize,
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
