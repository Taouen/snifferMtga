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
    cmc = mana_cost.replace(/[^0-9a-w][^yz]/gi, '').split('').length; // card face objects dont contain their own cmc properties. (stripping out X from the cost also, as x is treated as 0)
  }

  // Remove all but colored pips from the mana cost (also strips X out of the cost)
  const pipsArray = mana_cost.replace(/[^a-w/{}][^yz]/gi, '').split('{}');

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

  // for each color, check first single color lands (mana.color.length === 1), for available mana. If it is there, use the available amount (decrement the available amount by the required amount). If not, move on to dual, then tri, and finally 4 color lands, before finally using multicolor mana.

  const sortedByColorsProduced = Object.entries(
    JSON.parse(JSON.stringify(mana))
  ).sort((a, b) => a[1].colors.length - b[1].colors.length);

  if (typeof mana_cost === 'string') {
    // For any non-hybrid mana cost
    const requiredMana = findRequiredMana(
      mana_cost.replace(/[^a-z]/gi, '').split('')
    );

    const requiredManaArray = Object.entries(requiredMana);

    requiredManaArray.forEach((color) => {
      sortedByColorsProduced.forEach((manaSource) => {
        // color[1] is the value for the current required mana color
        // manaSource[1].colors is the array of colors the current source produces

        if (manaSource[1].value === 0) return;

        // color[0] is the color (W, U, B, R, or G)
        // manaSource[1].value is the current amount of available mana for the current source

        if (manaSource[1].colors.includes(color[0])) {
          if (manaSource[1].value >= color[1]) {
            manaSource[1].value -= 1;
            if (manaSource[1].value < 0) {
              manaSource[1].value = 0;
            }
            color[1] = 0;
          } else {
            color[1] -= manaSource[1].value;
            if (color[1] < 0) {
              color[1] = 0;
            }
            manaSource[1].value = 0;
          }
        }
      });
    });

    hasRequiredMana =
      Object.values(Object.fromEntries(requiredManaArray)).reduce(
        (a, b) => a + b,
        0
      ) === 0;
  } else {
    // For hybrid mana costs (which is an array of possible costs)
    const costsMet = [];
    mana_cost.forEach((cost) => {
      if (typeof cost === 'string') {
        // If the cost is a single pip, it will be a string value

        // Create a required mana object from the single pip
        const requiredMana = {};
        requiredMana[cost] = 1;

        const requiredManaArray = Object.entries(requiredMana);

        requiredManaArray.forEach((color) => {
          sortedByColorsProduced.forEach((manaSource) => {
            // color[1] is the value for the current required mana color
            // manaSource[1].colors is the array of colors the current source produces

            if (manaSource[1].value === 0 || color[1] === 0) return;

            // color[0] is the color (W, U, B, R, or G)
            // manaSource[1].value is the current amount of available mana for the current source

            if (manaSource[1].colors.includes(color[0])) {
              if (manaSource[1].value >= color[1]) {
                manaSource[1].value -= 1;
                if (manaSource[1].value < 0) {
                  manaSource[1].value = 0;
                }
                color[1] = 0;
              } else {
                color[1] -= manaSource[1].value;
                if (color[1] < 0) {
                  color[1] = 0;
                }
                manaSource[1].value = 0;
              }
            }
          });
        });

        costsMet.push(
          Object.values(Object.fromEntries(requiredManaArray)).reduce(
            (a, b) => a + b,
            0
          ) === 0
        );
      } else {
        const requiredMana = findRequiredMana(cost);
        const requiredManaArray = Object.entries(requiredMana);
        const sources = JSON.parse(JSON.stringify(sortedByColorsProduced)); // Need to make a copy here so as not to change the original from cost to cost (ie for a U/R U/R cost, with a U/R hybrid mana, the first cost in the array [U,U] uses the hybrid mana, and then it has a 0 value for the rest of the costs)

        requiredManaArray.forEach((color) => {
          sources.forEach((manaSource) => {
            // color[1] is the value for the current required mana color
            // manaSource[1].colors is the array of colors the current source produces

            if (manaSource[1].value === 0 || color[1] === 0) return;

            // color[0] is the color (W, U, B, R, or G)
            // manaSource[1].value is the current amount of available mana for the current source

            if (manaSource[1].colors.includes(color[0])) {
              if (manaSource[1].value >= color[1]) {
                manaSource[1].value -= 1;
                if (manaSource[1].value < 0) {
                  manaSource[1].value = 0;
                }
                color[1] = 0;
              } else {
                color[1] -= manaSource[1].value;
                if (color[1] < 0) {
                  color[1] = 0;
                }
                manaSource[1].value = 0;
              }
            }
          });
        });

        costsMet.push(
          Object.values(Object.fromEntries(requiredManaArray)).reduce(
            (a, b) => a + b,
            0
          ) === 0
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
          requiredForetellMana[color] <= mana[color].value ||
          requiredForetellMana[color] <= mana['M'].value
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
