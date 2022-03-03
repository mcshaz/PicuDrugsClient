/*
function getFlow(weightKg) {
    if (weightKg < 50) {
        return weightKg * 5
    }
    if (weightKg <= 60) {
        return 150
    }
    if (weightKg <= 80) {
        return 200
    }
    return 250
}

var getLinearPredictor = (sizeFr) => 1.74190036e-02 - 1.39596195e-03 * sizeFr;

function getFormula(sizeFr) {
    const linearPredictor = getLinearPredictor(sizeFr);
    const b0 = -9.65776781
    const b1 = 0.771534053
    return {
        pressure: (flow) => b1 * (Math.exp(linearPredictor * flow) - 1) / linearPredictor - b0,
        flow: (pressure) => Math.log(1 + (linearPredictor * (pressure + b0) / b1)) / linearPredictor
    }
}

var i = 6.5
var lines = []
var targetPres = 100;

while (i <= 13) {
  lines.push({lineFr: i, pressure: getFormula(i).pressure})
  i += 0.5
}

var outpt = [];
for (i = 2.5; i < 85; i < 12 ? i += 0.5 : i += 2) {
  const flow = getFlow(i)
  outpt.push({
    wt: i,
    flow,
    lineFr100: lines.find(l => l.pressure(flow) < 100)?.lineFr,
    lineFr150: lines.find(l => l.pressure(flow) < 150)?.lineFr,
    lineFr200: lines.find(l => l.pressure(flow) < 200)?.lineFr
  })
}
var str = outpt.reduce((accum, o) => accum + Object.values(o).join('\t') + '\n' , '')
console.log(str)

*/
