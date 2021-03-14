export default function khmFilter(card) {
  let foretellCost;

  const { keywords, oracle_text } = card;
  if (keywords.some((keyword) => keyword === 'Foretell')) {
    let costIndex;
    const arr = oracle_text.split(' ');
    arr.forEach((element, index) => {
      if (element.includes('Foretell')) {
        costIndex = index + 1;
      }
    });
    foretellCost = arr[costIndex];
  }

  return foretellCost;
}

// need to input cards list and run foretell filter, returning cards list modified
