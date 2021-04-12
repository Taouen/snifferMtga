import canBeCast from './castingChecker';

export default function CardsList({ cards, mana, totalMana, setControls }) {
  const filteredCards = [];
  cards.forEach((card) => {
    if (canBeCast(card, mana, totalMana, setControls)) {
      filteredCards.push(card);
    }
  });

  return (
    <ul className="flex flex-wrap justify-center">
      {filteredCards.map((card) => {
        const { mana_cost, image_uris, id, name } = card;
        return (
          <li key={id}>
            <img
              className="m-1 rounded-lg w-48 h-64"
              src={image_uris.normal}
              alt={`${name}, ${mana_cost}`}
            />
          </li>
        );
      })}
    </ul>
  );
}
