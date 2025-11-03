// Converts a mana cost from the Scryfall format (ex. {2}{W}) to a number representing the CMC

export default function convertManaCostToCmc(cost) {
  // removes the brackets and splits into an array

  const manaCostArray = cost.replace(/[^0-9a-z{}]/gi, '').split('}{'); // includes brackets so as to split properly. Found that splitting on '' was breaking with Hybrid mana (ex. {U/R} would return as CMC 2 because the U and R would both be put in as separate elements.)
  const cmc = [];

  manaCostArray.forEach((item) => {
    // if the item is not a number, pushes it to the cmc array
    if (Number.isNaN(parseInt(item))) {
      cmc.push(item);
    } else {
      // if the item is a number, pushes a number of '1' elements to the cmc array equal to it's value (ex. 2 will push '1', '1') to create a proper length for cmc.
      for (let i = 0; i < parseInt(item); i++) {
        cmc.push('1');
      }
    }
  });
  return cmc.length;
}
