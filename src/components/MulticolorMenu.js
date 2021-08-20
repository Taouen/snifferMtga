import { React, useState } from 'react';
import { Planet } from 'react-planet';
import {
  W,
  U,
  B,
  R,
  G,
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
  confirm,
  close,
  add,
} from '../assets/symbols';

const MulticolorMenu = () => {
  const colorsForNewLand = [];
  const [multicolorMenu, setMulticolorMenu] = useState('closed');
  const [colors, setColors] = useState([
    { value: 'W', symbol: W, selected: false },
    { value: 'U', symbol: U, selected: false },
    { value: 'B', symbol: B, selected: false },
    { value: 'R', symbol: R, selected: false },
    { value: 'G', symbol: G, selected: false },
  ]);

  let planetContent;

  switch (multicolorMenu) {
    case 'closed':
      planetContent = (
        <div
          className="rounded-full w-10"
          onClick={() => setMulticolorMenu('open')}
        >
          {add}
        </div>
      );
      break;
    case 'open':
      planetContent = (
        <div
          className="rounded-full w-10"
          onClick={() => setMulticolorMenu('closed')}
        >
          {close}
        </div>
      );
      break;
    case 'pending':
      planetContent = (
        <div
          className="rounded-full w-10"
          onClick={() => setMulticolorMenu('closed')}
        >
          {confirm}
        </div>
      );
      break;
    default:
      return null;
  }

  const handleSelectMana = (index) => {
    const mana = [...colors];
    mana[index].selected = !mana[index].selected;
    setColors(mana);
  };

  return (
    <>
      <Planet
        centerContent={planetContent}
        rotation={145}
        className="absolute -left-10"
        onClose={() => {
          setMulticolorMenu('closed');
        }}
        autoClose
        orbitRadius={75}
        hideOrbit
      >
        {colors.map(({ value, symbol, selected }, index) => (
          <button
            key={value}
            className="rounded-full w-10 h-10"
            style={{
              boxShadow: '0 0 0.5rem',
            }}
            onClick={() => {
              // write handler function, move colors to state variable.
              handleSelectMana(index);
              setMulticolorMenu('pending');
            }}
          >
            <div
              className={`${
                selected ? 'relative z-10 w-full h-full rounded-full' : 'hidden'
              }`}
            ></div>
            {symbol}
          </button>
        ))}
      </Planet>
      <div
        className={`${
          multicolorMenu === 'open' || multicolorMenu === 'pending'
            ? 'absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-40'
            : 'hidden'
        }`}
      ></div>
    </>
  );
};

export default MulticolorMenu;
