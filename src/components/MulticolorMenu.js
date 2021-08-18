import { React, useState } from 'react';
import { Planet } from 'react-planet';
import { W, U, B, R, G, confirm, close, add } from '../assets/symbols';

const colors = [
  { value: 'W', symbol: W },
  { value: 'U', symbol: U },
  { value: 'B', symbol: B },
  { value: 'R', symbol: R },
  { value: 'G', symbol: G },
];

const MulticolorMenu = () => {
  const colorsForNewLand = [];
  const [multicolorMenu, setMulticolorMenu] = useState('closed');

  let planetContent;

  switch (multicolorMenu) {
    case 'closed':
      planetContent = (
        <div
          style={{
            height: 40,
            width: 40,
            borderRadius: '50%',
          }}
          onClick={() => setMulticolorMenu('pending')}
        >
          {add}
        </div>
      );
      break;
    case 'pending':
      planetContent = (
        <div
          style={{
            height: 40,
            width: 40,
            borderRadius: '50%',
          }}
          onClick={() => setMulticolorMenu('closed')}
        >
          {close}
        </div>
      );
      break;
    case 'approve':
      planetContent = (
        <div
          style={{
            height: 40,
            width: 40,
            borderRadius: '50%',
          }}
          onClick={() => setMulticolorMenu('closed')}
        >
          {confirm}
        </div>
      );
      break;
  }

  return (
    <Planet
      centerContent={planetContent}
      rotation={145}
      onClose={() => setMulticolorMenu('closed')}
      autoClose
      orbitRadius={75}
      hideOrbit
    >
      {colors.map(({ value, symbol }, index) => (
        <button
          key={index}
          style={{
            height: 40,
            width: 40,
            borderRadius: '50%',
          }}
          onClick={() => {}}
        >
          {symbol}
        </button>
      ))}
    </Planet>
  );
};

export default MulticolorMenu;
