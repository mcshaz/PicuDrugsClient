import { promises } from 'fs';
import { exit } from 'process';
// add to package.json scripts: "resize-pdf": "node scripts/resize-pdf-dim.mjs",
const xOldWidth = 595.22;
const xRatio = 841.89 / xOldWidth;
const yOldWidth = 842;
const yRatio = 1190.55 / yOldWidth;
const decPlaces = 0;

// doc had been rotated 180 degrees so origing upper right rather than PDF lower left
const transformX = x => +((xOldWidth - x) * xRatio).toFixed(decPlaces);
const transformY = y => +((yOldWidth - y) * yRatio).toFixed(decPlaces);

function transformDrawText(str) {
    const drawText = '.drawText(';
    const getX = /(.*)x: *([0-9.-]+)/y;
    const getY = /(.*)y: *([0-9.-]+)/y;

    // old doc { width: 595.22, height: 842 }
    // new doc { width: 841.89, height: 1190.55 }

    let match = 0;
    while ((match = str.indexOf(drawText, match)) > -1) {
        match += drawText.length;
        getX.lastIndex = getY.lastIndex = match;
        str = str.replace(getX, (_a, b, c) => b + 'x: ' + transformX(c))
            .replace(getY, (_a, b, c) => b + 'y: ' + transformY(c));
    } 
    return str;
}

// taken from https://stackoverflow.com/questions/41516862/split-by-commas-but-not-within-brackets-using-regexp#answer-41517604
function parse(str) {
    let result = [];
    let item = '';
    let depth = 0;
    const push = () => { 
        if (item) {
            result.push(item); 
            item = '';
         }
    };
    for (let i = 0, c; c = str[i], i < str.length; i++) {
      if (!depth && c === ',') {
          push();
      } else {
        item += c;
        if (c === '[') depth++;
        if (c === ']') depth--;
      }
    }
    push();
    return result;
  }

function transformGetPages(str) {
    return str.replace(/new PdfTableValues\((.+)\)/g, (_a, b) => {
        const args = parse(b);
        if (args.length === 5) {
            args[4] = JSON.stringify(JSON.parse(args[4]).map(y => +(y * yRatio).toFixed(decPlaces)));
        }
        // start coord
        let coords = JSON.parse(args[1]);
        coords[0] = transformX(coords[0]);
        coords[1] = transformY(coords[1]);
        args[1] = JSON.stringify(coords);
        // offset coord
        coords = JSON.parse(args[2]);
        coords[0] = +(coords[0] * xRatio).toFixed(decPlaces);
        coords[1] = +(coords[1] * yRatio).toFixed(decPlaces);
        args[2] = JSON.stringify(coords);
        return `new PdfTableValues(${args.join(",")})`;
    });
}

(async () => {
    try {
        const path = './src/services/pdf-generation/create-filled-data-pdf-lib.ts';
        let code = await promises.readFile(path, { encoding: 'utf8' });
        console.log('file chars: ' + code.length);
        code = transformDrawText(code);
        console.log('trqansform drawText performed');
        code = transformGetPages(code);
        console.log('trqansform getPages performed');
        await promises.writeFile(path, code);
        console.log('file written');
    }
    catch(e) {
        console.log(e);
        exit(1);
    }
    exit(0);
})();
