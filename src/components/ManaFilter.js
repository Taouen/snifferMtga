import React from 'react';
import styled from 'styled-components';

const Controls = styled.div`
  display: flex;
  flex-direction: row;
`;
const Value = styled.div`
  width: 2rem;
  height: 2rem;
  border: 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function ColorFilter(props) {
  const { mana, handleManaChange, resetMana } = props;
  return (
    <Controls>
      {Object.keys(mana).map((color, index) => {
        return (
          <React.Fragment key={index}>
            <div>
              <button onClick={() => handleManaChange(color, 1)}>+</button>
              <Value>{mana[color]}</Value>
              <button onClick={() => handleManaChange(color, -1)}>-</button>
            </div>
          </React.Fragment>
        );
      })}
      <button onClick={() => resetMana()}>Reset</button>
    </Controls>
  );
}
