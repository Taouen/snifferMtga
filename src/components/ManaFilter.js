import React from 'react';
import { W, U, B, R, G, C } from '../assets/manaSymbols';

const buttonClasses =
  'flex justify-center items-center text-xl my-2 mx-0 h-10 md:h-8 w-10 md:w-8 border border-gray-400 rounded-full bg-gray-200 active:bg-gray-400';

export default function ColorFilter(props) {
  const { mana, handleManaChange, resetMana } = props;
  const manaSymbol = (color) => {
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
      default:
        return;
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between my-4 mx-0 max-w-4/5 w-96">
        {Object.keys(mana).map((color, index) => {
          return (
            <div key={index} className="flex flex-col items-center w-16">
              <button
                className={buttonClasses}
                type="button"
                onClick={() => handleManaChange(color, 1)}
              >
                +
              </button>
              <div className="flex flex-row items-center text-4xl h-10 justify-around w-4/5">
                {mana[color]}
                <div className="w-6">{manaSymbol(color)}</div>
              </div>
              <button
                className={buttonClasses}
                type="button"
                onClick={() => handleManaChange(color, -1)}
              >
                -
              </button>
            </div>
          );
        })}
      </div>
      <button
        className="text-base mb-4 border border-gray-400 rounded-lg p-1 bg-gray-200 active:bg-gray-400"
        type="reset"
        onClick={() => resetMana()}
      >
        Reset Mana
      </button>
    </>
  );
}
