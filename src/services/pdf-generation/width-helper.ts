import { IFontProperties } from './font-properties';
// refactored from https://github.com/MrRio/jsPDF/blob/master/src/modules/split_text_to_size.js
export class WidthHelper {
  constructor(readonly _fontProps: IFontProperties) {
  }

  getWidth(text: string) {
    let priorCharCode = 0; // for kerning
    const defaultCharWidth = this._fontProps.widths.get(0) || this._fontProps.fof;
    let output = 0;

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      output += (this._fontProps.widths.get(charCode) || defaultCharWidth) / this._fontProps.fof;
      output += (this._fontProps.kerningToPrior.get(charCode)?.get(priorCharCode) || 0) / this._fontProps.kerningFof;
      priorCharCode = charCode;
    }
    return output;
  }
}
