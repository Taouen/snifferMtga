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
  width: 400px;

  &:last-child {
    border-bottom: 1px solid black;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

class CardListItem extends React.Component {
  render = () => {
    const { name, manaCost, type } = this.props;
    let { colors } = this.props;

    if (colors.length >= 2) {
      colors = 'M';
    } else if (colors.length === 0) {
      colors = 'C';
    }

    return (
      <Li className={colors}>
        <Info>
          <div>{name}</div>
          <div>{type}</div>
        </Info>
        {manaCost}
      </Li>
    );
  };
}

export default CardListItem;
