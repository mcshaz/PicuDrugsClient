import { PDFDocument, PDFFont, rgb } from 'pdf-lib';
import { PdfTableValues } from './pdf-table-values-pdf-lib';

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
    medicine:string; 
    route: string;
    prescriber: string;
    regime: IWithdrawalRegime[];
}
export async function createFilledDataStream(details: IChartPatientDetails, doc: PDFDocument, widthOfTextAtSize: (txt: string, size: number) => number) {
    if (!details.regime.length) {
        return [];
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
    let cellTVs = new PdfTableValues(doc, [134, 179], [77.25, 285], [cols, gridsRows], 15);
    const beginTexts = [
        cellTVs.setCoords(details.regime.map(r => r.dayNo.toString()),
            { getWidth, size }),
        cellTVs.setCoords(details.regime.map(r => r.date.toString()),
            { getWidth, rowNo: 1, size }),
        cellTVs.setCoords(details.regime.map(r => r.regularDose.toString()),
            { getWidth, rowNo: 2, size }),
        cellTVs.setCoords(details.regime.map(r => r.frequency.toString()),
            { getWidth, rowNo: 3, size }),
    ];
    cellTVs.startCoord[1] = 369;
    beginTexts.push(cellTVs.setCoords(details.regime.map(r => r.rescueDose.toString()),
        { getWidth, size, color: toRGB('e9262c') }));
    cellTVs.gridsPerPage[0] = 1;
    cellTVs.startCoord = [80, 162];
    cellTVs.offsetCoord[0] = 0;
    size = 11;
    const medArray = new Array<string>(Math.ceil(details.regime.length / cols));
    // by not providing getwidth, we provide the default (0) which should left align
    beginTexts.push(cellTVs.setCoords(medArray.fill(details.medicine), { size }));
    cellTVs.startCoord[0] = 323;
    beginTexts.push(cellTVs.setCoords(medArray.fill(details.route), { size }));
    
    size = 12;
    for (let p = 0; p < pagesRequired; ++p) {
        const pg = doc.getPage(p);
        pg.drawText(details.dob, { x: 94, y: 104, size });
        pg.drawText(details.nhi, { x: 206, y: 104, size });
        // leave out page number incase different meds printed out
        // + PdfTableValues.simpleBT(i.toString(), [756, 125], { getWidth })
        pg.drawText(details.weight, { x: 756, y: 89, size });
        pg.drawText(details.prescriber, { x: 132 - getWidth(details.prescriber) / 2, y: 1057, size });
    }
}

function toRGB(color: string) {
    return rgb(
        parseInt(color.slice(0, 2), 16),
        parseInt(color.slice(2, 4), 16),
        parseInt(color.slice(-2), 16));
}
