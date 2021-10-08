import { React, useState } from 'react';
import { sortMana } from './helperFunctions.js';
import { Planet } from 'react-planet';
import { W, U, B, R, G, confirm, close, add } from '../assets/symbols';

const MulticolorMenu = ({ addMulticolorManaSource }) => {
  const [colorsForNewLand, setColorsForNewLand] = useState([]);
  const [menuStatus, setMenuStatus] = useState('closed');
  const [colors, setColors] = useState({
    W: { value: 'W', symbol: W, selected: false, sortOrder: 1 },
    U: { value: 'U', symbol: U, selected: false, sortOrder: 2 },
    B: { value: 'B', symbol: B, selected: false, sortOrder: 3 },
    R: { value: 'R', symbol: R, selected: false, sortOrder: 4 },
    G: { value: 'G', symbol: G, selected: false, sortOrder: 5 },
  });

  let planetContent;
  const planetClassNames = 'rounded-full cursor-pointer w-10';

  switch (menuStatus) {
    case 'closed':
      planetContent = (
        <div className={planetClassNames} onClick={() => setMenuStatus('open')}>
          {add}
        </div>
      );
      break;
    case 'open':
      planetContent = (
        <div
          className={planetClassNames}
          onClick={() => setMenuStatus('closed')}
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

  const handleSelectMana = (key) => {
    const mana = { ...colors };
    const colorsAdded = [...colorsForNewLand];

    mana[key].selected = !mana[key].selected;

    if (colorsAdded.includes(mana[key])) {
      colorsAdded.splice(colorsAdded.indexOf(mana[key]), 1);
    } else {
      colorsAdded.push(mana[key]);
    }

    colorsAdded.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1));

    if (
      Object.values(mana)
        .map((object) => object.selected)
        .filter((item) => item === true).length >= 2 &&
      Object.values(mana)
        .map((object) => object.selected)
        .filter((item) => item === true).length <= 4
    ) {
      setMenuStatus('pending');
    } else {
      setMenuStatus('open');
    }

    setColors(mana);
    setColorsForNewLand(colorsAdded);
  };

  const handleClose = () => {
    setColors((prevState) => {
      for (let color in prevState) {
        prevState[color].selected = false;
      }
      return prevState;
    });
    setMenuStatus('closed');
    setColorsForNewLand([]);
  };

  const handleConfirm = () => {
    const colorsSelected = [...colorsForNewLand];
    const colorsAddedValues = [];
    colorsSelected.forEach((color) => {
      colorsAddedValues.push(color.value);
    });
    addMulticolorManaSource(colorsAddedValues.join(''));
    handleClose();
  };

  return (
    <div className="w-10 h-10 mx-2">
      <Planet
        centerContent={planetContent}
        rotation={145}
        onClose={() => {
          handleClose();
        }}
        autoClose
        orbitRadius={75}
        hideOrbit
      >
        {Object.entries(colors).map(([key, { value, selected, symbol }]) => (
          <button
            key={value}
            className="rounded-full w-10 h-10"
            style={{
              boxShadow: '0 0 0.5rem',
            }}
            onClick={() => {
              handleSelectMana(key);
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
          menuStatus === 'open' || menuStatus === 'pending'
            ? 'absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-40'
            : 'hidden'
        }`}
      ></div>
    </div>
  );
};

export default MulticolorMenu;
