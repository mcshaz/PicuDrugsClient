export function updatePdfMetadata(metaDataXml: string) {
    let returnVar = replaceXMLContents(metaDataXml, 'xmpMM:InstanceID', 'uuid:[a-f0-9-]{36}', uuidv4());
    return replaceXMLContents(returnVar, 'xmpMM:InstanceIxmp:ModifyDate', '[0-9-]{10}T[0-9:.]{8,}[Z0-9:+-]+', currentISO8601WithOffset())
}

function replaceXMLContents(xmlData: string, xmlElementName: string, contentRx: string, newInner: string) {
    return xmlData.replace(new RegExp(`<${xmlElementName}>${contentRx}</${xmlElementName}>`, 'g'),
        `<${xmlElementName}>${newInner}</${xmlElementName}>`);
}

// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0;
        let v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function currentISO8601WithOffset() {
    const now = new Date();
    const  tzoffset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - tzoffset);
    const absTzoffset = Math.abs(tzoffset);
    return now.toISOString().slice(0, 19)
        + (tzoffset <= 0 ? '+': '-')
        + (absTzoffset / 60).toFixed().padStart(2, '0')
        + ':'
        + (absTzoffset % 60).toFixed().padStart(2, '0');
}