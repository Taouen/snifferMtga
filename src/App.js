import React from 'react';
import CardsList from './components/CardsList';
import SetSelector from './components/SetSelector';
import styled from 'styled-components';
import './styles/main.css';
import Loader from 'react-loader-spinner';
import ManaFilter from './components/ManaFilter';
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
`;

class App extends React.Component {
  state = {
    cards: [],
    currentSet: 'khm',
    mana: {
      W: 0,
      U: 0,
      B: 0,
      R: 0,
      G: 0,
      C: 0,
    },
    totalMana: 0,
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

  handleManaChange = (color, change) => {
    const { mana } = this.state;
    let { totalMana } = this.state;
    mana[color] += change;
    if (mana[color] < 0) {
      mana[color] = 0;
    }
    totalMana = Object.values(mana).reduce((a, b) => a + b, 0);
    this.setState({ totalMana, mana });
  };

  resetMana = () => {
    const { mana } = this.state;
    let { totalMana } = this.state;

    for (let color in mana) {
      mana[color] = 0;
    }
    totalMana = 0;

    this.setState({ mana, totalMana });
  };

  componentDidMount = () => {
    this.getLocalSetData(this.state.currentSet);
  };

  render() {
    const {
      currentSet,
      setControls,
      loading,
      cards,
      mana,
      totalMana,
    } = this.state;

    return (
      <Main>
        <header>MTGA Sniffer</header>
        <Controls>
          <SetSelector
            id="set"
            currentSet={currentSet}
            handleSetChange={this.handleSetChange}
          />
          <ManaFilter
            mana={this.state.mana}
            handleManaChange={this.handleManaChange}
            resetMana={this.resetMana}
          />

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
            mana={mana}
            setControls={setControls}
            totalMana={totalMana}
          />
        )}
      </Main>
    );
  }
}

export default App;
