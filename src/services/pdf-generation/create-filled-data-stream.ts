import { getHelvetica } from './font-properties';
import { WidthHelper } from './width-helper';
import { PdfTableValues } from './pdf-table-values-stream';

interface IWithdrawalRegime {
    dayNo: number;
    date: string;
    regularDose: string;
    frequency: string;
    rescueDose: string;
}
interface IChartPatientDetails {
    nhi: string;
    weight: string;
    dob: string;
    medicine: string;
    route: string;
    regime: IWithdrawalRegime[];
}
export function createFilledDataStream(details: IChartPatientDetails) {
  if (!details.regime.length) {
    return [];
  }
  const wh = new WidthHelper(getHelvetica());
  const getWidth = (txt: string) => wh.getWidth(txt) * fontSize;
  const cols = 9;
  const fontPdfKey = 'F2';
  let fontSize = 10;
  const cellTVs = new PdfTableValues([134, 179], [77.25, 285], [cols, 3], 15);
  const beginTexts = [
    cellTVs.createPdfStream(details.regime.map(r => r.dayNo.toString()),
      { getWidth, fontSize, fontPdfKey }),
    cellTVs.createPdfStream(details.regime.map(r => r.date.toString()),
      { getWidth, fontSize, fontPdfKey, rowNo: 1 }),
    cellTVs.createPdfStream(details.regime.map(r => r.regularDose.toString()),
      { getWidth, fontSize, fontPdfKey, rowNo: 2 }),
    cellTVs.createPdfStream(details.regime.map(r => r.frequency.toString()),
      { getWidth, fontSize, fontPdfKey, rowNo: 3 }),
  ];
  cellTVs.startCoord[1] = 369;
  beginTexts.push(cellTVs.createPdfStream(details.regime.map(r => r.rescueDose.toString()),
    { getWidth, fontSize, fontPdfKey }));
  cellTVs.gridsPerPage[0] = 1;
  cellTVs.startCoord = [80, 162];
  cellTVs.offsetCoord[0] = 0;
  fontSize = 11;
  const medArray = new Array<string>(Math.ceil(details.regime.length / cols));
  // by not providing getwidth, we provide the default (0) which should left align
  beginTexts.push(cellTVs.createPdfStream(medArray.fill(details.medicine),
    { fontSize, fontPdfKey }));
  cellTVs.startCoord[0] = 323;
  beginTexts.push(cellTVs.createPdfStream(medArray.fill(details.route),
    { fontSize, fontPdfKey }));

  fontSize = 12;
  return beginTexts[0].map((_, i) =>
    PdfTableValues.wrapStream(
      beginTexts.reduce((accum, cv) => accum +
                PdfTableValues.simpleBT(details.dob, [94, 104], { fontSize, fontPdfKey }) +
                PdfTableValues.simpleBT(details.nhi, [206, 104], { fontSize, fontPdfKey }) +
                // leave out page number incase different meds printed out
                // + PdfTableValues.simpleBT(i.toString(), [756, 125], { getWidth })
                PdfTableValues.simpleBT(details.weight, [756, 89], { getWidth, fontSize, fontPdfKey }) +
                cv[i], '')));
}
