import React, { useState, useEffect } from 'react';

/* To DO

  - select Set
  - import set symbol
  - import rares and mythics
  - display cards as list
  - enter quantity (min 0, max 4)
  - enter packs owned
  -  
*/

const App = () => {
  const [set, setSet] = useState('znr');
  const [setInfo, setSetInfo] = useState([]);

  const getSetData = async () => {
    const cardSet = await fetch(`https://api.scryfall.com/sets/${set}`);
    cardSet.json().then((data) => {
      fetch(data.search_uri).then((response) =>
        response.json().then((data) => {
          setSetInfo(data);
        })
      );
    });
  };

  // currently fetching data multiple times, when logging, it was logging about 1-2 times per second
  useEffect(() => {
    getSetData();
  });

  return (
    <div className="App">
      <header className="App-header">MTGA Collection Tracker</header>
      <form>
        <select id="set" required>
          <option value="znr">Zendikar Rising</option>
          <option value="m21" defaultValue>
            Core Set 2021
          </option>
          <option value="iko">Ikoria</option>
          <option value="thb">Theros Beyond Death</option>
          <option value="eld">Throne of Eldraine</option>
        </select>
      </form>
    </div>
  );
};

export default App;
