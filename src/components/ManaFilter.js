import React from 'react';
import { useState } from 'react';
import { W, U, B, R, G, C, more, close } from '../assets/symbols';

export default function ColorFilter({ mana, handleManaChange, resetMana }) {
  const [active, setActive] = useState(false);

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
      <div className="flex flex-row flex-wrap my-4 mx-1 justify-center">
        {Object.keys(mana).map((color, index) => {
          return (
            <div key={index} className="flex flex-col items-center ">
              <div className="flex flex-col justify-around">
                <button
                  onClick={() => handleManaChange(color, 1)}
                  className="flex flex-col items-center text-2xl px-2"
                >
                  <span
                    className={mana[color] > 0 ? 'text-black' : 'text-gray-200'}
                  >
                    {mana[color]}
                  </span>
                  <div className="w-10 block">{manaSymbol(color)}</div>
                </button>
              </div>
              <div className="flex flex-row mt-4">
                <button
                  className={`${
                    mana[color] > 0 ? 'text-gray-800' : 'text-gray-300'
                  } text-xs px-1.5 py-0.5 rounded bg-gray-100`}
                  type="button"
                  onClick={() => handleManaChange(color, -1)}
                  disabled={mana[color] > 0 ? '' : 'disabled'}
                >
                  -1
                </button>
              </div>
            </div>
          );
        })}

        {/* Multicolor mana button */}

        <div className="flex flex-col items-center ">
          <span className="text-2xl px-4 invisible">0</span>
          <button className="flex flex-col items-center text-2xl px-2">
            <div className=" w-10 block" onClick={() => setActive(!active)}>
              {active ? close : more}
            </div>
          </button>
        </div>
        <div className="flex flex-row mt-4">
          <button
            className="
               invisible text-xs px-1.5 py-0.5 rounded bg-gray-100"
            type="button"
          ></button>
        </div>
      </div>

      <button
        className="text-sm mb-4 border border-gray-400 rounded-lg px-2 py-1 bg-gray-200 active:bg-gray-400"
        type="reset"
        onClick={() => resetMana()}
      >
        Clear all
      </button>
    </>
  );
}
