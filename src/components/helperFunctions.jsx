import * as symbols from '../assets/symbols.jsx';

export const getManaSymbol = (color) => {
  switch (color) {
    case 'W':
      return symbols.W;
    case 'U':
      return symbols.U;
    case 'B':
      return symbols.B;
    case 'R':
      return symbols.R;
    case 'G':
      return symbols.G;
    case 'C':
      return symbols.C;
    case 'M':
      return symbols.M;
    case 'WU':
      return symbols.WU;
    case 'UB':
      return symbols.UB;
    case 'BR':
      return symbols.BR;
    case 'RG':
      return symbols.RG;
    case 'WG':
      return symbols.WG;
    case 'WB':
      return symbols.WB;
    case 'BG':
      return symbols.BG;
    case 'UG':
      return symbols.UG;
    case 'UR':
      return symbols.UR;
    case 'WR':
      return symbols.WR;
    case 'WUB':
      return symbols.WUB;
    case 'UBR':
      return symbols.UBR;
    case 'BRG':
      return symbols.BRG;
    case 'WRG':
      return symbols.WRG;
    case 'WUG':
      return symbols.WUG;
    case 'WBR':
      return symbols.WBR;
    case 'WBG':
      return symbols.WBG;
    case 'UBG':
      return symbols.UBG;
    case 'URG':
      return symbols.URG;
    case 'WUR':
      return symbols.WUR;
    case 'WUBR':
      return symbols.WUBR;
    case 'UBRG':
      return symbols.UBRG;
    case 'WBRG':
      return symbols.WBRG;
    case 'WURG':
      return symbols.WURG;
    case 'WUBG':
      return symbols.WUBG;
    default:
      return;
  }
};

export const sortMana = (a, b) => {
  const colorArray = ['W', 'U', 'B', 'R', 'G'];
  let indexOfA = colorArray.indexOf(a);

  if (indexOfA > 0) {
    for (let i = 0; i < indexOfA; i++) {
      colorArray.push(colorArray.shift());
    }
  }

  if (colorArray.indexOf(b) <= 2) {
    return -1;
  }

  if (colorArray.indexOf(b) >= 3) {
    return 1;
  }
};
