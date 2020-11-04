import React from 'react';

class App2 extends React.Component {
  state = {
    currentSet: 'znr',
    cardsList: [],
  };

  getSetData = async (set) => {
    const cardSet = await fetch(`https://api.scryfall.com/sets/${set}`);
    const cardsList = [];

    cardSet.json().then((data) => {
      const getCards = async (uri) => {
        await fetch(uri).then((response) => {
          response.json().then((data) => {
            if (data.has_more) {
              data.data.map((item) => {
                if (
                  (item.rarity === 'rare' || item.rarity === 'mythic') &&
                  !cardsList.some((element) => element.name === item.name)
                )
                  cardsList.push(item);
              });
              getCards(data.next_page);
            } else {
              data.data.map((item) => {
                if (
                  (item.rarity === 'rare' || item.rarity === 'mythic') &&
                  !cardsList.some((element) => element.name === item.name)
                )
                  cardsList.push(item);
                //localStorage.setItem(set, JSON.stringify(cardsList));
              });
            }
          });
        });
      };

      getCards(data.search_uri);
      console.log('successfully fetched set data');
      this.setState({ cardsList });
      console.log('Set state to current cardsList');
    });
  };

  getLocalSetData = (set) => {
    if (localStorage.getItem(set)) {
      const cardsList = JSON.parse(localStorage.getItem(set));
      this.setState({ cardsList });
      console.log('loading local set data');
    } else {
      this.getSetData(set);
      console.log('fetching set data');
    }
  };

  handleSetChange = (event) => {
    const currentSet = event.target.value;
    this.getLocalSetData(currentSet);
    this.setState({ currentSet });
    console.log('set changed');
  };

  componentDidMount = () => {
    console.log('component mounted');
    this.getLocalSetData(this.state.currentSet);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">MTGA Collection Tracker</header>
        <select
          id="set"
          value={this.state.currentSet}
          onChange={this.handleSetChange}
        >
          <option value="znr">Zendikar Rising</option>
          <option value="m21" defaultValue>
            Core Set 2021
          </option>
          <option value="iko">Ikoria</option>
          <option value="thb">Theros Beyond Death</option>
          <option value="eld">Throne of Eldraine</option>
        </select>
        {this.state.cardsList.map((item) => {
          const { id, name, rarity } = item;
          if (rarity === 'rare') {
            return <p key={id}>{name}</p>;
          }
        })}
      </div>
    );
  }
}

export default App2;
