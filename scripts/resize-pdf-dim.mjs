import { promises, fstat } from 'fs';

const xOldWidth = 595.22;
const xRatio = 841.89 / xOldWidth;
const yOldWidth = 842;
const yRatio = 1190.55 / yOldWidth;

// doc had been rotated 180 degrees so origing upper right rather than PDF lower left
const transformX = x => (xOldWidth - x) * xRatio;
const transformY = y => (yOldWidth - y) * yRatio;

function transformDawText(str) {
    const drawText = '.drawText(';
    const getX = /(.*)x: *([0-9.-]+)/y;
    const getY = /(.*)y: *([0-9.-]+)/y;

    // old doc { width: 595.22, height: 842 }
    // new doc { width: 841.89, height: 1190.55 }

    let match = 0;
    while ((match = str.indexOf(drawText, match)) > -1) {
        getX.lastIndex = getY.lastIndex = match + drawText.length;
        str = str.replace(getX, (_a, b, c) => b + 'x: ' + transformX(c))
            .replace(getY, (_a, b, c) => b + 'y: ' + transformY(c));
    } 

    return str;
}

function transformGetPages(str) {
    str.replaceAll(/new PdfTableValues\(.*\)/g, (a, b) => {
        const vals = b.split(',');
        if (b.length === 5) {
            b[4] = JSON.stringify(JSON.parse(b[4]).map(y => y * yRatio));
        }
        // start coord
        let coords = JSON.parse(b[1]);
        coords[0] = transformX(coords[0]);
        coords[1] = transformY(coords[1]);
        b[1] = JSON.stringify(coords);
        // offset coord
        let coords = JSON.parse(b[2]);
        coords[0] = coords[0] * xRatio;
        coords[1] = coords[1] * yRatio;
        b[2] = JSON.stringify(coords);
        return b.join(",");
    });
}

(async () => {
    const path = './src/services/pdf-generation/create-filled-data-pdf-lib.ts';
    let code = await promises.readFile(path, { encoding: 'utf8' });
    console.log('file chars: ' + code.length);
    code = transformDrawText(code);
    code = transformGetPages(code);
    await promises.writeFile(path, code);
})();
