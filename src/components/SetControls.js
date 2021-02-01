export default function SetControls({
  currentSet,
  handleSetControlsChange,
  setControls,
}) {
  switch (currentSet) {
    case 'khm':
      const { foretold } = setControls;
      return (
        <div>
          <label htmlFor="foretold">Cards Foretold?</label>
          <input
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
