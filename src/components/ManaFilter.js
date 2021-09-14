import { getManaSymbol } from './helperFunctions';
import ManaButton from './ManaButton';
import MulticolorMenu from './MulticolorMenu';

const resetButtonClasses =
  'text-sm border border-gray-400 rounded-lg px-2 py-1 bg-gray-200 active:bg-gray-400 w-24 mx-2';

export default function ManaFilter({
  mana,
  handleManaChange,
  addMulticolorManaSource,
  clearMana,
  resetMana,
}) {
  return (
    // Color Buttons
    <div className="flex flex-col items-center">
      <div className="flex flex-row flex-wrap max-w-screen mt-4 mx-1 justify-center">
        {Object.keys(mana).map((color) => {
          return (
            <ManaButton
              key={color}
              color={color}
              mana={mana}
              symbol={getManaSymbol(color)}
              handleManaChange={handleManaChange}
            />
          );
        })}
      </div>

      {/* Add Multicolor source button */}
      <div className="flex flex-row my-4 mx-1 justify-center items-center flex-wrap">
        <MulticolorMenu addMulticolorManaSource={addMulticolorManaSource} />
      </div>
      <div className="flex flex-row">
        <button
          className={resetButtonClasses}
          type="reset"
          onClick={() => clearMana()}
        >
          Clear Mana
        </button>
        <button
          className={resetButtonClasses}
          type="reset"
          onClick={() => resetMana()}
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
}
