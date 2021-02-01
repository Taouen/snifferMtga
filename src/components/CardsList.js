// import CardListItem from './CardListItem';
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

export default function CardsList({ cards, filters, currentSet, setControls }) {
  return (
    <Ul>
      {cards.map((item) => {
        const { id, name } = item;
        // const variables for overall card values, let variables for values specific to a card face
        let {
          colors,
          keywords,
          mana_cost,
          type_line,
          image_uris,
          oracle_text,
        } = item;

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
              type_line = face.type_line;
            }
          });
        }
        let foretellCost;

        switch (currentSet) {
          case 'khm':
            foretellCost = khmFilter(item);
        }

        /* 
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

        if (foretellCost) {
          foretellCost = convertManaCostToCmc(foretellCost);
          console.log(foretellCost);
        } */

        // this currently filters out hybrid cards since they have both colors.
        const colorsMatch = colors.every((color) => {
          return filters.colors.indexOf(color) !== -1;
        });

        if (
          (item.cmc <= filters.availableMana ||
            (setControls.foretold && foretellCost <= filters.availableMana)) &&
          colorsMatch
        ) {
          return (
            <CardImage
              key={id}
              src={image_uris.normal}
              width="244px"
              height="340px"
              alt={name}
            />
          );
        }
      })}
    </Ul>
  );
}
