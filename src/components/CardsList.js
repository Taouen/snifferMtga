import canBeCast from './castingChecker';

export default function CardsList({ cards, mana, totalMana, setControls }) {
  const filteredCards = [];

  cards.forEach((card) => {
    if (canBeCast(card, mana, totalMana, setControls)) {
      filteredCards.push(card);
    }
  });

  const getCardImage = (card) => {
    const { image_uris, card_faces } = card;
    if (image_uris) return image_uris.normal;
    if (card_faces) {
      let image_uri;
      card_faces.forEach((face) => {
        if (
          face.type_line.includes('Instant') ||
          (face.keywords && face.keywords.includes('Flash'))
        ) {
          image_uri = face.image_uris.normal;
        }
      });
      return image_uri;
    } else {
      return null;
    }
  };

  return (
    <ul className="flex flex-wrap justify-center">
      {filteredCards.map((card) => {
        const { mana_cost, id, name } = card;

        return (
          <li key={id}>
            <img
              className="m-1 rounded-lg w-48 h-64"
              src={getCardImage(card)}
              alt={`${name} ${mana_cost === undefined ? '' : mana_cost}`}
            />
          </li>
        );
      })}
    </ul>
  );
}
