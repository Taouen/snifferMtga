import React from 'react';
import NumericInput from 'react-numeric-input';

class CardListItem extends React.Component {
  render = () => {
    const { collected, colors, name, updateCollected } = this.props;

    return (
      <li className={colors}>
        {name}
        <NumericInput
          min={0}
          max={4}
          value={collected}
          onChange={updateCollected}
        />
        {/* <select
          id={name}
          value={this.state.collected}
          // when passing name as an argument, event becomes name instead of the select object
          onChange={updateCollected}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select> */}
      </li>
    );
  };
}

export default CardListItem;
