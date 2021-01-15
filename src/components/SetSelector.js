import styled from 'styled-components';
import { useState } from 'react';

const Select = styled.select`
  font-size: 16px;
  height: 2rem;
`;

export default function SetSelector(props) {
  // manually entering sets for now. Might attempt later on to fetch sets from a selected format
  const [sets] = useState([
    { code: 'khm', name: 'Kaldheim' },
    { code: 'znr', name: 'Zendikar Rising' },
    { code: 'm21', name: 'Core Set 2021' },
    { code: 'iko', name: 'Ikoria' },
    { code: 'thb', name: 'Theros Beyond Death' },
    { code: 'eld', name: 'Throne of Eldraine' },
  ]);

  return (
    <Select id="set" value={props.currentSet} onChange={props.handleSetChange}>
      {sets.map((set, index) => {
        return (
          <option key={index} value={set.code}>
            {set.name}
          </option>
        );
      })}
    </Select>
  );
}
