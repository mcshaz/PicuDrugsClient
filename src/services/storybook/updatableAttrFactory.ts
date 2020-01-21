// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function updatableAttrFactory(xml: string) {
  const attr = /^\s*<\s*([a-zA-Z_][\w\-.]+)/.exec(xml)!;
  const insertAttrPos = attr[0].length;
  const attrName = attr[1];
  return {
    insert(newAttributes?: any, slotContent?: string) {
      let returnVar = xml;
      if (newAttributes) {
        for (const [attName, attValue] of Object.entries(newAttributes)) {
          const findAttr = new RegExp(`\\s${escapeRegExp(attName)}(="[^"]*")?`);
          const newVal = attValue === void 0
            ? ' ' + attName
            : ` ${attName}="${attValue}"`;
          let isReplaced = false;
          returnVar = returnVar.replace(findAttr, (_match) => {
            isReplaced = true;
            return newVal;
          });
          if (!isReplaced) {
            returnVar = returnVar.substring(0, insertAttrPos) + newVal + returnVar.substring(insertAttrPos);
          }
        }
      }
      if (slotContent) {
        let insertPos = returnVar.indexOf('></') + 1;
        if (insertPos) {
          returnVar = returnVar.substring(0, insertPos) + slotContent + returnVar.substring(insertPos);
        } else {
          insertPos = /\/>\s*$/.exec(returnVar)!.index;
          returnVar = `${returnVar.substring(0, insertPos)}>${slotContent}</${attrName}>`;
        }
      }
      console.log(returnVar);
      return returnVar;
    },
  };
}
