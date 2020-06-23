
import { PDFDocument, PDFPage, PDFPageDrawTextOptions } from 'pdf-lib';
export interface ICoordOptions extends PDFPageDrawTextOptions {
  getWidth?: (txt: string) => number; rowNo?: number;
}

export class PdfTableValues {
  constructor(
        public doc: PDFDocument,
        public startCoord: [number, number],
        public offsetCoord: [number, number] = [0, 0],
        public gridsPerPage: [number, number] = [0, 0],
        public itemRowOffset = 0) {
  }

  // to left justify, just return 0 from getWidth
  public setCoords(txt: string[], opts: ICoordOptions = {}) {
    const { rowNo = 0, getWidth = () => 0 } = opts;
    const totalGridsPerPage = this.gridsPerPage[0] * this.gridsPerPage[1];
    let currentPage = 0;
    let pg!: PDFPage;
    let lastWidth = 0;
    const startPageY = this.startCoord[1] + rowNo * this.itemRowOffset;
    for (let currentCell = 0; currentCell < txt.length; ++currentCell) {
      const txtWidth = getWidth(txt[currentCell]) / 2;
      // all a bit funky - the doc is rotated 180 degrees, so origin is upper right
      if (currentCell % totalGridsPerPage === 0) {
        pg = this.doc.getPage(currentPage++);
        pg.moveTo(this.startCoord[0] + txtWidth, startPageY);
      } else if (currentCell % this.gridsPerPage[0] === 0) {
        pg.moveTo(this.startCoord[0] + txtWidth, startPageY + this.offsetCoord[1] * (currentCell / this.gridsPerPage[0]));
      } else {
        pg.moveLeft(this.offsetCoord[0] + lastWidth - txtWidth);
      }
      pg.drawText(txt[currentCell], opts);
      lastWidth = txtWidth;
    }
  }

  /*
  public setCoords(txt: string[], opts: ICoordOptions & PDFPageDrawTextOptions = {}) {
    this.moveTo((pg, i) => pg.drawText(txt[i], opts),
      txt.length,
      opts.rowNo,
      opts.getWidth
        ? i => opts.getWidth!(txt[i]) / 2
        : void 0);
  }

  // to left justify, just return 0 from getWidth
  public moveTo(delegate: (pg: PDFPage, i: number) => void,
    count: number,
    rowNo = 0,
    getWidth: (i: number) => number = () => 0) {
    const totalGridsPerPage = this.gridsPerPage[0] * this.gridsPerPage[1];
    let currentPage = 0;
    let pg!: PDFPage;
    let lastWidth = 0;
    const startPageY = this.startCoord[1] + rowNo * this.itemRowOffset;
    for (let currentCell = 0; currentCell < count; ++currentCell) {
      const txtWidth = getWidth(currentCell);
      // all a bit funky - the doc is rotated 180 degrees, so origin is upper right
      if (currentCell % totalGridsPerPage === 0) {
        pg = this.doc.getPage(currentPage++);
        pg.moveTo(this.startCoord[0] + txtWidth, startPageY);
      } else if (currentCell % this.gridsPerPage[0] === 0) {
        pg.moveTo(this.startCoord[0] + txtWidth, startPageY + this.offsetCoord[1] * (currentCell / this.gridsPerPage[0]));
      } else {
        pg.moveLeft(this.offsetCoord[0] + lastWidth - txtWidth);
      }
      delegate(pg, currentCell);
      lastWidth = txtWidth;
    }
  }
  */
}
