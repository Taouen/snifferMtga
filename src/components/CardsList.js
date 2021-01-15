// import CardListItem from './CardListItem';

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

export default function CardsList(props) {
  const { cards, filters } = props;

  return (
    <Ul>
      {cards.map((item) => {
        // add functionality to filter items based on selected colors and available mana.
        const { id, name } = item;
        // const variables for overall card values, let variables for values specific to a face
        let { colors, mana_cost, type_line, image_uris } = item;

        if (item.card_faces) {
          if (!colors) {
            item.card_faces.forEach((face) => {
              if (
                face.type_line.includes('Instant') ||
                (face.oracle_text && face.oracle_text.includes('Flash'))
              ) {
                colors = face.colors;
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
              image_uris = face.image_uris;
            }
          });
        }

        // check each card and return the card image only if they match all filters.

        // this currently filters out hybrid cards since they have both colors.
        const colorsMatch = item.colors.every((color) => {
          return filters.colors.indexOf(color) != -1;
        });

        if (item.cmc <= filters.cmc && colorsMatch) {
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
      {/* <CardListItem
            key={id}
            name={name}
            colors={colors}
            manaCost={mana_cost}
            type={type_line}
          /> */}
    </Ul>
  );
}
