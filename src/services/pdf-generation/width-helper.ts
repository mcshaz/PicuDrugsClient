import { IFontProperties } from './font-properties';
// refactored from https://github.com/MrRio/jsPDF/blob/master/src/modules/split_text_to_size.js
export class WidthHelper{
    constructor(readonly _fontProps: IFontProperties) {
    }
    getWidth(text: string) {
        let prior_char_code = -1; //for kerning
        const default_char_width = this._fontProps.widths.get(0) || this._fontProps.fof;
        let output = 0;

        for (let i = 0; i < text.length; i++) {
            const char_code = text.charCodeAt(i);
            output += (this._fontProps.widths.get(char_code) || default_char_width) / this._fontProps.fof;
            output += (this._fontProps.kerningToPrior.get(char_code)?.get(prior_char_code) || 0) / this._fontProps.kerningFof;
            prior_char_code = char_code;
        }
        return output;
    }
}