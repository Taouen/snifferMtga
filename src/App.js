import React from 'react';
import CardsList from './components/CardsList';
import SetSelector from './components/SetSelector';
import styled from 'styled-components';
import './styles/main.css';
import Loader from 'react-loader-spinner';
import ColorFilter from './components/ColorFilter';
import CmcFilter from './components/CmcFilter';
import SetControls from './components/SetControls';

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
  padding: 1.5rem 0;
  font-size: 1.2rem;
  height: 8rem;
`;

class App extends React.Component {
  state = {
    cards: [],
    currentSet: 'khm',
    filters: {
      colors: [
        /* 'W', 'U', 'B', 'R', 'G' */
      ],
      availableMana: 10,
    },
    setControls: {
      foretold: false,
    },
    loading: true,
  };

  getSetData = async (set) => {
    const cardSet = await fetch(`https://api.scryfall.com/sets/${set}`);
    const cards = [];

    cardSet
      .json()
      .then((data) => {
        const getCards = async (uri) => {
          await fetch(uri)
            .then((response) => {
              response
                .json()
                .then((data) => {
                  if (data.has_more) {
                    data.data.forEach((item) => {
                      const { booster, type_line, keywords } = item;
                      if (
                        booster &&
                        (type_line.includes('Instant') ||
                          (keywords && keywords.indexOf('Flash') !== -1))
                      ) {
                        cards.push(item);
                      }
                    });
                    getCards(data.next_page);
                  } else {
                    data.data.forEach((item) => {
                      const { booster, type_line, keywords } = item;
                      if (
                        booster &&
                        (type_line.includes('Instant') ||
                          (keywords && keywords.indexOf('Flash') !== -1))
                      ) {
                        cards.push(item);
                      }
                    });
                  }

                  sessionStorage.setItem(`${set}`, JSON.stringify(cards));
                  this.setState({ cards, loading: false });
                })
                .catch(console.error());
            })
            .catch(console.error());
        };

        getCards(data.search_uri);
      })
      .catch(console.error());
  };

  getLocalSetData = (set) => {
    if (sessionStorage.getItem(`${set}`)) {
      const cards = JSON.parse(sessionStorage.getItem(`${set}`));
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
    filters.availableMana = value;
    this.setState({ filters });
  };

  handleSetChange = (event) => {
    const currentSet = event.target.value;
    this.setState({ loading: true });
    this.getLocalSetData(currentSet);
    this.setState({ currentSet });
  };

  handleSetControlsChange = (name, value) => {
    const setControls = this.state.setControls;
    setControls[name] = value;
    this.setState({ setControls });
  };

  componentDidMount = () => {
    this.getLocalSetData(this.state.currentSet);
  };

  render() {
    const { currentSet, setControls, loading, cards, filters } = this.state;
    return (
      <Main>
        <header className="text-green-600 font-times">MTGA Sniffer</header>
        <Controls>
          <SetSelector
            id="set"
            currentSet={currentSet}
            handleSetChange={this.handleSetChange}
          />
          <ColorFilter handleColorChange={this.handleColorChange} />
          <CmcFilter handleCmcChange={this.handleCmcChange} />
          <SetControls
            currentSet={currentSet}
            setControls={setControls}
            handleSetControlsChange={this.handleSetControlsChange}
          />
        </Controls>
        {loading ? (
          <Loader type="Oval" color="#00BFFF" height={40} width={40} />
        ) : (
          <CardsList
            cards={cards}
            currentSet={currentSet}
            filters={filters}
            setControls={setControls}
          />
        )}
      </Main>
    );
  }
}

export default App;
