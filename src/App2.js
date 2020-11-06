import React from 'react';
import CardListItem from './components/CardListItem';

/* To DO
 
  - import set symbol
  - enter quantity (min 0, max 4)
  - enter packs owned
  -  
*/

class App2 extends React.Component {
  state = {
    currentSet: 'znr',
    mythics: [],
    rares: [],
    raritySelector: 'rare',
  };

  getSetData = async (set) => {
    const cardSet = await fetch(`https://api.scryfall.com/sets/${set}`);
    const rares = [];
    const mythics = [];

    cardSet.json().then((data) => {
      const getCards = async (uri) => {
        await fetch(uri).then((response) => {
          response.json().then((data) => {
            if (data.has_more) {
              data.data.map((item) => {
                if (
                  item.rarity === 'rare' &&
                  !rares.some((element) => element.name === item.name)
                ) {
                  item.collected = 0;
                  rares.push(item);
                } else if (
                  item.rarity === 'mythic' &&
                  !mythics.some((element) => element.name === item.name)
                ) {
                  item.collected = 2;
                  mythics.push(item);
                }
              });
              getCards(data.next_page);
            } else {
              data.data.map((item) => {
                if (
                  item.rarity === 'rare' &&
                  !rares.some((element) => element.name === item.name)
                ) {
                  item.collected = 0;
                  rares.push(item);
                } else if (
                  item.rarity === 'mythic' &&
                  !mythics.some((element) => element.name === item.name)
                ) {
                  item.collected = 0;
                  mythics.push(item);
                }
              });
            }
            localStorage.setItem(`${set}Rares`, JSON.stringify(rares));
            localStorage.setItem(`${set}Mythics`, JSON.stringify(mythics));
          });
        });
        this.setState({ rares, mythics });
      };

      getCards(data.search_uri);
    });
  };

  getLocalSetData = (set) => {
    if (localStorage.getItem(`${set}Rares`)) {
      const rares = JSON.parse(localStorage.getItem(`${set}Rares`));
      const mythics = JSON.parse(localStorage.getItem(`${set}Mythics`));
      this.setState({ rares, mythics });
    } else {
      this.getSetData(set);
    }
  };

  handleSetChange = (event) => {
    const currentSet = event.target.value;
    this.getLocalSetData(currentSet);
    this.setState({ currentSet });
  };

  handleRarityChange = (event) => {
    const raritySelector = event.target.value;
    this.setState({ raritySelector });
  };

  // Working on writing two formulas, one to select the card to update, and one to update the collected value for the card, then call them both within a single function to pass to the component.

  flagForUpdate = (name) => {
    const { rares, mythics } = this.state;
  };

  updateCollected = (e) => {
    const { rares, mythics } = this.state;
    console.log(e);
  };

  componentDidMount = () => {
    this.getLocalSetData(this.state.currentSet);
  };

  render() {
    let list;
    if (this.state.raritySelector === 'rare') {
      list = (
        <ul>
          {this.state.rares.map((item) => {
            const { collected, id, name } = item;
            let color;
            if (item.card_faces) {
              color = item.card_faces[0].colors;
            } else {
              color = item.colors;
            }

            return (
              <CardListItem
                collected={collected}
                key={id}
                name={name}
                colors={color}
                updateCollected={this.updateCollected}
              />
            );
          })}
        </ul>
      );
    } else if (this.state.raritySelector === 'mythic') {
      list = (
        <ul>
          {this.state.mythics.map((item) => {
            const { collected, id, name } = item;
            let color;
            if (item.card_faces) {
              color = item.card_faces[0].colors;
            } else {
              color = item.colors;
            }

            return (
              <CardListItem
                collected={collected}
                key={id}
                name={name}
                colors={color}
                updateCollected={this.updateCollected}
              />
            );
          })}
        </ul>
      );
    }

    return (
      <div className="App">
        <header className="App-header">MTGA Collection Tracker</header>
        <select
          id="set"
          value={this.state.currentSet}
          onChange={this.handleSetChange}
        >
          <option value="znr">Zendikar Rising</option>
          <option value="m21">Core Set 2021</option>
          <option value="iko">Ikoria</option>
          <option value="thb">Theros Beyond Death</option>
          <option value="eld">Throne of Eldraine</option>
        </select>
        <select
          id="rarity"
          value={this.state.raritySelector}
          onChange={this.handleRarityChange}
        >
          <option value="rare">Rare</option>
          <option value="mythic">Mythic Rare</option>
        </select>
        {list}
      </div>
    );
  }
}

export default App2;
