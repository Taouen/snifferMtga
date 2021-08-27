import { getManaSymbol } from './helperFunctions';
import ManaButton from './ManaButton';
import MulticolorMenu from './MulticolorMenu';

export default function ManaFilter({
  mana,
  multicolorMana,
  handleManaChange,
  addMulticolorManaSource,
  resetMana,
}) {
  return (
    // Main color buttons
    <div className="flex flex-col items-center">
      <div className="flex flex-row  mt-4 mx-1 justify-center">
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

      {/* Multicolr Mana buttons */}
      <div className="flex flex-row  my-4 mx-1 justify-center">
        {Object.keys(multicolorMana).map((color) => {
          return (
            <ManaButton
              key={color}
              color={color}
              mana={multicolorMana}
              symbol={getManaSymbol(color)}
              handleManaChange={handleManaChange}
            />
          );
        })}
        <MulticolorMenu addMulticolorManaSource={addMulticolorManaSource} />
      </div>

      <button
        className="text-sm border border-gray-400 rounded-lg px-2 py-1 bg-gray-200 active:bg-gray-400"
        type="reset"
        onClick={() => resetMana()}
      >
        Clear all
      </button>
    </div>
  );
}
