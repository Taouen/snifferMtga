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

  // splits mana_cost into an array of each separate mana symbol
  const splitManaCost = mana_cost.split('}{');
  const manaCostArray = [];

  splitManaCost.forEach((manaSymbol) => {
    const tempArray = [];
    const fixedManaSymbol = manaSymbol.replace(/[^0-9a-z/]/gi, ''); // strip {} out of each item

    if (fixedManaSymbol.includes('/')) {
      fixedManaSymbol.split('').forEach((character) => {
        if (character === '/') {
          return;
        } else {
          tempArray.push(character);
        }
      });
    } else {
      tempArray.push(fixedManaSymbol);
    }
    manaCostArray.push(tempArray);
  });

  const getCastingCosts = (arr) => {
    return arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
  };

  // ! issue currently is that non hybrid costs are a single array, while hybrid costs are multidimensional arrays, can't process both the same way. Try only processing hybrid cards into arrays, and set mana_cost equal to the array of possible costs. Then I can find required mana of the mana_cost normally, and do it for each item in array if it's hybrid

  const castingCosts = getCastingCosts(manaCostArray);

  // ? console.log(getPossibleCosts([[1], ['W', 'U'], ['W', 'U']])); required format for entering mana costs into getPossibleCosts

  // returns an object with the quantities of each color of mana required for the card
  const findRequiredMana = (array) => {
    return array.reduce((color, quantity) => {
      color[quantity] = color[quantity] ? color[quantity] + 1 : 1;
      return color;
    }, {});
  };

  const requiredMana = findRequiredMana(
    mana_cost.replace(/[^a-z]/gi, '').split('')
  );

  /* mana_cost.replace(/[^a-z]/gi, '').split(''); this is an array with the color pips only from the mana cost. will turn a hybrid pip into two pips as is, will need to adjust for that */

  const hasRequiredMana = Object.keys(requiredMana).every((color) => {
    return requiredMana[color] <= mana[color];
  });

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
        return requiredForetellMana[color] <= mana[color];
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
