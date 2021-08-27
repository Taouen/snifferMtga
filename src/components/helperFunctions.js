import {
  W,
  U,
  B,
  R,
  G,
  C,
  M,
  WU,
  UB,
  BR,
  RG,
  GW,
  WB,
  BG,
  GU,
  UR,
  RW,
} from '../assets/symbols';

export const getManaSymbol = (color) => {
  switch (color) {
    case 'W':
      return W;
    case 'U':
      return U;
    case 'B':
      return B;
    case 'R':
      return R;
    case 'G':
      return G;
    case 'C':
      return C;
    case 'M':
      return M;
    case 'WU':
      return WU;
    case 'UB':
      return UB;
    case 'BR':
      return BR;
    case 'RG':
      return RG;
    case 'GW':
      return GW;
    case 'WB':
      return WB;
    case 'BG':
      return BG;
    case 'GU':
      return GU;
    case 'UR':
      return UR;
    case 'RW':
      return RW;
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
