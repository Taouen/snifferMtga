import React from 'react';
import CardsList from './components/CardsList';
import SetSelector from './components/SetSelector';
import { PulseLoader } from 'react-spinners';
import ManaFilter from './components/ManaFilter';
import SetControls from './components/SetControls';
import * as scryfall from 'scryfall-client';

// TODO - fix memory leak (cancel async fetch when unmount, memory leak when changing sets before the fetch finishes)
// TODO - Add a way for a user to input lands that produce more than one type of mana

class App extends React.Component {
  state = {
    cards: [],
    currentSet: 'sta',
    error: false,
    loading: true,
    mana: {
      W: 0,
      U: 0,
      B: 0,
      R: 0,
      G: 0,
      C: 0,
    },
    setControls: {
      foretold: false,
    },
    totalMana: 0,
  };

  getSetData = async (setCode) => {
    const { cards } = this.state;
    scryfall.getSet(setCode).then((set) => {
      if (set.parent_set_code) {
        scryfall
          .search(
            `set:${set.parent_set_code} (t:instant or keyword:flash) lang=en order:set unique:prints`
          )
          .then((list) => {
            this.setState({ cards: list, loading: false });
          })
          .then(() => {
            scryfall.search();
          });
      }
    });
    scryfall
      .search(
        `s:${this.state.currentSet} (t:instant or keyword:flash) order:set  lang=en`
      )
      .then((list) => {
        console.log(list);
      })
      .catch((err) => {
        console.error(err);
        this.setState({ error: true, loading: false });
      });
  };

  componentDidMount = () => {
    // this.getLocalSetData(this.state.currentSet);
    this.getSetData(this.state.currentSet);
  };

  getLocalSetData = (set) => {
    if (sessionStorage.getItem(`${set}`)) {
      const cards = JSON.parse(sessionStorage.getItem(`${set}`));
      this.setState({ cards, loading: false });
    } else {
      this.getSetData(set).catch((err) => {
        console.error(err);
        this.setState({ error: true, loading: false });
      });
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

  render() {
    const { currentSet, error, setControls, loading, cards, mana, totalMana } =
      this.state;

    return (
      <main className="flex flex-col items-center">
        <header className="mt-4">
          <h1 className="text-2xl">MTGA Sniffer</h1>
        </header>
        {error ? (
          <p>
            An error occurred while trying to fetch resources. Please refresh
            the page to try again.
          </p>
        ) : (
          <div className="flex flex-col items-center justify-between mb-4 text-lg">
            <SetSelector
              id="set"
              currentSet={currentSet}
              handleSetChange={this.handleSetChange}
            />
            <ManaFilter
              mana={mana}
              handleManaChange={this.handleManaChange}
              resetMana={this.resetMana}
            />
            <SetControls
              currentSet={currentSet}
              setControls={setControls}
              handleSetControlsChange={this.handleSetControlsChange}
            />
          </div>
        )}
        {loading ? (
          <PulseLoader loading={loading} color="#80b2e0" size="12" />
        ) : (
          <CardsList
            cards={cards}
            currentSet={currentSet}
            mana={mana}
            setControls={setControls}
            totalMana={totalMana}
          />
        )}
      </main>
    );
  }
}

export default App;
