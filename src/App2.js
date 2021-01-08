import React from 'react';
import CardListItem from './components/CardListItem';
import styled from 'styled-components';
import './styles/main.css';
// import base from './base';

/* To DO
 
  - import set symbol
  - enter packs owned
  - calculate packs needed
  - 
*/
const Main = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Select = styled.select`
  font-size: 16px;
  height: 2rem;
`;

const Ul = styled.ul`
  padding: 0;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

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
                  !rares.some((element) => element.name === item.name) &&
                  item.booster
                ) {
                  item.collected = 0;
                  rares.push(item);
                } else if (
                  item.rarity === 'mythic' &&
                  !mythics.some((element) => element.name === item.name) &&
                  item.booster
                ) {
                  item.collected = 0;
                  mythics.push(item);
                }
              });
              getCards(data.next_page);
            } else {
              data.data.map((item) => {
                if (
                  item.rarity === 'rare' &&
                  !rares.some((element) => element.name === item.name) &&
                  item.booster
                ) {
                  item.collected = 0;
                  rares.push(item);
                } else if (
                  item.rarity === 'mythic' &&
                  !mythics.some((element) => element.name === item.name) &&
                  item.booster
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
        console.log(JSON.stringify(rares));
        console.log(JSON.stringify(mythics));
        this.setState({ rares, mythics });
      };

      getCards(data.search_uri);
      console.log(data.icon_svg_uri);
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

  updateCollected = (event) => {
    const { currentSet, rares, mythics } = this.state;
    const name = event.target.id;
    const collected = event.target.value;

    rares.forEach((item) => {
      if (item.name === name) {
        item.collected = collected;
      }
    });
    mythics.forEach((item) => {
      if (item.name === name) {
        item.collected = collected;
      }
    });
    localStorage.setItem(`${currentSet}Rares`, JSON.stringify(rares));
    localStorage.setItem(`${currentSet}Mythics`, JSON.stringify(mythics));
    this.setState({ rares, mythics });
  };

  componentDidMount = () => {
    /* this.ref = base.syncState(`${this.state.mythics}`, {
      context: this,
      state: 'mythics',
    }); */
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
      <Main>
        <header className="text-green-600 font-times">
          MTGA Collection Tracker
        </header>
        <Controls>
          <Select
            id="set"
            value={this.state.currentSet}
            onChange={this.handleSetChange}
          >
            <option value="znr">Zendikar Rising</option>
            <option value="m21">Core Set 2021</option>
            <option value="iko">Ikoria</option>
            <option value="thb">Theros Beyond Death</option>
            <option value="eld">Throne of Eldraine</option>
          </Select>
          <Select
            id="rarity"
            value={this.state.raritySelector}
            onChange={this.handleRarityChange}
          >
            <option value="rare">Rare</option>
            <option value="mythic">Mythic Rare</option>
          </Select>
        </Controls>
        {list}
      </Main>
    );
  }
}

export default App2;
