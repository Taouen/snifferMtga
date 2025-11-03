import React from 'react';
import classNames from 'classnames';

class CardListItem extends React.Component {
  render = () => {
    const { name, manaCost, type } = this.props;
    let { colors } = this.props;

    if (colors.length >= 2) {
      colors = 'M';
    } else if (colors.length === 0) {
      colors = 'C';
    }

    const listItemClasses = classNames([
      { colors },
      'flex justify-between items-center p-2 w-96 border border-black border-b-0 last:border-b last:border-b-black',
    ]);

    return (
      <li className={listItemClasses}>
        <div className="flex flex-col">
          <div>{name}</div>
          <div>{type}</div>
        </div>
        {manaCost}
      </li>
    );
  };
}

export default CardListItem;
