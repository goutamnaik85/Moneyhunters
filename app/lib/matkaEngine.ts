import { wrapDigit, RED_JODIS } from './utils';

export interface MatkaInput {
  openPanel: string;
  jodi: string;
  closePanel: string;
}

export interface PyramidStep {
  level: number;
  values: number[];
}

export interface MatkaResult {
  openPanel: string;
  jodi: string;
  closePanel: string;
  pyramidSteps: PyramidStep[];
  finalOtcDigit: number;
  otcSequence: number[];
  removedOtcDigit: number;
  otcPool: number[];
  openDigits: number[];
  closeDigits: number[];
  missingDigits: number[];
  directJodis: string[];
  reverseJodis: string[];
  initialJodis: string[];
  redJodisRemoved: string[];
  jodisAfterRedRemoval: string[];
  openCuts: number[];
  closeCuts: number[];
  globalCuts: number[];
  rules15_16_17_digits: number[];
  openDigitsFinal: number[];
  closeDigitsFinal: number[];
  filteredJodis: string[];
  strongJodis: string[];
  top8Predictions: string[];
}

function sumAdjacent(arr: number[]): number[] {
  const res: number[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    res.push(wrapDigit(arr[i] + arr[i + 1]));
  }
  return res;
}

function getAllJodisFromDigits(digits: number[]): string[] {
  const jodis: string[] = [];
  for (let i = 0; i < digits.length; i++) {
    for (let j = 0; j < digits.length; j++) {
      jodis.push(`${digits[i]}${digits[j]}`);
    }
  }
  return [...new Set(jodis)].sort();
}

function getMissingDigits(used: number[]): number[] {
  return [0,1,2,3,4,5,6,7,8,9].filter(d => !used.includes(d));
}

function buildDirectReverseJodis(missing: number[]) {
  const direct = getAllJodisFromDigits(missing);
  const reverse = direct.map(j => j[1] + j[0]);
  return { direct, reverse: [...new Set(reverse)] };
}

function removeRedJodis(jodis: string[]) {
  const kept = jodis.filter(j => !RED_JODIS.includes(j));
  const removed = jodis.filter(j => RED_JODIS.includes(j));
  return { kept, removed };
}

function calculateCuts(input: MatkaInput) {
  const o = input.openPanel.split('').map(Number);
  const c = input.closePanel.split('').map(Number);
  const j = input.jodi.split('').map(Number);

  const openUnit = wrapDigit(o.reduce((a,b)=>a+b,0));
  const closeUnit = wrapDigit(c.reduce((a,b)=>a+b,0));
  const jodiUnit = wrapDigit(j.reduce((a,b)=>a+b,0));

  const openCuts: number[] = [];
  const closeCuts: number[] = [];

  openCuts.push(openUnit);
  closeCuts.push(closeUnit);
  openCuts.push(wrapDigit(openUnit + 5));
  closeCuts.push(wrapDigit(closeUnit + 5));
  openCuts.push(wrapDigit(openUnit + 1), wrapDigit(openUnit - 1));
  closeCuts.push(wrapDigit(closeUnit + 1), wrapDigit(closeUnit - 1));
  openCuts.push(wrapDigit(openUnit + 2), wrapDigit(openUnit - 2));
  closeCuts.push(wrapDigit(closeUnit + 2), wrapDigit(closeUnit - 2));
  openCuts.push(wrapDigit(o[0] + o[2]));
  closeCuts.push(wrapDigit(c[0] + c[2]));
  openCuts.push(o[1]);
  closeCuts.push(c[1]);
  openCuts.push(j[0]);
  closeCuts.push(j[1]);
  openCuts.push(jodiUnit);
  closeCuts.push(jodiUnit);
  openCuts.push(wrapDigit(jodiUnit + 5));
  closeCuts.push(wrapDigit(jodiUnit + 5));
  const ocSum = wrapDigit(openUnit + closeUnit);
  openCuts.push(ocSum);
  closeCuts.push(ocSum);
  const ocDiff = wrapDigit(Math.abs(openUnit - closeUnit));
  openCuts.push(ocDiff);
  closeCuts.push(ocDiff);
  openCuts.push(wrapDigit(openUnit * 2));
  closeCuts.push(wrapDigit(closeUnit * 2));
  openCuts.push(wrapDigit(openUnit * 3));
  closeCuts.push(wrapDigit(closeUnit * 3));
  openCuts.push(o[0]);
  closeCuts.push(c[0]);

  const r15 = [o[2], c[2]];
  const r16 = [wrapDigit(o.reduce((a,b)=>a+b,0)), wrapDigit(c.reduce((a,b)=>a+b,0))];
  const r17 = [wrapDigit(jodiUnit + 3), wrapDigit(jodiUnit - 3)];

  const globalCuts = [...new Set([...r15, ...r16, ...r17])];

  return {
    openCuts: [...new Set(openCuts)],
    closeCuts: [...new Set(closeCuts)],
    globalCuts,
    rule151617: [...new Set([...r15, ...r16, ...r17])]
  };
}

export function processMatka(input: MatkaInput): MatkaResult {
  const jodiDigits = input.jodi.split('').map(Number);
  const baseArr = [...jodiDigits, 8, 8, 8];
  const pyramidSteps: PyramidStep[] = [];
  let current = [...baseArr];
  pyramidSteps.push({ level: 0, values: current });

  while (current.length > 1) {
    current = sumAdjacent(current);
    pyramidSteps.push({ level: pyramidSteps.length, values: current });
  }

  const finalOtcDigit = current[0];
  const otcSequence = [
    wrapDigit(finalOtcDigit - 1),
    finalOtcDigit,
    wrapDigit(finalOtcDigit + 1),
    wrapDigit(finalOtcDigit + 2),
    wrapDigit(finalOtcDigit + 3)
  ];
  const removedOtcDigit = otcSequence[1];
  const otcPool = [otcSequence[0], otcSequence[2], otcSequence[3], otcSequence[4]];

  const openDigits = [...new Set(input.openPanel.split('').map(Number))];
  const closeDigits = [...new Set(input.closePanel.split('').map(Number))];
  const allUsed = [...new Set([...openDigits, ...closeDigits])];
  const missingDigits = getMissingDigits(allUsed);

  const { direct, reverse } = buildDirectReverseJodis(missingDigits);
  const initialJodis = [...new Set([...direct, ...reverse])].sort();
  const { kept: jodisAfterRedRemoval, removed: redJodisRemoved } = removeRedJodis(initialJodis);

  const { openCuts, closeCuts, globalCuts, rule151617 } = calculateCuts(input);

  const openDigitsFinal = openDigits.filter(d => !rule151617.includes(d));
  const closeDigitsFinal = closeDigits.filter(d => !rule151617.includes(d));

  const filteredJodis = jodisAfterRedRemoval.filter(j => {
    const first = parseInt(j[0]);
    const second = parseInt(j[1]);
    return openDigitsFinal.includes(first) && closeDigitsFinal.includes(second);
  });

  const strongJodis = filteredJodis.filter(j => {
    const first = parseInt(j[0]);
    const second = parseInt(j[1]);
    return openCuts.includes(first) && closeCuts.includes(second) && !globalCuts.includes(first) && !globalCuts.includes(second);
  });

  const top8Predictions = strongJodis.slice(0, 8);
  while (top8Predictions.length < 8 && filteredJodis.length > top8Predictions.length) {
    const next = filteredJodis.find(j => !top8Predictions.includes(j));
    if (next) top8Predictions.push(next);
    else break;
  }

  return {
    openPanel: input.openPanel,
    jodi: input.jodi,
    closePanel: input.closePanel,
    pyramidSteps,
    finalOtcDigit,
    otcSequence,
    removedOtcDigit,
    otcPool,
    openDigits,
    closeDigits,
    missingDigits,
    directJodis: direct,
    reverseJodis: reverse,
    initialJodis,
    redJodisRemoved,
    jodisAfterRedRemoval,
    openCuts,
    closeCuts,
    globalCuts,
    rules15_16_17_digits: rule151617,
    openDigitsFinal,
    closeDigitsFinal,
    filteredJodis,
    strongJodis,
    top8Predictions
  };
}
