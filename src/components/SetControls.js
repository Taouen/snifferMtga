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
            onChange={() => handleSetControlsChange('foretold', !foretold)}
          />
          <label className="text-base" htmlFor="foretold">
            Include Foretold cards
          </label>
        </div>
      );

    default:
      return null;
  }
}
