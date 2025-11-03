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
          // (face.keywords && face.keywords.includes('Flash')) It appears as of SIR scryfall changed how they structure the data for double faced cards. Face objects no longer contain the keywords, they exist only on the card object. Updated to check for the existence of flash in the oracle text.
          (face.oracle_text && face.oracle_text.toLowerCase().includes('flash'))
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
