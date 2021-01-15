import React from 'react';

export default function CmcFilter(props) {
  const values = ['1', '2', '3', '4', '5', '6'];
  return (
    <div>
      {values.map((value, index) => (
        <React.Fragment key={index}>
          <input
            type="radio"
            id={value}
            name="mana"
            value={value}
            onChange={props.handleCmcChange}
          />
          <label for={value}>{value}</label>
        </React.Fragment>
      ))}
    </div>
  );
}
