
import { PDFDocument, PDFPage, PDFPageDrawTextOptions } from 'pdf-lib';
interface ICoordOptions { getWidth?: (txt: string) => number; rowNo?: number }

export class PdfTableValues {
  constructor(
        public doc: PDFDocument,
        public startCoord: [number, number],
        public offsetCoord: [number, number] = [0, 0],
        public gridsPerPage: [number, number] = [0, 0],
        public itemRowOffset = 0) {
  }

  // to left justify, just return 0 from getWidth
  public setCoords(txt: string[], opts: ICoordOptions & PDFPageDrawTextOptions = {}) {
    const { rowNo = 0, getWidth = () => 0 } = opts;
    const totalGridsPerPage = this.gridsPerPage[0] * this.gridsPerPage[1];
    const startPageY = this.startCoord[1] + rowNo * this.itemRowOffset;
    let currentPage = 0;
    let pg!: PDFPage;
    for (let currentCell = 0; currentCell < txt.length; ++currentCell) {
      const step = getWidth(txt[currentCell]) / 2;
      if (currentCell % totalGridsPerPage === 0) {
        pg = this.doc.getPage(currentPage++);
        pg.moveTo(this.startCoord[0] - step, startPageY);
      } else if (currentCell % this.gridsPerPage[0] === 0) {
        pg.moveTo(this.startCoord[0] - step, this.startCoord[1] + this.offsetCoord[1] * (currentCell / this.gridsPerPage[0]));
      } else {
        pg.moveRight(this.offsetCoord[0] - step);
      }
      pg.drawText(txt[currentCell], opts);
    }
  }
}
