import { useState } from 'react';

export default function SetSelector(props) {
  // manually entering sets for now. Might attempt later on to fetch sets from a selected format
  const [sets] = useState([
    { code: 'khm', name: 'Kaldheim' },
    { code: 'znr', name: 'Zendikar Rising' },
    { code: 'm21', name: 'Core Set 2021' },
    { code: 'iko', name: 'Ikoria' },
    { code: 'thb', name: 'Theros Beyond Death' },
    { code: 'eld', name: 'Throne of Eldraine' },
    { code: 'm20', name: 'Core Set 2020' },
    { code: 'war', name: 'War of the Spark' },
    { code: 'rna', name: 'Ravnica Allegiance' },
    { code: 'GRN', name: 'Guilds of Ravnica' },
    { code: 'm19', name: 'Core Set 2019' },
  ]);

  return (
    <select
      className="text-base w-3/5 h-8"
      id="set"
      value={props.currentSet}
      onChange={props.handleSetChange}
    >
      {sets.map((set, index) => {
        return (
          <option key={index} value={set.code}>
            {set.name}
          </option>
        );
      })}
    </select>
  );
}
