import khmFilter from './setFilters/khm';
import convertManaCostToCmc from './cmcConverter';

// This function checks the mana cost of a card against the available mana entered by the user and returns true if the card can be cast with the available mana and false if it cannot.

export default function canBeCast(card, mana, totalMana, setControls) {
  let { mana_cost } = card;

  //! This is currently not correctly showing cards with instant speed faces (ie. bonecrusher giant // stomp)

  if (card.card_faces) {
    card.card_faces.forEach((face) => {
      if (
        face.type_line.includes('Instant') ||
        (face.keywords && face.keywords.includes('Flash'))
      ) {
        mana_cost = face.mana_cost;
      }
    });
  }

  let pipsOnly = mana_cost.replace(/[^a-z/{}]/gi, ''); // leaves only the colored mana pips of the mana cost. The total doesn't matter here, can use item.cmc for total

  const pipsArray = pipsOnly.split('{}');

  // following function strips the numbered symbols from the mana_cost
  pipsArray.forEach((item) => {
    if (item === '') {
      pipsArray.splice(pipsArray.indexOf(item), 1);
    }
  });

  mana_cost = pipsArray.join('');

  if (mana_cost.includes('/')) {
    // splits mana_cost into an array of each separate mana symbol
    const splitManaCost = mana_cost.split('}{');

    const manaCostArray = [];

    splitManaCost.forEach((manaSymbol) => {
      const tempArray = [];
      const fixedManaSymbol = manaSymbol.replace(/[^a-z/]/gi, ''); // strip {} out of each item

      fixedManaSymbol.split('').forEach((character) => {
        if (character === '/') {
          return;
        } else {
          tempArray.push(character);
        }
      });

      manaCostArray.push(tempArray);
    });

    // ? console.log(getPossibleCosts([[1], ['W', 'U'], ['W', 'U']])); required format for entering mana costs into getPossibleCosts
    const getCastingCosts = (arr) => {
      return arr.reduce((a, b) =>
        a.flatMap((d) => b.map((e) => [d, e].flat()))
      );
    };
    mana_cost = getCastingCosts(manaCostArray);
  }

  // returns an object with the quantities of each color of mana required for the card
  const findRequiredMana = (array) => {
    return array.reduce((color, quantity) => {
      color[quantity] = color[quantity] ? color[quantity] + 1 : 1;
      return color;
    }, {});
  };

  let hasRequiredMana;

  if (typeof mana_cost === 'string') {
    // For any non-hybrid mana cost
    const requiredMana = findRequiredMana(
      mana_cost.replace(/[^a-z]/gi, '').split('')
    );
    hasRequiredMana = Object.keys(requiredMana).every((color) => {
      // console.log(mana_cost, color, requiredMana[color]);
      return (
        requiredMana[color] <= mana[color] || requiredMana[color] <= mana['M']
      );
    });
  } else {
    // For hybrid mana costs, which are an array of possible costs
    const costsMet = [];
    mana_cost.forEach((cost) => {
      if (typeof cost === 'string') {
        const requiredMana = {};
        requiredMana[cost] = 1;
        costsMet.push(
          Object.keys(requiredMana).every((color) => {
            console.log(mana_cost, color, requiredMana[color]);
            return requiredMana[color] <= mana[color];
          })
        );
      } else {
        const requiredMana = findRequiredMana(cost);
        costsMet.push(
          Object.keys(requiredMana).every((color) => {
            console.log(mana_cost, color, requiredMana[color]);
            return requiredMana[color] <= mana[color];
          })
        );
      }
    });
    hasRequiredMana = costsMet.includes(true);
  }

  // ---------- Foretell cost ----------
  let foretellCost = khmFilter(card);
  let requiredForetellMana;
  let hasRequiredForetellMana;
  let foretellCmc;
  if (foretellCost) {
    requiredForetellMana = findRequiredMana(
      foretellCost.replace(/[^a-z]/gi, '').split('')
    );
    hasRequiredForetellMana = Object.keys(requiredForetellMana).every(
      (color) => {
        return (
          requiredForetellMana[color] <= mana[color] ||
          requiredForetellMana[color] <= mana['M']
        );
      }
    );
    foretellCmc = convertManaCostToCmc(foretellCost);
  } // ----------------------------------

  return (
    (card.cmc <= totalMana && hasRequiredMana) ||
    (setControls.foretold &&
      hasRequiredForetellMana &&
      foretellCmc <= totalMana)
  );
}
