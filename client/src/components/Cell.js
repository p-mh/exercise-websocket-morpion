import React from 'react';
import styled from 'styled-components';

const CellCase = styled.div`
  flex: 1 1 33%;
  padding: 16% 0;
  box-sizing: border-box;
  height: 50px;
  border: #000 3px solid;
`;

const Cell = ({ value, cellClick }) => {
  return (
    <CellCase onClick={cellClick}>
      {value && (value === 1 ? 'x' : 'o')}
    </CellCase>
  );
};

export default Cell;
