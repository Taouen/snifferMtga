import React, { useState } from 'react';

export default function SetSelector(props) {
  // manually entering sets for now. Might attempt later on to fetch sets from a selected format
  const [sets] = useState([
    { code: 'afr', name: 'Adventures in the Forgotten Realms'},
    { code: 'sta', name: 'Strixhaven' }, // This has set code STA because the fetch function will find the parent set cards based off the sub set codes
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
      className="text-base w-9/12 h-8 border border-gray-400 rounded mt-4 text-center"
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
