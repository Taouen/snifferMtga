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
  const planetClassNames = 'rounded-full cursor-pointer w-10';
  switch (multicolorMenu) {
    case 'closed':
      planetContent = (
        <div
          className={planetClassNames}
          onClick={() => setMulticolorMenu('open')}
        >
          {add}
        </div>
      );
      break;
    case 'open':
      planetContent = (
        <div
          className={planetClassNames}
          onClick={() => setMulticolorMenu('closed')}
        >
          {close}
        </div>
      );
      break;
    case 'pending':
      planetContent = (
        <div
          className={planetClassNames}
          onClick={() => {
            handleConfirm();
          }}
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
    setMulticolorMenu('pending');
  };

  const handleConfirm = () => {
    const mana = [...colors];
    setMulticolorMenu('closed');
    mana.forEach((color) => {
      color.selected = false;
    });
    setColors(mana);
  };

  return (
    <div className="w-10 h-10">
      <Planet
        centerContent={planetContent}
        rotation={145}
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
              handleSelectMana(index);
            }}
          >
            <div
              className={`${
                selected
                  ? 'w-10 h-10 rounded-full opacity-70 absolute'
                  : 'hidden'
              }`}
            >
              {confirm}
            </div>
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
    </div>
  );
};

export default MulticolorMenu;
