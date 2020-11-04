import React from 'react';

class CardListItem extends React.Component {
  render = () => {
    const { name } = this.props;
    return <p>{name}</p>;
  };
}

export default CardListItem;
