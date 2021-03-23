import React from 'react';

const buttonClasses =
  'flex justify-center items-center text-xl my-2 mx-0 h-10 md:h-8 w-10 md:w-8 border border-gray-400 rounded-full bg-gray-200 active:bg-gray-400';

export default function ColorFilter(props) {
  const { mana, handleManaChange, resetMana } = props;
  return (
    <>
      <div className="flex flex-row justify-between my-4 mx-0 max-w-full w-96">
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
                <img
                  className="h-6"
                  src={`https://c2.scryfall.com/file/scryfall-symbols/card-symbols/${color}.svg`}
                  alt={color}
                />
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
