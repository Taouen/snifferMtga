import canBeCast from './castingChecker';

export default function CardsList({ cards, mana, totalMana, setControls }) {
  const filteredCards = [];
  
  cards.forEach((card) => {
    if (canBeCast(card, mana, totalMana, setControls)) {
      filteredCards.push(card);
    }
  });
  
  
  // TODO – improve this function so that it fetches the correct face
  const getCardImage = (card) => {
    if (card.image_uris) return card.image_uris.normal;
    if (card.card_faces) {
      if (card.card_faces[0].image_uris) return card.card_faces[0].image_uris.normal;
    } else {
      return null;
    }
  }
  
  return (
    <ul className="flex flex-wrap justify-center">
      {filteredCards.map((card) => {
        const { mana_cost, image_uris, card_faces, id, name } = card;
        
        return (
          <li key={id}>
            <img
              className="m-1 rounded-lg w-48 h-64"
              src={getCardImage(card)}
              alt={`${name}, ${mana_cost}`}
            />
          </li>
        );
      })}
    </ul>
  );
}
