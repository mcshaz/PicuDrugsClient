interface ICoordData { getWidth?: (txt: string) => number }
interface IWidthData { rowNo?: number }
interface IBTData { fontSize?: number; fontPdfKey?: string }
export class PdfTableValues {
  constructor(public startCoord: [number, number],
        public offsetCoord: [number, number] = [0, 0],
        public gridsPerPage: [number, number] = [0, 0],
        public itemRowOffset = 0) {
  }

  // to left justify, just return 0 from getWidth
  public createPdfStream(txt: string[], { fontSize = 12, getWidth = (_txt: string) => 0, rowNo = 0, fontPdfKey = 'F1' }: ICoordData & IBTData & IWidthData) {
    const returnVar = [];
    const totalGridsPerPage = this.gridsPerPage[0] * this.gridsPerPage[1];
    let currentPage = -1;
    let lastStep = 0;
    const startPageY = this.startCoord[1] + rowNo * this.itemRowOffset;
    for (let currentCell = 0; currentCell < txt.length; ++currentCell) {
      let step = getWidth(txt[currentCell]) / 2 - lastStep;
      if (currentCell % totalGridsPerPage === 0) {
        ++currentPage;
        step += lastStep;
        returnVar.push(`BT /${fontPdfKey} ${fontSize} Tf ${this.startCoord[0] - step} ${startPageY} Td`);
      } else if (currentCell % this.gridsPerPage[0] === 0) {
        returnVar[currentPage] += ` ${step - this.offsetCoord[0] * this.gridsPerPage[0]} ${-this.offsetCoord[1]} Td`;
      } else {
        returnVar[currentPage] += ` ${step - this.offsetCoord[0]} 0 Td`;
      }
      returnVar[currentPage] += ` (${txt[currentCell]})Tj`;
      lastStep = step;
    }
    return returnVar.map(rv => rv + ' ET\n');
  }

  public static simpleBT(txt: string, coord: [number, number], { fontSize = 12, fontPdfKey = 'F1', getWidth = () => 0 }: IBTData & ICoordData = {}) {
    return `BT /${fontPdfKey} ${fontSize} Tf ${coord[0] - getWidth(txt)} ${coord[1]} Td (${txt})Tj ET\n`;
  }

  public static wrapStream(txt: string) {
    // (new TextEncoder()).encode(str).length but all ascii at the moment
    return `<</Length ${txt.length}>>stream\n${txt}endstream`;
  }
}
