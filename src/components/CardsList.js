import khmFilter from './setFilters/khm';
import convertManaCostToCmc from './cmcConverter';

export default function CardsList({
  cards,
  mana,
  totalMana,
  currentSet,
  setControls,
}) {
  return (
    <ul className="flex flex-wrap justify-center">
      {cards.map((item) => {
        const { id, name } = item;
        // const variables for overall card values, let variables for values specific to a card face
        let { colors, mana_cost, image_uris } = item;

        if (item.card_faces) {
          if (!colors) {
            item.card_faces.forEach((face) => {
              if (
                face.type_line.includes('Instant') ||
                (face.oracle_text && face.oracle_text.includes('Flash'))
              ) {
                colors = face.colors;
                image_uris = face.image_uris;
              }
            });
          }

          item.card_faces.forEach((face) => {
            if (
              face.type_line.includes('Instant') ||
              (face.oracle_text && face.oracle_text.includes('Flash'))
            ) {
              mana_cost = face.mana_cost;
            }
          });
        }
        let foretellCost;

        switch (currentSet) {
          case 'khm':
            foretellCost = khmFilter(item);
            break;
        }

        /* mana_cost.replace(/[^a-z]/gi, '').split(''); this is an array with the color pips only from the mana cost. will turn a hybrid pip into two pips as is, will need to adjust for that */

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
        const hasRequiredMana = Object.keys(requiredMana).every((color) => {
          return requiredMana[color] <= mana[color];
        });

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
        }

        if (
          (item.cmc <= totalMana && hasRequiredMana) ||
          (setControls.foretold &&
            hasRequiredForetellMana &&
            foretellCmc <= totalMana)
        ) {
          return (
            <img
              className="m-1 rounded-lg w-48 h-64"
              key={id}
              src={image_uris.normal}
              alt={`${name}, ${mana_cost}`}
            />
          );
        }
      })}
    </ul>
  );
}
