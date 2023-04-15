import React from 'react';

export default function SetControls({
  currentSet,
  handleSetControlsChange,
  setControls,
}) {
  switch (currentSet) {
    case 'khm':
      const { foretold } = setControls;
      return (
        <div className="flex items-center">
          <input
            className="mr-2"
            type="checkbox"
            name="foretold"
            id="foretold"
            checked={foretold}
            onChange={() => handleSetControlsChange('foretold', !foretold)}
          />
          <label className="text-base" htmlFor="foretold">
            Include Foretold cards
          </label>
        </div>
      );
    case 'mul':
    case 'grn':
      const { convoke } = setControls;
      return (
        <div className="flex items-center">
          <input
            className="mr-2"
            type="checkbox"
            name="convoke"
            id="convoke"
            checked={convoke}
            onChange={() => handleSetControlsChange('convoke', !convoke)}
          />
          <label className="text-base" htmlFor="convoke">
            Include Convoke Spells
          </label>
        </div>
      );
    default:
      return null;
  }
}
