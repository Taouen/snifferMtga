import khmFilter from './setFilters/khm';

import styled from 'styled-components';

const Ul = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const CardImage = styled.img`
  margin: 0.25rem;
  border-radius: 0.7rem;
  width: 148px;
  height: 204px;

  @media (min-width: 400px) {
    width: 183px;
    height: 255px;
  }

  @media (min-width: 800px) {
    width: 244px;
    height: 340px;
  }
`;

export default function CardsList({
  cards,
  mana,
  totalMana,
  currentSet,
  setControls,
}) {
  return (
    <Ul>
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
        if (foretellCost) {
          requiredForetellMana = findRequiredMana(
            foretellCost.replace(/[^a-z]/gi, '').split('')
          );
          hasRequiredForetellMana = Object.keys(requiredForetellMana).every(
            (color) => {
              return requiredForetellMana[color] <= mana[color];
            }
          );
        }

        if (
          (item.cmc <= totalMana ||
            (setControls.foretold && hasRequiredForetellMana)) &&
          hasRequiredMana
        ) {
          return (
            <CardImage
              key={id}
              src={image_uris.normal}
              width="244px"
              height="340px"
              alt={`${name}, ${mana_cost}`}
            />
          );
        }
      })}
    </Ul>
  );
}
