import React, { useState } from 'react';

export default function SetSelector(props) {
  // manually entering sets for now. Might attempt later on to fetch sets from a selected format
  const [sets] = useState([
    { code: 'ktk', name: 'Khans of Tarkir'},
    { code: 'lci', name: 'Lost Caverns of Ixalan' },
    { code: 'woe', name: 'Wilds of Eldraine' },
    { code: 'ltr', name: 'Lord of the Rings: Battle for Middle Earth' },
    { code: 'mul', name: 'March of the Machine' }, // Code is MUL because the bonus sheet of legendary creatures is a child set of MOM
    { code: 'sir', name: 'Shadows Remastered' },
    { code: 'one', name: 'Phyrexia: All Will Be One' },
    { code: 'bro', name: "The Brothers' War" },
    { code: 'ydmu', name: 'Alchemy: Dominaria United' },
    { code: 'dmu', name: 'Dominaria United' },
    { code: 'hbg', name: "Alchemy Horizons: Baldur's Gate" },
    { code: 'snc', name: 'Streets of New Capenna' },
    { code: 'neo', name: 'Kamigawa Neon Dynasty' },
    { code: 'vow', name: 'Innistrad: Crimson Vow' },
    { code: 'mid', name: 'Innistrad: Midnight Hunt' },
    { code: 'afr', name: 'Adventures in the Forgotten Realms' },
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
    { code: 'grn', name: 'Guilds of Ravnica' },
    { code: 'm19', name: 'Core Set 2019' },
  ]);

  return (
    <select
      className="text-base w-9/12 max-w-xs h-8 border border-gray-400 rounded mt-4 text-center dark:text-black"
      id="set"
      value={props.currentSet}
      onChange={props.handleSetChange}
    >
      {sets.map(({ code, name }) => {
        return (
          <option key={code} value={code}>
            {name}
          </option>
        );
      })}
    </select>
  );
}
