import React from 'react';
import styled from 'styled-components';

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem 0;
  max-width: 100%;
  width: 24rem;
`;

const ColorDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 4rem;
`;

const Value = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-size: 2.5rem;
  height: 2.5rem;
  justify-content: space-around;
  width: 80%;
`;

const Logo = styled.img`
  height: 1.5rem;
`;

const ValueButton = styled.button`
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem auto;
  height: 2rem;
  width: 2.5rem;
`;

const Reset = styled.button`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

export default function ColorFilter(props) {
  const { mana, handleManaChange, resetMana } = props;
  return (
    <>
      <Controls>
        {Object.keys(mana).map((color, index) => {
          return (
            <React.Fragment key={index}>
              <ColorDiv>
                <ValueButton
                  type="button"
                  onClick={() => handleManaChange(color, 1)}
                >
                  +
                </ValueButton>
                <Value>
                  {mana[color]}
                  <Logo
                    src={`https://c2.scryfall.com/file/scryfall-symbols/card-symbols/${color}.svg`}
                  />
                </Value>
                <ValueButton
                  type="button"
                  onClick={() => handleManaChange(color, -1)}
                >
                  -
                </ValueButton>
              </ColorDiv>
            </React.Fragment>
          );
        })}
      </Controls>
      <Reset type="reset" onClick={() => resetMana()}>
        Reset Mana
      </Reset>
    </>
  );
}
