import React from 'react';
import CardsList from './components/CardsList.js';
import SetSelector from './components/SetSelector.js';
import { PulseLoader } from 'react-spinners';
import ManaFilter from './components/ManaFilter.js';
import SetControls from './components/SetControls.js';
import * as scryfall from 'scryfall-client';

class App extends React.Component {
  state = {
    cards: [],
    currentSet: 'vow',
    error: false,
    loading: true,
    mana: {
      W: { value: 0, colors: ['W'] },
      U: { value: 0, colors: ['U'] },
      B: { value: 0, colors: ['B'] },
      R: { value: 0, colors: ['R'] },
      G: { value: 0, colors: ['G'] },
      M: { value: 0, colors: ['W', 'U', 'B', 'R', 'G'] },
      C: { value: 0, colors: [] },
    },
    setControls: {
      foretold: false,
    },
    totalMana: 0,
  };

  getSetData = async (setCode) => {
    let cards;
    let tempCardArray;

    const set = await scryfall.getSet(setCode);

    if (set.parent_set_code) {
      tempCardArray = await scryfall
        .search(
          `set:${set.parent_set_code} (t:instant or keyword:flash) lang=en order:set is:nonfoil is:booster`
        )
        .then((list) => list)
        .catch((err) => {
          console.error(err);
          this.setState({ error: true, loading: false });
        });

      const setCards = await scryfall
        .search(
          `set:${setCode} (t:instant or keyword:flash) lang=en order:set is:nonfoil `
        )
        .then((list) => list)
        .catch((err) => {
          console.error(err);
          this.setState({ error: true, loading: false });
        });
      tempCardArray.push(...setCards);
      cards = tempCardArray;
    } else {
      cards = await scryfall
        .search(
          `set:${setCode} (t:instant or keyword:flash) lang=en order:set is:nonfoil is:booster`
        )
        .then((list) => list)
        .catch((err) => {
          console.error(err);
          this.setState({ error: true, loading: false });
        });
    }

    sessionStorage.setItem(`${setCode}`, JSON.stringify(cards));
    this.setState({ cards, loading: false });
  };

  componentDidMount = () => {
    this.getLocalSetData(this.state.currentSet);
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
    const setControls = { ...this.state.setControls };
    setControls[name] = value;
    this.setState({ setControls });
  };

  handleManaChange = (color, change) => {
    const mana = { ...this.state.mana };
    let total = this.state.totalMana;

    mana[color].value += change;
    if (mana[color].value < 0) {
      mana[color].value = 0;
    }

    total += change;
    this.setState({ totalMana: total, mana });
  };

  addMulticolorManaSource = (color) => {
    const mana = { ...this.state.mana };
    mana[color] = {
      value: 0,
      colors: color.split(''),
    };
    this.setState({ mana });
  };

  clearMana = () => {
    const mana = { ...this.state.mana };
    let total = this.state.totalMana;
    for (let color in mana) {
      mana[color].value = 0;
    }
    total = 0;
    this.setState({ mana, totalMana: total });
  };

  resetMana = () => {
    const mana = { ...this.state.mana };
    let total = this.state.totalMana;
    for (let color in mana) {
      mana[color].value = 0;
      if (color.length > 1) {
        delete mana[color];
      }
    }
    total = 0;
    this.setState({ mana, totalMana: total });
  };

  render() {
    const { currentSet, error, setControls, loading, cards, mana, totalMana } =
      this.state;

    return (
      <main className="flex flex-col items-center ">
        <header className="mt-4">
          <h1 className="text-2xl">MTGA Hand Sniffer</h1>
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
              clearMana={this.clearMana}
              resetMana={this.resetMana}
              handleMulticolorManaChange={this.handleMulticolorManaChange}
              addMulticolorManaSource={this.addMulticolorManaSource}
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
