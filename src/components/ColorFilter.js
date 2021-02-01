import React, { useState } from 'react';

export default function ColorFilter(props) {
  const [colors] = useState([
    { name: 'white', label: 'White', value: 'W' },
    { name: 'blue', label: 'Blue', value: 'U' },
    { name: 'black', label: 'Black', value: 'B' },
    { name: 'red', label: 'Red', value: 'R' },
    { name: 'green', label: 'Green', value: 'G' },
  ]);

  return (
    <div>
      {colors.map((color, index) => {
        return (
          <React.Fragment key={index}>
            <input
              type="checkbox"
              name="colors"
              // defaultChecked={true}
              id={color.name}
              value={color.value}
              onChange={props.handleColorChange}
            />
            <label htmlFor={color.name}>{color.label}</label>
          </React.Fragment>
        );
      })}
    </div>
  );
}
