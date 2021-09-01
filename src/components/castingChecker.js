import khmFilter from './setFilters/khm';
import convertManaCostToCmc from './cmcConverter';

// This function checks the mana cost of a card against the available mana entered by the user and returns true if the card can be cast with the available mana and false if it cannot.

export default function canBeCast(card, mana, totalMana, setControls) {
  const { card_faces } = card;
  let { mana_cost, cmc } = card;

  // for double faced cards (or cards like Adventure cards from Throne of Eldraine), find which face is the instant speed one, and set mana_cost and cmc to the values for that face only.
  if (card_faces.length > 1) {
    if (
      card_faces[0].type_line.includes('Instant') ||
      (card_faces[0].keywords && card_faces[0].keywords.includes('Flash'))
    ) {
      mana_cost = card_faces[0].mana_cost;
    } else {
      mana_cost = card_faces[1].mana_cost;
    }
    cmc = mana_cost.replace(/[^0-9a-z]/gi, '').split('').length; // card face objects dont contain their own cmc properties.
  }

  // Remove all but colored pips from the mana cost
  const pipsArray = mana_cost.replace(/[^a-z/{}]/gi, '').split('{}');

  // strip the numbered symbols from the mana_cost
  pipsArray.forEach((item) => {
    if (item === '') {
      pipsArray.splice(pipsArray.indexOf(item), 1);
    }
  });

  mana_cost = pipsArray.join('');

  // For mana costs with Hybrid mana
  if (mana_cost.includes('/')) {
    // split mana_cost into an array of each separate mana symbol
    const splitManaCost = mana_cost.split('}{');

    const manaCostArray = [];
    splitManaCost.forEach((manaSymbol) => {
      // Split each mana symbol into an array of possible colored mana (ie. {U/B} creates [U,B]), and push it to the manaCostArray

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

    const getCastingCosts = (arr) => {
      return arr.reduce((a, b) =>
        a.flatMap((d) => b.map((e) => [d, e].flat()))
      );
    };

    // Set mana_cost equal to an array of possible casting costs (ie. {U/R}{U/R} returns as [[U,U], [U/R], [R/U], [R/R]]). U/R and R/U are functionally the same, but as they will both return true for the same available mana, there is no point in removing them from the array.
    mana_cost = getCastingCosts(manaCostArray);
  }

  // return an object with the quantities of each color of mana required for the card (ie. mana_cost === 3RR returns {r:2})
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
      return (
        requiredMana[color] <= mana[color] || requiredMana[color] <= mana['M']
      );
    });
  } else {
    // For hybrid mana costs (which is an array of possible costs)
    const costsMet = [];
    mana_cost.forEach((cost) => {
      if (typeof cost === 'string') {
        // If the cost is a single pip, it will be a string value
        const requiredMana = {};
        requiredMana[cost] = 1;
        costsMet.push(
          Object.keys(requiredMana).every((color) => {
            return (
              requiredMana[color] <= mana[color] ||
              requiredMana[color] <= mana['M']
            );
          })
        );
      } else {
        const requiredMana = findRequiredMana(cost);
        costsMet.push(
          Object.keys(requiredMana).every((color) => {
            return (
              requiredMana[color] <= mana[color] ||
              requiredMana[color] <= mana['M']
            );
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
    (cmc <= totalMana && hasRequiredMana) ||
    (setControls.foretold &&
      hasRequiredForetellMana &&
      foretellCmc <= totalMana)
  );
}
