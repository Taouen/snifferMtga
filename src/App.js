import React from 'react';
import CardsList from './components/CardsList';
import SetSelector from './components/SetSelector';
import styled from 'styled-components';
import './styles/main.css';
import Loader from 'react-loader-spinner';
import ColorFilter from './components/ColorFilter';
import CmcFilter from './components/CmcFilter';

/* To DO
  
- figure out logic for including hybrid cards when either of their colors are selected
- 
*/

const Main = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 1.5rem 0;
  height: 6rem;
`;

class App extends React.Component {
  state = {
    cards: [],
    currentSet: 'khm',
    filters: {
      colors: ['W', 'U', 'B', 'R', 'G'],
      cmc: 10,
    },
    lastUpdated: '',
    loading: true,
  };

  getSetData = async (set) => {
    const cardSet = await fetch(`https://api.scryfall.com/sets/${set}`);
    const cards = [];

    cardSet.json().then((data) => {
      const getCards = async (uri) => {
        await fetch(uri).then((response) => {
          response.json().then((data) => {
            if (data.has_more) {
              data.data.forEach((item) => {
                const { booster, type_line, oracle_text } = item;
                if (
                  booster &&
                  (type_line.includes('Instant') ||
                    (oracle_text && oracle_text.includes('Flash')))
                ) {
                  cards.push(item);
                }
              });
              getCards(data.next_page);
            } else {
              data.data.forEach((item) => {
                const { booster, type_line, oracle_text } = item;
                if (
                  booster &&
                  (type_line.includes('Instant') ||
                    (oracle_text && oracle_text.includes('Flash')))
                ) {
                  cards.push(item);
                }
              });
            }

            localStorage.setItem(`${set}`, JSON.stringify(cards));
            localStorage.setItem(
              `${set}lastUpdated`,
              JSON.stringify(Date.now())
            );
            this.setState({ cards, loading: false });
          });
        });
      };

      getCards(data.search_uri);
    });
  };

  getLocalSetData = (set) => {
    if (localStorage.getItem(`${set}`)) {
      const cards = JSON.parse(localStorage.getItem(`${set}`));
      this.setState({ cards, loading: false });
    } else {
      this.getSetData(set);
    }
  };

  handleColorChange = (event) => {
    const value = event.target.value;
    const { filters } = this.state;

    if (!filters.colors.some((item) => item === value)) {
      filters.colors.push(value);
    } else {
      filters.colors.splice(filters.colors.indexOf(value), 1);
    }
    this.setState({ filters });
  };

  handleCmcChange = (event) => {
    const value = event.target.value;
    const { filters } = this.state;
    filters.cmc = value;
    this.setState({ filters });
  };

  handleSetChange = (event) => {
    const currentSet = event.target.value;
    const now = Date.now();
    const lastUpdated = JSON.parse(
      localStorage.getItem(`${currentSet}lastUpdated`)
    );

    this.setState({ loading: true });

    // if more than 24 hours has passed, fetch the set again, otherwise use the current localstorage version
    if (now - lastUpdated > 86400000) {
      this.getSetData(currentSet);
    } else {
      this.getLocalSetData(currentSet);
    }

    this.setState({ currentSet });
  };

  componentDidMount = () => {
    this.getLocalSetData(this.state.currentSet);
  };

  render() {
    return (
      <Main>
        <header className="text-green-600 font-times">MTGA Sniffer</header>
        <Controls>
          <SetSelector
            id="set"
            currentSet={this.state.currentSet}
            handleSetChange={this.handleSetChange}
          />
          <ColorFilter handleColorChange={this.handleColorChange} />
          <CmcFilter handleCmcChange={this.handleCmcChange} />
        </Controls>
        {this.state.loading && (
          <Loader type="Oval" color="#00BFFF" height={40} width={40} />
        )}
        {!this.state.loading && (
          <CardsList filters={this.state.filters} cards={this.state.cards} />
        )}
      </Main>
    );
  }
}

export default App;
