const ManaButton = ({ mana, color, handleManaChange, symbol }) => {
  const { value } = mana[color];
  return (
    <div className="flex flex-col items-center ">
      <div className="flex flex-col justify-around">
        <button
          onClick={() => handleManaChange(color, 1)}
          className="flex flex-col items-center text-2xl px-2"
          aria-label={color}
        >
          <span
            className={
              value > 0
                ? 'text-black dark:text-white'
                : 'text-gray-200 dark:text-gray-400'
            }
          >
            {value}
          </span>
          <div className="w-10 block">{symbol}</div>
        </button>
      </div>
      <div className="flex flex-row mt-4">
        <button
          className={`${
            value > 0
              ? 'text-gray-800 dark:text-black'
              : 'text-gray-300 dark:text-gray-400'
          } text-xs px-1.5 py-0.5 rounded bg-gray-100`}
          type="button"
          onClick={() => handleManaChange(color, -1)}
          disabled={value > 0 ? '' : 'disabled'}
        >
          -1
        </button>
      </div>
    </div>
  );
};

export default ManaButton;
