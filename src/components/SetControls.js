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
          <label htmlFor="foretold">Cards Foretold?</label>
          <input
            className="ml-2"
            type="checkbox"
            name="foretold"
            id="foretold"
            onChange={() => handleSetControlsChange('foretold', !foretold)}
          />
        </div>
      );

    default:
      return null;
  }
}
