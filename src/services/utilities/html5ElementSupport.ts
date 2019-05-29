export enum dateElSupportValues { noSupport, elSupport, valueAsDateSupport }

export const dateElSupport = (() => {
    const input = document.createElement('input');
    const v = 'a';
    input.setAttribute('type', 'date');
    input.setAttribute('value', v);
    if (input.value === v) {
        return dateElSupportValues.noSupport;
    }
    return input.valueAsDate === null
        ? dateElSupportValues.valueAsDateSupport
        : dateElSupportValues.elSupport;
})();

export const  isTimeElSupported = (() => {
    const input = document.createElement('input');
    const v = 'F';
    input.setAttribute('type', 'date');
    input.setAttribute('value', v);
    return (input.value !== v);
})();
