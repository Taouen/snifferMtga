import React from 'react';

class CardListItem extends React.Component {
  render = () => {
    const { collected, colors, name, updateCollected } = this.props;

    return (
      <li className={colors}>
        {name}
        <select id={name} value={collected} onChange={updateCollected}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </li>
    );
  };
}

export default CardListItem;
