import React from 'react';

export default function ColorFilter(props) {
  const { mana, handleManaChange, resetMana } = props;
  return (
    <>
      <div className="flex flex-row justify-between my-4 mx-0 max-w-full w-96">
        {Object.keys(mana).map((color, index) => {
          return (
            <div key={index} className="flex flex-col items-center w-16">
              <div
                className="flex justify-center items-center text-xl my-2 mx-0 h-8 w-10"
                type="button"
                onClick={() => handleManaChange(color, 1)}
              >
                +
              </div>
              <div className="flex flex-row items-center text-4xl h-10 justify-around w-4/5">
                {mana[color]}
                <img
                  className="h-6"
                  src={`https://c2.scryfall.com/file/scryfall-symbols/card-symbols/${color}.svg`}
                  alt={color}
                />
              </div>
              <button
                className="flex justify-center items-center text-xl my-2 mx-0 h-8 w-10"
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
        className="text-base mb-4"
        type="reset"
        onClick={() => resetMana()}
      >
        Reset Mana
      </button>
    </>
  );
}
