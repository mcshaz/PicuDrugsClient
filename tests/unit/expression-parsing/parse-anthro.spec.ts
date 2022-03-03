import { expect } from 'chai';
import { parseAnthro } from '../../../src/services/parser/parse-expression';

describe('parseAnthro', () => {
  // try
  //  const fmt = Intl.DateTimeFormat(['en-NZ','en-AU','en-GB']).format;
  it('predicates correctly on all anthro', () => {
    const pretermExpression = 'cgaWeeks > 32 && cgaWeeks < 39';
    let result = parseAnthro(pretermExpression, { weightKg: 2.3, cgaWeeks: 35 });
    expect(result).to.equal(true);
    result = parseAnthro(pretermExpression, { weightKg: 1.3, cgaWeeks: 31 });
    expect(result).to.equal(false);
    const infantExpression = 'cgaWeeks >= 39 && ageMonths < 4';
    result = parseAnthro(infantExpression, { weightKg: 4.5, cgaWeeks: 43, ageMonths: 3.8 });
    expect(result).to.equal(true);
    result = parseAnthro(infantExpression, { weightKg: 4.9, cgaWeeks: 43, ageMonths: 4.5 });
    expect(result).to.equal(false);
  });
  it('calculates', () => {
    let result = parseAnthro('wtKg * 0.15', { weightKg: 2.3, cgaWeeks: 35 });
    expect(result).to.equal(2.3 * 0.15);
    result = parseAnthro('bsa * 0.5', { weightKg: 12, bsa: 0.8 });
    expect(result).to.equal(0.4);
  });
  it('throws with alert and document', () => {
    let malicious = () => parseAnthro(' alert(\'your computer is infected - send money\')', { weightKg: 4.9, cgaWeeks: 43, ageMonths: 4.5 });
    expect(malicious).to.throw();
    malicious = () => parseAnthro(' document.appendChild(\'<script src="http://malicious.gov"></script>\')', { weightKg: 4.9, cgaWeeks: 43, ageMonths: 4.5 });
    expect(malicious).to.throw();
  });
});
