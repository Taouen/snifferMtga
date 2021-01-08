import React from 'react';
import styled from 'styled-components';

const Li = styled.li`
  border: 1px solid black;
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  padding: 0.5rem;
  width: 300px;

  &:last-child {
    border-bottom: 1px solid black;
  }
`;

const Select = styled.select`
  font-size: 16px;
`;

class CardListItem extends React.Component {
  render = () => {
    const { collected, name, updateCollected } = this.props;
    let { colors } = this.props;

    if (colors.length >= 2) {
      colors = 'M';
    } else if (colors.length === 0) {
      colors = 'C';
    }

    return (
      <Li className={colors}>
        {name}
        <Select id={name} value={collected} onChange={updateCollected}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </Select>
      </Li>
    );
  };
}

export default CardListItem;
